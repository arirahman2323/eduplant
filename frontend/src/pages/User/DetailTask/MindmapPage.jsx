import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import { GiBackwardTime } from "react-icons/gi";
import { UserContext } from "../../../context/userContext";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const MindmapPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch Task + Submission
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTask = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_MINDMAP_BY_ID(id));
        setTask(resTask.data);

        const resSub = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_MINDMAP_BY_ID_USER(id));
        setSubmission(resSub.data);
      } catch (err) {
        console.error("Error fetching mindmap data", err);
      }
    };

    if (user?._id) fetchData();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || submission) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      await axiosInstance.post(API_PATHS.TASKS.POST_SUBMISSION_MINDMAP_BY_TASK_ID(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Berhasil mengumpulkan jawaban!");
      window.location.reload();
    } catch (err) {
      toast.error("Gagal mengirim jawaban");
      console.error(err);
    }
  };

  if (!task) return <div className="text-center mt-10">Memuat...</div>;

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Kiri - Konten */}
        <div className="flex-1">
          <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-blue-600 hover:underline cursor-pointer">
            <HiChevronLeft className="mr-1" /> Kembali
          </button>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600">Quiz</p>
            <p className="mt-4 text-sm text-black">1 Soal</p>
            <div className="mt-2 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Petunjuk Pengerjaan</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
              {task.instructions?.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Rubrik Mindmap</h3>
            {task.rubric?.[0]?.file ? (
              <iframe src={encodeURI(task.rubric[0].file)} width="100%" height="600px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} title="Rubrik PDF" />
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada rubrik tersedia</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upload Jawaban</h3>
            <label htmlFor="file" className="block border-dashed border-2 border-blue-500 rounded-md p-4 text-center cursor-pointer text-sm text-blue-500">
              Upload file dalam format PDF
              <input type="file" id="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" disabled={!!submission} />
            </label>

            {file && <p className="text-sm mt-2 text-gray-600">File dipilih: {file.name}</p>}
            {submission && <p className="text-sm mt-2 text-green-600">Sudah mengumpulkan: {submission.file}</p>}

            <button onClick={handleSubmit} disabled={!!submission} className={`w-full mt-4 py-2.5 rounded-md text-white text-lg transition cursor-pointer ${submission ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
              {submission ? "Sudah Dikirim" : "Kumpulkan"}
            </button>

            <button
              type="button"
              disabled={!submission || !submission.score || submission.score <= 0}
              onClick={() => navigate(`/user/mindmap/result/${id}`)}
              className={`w-full mt-3 py-2.5 rounded-md text-white text-lg transition cursor-pointer ${submission && submission.score > 0 ? "bg-gray-600 hover:bg-gray-700" : "bg-gray-300 cursor-not-allowed"}`}
            >
              Nilai
            </button>
          </div>
        </div>

        {/* Kanan - Info Tugas */}
        <div className="w-full mt-10 md:w-72 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Course Deadline</h4>
            <p className="text-sm flex gap-1 text-gray-400 font-medium">
              <GiBackwardTime className="text-xl" />
              {new Date(task.dueDate).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p className="text-sm mt-8 text-gray-400 font-medium">Status: {task.status === "Completed" ? "Selesai" : "Belum Selesai"}</p>
          </div>

          <div className="bg-white mt-6 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Course</h4>
            <ul className="list-disc mt-3 list-inside text-sm text-gray-700 space-y-1">
              <li>Pembuatan Mindmap</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MindmapPage;
