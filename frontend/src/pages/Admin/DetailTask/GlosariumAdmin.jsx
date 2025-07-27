import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft } from "react-icons/hi";

const GlosariumAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;

  const [form, setForm] = useState({
    term: "",
    content: "",
    description: "",
    priority: "medium",
    dueDate: "",
    status: "Pending",
    attachments: [],
    files: [],
    todoChecklist: [],
  });

  useEffect(() => {
    if (taskId) {
      axiosInstance
        .get(API_PATHS.TASKS.GET_MATERIALS_BY_TYPE("glosarium"))
        .then((res) => {
          const data = res.data[0];
          setForm({
            term: data.term || "",
            content: data.content || "",
            description: data.description || "",
            priority: data.priority || "medium",
            dueDate: data.dueDate ? data.dueDate.slice(0, 16) : "",
            status: data.status || "Pending",
            attachments: data.attachments || [],
            files: data.files || [],
            todoChecklist: data.todoChecklist || [],
          });
        })
        .catch(() => toast.error("Gagal memuat data materi"));
    }
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("term", form.term);
    formData.append("content", form.content);
    formData.append("description", form.description);
    formData.append("priority", form.priority);
    formData.append("dueDate", form.dueDate);
    formData.append("status", form.status);

    form.files.forEach((file) => {
      if (file instanceof File) {
        formData.append("files", file);
      }
    });

    try {
      if (taskId) {
        await axiosInstance.put(API_PATHS.TASKS.UPDATE_MATERIALS_BY_ID(taskId), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Materi berhasil diperbarui");
      } else {
        await axiosInstance.post(API_PATHS.TASKS.CREATE_MATERIALS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Materi berhasil dibuat");
      }

      navigate("/admin/tasks");
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan materi");
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-3xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="p-6 max-w-3xl mx-auto my-5 bg-white shadow rounded">
        <h2 className="text-xl font-bold mb-4">{taskId ? "Edit Glosarium" : "Buat Glosarium"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="term" value={form.term} onChange={handleChange} placeholder="Judul" className="border border-gray-400 rounded-md p-2 w-full" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Deskripsi" className="border border-gray-400 rounded-md p-2 w-full" />
          {/* <input name="dueDate" value={form.dueDate} onChange={handleChange} type="datetime-local" className="border border-gray-400 rounded-md p-2 w-full" /> */}
          <h3 className="font-medium">Materi :</h3>
          <textarea name="content" value={form.content} onChange={handleChange} placeholder="Konten Materi" className="border border-gray-400 rounded-md p-2 w-full" />
          <input type="file" accept=".pdf,image/*" multiple onChange={handleFileChange} className="w-full border border-gray-400 rounded-md p-2 cursor-pointer" />
          {form.files.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">File yang sudah ada:</h4>
              <ul className="space-y-4">
                {form.files.map((file, index) => {
                  const fileUrl = typeof file === "string" ? file : URL.createObjectURL(file);
                  const fileName = typeof file === "string" ? file.split("/").pop() : file.name;
                  const fileExt = fileName.split(".").pop().toLowerCase();

                  const handleDeleteFile = async (fileName, index) => {
                    const isExistingFile = typeof form.files[index] === "string";

                    if (!taskId || !isExistingFile) {
                      // Jika file belum diupload (baru ditambahkan saat edit)
                      const updatedFiles = [...form.files];
                      updatedFiles.splice(index, 1);
                      setForm((prev) => ({
                        ...prev,
                        files: updatedFiles,
                      }));
                      return;
                    }

                    try {
                      await axiosInstance.delete(API_PATHS.TASKS.DELETE_MATERIALS_FILE_BY_ID(taskId, encodeURIComponent(fileName)));
                      toast.success(`File ${fileName} berhasil dihapus`);

                      // Hapus dari state
                      const updatedFiles = [...form.files];
                      updatedFiles.splice(index, 1);
                      setForm((prev) => ({
                        ...prev,
                        files: updatedFiles,
                      }));
                    } catch (err) {
                      console.error("Gagal menghapus file:", err);
                      toast.error("Gagal menghapus file");
                    }
                  };

                  return (
                    <li key={index} className="rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">{fileName}</p>
                        <button type="button" onClick={() => handleDeleteFile(fileName, index)} className="text-red-500 text-sm hover:bg-red-100 border rounded-lg px-2 py-1 cursor-pointer">
                          Hapus
                        </button>
                      </div>
                      {fileExt === "pdf" ? (
                        <iframe src={fileUrl} title={`Preview PDF ${index}`} width="100%" height="400px" className="rounded border" />
                      ) : (
                        <img src={fileUrl} alt={`Preview ${fileName}`} className="max-w-full h-auto rounded" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded">
            {taskId ? "Perbarui" : "Buat"} Glosarium
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default GlosariumAdmin;
