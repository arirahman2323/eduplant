import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { ObjectId } from "bson";
import { HiChevronLeft } from "react-icons/hi";

const PostestAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "High",
    dueDate: "",
    assignedTo: [],
    attachments: [],
    todoChecklist: [],
    essayQuestions: [],
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
            priority: data.priority || "High",
            dueDate: data.dueDate ? data.dueDate.slice(0, 16) : "",
            assignedTo: data.assignedTo || [],
            attachments: data.attachments || [],
            todoChecklist: data.todoChecklist?.length ? data.todoChecklist : [],
            essayQuestions: data.essayQuestions || [],
            multipleChoiceQuestions: data.multipleChoiceQuestions || [],
          });
        })
        .catch(() => toast.error("Gagal memuat data postest"));
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEssay = () => {
    setForm((prev) => ({
      ...prev,
      essayQuestions: [...prev.essayQuestions, { _id: new ObjectId().toHexString(), question: "" }],
    }));
  };

  const handleAddMCQ = () => {
    setForm((prev) => ({
      ...prev,
      multipleChoiceQuestions: [
        ...prev.multipleChoiceQuestions,
        {
          _id: new ObjectId().toHexString(),
          question: "",
          options: ["", "", "", ""],
          answer: "",
        },
      ],
    }));
  };

  const handleEssayChange = (index, value) => {
    const updated = [...form.essayQuestions];
    updated[index].question = value;
    setForm((prev) => ({ ...prev, essayQuestions: updated }));
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

  const handleDeleteEssay = async (id) => {
    if (taskId && id) {
      try {
        await axiosInstance.delete(API_PATHS.TASKS.DELETE_QUESTION_BY_ID_TYPE(taskId, "essay", id));
        setForm((prev) => ({
          ...prev,
          essayQuestions: prev.essayQuestions.filter((q) => q._id !== id),
        }));
        toast.success("Soal essai berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus soal essai");
      }
    }
  };

  const handleDeleteMCQ = async (id) => {
    if (taskId && id) {
      try {
        await axiosInstance.delete(API_PATHS.TASKS.DELETE_QUESTION_BY_ID_TYPE(taskId, "multipleChoice", id));
        setForm((prev) => ({
          ...prev,
          multipleChoiceQuestions: prev.multipleChoiceQuestions.filter((q) => q._id !== id),
        }));
        toast.success("Soal pilihan ganda berhasil dihapus");
      } catch {
        toast.error("Gagal menghapus soal pilihan ganda");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskType = "postest";

    try {
      if (taskId) {
        await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_BY_ID(taskId, taskType), form);
        toast.success("Postest berhasil diperbarui");
      } else {
        await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK_BY_TYPE(taskType), form);
        toast.success("Postest berhasil dibuat");
      }
      navigate("/admin/tasks");
    } catch (err) {
      toast.error("Gagal menyimpan postest");
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
        <h2 className="text-xl font-semibold mb-4">{taskId ? "Edit Postest" : "Buat Postest"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Judul" className="border border-gray-400 rounded-md p-2 w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="border border-gray-400 rounded-md p-2 w-full"></textarea>
          <input name="dueDate" value={form.dueDate} onChange={handleChange} type="datetime-local" className="border border-gray-400 rounded-md p-2 w-full" />

          <div className="border-t-2 border-gray-300 mt-2 pt-2">
            <h3 className="font-medium">Soal Essai</h3>
            {form.essayQuestions.map((q, i) => (
              <div key={q._id} className="flex items-center space-x-2 mt-1">
                <input value={q.question} onChange={(e) => handleEssayChange(i, e.target.value)} placeholder={`Essay ${i + 1}`} className="border border-gray-400 rounded-md p-2 w-full" />
                <button type="button" onClick={() => handleDeleteEssay(q._id)} className="text-red-500 text-sm cursor-pointer">
                  Hapus
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddEssay} className="text-blue-500 mt-2 cursor-pointer">
              + Tambah Soal Essai
            </button>
          </div>

          <div className="border-t-2 border-gray-300 pt-2">
            <h3 className="font-medium">Soal Pilihan Ganda</h3>
            {form.multipleChoiceQuestions.map((q, i) => (
              <div key={q._id} className="space-y-1 mb-4">
                <input value={q.question} onChange={(e) => handleMCQChange(i, "question", e.target.value)} placeholder={`Soal ${i + 1}`} className="border border-gray-400 rounded-md p-2 w-full" />
                <h3 className="font-medium">Opsi Jawaban :</h3>
                {q.options.map((opt, j) => (
                  <input key={j} value={opt} onChange={(e) => handleOptionChange(i, j, e.target.value)} placeholder={`Opsi ${j + 1}`} className="border border-gray-400 rounded-md p-2 w-full mt-1" />
                ))}
                <h3 className="font-medium">Jawaban Benar :</h3>
                <input value={q.answer} onChange={(e) => handleMCQChange(i, "answer", e.target.value)} placeholder="Jawaban benar" className="border border-gray-400 rounded-md p-2 w-full mt-1" />
                <button type="button" onClick={() => handleDeleteMCQ(q._id)} className="text-red-500 text-sm cursor-pointer">
                  Hapus Soal
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddMCQ} className="text-blue-500 cursor-pointer">
              + Tambah Soal Pilihan Ganda
            </button>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            {taskId ? "Perbarui" : "Buat"} Pretest
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostestAdmin;
