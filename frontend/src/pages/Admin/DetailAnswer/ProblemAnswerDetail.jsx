import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const ProblemAnswerDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [problemScores, setProblemScores] = useState({});
  const [groupChats, setGroupChats] = useState({});
  const [groupMessages, setGroupMessages] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", userId));
        const submissionData = submissionRes.data.submissions[0];

        if (!submissionData) {
          toast.error("Data jawaban tidak ditemukan");
          return;
        }

        setSubmission(submissionData);

        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(submissionData.task._id));
        const taskData = taskRes.data;
        setTask(taskData);

        const initScores = {};
        const chatGroups = {};
        const chatMessages = {};

        await Promise.all(
          submissionData.problemAnswer?.map(async (a) => {
            initScores[a.questionId] = 0;
            try {
              const resGroup = await axiosInstance.get(`/api/groups/problem/${a.questionId}`);
              const group = resGroup.data;
              chatGroups[a.questionId] = group;

              const resMessages = await axiosInstance.get(`/api/groups/${group._id}/messages`);
              chatMessages[a.questionId] = resMessages.data;
            } catch (err) {
              console.warn("Gagal mengambil grup atau pesan untuk", a.questionId);
            }
          })
        );

        setProblemScores(initScores);
        setGroupChats(chatGroups);
        setGroupMessages(chatMessages);
      } catch (err) {
        toast.error("Gagal memuat data jawaban siswa");
        console.error(err);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    const values = Object.values(problemScores);
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + Number(b || 0), 0) / values.length;
      setScore(Math.round(avg));
    }
  }, [problemScores]);

  const handleProblemScoreChange = (problemId, value) => {
    const updated = {
      ...problemScores,
      [problemId]: isNaN(value) ? 0 : value,
    };
    setProblemScores(updated);
  };

  const handleScoreSubmit = async () => {
    if (!submission?.task?._id) return toast.error("Task ID belum tersedia");

    try {
      setIsSubmitting(true);
      await axiosInstance.put(API_PATHS.TASKS.POST_SUBMISSION_SCORE("problem", submission.task._id, userId), {
        score,
        problemScores,
        if(file) {
          formData.append("feedbackFile", file);
        },
      });
      toast.success("Nilai berhasil disimpan");
      navigate(`/admin/list-answer/problem/${submission.task._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan nilai");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Penilaian Jawaban Siswa</h2>

        {/* Skor Total */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Nilai Total :</label>
          <input type="number" value={score} disabled className="border rounded px-3 py-2 w-32 text-gray-600 bg-gray-100" min={0} max={100} />
          <button onClick={handleScoreSubmit} disabled={isSubmitting} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Simpan Nilai
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block border-dashed border-2 border-blue-500 rounded-md p-4 text-center cursor-pointer text-sm text-blue-500">
            Upload file feedback (PDF)
            <input type="file" id="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="hidden" />
          </label>
          {file && <p className="text-sm mt-1 text-gray-700">File terpilih: {file.name}</p>}
        </div>

        {task && submission && (
          <>
            <h3 className="text-lg font-semibold mb-4">Jawaban Problem (Kelompok)</h3>
            {submission.problemAnswer?.length === 0 ? (
              <p className="text-sm italic text-gray-500">User belum mengerjakan soal problem.</p>
            ) : (
              submission.problemAnswer.map((ans) => {
                const problem = task.problem.find((p) => p._id === ans.questionId);
                const groupIndex = task.problem.findIndex((p) => p._id === ans.questionId);

                return (
                  <div key={ans.questionId} className="mb-8 rounded-lg">
                    <p className="font-medium text-lg mb-2">Kelompok {groupIndex + 1}</p>
                    <p className="font-medium text-md mb-2">Soal:</p>
                    <p className="mb-2">{problem?.problem || "Soal tidak ditemukan"}</p>

                    <p className="font-medium text-md mt-4 mb-1">Jawaban:</p>
                    <p className="text-gray-700">{ans.problem || "-"}</p>

                    <label className="block mt-4 mb-2 font-medium text-sm">Nilai:</label>
                    <input
                      type="number"
                      className="border rounded px-3 py-1 w-32"
                      min={0}
                      max={100}
                      value={problemScores[ans.questionId] !== undefined && problemScores[ans.questionId] !== null ? parseInt(problemScores[ans.questionId]) || "" : ""}
                      onChange={(e) => handleProblemScoreChange(ans.questionId, Number(e.target.value))}
                    />

                    {/* Chat Group Section */}
                    {groupChats[ans.questionId] && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Obrolan Grup</h4>
                        <div className="h-60 overflow-y-auto border p-2 rounded mb-3 bg-gray-50">
                          {groupMessages[ans.questionId]?.length > 0 ? (
                            groupMessages[ans.questionId].map((msg, i) => {
                              const isMe = false; // Admin tidak membandingkan user, jadi selalu false
                              return (
                                <div key={i} className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
                                  <div className={`max-w-[80%] ${isMe ? "text-right" : "text-left"}`}>
                                    {!isMe && (
                                      <div className="flex items-center gap-2 mb-1">
                                        {msg?.senderId?.profileImageUrl ? (
                                          <img src={msg.senderId.profileImageUrl} alt="avatar" className="w-6 h-6 rounded-full" />
                                        ) : (
                                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-xs text-gray-700">👤</span>
                                          </div>
                                        )}
                                        <span className="text-xs text-gray-500">{msg.senderId?.name || "Anonim"}</span>
                                      </div>
                                    )}

                                    <div className={`px-4 py-2 rounded-lg text-sm ${isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>{msg.message}</div>

                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-gray-500">Belum ada pesan dalam grup ini.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProblemAnswerDetail;
