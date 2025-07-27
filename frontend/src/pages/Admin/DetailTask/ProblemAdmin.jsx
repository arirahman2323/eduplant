import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { ObjectId } from "bson";
import { HiChevronLeft } from "react-icons/hi";

const ProblemAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;
  const [problemArray, setProblemArray] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "High",
    dueDate: "",
    assignedTo: [],
    attachments: [],
    todoChecklist: [],
  });

  useEffect(() => {
    if (taskId) {
      axiosInstance
        .get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
        .then((res) => {
          const data = res.data;

          setForm({
            title: data.title || "",
            description: data.description || "",
            priority: data.priority || "High",
            dueDate: data.dueDate ? data.dueDate.slice(0, 16) : "",
            assignedTo: data.assignedTo || [],
            attachments: data.attachments || [],
            todoChecklist: data.todoChecklist?.length ? data.todoChecklist : [],
          });

          setProblemArray(Array.isArray(data.problem) ? data.problem : []);
        })
        .catch(() => toast.error("Gagal memuat data problem"));
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigate = (groupNumber) => {
    navigate(`/admin/problem/edit`, {
      state: {
        taskId,
        groupNumber,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskType = "problem";
    try {
      console.log("Payload create problem:", form);

      if (taskId) {
        await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_BY_ID(taskId, taskType), form);
        toast.success("Problem berhasil diperbarui");
      } else {
        await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK_BY_TYPE(taskType), form);
        toast.success("Problem berhasil dibuat");
      }
      navigate("/admin/tasks");
    } catch (err) {
      console.log(err.response.data);
      toast.error("Gagal menyimpan problem");
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="p-6 max-w-4xl my-4 shadow-md bg-white rounded-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">{taskId ? "Edit Problem" : "Buat Problem"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Judul" className="border border-gray-400 rounded-md p-2 w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="border border-gray-400 rounded-md p-2 w-full"></textarea>
          <input name="dueDate" value={form.dueDate} onChange={handleChange} type="datetime-local" className="border border-gray-400 rounded-md p-2 w-full" />

          {/* <div className="border-t-2 border-gray-300 mt-2 pt-2">
            <h3 className="font-medium">Soal</h3>
            <div className="flex items-center space-x-2 mt-1">
              <textarea name="problem" value={form.problem} onChange={handleChange} placeholder="Tulis soal problem di sini" className="border border-gray-400 rounded-md p-2 w-full" rows={4} />
            </div>
          </div> */}

          {problemArray.length === 6 && (
            <div className="flex gap-2 mt-2 mb-4">
              {problemArray.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() =>
                    navigate(`/admin/edit-problem/${item._id}`, {
                      state: { groupNumber: index + 1, taskId },
                    })
                  }
                  className="bg-gray-200 w-full py-2 rounded hover:bg-gray-300 cursor-pointer"
                >
                  Kelompok {index + 1}
                </button>
              ))}
            </div>
          )}

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            {taskId ? "Perbarui" : "Buat"} Problem
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProblemAdmin;
