import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const ProblemAnswerDetail = () => {
  const { taskId, userId } = useParams();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [problemScores, setProblemScores] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", userId));
        const allSubmissions = submissionRes.data.submissions;

        const relevantSubmissions = allSubmissions.filter((sub) => sub.task?._id === taskId);

        if (relevantSubmissions.length === 0) {
          toast.error("Data jawaban untuk tugas ini tidak ditemukan.");
          return;
        }

        relevantSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const latestSubmission = relevantSubmissions[0];

        if (!latestSubmission) {
          toast.error("Data jawaban tidak ditemukan");
          return;
        }

        setSubmission(latestSubmission);

        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(latestSubmission.task._id));
        const taskData = taskRes.data;
        setTask(taskData);

        const initScores = {};
        (latestSubmission.problemAnswer || []).forEach((ans) => {
          initScores[ans.questionId] = ans.score || 0;
        });
        setProblemScores(initScores);
      } catch (err) {
        toast.error("Gagal memuat data jawaban siswa");
        console.error(err);
      }
    };

    fetchData();
  }, [userId, taskId]);

  useEffect(() => {
    const values = Object.values(problemScores);
    if (values.length > 0) {
      const avg = values.reduce((a, b) => a + Number(b || 0), 0) / values.length;
      setScore(Math.round(avg));
    }
  }, [problemScores]);

  const handleProblemScoreChange = (problemId, value) => {
    setProblemScores((prev) => ({
      ...prev,
      [problemId]: isNaN(Number(value)) ? 0 : Number(value),
    }));
  };

  const handleScoreSubmit = async () => {
    if (!submission?.task?._id) return toast.error("Task ID belum tersedia");
    const formData = new FormData();

    formData.append("score", score);
    formData.append("problemScores", JSON.stringify(problemScores));

    if (file) {
      formData.append("feedbackFile", file);
    }

    try {
      setIsSubmitting(true);
      await axiosInstance.put(API_PATHS.TASKS.POST_SUBMISSION_SCORE("problem", submission.task._id, userId), formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
                const problemDetail = task.problem.find((p) => p._id === ans.questionId);
                const groupIndex = task.problem.findIndex((p) => p._id === ans.questionId);

                return (
                  <div key={ans.questionId} className="mb-8 rounded-lg">
                    <p className="font-medium text-lg mb-2">Kelompok {groupIndex + 1}</p>
                    <p className="font-medium text-md mb-2">Soal:</p>
                    <p className="mb-2">{problemDetail?.problem || "Soal tidak ditemukan"}</p>

                    {problemDetail?.pdfFiles && problemDetail.pdfFiles.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2 text-gray-700">File Soal Terlampir:</p>
                        <div className="space-y-4">
                          {problemDetail.pdfFiles.map((file, i) => (
                            <div key={i}>
                              <p className="text-xs text-gray-600 mb-1">{decodeURI(file.split("/").pop())}</p>
                              <iframe src={encodeURI(file)} width="100%" height="500px" style={{ border: "1px solid #ddd", borderRadius: "8px" }} title={`File Soal ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="font-medium text-md mt-4 mb-1">Jawaban:</p>
                    <p className="text-gray-700">{ans.problem || "-"}</p>

                    {ans.files && ans.files.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium text-md mb-2">File Jawaban:</p>
                        <div className="space-y-4">
                          {ans.files.map((file, i) => (
                            <div key={i}>
                              <p className="text-xs text-gray-600 mb-1">{decodeURI(file.split("/").pop())}</p>
                              <iframe src={encodeURI(file)} width="100%" height="500px" style={{ border: "1px solid #ddd", borderRadius: "8px" }} title={`File Jawaban ${i + 1}`} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4">
                      <label className="block font-medium text-sm">Nilai untuk Kelompok Ini:</label>
                      <input
                        type="number"
                        className="border rounded px-3 py-1 w-32 mt-1"
                        placeholder="0"
                        min={0}
                        max={100}
                        value={problemScores[ans.questionId] || ""}
                        onChange={(e) => handleProblemScoreChange(ans.questionId, e.target.value)}
                      />
                    </div>
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
