import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/userContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft, HiPaperClip } from "react-icons/hi";
import { GiBackwardTime } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";

const ProblemResultAnswer = () => {
  const { id } = useParams();
  const taskId = id;
  const { user } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskAndSubmission = async () => {
      if (!user?._id) return;
      try {
        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
        setTask(taskRes.data);

        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", user._id));
        const userSubmissions = (submissionRes.data?.submissions || []).filter((s) => s.task?._id === taskId);

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

    if (user?._id) fetchTaskAndSubmission();
  }, [user, taskId]);

  if (loading) return <div className="text-center mt-10">Memuat hasil problem...</div>;
  if (!task || !submission) return <div className="text-center mt-10">Data jawaban tidak ditemukan.</div>;
  console.log(submission);
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
            <div className="mt-11 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <p className="mt-2 text-sm w-32 text-center rounded-lg py-2 font-medium mb-4 text-blue-500 border border-blue-500">Nilai: {submission.score ?? 0}</p>

            {submission.problemAnswer?.length === 0 ? (
              <p className="text-sm italic text-gray-500">Belum ada jawaban yang dikumpulkan.</p>
            ) : (
              submission.problemAnswer.map((ans, index) => {
                const problem = task.problem.find((p) => p._id === ans.questionId);
                const groupIndex = task.problem.findIndex((p) => p._id === ans.questionId);

                return (
                  <div key={ans.questionId} className="mb-2">
                    <h4 className="font-semibold mb-1">Kelompok {groupIndex + 1}</h4>
                    <p className="font-medium text-md mb-1">Soal:</p>
                    <p className="text-gray-800 mb-1">{problem?.problem || "Soal tidak ditemukan"}</p>
                    {problem?.pdfFiles && problem.pdfFiles.length > 0 && (
                      <div className="mt-2 space-y-4">
                        {problem.pdfFiles.map((file, i) => (
                          <div key={i}>
                            <p className="text-xs text-gray-600 mb-1">{decodeURI(file.split("/").pop())}</p>
                            <iframe src={encodeURI(file)} width="100%" height="500px" style={{ border: "1px solid #ddd" }} title={`File Soal ${i + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="font-medium text-md mt-3 mb-1">Jawaban Teks:</p>
                    <p className="bg-gray-100 p-3 rounded text-sm mb-4">{ans.problem || "-"}</p>

                    {ans.files && ans.files.length > 0 && (
                      <div>
                        <p className="font-medium text-md mb-1">File Jawaban Terlampir:</p>
                        <div className="space-y-4">
                          <div key={0}>
                            <p className="text-xs text-gray-600 mb-1 font-semibold">File Hasil Diskusi:</p>
                            <iframe src={encodeURI(ans.files[0])} width="100%" height="500px" style={{ border: "1px solid #ddd" }} title={`File Diskusi`} />
                          </div>
                          {ans.files.slice(1).map((file, i) => (
                            <div key={i + 1}>
                              <p className="text-xs text-gray-600 mb-1 font-semibold">File Jawaban {i + 1}:</p>
                              <iframe src={encodeURI(file)} width="100%" height="500px" style={{ border: "1px solid #ddd" }} title={`File Jawaban ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {submission.feedbackFile && (
              <div className="mt-8">
                <h4 className="text-md font-semibold mb-2">Feedback</h4>
                <iframe src={encodeURI(submission.feedbackFile)} width="100%" height="600px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} title="Feedback PDF" />
              </div>
            )}

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
            <p className="text-sm mt-8 text-gray-400 font-medium">Status: {task.status === "Completed" ? "Selesai" : "Belum Selesai"}</p>
          </div>

          <div className="bg-white mt-6 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Course</h4>
            <ul className="list-disc mt-3 list-inside text-sm text-gray-700 space-y-1">
              <li>Problem Kelompok</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProblemResultAnswer;
