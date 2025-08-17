import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const likertOptions = ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"];

const LoAnswerDetail = () => {
  const { userId } = useParams();
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const navigate = useNavigate();
  const [feedbackFile, setFeedbackFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("lo", userId));
        const allSubmissions = submissionRes.data.submissions || [];
        if (allSubmissions.length === 0) {
          toast.error("Data jawaban tidak ditemukan");
          return;
        }

        const submissionData = allSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

        setSubmission(submissionData);
        setTaskId(submissionData.task._id);
        setScore(submissionData.score);

        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(submissionData.task._id));
        setTask(taskRes.data);
      } catch (err) {
        toast.error("Gagal memuat data jawaban");
      }
    };

    fetchData();
  }, [userId]);

  const handleOptionChange = (qId, value) => {
    setResponses({
      ...responses,
      [qId]: {
        ...responses[qId],
        selectedOption: value,
      },
    });
  };

  const handleScoreChange = (qId, value) => {
    const num = parseFloat(value);
    const updated = {
      ...responses,
      [qId]: { manualScore: isNaN(num) ? "" : num },
    };
    setResponses(updated);

    const validScores = Object.values(updated)
      .map((r) => r.manualScore)
      .filter((s) => s !== "" && !isNaN(s));

    const total = validScores.reduce((acc, val) => acc + Number(val), 0);
    const avg = validScores.length > 0 ? total / validScores.length : 0;
    setScore(Math.round(avg));
  };

  const handleSubmit = async () => {
    if (!taskId) return toast.error("Task ID belum tersedia");

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("score", score);
      if (feedbackFile) {
        formData.append("feedbackFile", feedbackFile);
      }
      await axiosInstance.put(API_PATHS.TASKS.POST_SUBMISSION_SCORE("lo", taskId, userId), formData, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success("Nilai dan feedback berhasil disimpan");
      navigate(`/admin/list-answer/lo/${taskId}`);
    } catch (err) {
      toast.error("Gagal menyimpan nilai/feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Penilaian Learning Ownership</h2>

        {task?.multipleChoiceQuestions && task.multipleChoiceQuestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Jawaban Kuisioner</h3>
            {task.multipleChoiceQuestions.map((q, i) => {
              const userAnswer = submission?.multipleChoiceAnswers?.find((a) => a.questionId === q._id)?.selectedOption;
              return (
                <div key={q._id} className="mb-4 pt-2">
                  <p className="font-medium mb-2">
                    {i + 1}. {q.question}
                  </p>
                  <p className="text-sm text-gray-700">
                    Jawaban siswa: <span className="font-semibold text-blue-600">{userAnswer || "-"}</span>
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Bagian Jawaban Angket (Esai) --- */}
        {task?.essayQuestions && task.essayQuestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Jawaban Angket (Esai)</h3>
            {task.essayQuestions.map((q, i) => {
              const userAnswer = submission?.essayAnswers?.find((a) => a.questionId === q._id)?.answer;
              return (
                <div key={q._id} className="mb-4 pt-2">
                  <p className="font-medium mb-2">
                    {i + 1}. {q.question}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">Jawaban siswa:</p>
                  <div className="w-full p-3 bg-gray-50 border rounded text-sm text-gray-800 whitespace-pre-wrap">{userAnswer || "-"}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- Bagian Penilaian --- */}
        <div className="border-t-2 border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Input Penilaian</h3>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Nilai Total (0-100):</label>
            <input type="number" placeholder="0" value={score} onChange={(e) => setScore(e.target.value)} className="border rounded px-3 py-2 w-32" min="0" max="100" />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Upload File Feedback (PDF)</label>
            <div className="flex items-center gap-3">
              <label htmlFor="file" className="px-4 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700">
                Pilih File
              </label>
              <span className="text-sm text-gray-600">{feedbackFile?.name || "Belum ada file dipilih"}</span>
              <input type="file" id="file" accept=".pdf" onChange={(e) => setFeedbackFile(e.target.files[0])} className="hidden" />
            </div>
            {submission?.feedbackFile && !feedbackFile && (
              <p className="mt-2 text-sm text-green-600">
                Feedback sudah ada:{" "}
                <a href={submission.feedbackFile} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
                  Lihat File
                </a>
              </p>
            )}
          </div>

          <button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg">
            {isSubmitting ? "Menyimpan..." : "Simpan Penilaian"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LoAnswerDetail;
