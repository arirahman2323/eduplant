import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const PostestAnswerDetail = () => {
  const { userId } = useParams();
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [essayScores, setEssayScores] = useState({});
  const [taskId, setTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil submission berdasarkan user dan jenis postest
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("postest", userId));
        const submissionData = submissionRes.data.submissions[0];

        if (!submissionData) {
          toast.error("Data jawaban tidak ditemukan");
          return;
        }

        setSubmission(submissionData);
        setTaskId(submissionData.task._id);

        // Ambil detail soal postest
        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_TYPE("postest"));
        const taskData = taskRes.data.tasks.find((t) => t._id === submissionData.task._id);
        setTask(taskData);

        // Inisialisasi nilai essay
        const essayInit = {};
        taskData?.essayQuestions?.forEach((q) => {
          essayInit[q._id] = 0;
        });
        setEssayScores(essayInit);

        // Hitung skor pilihan ganda
        const totalMCQ = taskData?.multipleChoiceQuestions?.length || 0;
        let mcqScore = 0;
        if (totalMCQ > 0) {
          const correctMCQ = submissionData.multipleChoiceAnswers.filter((ans) => {
            const q = taskData.multipleChoiceQuestions.find((q) => q._id === ans.questionId);
            return q && q.answer === ans.selectedOption;
          }).length;
          mcqScore = (correctMCQ / totalMCQ) * 100;
        }

        const finalScore = calculateFinalScore(essayInit, mcqScore, taskData);
        setScore(Math.round(finalScore));
      } catch (err) {
        toast.error("Gagal memuat data jawaban siswa");
      }
    };

    fetchData();
  }, [userId]);

  const calculateFinalScore = (essayScores, mcqScore, taskData) => {
    const totalEssay = taskData.essayQuestions.length;
    const totalMCQ = taskData.multipleChoiceQuestions.length;

    const essayWeight = totalEssay && totalMCQ ? 0.6 : totalEssay ? 1 : 0;
    const mcqWeight = totalEssay && totalMCQ ? 0.4 : totalMCQ ? 1 : 0;

    const avgEssayScore = totalEssay > 0 ? Object.values(essayScores).reduce((acc, val) => acc + Number(val), 0) / totalEssay : 0;

    return avgEssayScore * essayWeight + mcqScore * mcqWeight;
  };

  const handleEssayScoreChange = (questionId, value) => {
    const sanitized = isNaN(value) ? 0 : value;
    const updated = {
      ...essayScores,
      [questionId]: sanitized,
    };
    setEssayScores(updated);

    const totalMCQ = task?.multipleChoiceQuestions?.length || 0;
    let mcqScore = 0;
    if (totalMCQ > 0 && submission) {
      const correctMCQ = submission.multipleChoiceAnswers.filter((ans) => {
        const q = task.multipleChoiceQuestions.find((q) => q._id === ans.questionId);
        return q && q.answer === ans.selectedOption;
      }).length;
      mcqScore = (correctMCQ / totalMCQ) * 100;
    }

    const finalScore = calculateFinalScore(updated, mcqScore, task);
    setScore(Math.round(finalScore));
  };

  const handleScoreSubmit = async () => {
    if (!taskId) return toast.error("Task ID belum tersedia");

    try {
      setIsSubmitting(true);
      await axiosInstance.post(API_PATHS.TASKS.POST_SUBMISSION_SCORE("postest", taskId, userId), { score });
      navigate(`/admin/list-answer/postest/${taskId}`);
      toast.success("Nilai berhasil disimpan");
    } catch (err) {
      console.log(err);
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

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Nilai Total:</label>
          <input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} className="border rounded px-3 py-2 w-32 text-gray-600 cursor-not-allowed" min={0} max={100} disabled />
          <button onClick={handleScoreSubmit} disabled={isSubmitting} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Simpan Nilai
          </button>
        </div>

        {task && submission && (
          <>
            <h3 className="text-lg font-semibold mb-2">Jawaban Essai</h3>
            {task.essayQuestions.length === 0 ? (
              <p className="text-sm italic text-gray-500">Tidak ada soal essai.</p>
            ) : (
              task.essayQuestions.map((q, index) => {
                const ans = submission.essayAnswers.find((a) => a.questionId === q._id);
                return (
                  <div key={q._id} className="mb-4">
                    <p className="font-medium">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Jawaban: {ans?.answer || "-"}</p>
                    <input
                      type="number"
                      placeholder="Nilai"
                      className="border rounded px-3 py-1 mt-2 w-32"
                      value={essayScores[q._id] !== undefined && essayScores[q._id] !== null ? parseInt(essayScores[q._id]) || "" : ""}
                      min={0}
                      max={100}
                      onChange={(e) => handleEssayScoreChange(q._id, Number(e.target.value))}
                    />
                  </div>
                );
              })
            )}

            <h3 className="text-lg font-semibold mt-6 mb-2">Jawaban Pilihan Ganda</h3>
            {task.multipleChoiceQuestions.length === 0 ? (
              <p className="text-sm italic text-gray-500">Tidak ada soal pilihan ganda.</p>
            ) : (
              task.multipleChoiceQuestions.map((q, index) => {
                const ans = submission.multipleChoiceAnswers.find((a) => a.questionId === q._id);
                return (
                  <div key={q._id} className="mb-4">
                    <p className="font-medium">
                      {index + 1}. {q.question}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Jawaban: {ans?.selectedOption || "-"}</p>
                    <p className="text-sm text-green-600">Kunci: {q.answer}</p>
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

export default PostestAnswerDetail;
