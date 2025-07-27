import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft } from "react-icons/hi";

const MindmapAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;

  const [form, setForm] = useState({
    title: "",
    instructions: "",
    description: "",
    priority: "medium",
    dueDate: "",
    rubric: [{ text: "", file: null }],
    attachments: [],
    todoChecklist: [],
  });

  useEffect(() => {
    if (taskId) {
      axiosInstance
        .get(API_PATHS.TASKS.GET_TASK_MINDMAP_BY_ID(taskId))
        .then((res) => {
          const data = res.data;
          setForm({
            title: data.title || "",
            instructions: data.instructions || "",
            description: data.description || "",
            priority: data.priority || "medium",
            dueDate: data.dueDate ? data.dueDate.slice(0, 16) : "",
            rubric:
              data.rubric?.length > 0
                ? data.rubric.map((r) => ({
                    text: r.text,
                    file: null,
                    previousFileName: r.file || null,
                  }))
                : [{ text: "", file: null, previousFileName: null }],

            attachments: data.attachments || [],
            todoChecklist: data.todoChecklist || [],
          });
        })
        .catch(() => toast.error("Gagal memuat data mindmap"));
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRubricChange = (index, field, value) => {
    const updated = [...form.rubric];
    updated[index][field] = value;
    setForm((prev) => ({ ...prev, rubric: updated }));
  };

  const handleAddRubric = () => {
    setForm((prev) => ({
      ...prev,
      rubric: [...prev.rubric, { text: "", file: null }],
    }));
  };

  const handleDeleteRubric = (index) => {
    const updated = [...form.rubric];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, rubric: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("instructions", form.instructions);
    formData.append("description", form.description);
    formData.append("dueDate", form.dueDate);
    formData.append("status", form.status || "Pending");

    // Kirim setiap item rubric.text sebagai field rubric
    form.rubric.forEach((item) => {
      formData.append("rubric", item.text);
    });

    // Kirim file rubric dengan field name "files"
    form.rubric.forEach((item) => {
      if (item.file instanceof File) {
        formData.append("rubricFiles", item.file);
      }
    });

    try {
      if (taskId) {
        await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_MINDMAP_BY_ID(taskId), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Mindmap berhasil diperbarui");
      } else {
        await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK_MINDMAP, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Mindmap berhasil dibuat");
      }

      navigate("/admin/tasks");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan mindmap");
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="p-6 max-w-3xl mx-auto my-5 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">{taskId ? "Edit Mindmap" : "Buat Mindmap"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Judul" className="border border-gray-400 rounded-md p-2 w-full" />
          <input name="instructions" value={form.instructions} onChange={handleChange} placeholder="Instruksi" className="border border-gray-400 rounded-md p-2 w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="border border-gray-400 rounded-md p-2 w-full" />
          <input name="dueDate" value={form.dueDate} onChange={handleChange} type="datetime-local" className="border border-gray-400 rounded-md p-2 w-full" />

          {/* Rubrik */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Rubrik Penilaian</h3>
            {form.rubric.map((r, index) => (
              <div key={index} className="space-y-2 mb-4">
                <input type="text" value={r.text} onChange={(e) => handleRubricChange(index, "text", e.target.value)} placeholder={`Rubrik ${index + 1}`} className="border border-gray-400 rounded-md p-2 w-full" />
                <input type="file" accept=".pdf,image/*" onChange={(e) => handleRubricChange(index, "file", e.target.files[0])} className="w-full border border-gray-400 rounded-md p-2" />

                {/* Tampilkan nama file yang sudah ada */}
                {!form.rubric[index].file && location.state && <p className="text-sm text-gray-600 italic">File sebelumnya: {form.rubric[index].previousFileName || "Tidak ada"}</p>}

                <button type="button" onClick={() => handleDeleteRubric(index)} className="text-red-600 text-sm">
                  Hapus Rubrik
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddRubric} className="text-blue-600 mt-2">
              + Tambah Rubrik
            </button>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {taskId ? "Perbarui" : "Buat"} Mindmap
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default MindmapAdmin;
