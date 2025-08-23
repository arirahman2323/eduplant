import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import { HiChevronLeft } from "react-icons/hi";

const EditProblem = () => {
  const { problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { taskId, groupNumber } = location.state || {};

  const [task, setTask] = useState(null);
  const [currentProblemText, setCurrentProblemText] = useState("");
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    if (!taskId || !groupNumber) {
      toast.error("Data tidak lengkap");
      navigate("/admin/tasks");
      return;
    }

    axiosInstance
      .get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
      .then((res) => {
        const data = res.data;
        const problemItem = (data.problem || []).find((item) => item._id === problemId);
        if (!problemItem) {
          toast.error("Problem tidak ditemukan");
          navigate("/admin/tasks");
          return;
        }
        setTask(data);
        setCurrentProblemText(problemItem.problem || "");
        setExistingFiles(problemItem.pdfFiles || []);
      })
      .catch(() => {
        toast.error("Gagal memuat data problem");
        navigate("/admin/tasks");
      });
  }, [taskId, problemId, groupNumber, navigate]);

  // const handleChange = (e) => {
  //   setCurrentProblem((prev) => ({
  //     ...prev,
  //     problem: e.target.value,
  //   }));
  // };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", task.title);
      formData.append("description", task.description);
      if (task.dueDate) formData.append("dueDate", task.dueDate);

      // Buat ulang array problem dan kirim
      const updatedProblems = task.problem.map((p) => {
        if (p._id === problemId) {
          return {
            ...p,
            problem: currentProblemText,
            // Kirim file yang sudah ada sebagai string untuk dipertahankan
            pdfFiles: existingFiles,
          };
        }
        return p;
      });

      formData.append("problem", JSON.stringify(updatedProblems));
      formData.append("problemId", problemId);
      // Lampirkan file BARU yang akan diupload
      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      await axiosInstance.put(`/api/tasks/problem/${taskId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Problem berhasil disimpan");
      navigate("/admin/tasks", { state: { taskId } });
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyimpan problem");
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1, { state: { taskId } })} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="p-6 mt-4 max-w-4xl mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Edit Problem - Kelompok {groupNumber}</h2>
        <label className="block text-sm font-medium mb-1">Soal Kelompok {groupNumber}</label>
        <textarea className="border border-gray-300 w-full rounded p-2 mb-4" rows={4} value={currentProblemText} onChange={(e) => setCurrentProblemText(e.target.value)} />
        <div className="mb-4">
          <h3 className="text-md font-semibold mb-2">File Soal Terlampir</h3>
          {existingFiles.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {existingFiles.map((fileUrl, index) => (
                <li key={index}>
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {fileUrl.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada file terlampir.</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload File Soal Baru (PDF)</label>
          <input type="file" multiple accept=".pdf" onChange={(e) => setNewFiles(Array.from(e.target.files))} className="w-full text-sm" />
        </div>
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Simpan
        </button>
      </div>
    </DashboardLayout>
  );
};

export default EditProblem;
