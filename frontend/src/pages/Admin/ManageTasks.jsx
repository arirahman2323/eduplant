import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";

const taskTypes = ["Pretest", "Postest", "Grup Chat", "Mindmap", "Materi", "Refleksi", "LO/KBK", "E-Portofolio"];

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const getAllTasks = async () => {
    try {
      const [taskRes, mindmapRes, materialRes] = await Promise.all([
        axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
          params: { status: filterStatus === "All" ? "" : filterStatus },
        }),
        axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASK_MINDMAP),
        axiosInstance.get(API_PATHS.TASKS.GET_MATERIALS),
      ]);

      const tasks = taskRes.data?.tasks || [];
      const mindmaps = mindmapRes.data || [];
      const materials = materialRes.data || [];

      const allData = [
        ...tasks.map((t) => ({ ...t, taskType: "task" })),
        ...mindmaps.map((m) => ({ ...m, taskType: "mindmap" })),
        ...materials.map((m) => ({
          ...m,
          taskType: "material",
          title: m.term || m.title,
        })),
      ];

      const taskOrder = ["pretest", "orient students", "organize", "mindmap", "materi", "assist", "develop", "analyze", "postest", "refleksi", "learning", "berpikir"];

      const getTaskOrderIndex = (task) => {
        const lowerTitle = (task.title || "").toLowerCase();
        for (let i = 0; i < taskOrder.length; i++) {
          if (lowerTitle.includes(taskOrder[i])) return i;
        }
        return taskOrder.length;
      };

      const sorted = allData.sort((a, b) => {
        return getTaskOrderIndex(a) - getTaskOrderIndex(b);
      });

      setAllTasks(sorted);

      const summary = taskRes.data?.statusSummary || {};
      setTabs([
        { label: "All", count: summary.all || 0 },
        { label: "Pending", count: summary.pendingTasks || 0 },
        { label: "In Progress", count: summary.inProgressTasks || 0 },
        { label: "Completed", count: summary.completedTasks || 0 },
      ]);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Gagal memuat semua tugas");
    }
  };

  const handleCreateTask = (type) => {
    setIsModalOpen(false);
    navigate(`/admin/create-task/${type.toLowerCase()}`);
  };

  useEffect(() => {
    getAllTasks();
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Manage Course</h2>
        </div>

        <div className="overflow-x-auto shadow-md">
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                <th className="p-3">Judul</th>
                <th className="p-3">Deadline</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {allTasks.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="6">
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                allTasks.map((task) => {
                  let type = "";
                  if (task.isPretest) type = "pretest";
                  else if (task.isPostest) type = "postest";
                  else if (task.isProblem) type = "problem";
                  else if (task.isRefleksi) type = "refleksi";
                  else if (task.isLo) type = "lo";
                  else if (task.isKbk) type = "kbk";
                  else if (task.type === "materi") type = "materi";
                  else if (task.type === "glosarium") type = "glosarium";
                  else if (task.taskType === "mindmap") type = "mindmap";
                  else type = "";

                  return (
                    <tr key={task._id} className="border-t">
                      <td className="p-3 text-gray-500">{task.title}</td>
                      <td className="p-3 text-gray-500">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="p-3 space-x-4">
                        <button
                          onClick={() => {
                            const targetPath = type ? `/admin/create-task/${type}` : "/admin/create-task";
                            navigate(targetPath, { state: { taskId: task._id } });
                          }}
                          className="text-blue-600 cursor-pointer mr-3 hover:underline"
                        >
                          Edit
                        </button>
                        {task.taskType !== "material" && (
                          <button
                            onClick={() => {
                              if (type) navigate(`/admin/list-answer/${type}/${task._id}`);
                            }}
                            className="text-green-600 text-start md:text-center cursor-pointer hover:underline"
                          >
                            Lihat Jawaban
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-50 inset-0 overflow-y-auto bg-black/50">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Panel className="bg-white rounded-lg shadow p-6 max-w-md w-full">
              <Dialog.Title className="text-lg font-semibold mb-4">Pilih Jenis Course</Dialog.Title>
              <ul className="space-y-2">
                {taskTypes.map((type) => (
                  <li key={type}>
                    <button onClick={() => handleCreateTask(type)} className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded text-blue-800 cursor-pointer">
                      {type}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="text-right mt-4">
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:underline cursor-pointer">
                  Batal
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;
