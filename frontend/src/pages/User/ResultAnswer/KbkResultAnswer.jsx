import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/userContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft } from "react-icons/hi";
import { GiBackwardTime } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";

const KbkResultAnswer = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskAndSubmission = async () => {
      if (!user?._id) return;
      try {
        // Ambil data soal yang spesifik
        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
        setTask(taskRes.data);

        // Ambil data jawaban terbaru
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("kbk", user._id));
        const userSubmissions = (submissionRes.data?.submissions || []).filter((s) => s.task._id === id);

        if (userSubmissions.length > 0) {
          const latestSubmission = userSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
          setSubmission(latestSubmission);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskAndSubmission();
  }, [id, user]);

  if (loading) return <div className="text-center mt-10">Memuat hasil penilaian...</div>;

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="flex-1">
          <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-blue-600 hover:underline cursor-pointer">
            <HiChevronLeft className="mr-1" /> Kembali
          </button>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            <p className="mt-4 text-sm text-black">{(task.multipleChoiceQuestions?.length || 0) + (task.essayQuestions?.length || 0)} Pertanyaan</p>
            <div className="mt-2 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <p className="mt-2 text-sm w-24 text-center rounded-lg py-2 font-medium mb-4 text-blue-500 border border-blue-500">Nilai: {submission.score ?? 0}</p>

            {/* Tampilkan Feedback File jika ada */}
            {submission?.feedbackFile && (
              <div className="mb-6">
                <p className="text-sm mb-2 text-green-600 font-medium">Feedback :</p>
                <div className="w-full h-[500px] border rounded shadow-inner overflow-hidden">
                  <iframe src={submission.feedbackFile} title="Feedback PDF" width="100%" height="100%" className="rounded"></iframe>
                </div>
              </div>
            )}

            {/* Menampilkan Jawaban Kuisioner */}
            {task.multipleChoiceQuestions?.map((q, i) => {
              const userAnswer = submission.multipleChoiceAnswers.find((a) => a.questionId === q._id);
              return (
                <div key={q._id} className="mb-4 border-t pt-4">
                  <h4 className="font-semibold">Pertanyaan Kuisioner {i + 1}</h4>
                  <p className="mb-2">{q.question}</p>
                  <p className="mt-2 text-sm">
                    Jawaban kamu: <strong>{userAnswer?.selectedOption || "-"}</strong>
                  </p>
                </div>
              );
            })}

            {/* Menampilkan Jawaban Angket */}
            {task.essayQuestions?.map((q, i) => {
              const userAnswer = submission.essayAnswers.find((a) => a.questionId === q._id);
              return (
                <div key={q._id} className="mb-4 border-t pt-4">
                  <h4 className="font-semibold">Pertanyaan Angket {i + 1}</h4>
                  <p className="mb-2">{q.question}</p>
                  <p className="text-sm">Jawaban kamu:</p>
                  <div className="w-full p-3 bg-gray-50 border rounded text-sm text-gray-800 whitespace-pre-wrap">{userAnswer?.answer || "-"}</div>
                </div>
              );
            })}

            <button onClick={() => navigate("/survey", { state: { taskTitle: task.title, taskId: task._id } })} className="bg-blue-600 w-full cursor-pointer text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-700">
              Selesai
            </button>
          </div>
        </div>

        <div className="w-full mt-10 md:w-72 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Batas Waktu</h4>
            <p className="text-sm flex gap-1 text-gray-400 font-medium">
              <GiBackwardTime className="text-xl" />
              {new Date(task.dueDate).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-sm mt-8 text-gray-400 font-medium">Status: {submission?.score ? "Sudah Dinilai" : "Belum Dinilai"}</p>
          </div>

          <div className="bg-white mt-6 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Jenis Soal</h4>
            <ul className="list-disc mt-3 list-inside text-sm text-gray-700 space-y-1">
              <li>Pertanyaan Skala Likert</li>
              <li>Penilaian oleh Admin</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KbkResultAnswer;
