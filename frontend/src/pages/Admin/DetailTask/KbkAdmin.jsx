// Bagian atas tidak berubah
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { ObjectId } from "bson";
import { HiChevronLeft } from "react-icons/hi";

const KbkAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: [],
    attachments: [],
    todoChecklist: [],
    multipleChoiceQuestions: [],
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
            priority: data.priority || "Medium",
            dueDate: data.dueDate ? data.dueDate.slice(0, 16) : "",
            assignedTo: data.assignedTo || [],
            attachments: data.attachments || [],
            todoChecklist: data.todoChecklist?.length ? data.todoChecklist : [],
            multipleChoiceQuestions: data.multipleChoiceQuestions || [],
          });
        })
        .catch(() => toast.error("Gagal memuat data KBK"));
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMCQ = () => {
    setForm((prev) => ({
      ...prev,
      multipleChoiceQuestions: [
        ...prev.multipleChoiceQuestions,
        {
          _id: new ObjectId().toHexString(),
          question: "",
          options: ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"],
        },
      ],
    }));
  };

  const handleMCQChange = (index, field, value) => {
    const updated = [...form.multipleChoiceQuestions];
    if (field === "question" || field === "answer") updated[index][field] = value;
    setForm((prev) => ({ ...prev, multipleChoiceQuestions: updated }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...form.multipleChoiceQuestions];
    updated[qIndex].options[optIndex] = value;
    setForm((prev) => ({ ...prev, multipleChoiceQuestions: updated }));
  };

  const handleDeleteMCQ = async (id) => {
    if (taskId && id) {
      try {
        await axiosInstance.delete(API_PATHS.TASKS.DELETE_QUESTION_BY_ID_TYPE(taskId, "multipleChoice", id));
        setForm((prev) => ({
          ...prev,
          multipleChoiceQuestions: prev.multipleChoiceQuestions.filter((q) => q._id !== id),
        }));
        toast.success("Soal berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus soal");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskType = "kbk";

    try {
      if (taskId) {
        await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_BY_ID(taskId, taskType), form);
        toast.success("Berpikir Kreatif berhasil diperbarui");
      } else {
        await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK_BY_TYPE(taskType), form);
        toast.success("Berpikir Kreatif berhasil dibuat");
      }
      navigate("/admin/tasks");
    } catch (err) {
      toast.error("Gagal menyimpan Berpikir Kreatif");
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
        <h2 className="text-xl font-semibold mb-4">{taskId ? "Berpikir Kreatif" : "Buat Berpikir Kreatif"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Judul" className="border border-gray-400 rounded-md p-2 w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="border border-gray-400 rounded-md p-2 w-full"></textarea>
          <input name="dueDate" value={form.dueDate} onChange={handleChange} type="datetime-local" className="border border-gray-400 rounded-md p-2 w-full" />

          <div className="border-t-2 border-gray-300 pt-2">
            <h3 className="font-medium">Soal Berpikir Kreatif</h3>
            {form.multipleChoiceQuestions.map((q, i) => (
              <div key={q._id} className="space-y-1 mb-4">
                <input value={q.question} onChange={(e) => handleMCQChange(i, "question", e.target.value)} placeholder={`Soal ${i + 1}`} className="border border-gray-400 rounded-md p-2 w-full" />
                {/* <h3 className="font-medium">Opsi Jawaban:</h3>
                {q.options.map((opt, j) => (
                  <input key={j} value={opt} onChange={(e) => handleOptionChange(i, j, e.target.value)} placeholder={`Opsi ${j + 1}`} className="border border-gray-400 rounded-md p-2 w-full mt-1" />
                ))}
                <h3 className="font-medium">Jawaban Benar (opsional):</h3>
                <input value={q.answer} onChange={(e) => handleMCQChange(i, "answer", e.target.value)} placeholder="Jawaban benar (boleh dikosongi)" className="border border-gray-400 rounded-md p-2 w-full mt-1" /> */}
                <button type="button" onClick={() => handleDeleteMCQ(q._id)} className="text-red-500 text-sm cursor-pointer">
                  Hapus Soal
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddMCQ} className="text-blue-500 cursor-pointer">
              + Tambah Soal Berpikir Kreatif
            </button>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            {taskId ? "Perbarui" : "Buat"} Berpikir Kreatif
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default KbkAdmin;
