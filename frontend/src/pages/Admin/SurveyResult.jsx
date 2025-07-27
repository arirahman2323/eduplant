import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

const nilaiLabelMap = {
  5: "Sangat Puas",
  4: "Puas",
  3: "Biasa",
  2: "Kurang",
  1: "Tidak Puas",
};

const SurveyResults = () => {
  const [surveys, setSurveys] = useState([]);
  const [tasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllSurveys = async () => {
    try {
      const response = await axiosInstance.get("/api/survei");
      setSurveys(response.data || []);
    } catch (err) {
      console.error("Failed to fetch surveys:", err);
      toast.error("Gagal mengambil data survei.");
    }
  };

  const getAllTasks = async () => {
    try {
      const [generalRes, mindmapRes, materialRes] = await Promise.all([axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS), axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASK_MINDMAP), axiosInstance.get(API_PATHS.TASKS.GET_MATERIALS)]);

      const generalTasks = generalRes.data?.tasks || [];
      const mindmapTasks = mindmapRes.data || [];
      const materialTasks =
        materialRes.data?.map((m, i) => ({
          ...m,
          taskType: "material",
          title: i === 0 && m.term ? m.term : m.title || m.term || "Materi",
        })) || [];

      const combinedTasks = [...generalTasks, ...mindmapTasks, ...materialTasks];
      let sortedTasks = combinedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // Tambahkan task E-Portfolio di akhir
      const ePortfolioTask = {
        _id: "6870c39f1782cf126fa700e1",
        taskType: "e-portfolio",
        title: "E-Portfolio",
        description: "Lengkapi portofolio akhirmu di sini.",
        status: "Pending",
        createdAt: new Date().toISOString(),
        assignedTo: [],
        attachments: [],
        completedTodoCount: 0,
        todoChecklist: [],
      };

      sortedTasks = [...sortedTasks, ePortfolioTask];
      setAllTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Gagal mengambil data tugas");
    }
  };

  const getTaskTitleById = (id) => {
    const task = tasks.find((t) => t._id === id);
    return task ? task.title : "-";
  };

  useEffect(() => {
    Promise.all([getAllSurveys(), getAllTasks()]).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout activeMenu="Survey Results">
      <div className="mt-5 mb-10 bg-white p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-6">Survey Results</h2>

        {loading ? (
          <p>Loading...</p>
        ) : surveys.length === 0 ? (
          <p className="text-gray-600">Tidak ada data survei yang tersedia.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">No</th>
                  <th className="border p-2 text-left">Nama</th>
                  <th className="border p-2 text-left">Email</th>
                  <th className="border p-2 text-left">Nilai</th>
                  <th className="border p-2 text-left">Task</th>
                  <th className="border p-2 text-left">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((item, index) => (
                  <tr key={item._id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.idUser?.name || "-"}</td>
                    <td className="border p-2">{item.idUser?.email || "-"}</td>
                    <td className="border p-2">{nilaiLabelMap[item.nilai] || "-"}</td>
                    <td className="border p-2">{getTaskTitleById(item.idTask)}</td>
                    <td className="border p-2">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SurveyResults;
