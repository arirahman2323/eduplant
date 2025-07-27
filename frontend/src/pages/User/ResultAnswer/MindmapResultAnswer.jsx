import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft } from "react-icons/hi";
import { GiBackwardTime } from "react-icons/gi";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const MindmapResultAnswer = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTask = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_MINDMAP_BY_ID(id));
        setTask(resTask.data);

        const resSub = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_MINDMAP_BY_ID_USER(id));
        setSubmission(resSub.data);
      } catch (error) {
        console.error("❌ Error fetching mindmap result:", error);
      }
    };

    if (user?._id) fetchData();
  }, [id, user]);

  if (!task || !submission) return <div className="text-center mt-10">Memuat hasil mindmap...</div>;

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
            <p className="text-gray-600">Tugas Mindmap</p>
            <p className="mt-4 text-sm text-black">1 Soal</p>
            <div className="mt-2 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <p className="mt-2 text-sm w-20 text-center rounded-lg py-2 font-medium mb-4 text-blue-500 border border-blue-500">Nilai: {submission.score ?? 0}</p>
            <h3 className="text-lg font-semibold mb-2">Petunjuk Pengerjaan</h3>
            <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
              {task.instructions?.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Jawaban Kamu (PDF)</h3>
            {submission ? (
              <iframe src={encodeURI(submission.answerPdf)} width="100%" height="600px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} title="Jawaban Mindmap PDF" />
            ) : (
              <p className="text-sm text-gray-500">Belum ada file yang diunggah.</p>
            )}

            <button onClick={() => navigate("/survey", { state: { taskTitle: "mindmap", taskId: task._id } })} className="bg-blue-600 w-full cursor-pointer text-white px-6 py-2 rounded-md mt-6 hover:bg-blue-700">
              Selesai
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

export default MindmapResultAnswer;
