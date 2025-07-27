import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const likertOptions = ["Sangat Tidak Setuju", "Tidak Setuju", "Netral", "Setuju", "Sangat Setuju"];

const KbkAnswerDetail = () => {
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
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("kbk", userId));
        const submissionData = submissionRes.data.submissions[0];

        if (!submissionData) return toast.error("Data jawaban tidak ditemukan");

        setSubmission(submissionData);
        setTaskId(submissionData.task._id);

        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_TYPE("kbk"));
        const taskData = taskRes.data.tasks.find((t) => t._id === submissionData.task._id);
        setTask(taskData);

        // Inisialisasi response
        const init = {};
        taskData?.multipleChoiceQuestions?.forEach((q) => {
          init[q._id] = { selectedOption: "", manualScore: "" };
        });
        setResponses(init);
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
      await axiosInstance.put(API_PATHS.TASKS.POST_SUBMISSION_SCORE("kbk", taskId, userId), formData, { headers: { "Content-Type": "multipart/form-data" } });

      toast.success("Nilai dan feedback berhasil disimpan");
      navigate(`/admin/list-answer/kbk/${taskId}`);
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
        <h2 className="text-xl font-semibold mb-4">Penilaian Jawaban (Input Manual)</h2>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Nilai Total:</label>
          <input type="number" value={score} readOnly className="border rounded px-3 py-2 w-32 text-gray-600 cursor-not-allowed" />
          <button onClick={handleSubmit} disabled={isSubmitting} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            Simpan Nilai
          </button>
        </div>

        {/* File feedback */}
        <div className="mb-6">
          <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
            Upload File Feedback (PDF)
          </label>
          <div className="flex items-center gap-3">
            <label htmlFor="file" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 disabled:opacity-50">
              Pilih File
            </label>
            <span className="text-sm text-gray-600">{feedbackFile?.name || "Belum ada file dipilih"}</span>
            <input type="file" id="file" accept=".pdf" onChange={(e) => setFeedbackFile(e.target.files[0])} className="hidden" disabled={!!submission?.feedbackFile} />
          </div>

          {submission?.feedbackFile && (
            <p className="mt-2 text-sm text-green-600">
              File Feedback:{" "}
              <a href={submission.feedbackFile} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
                Lihat File
              </a>
            </p>
          )}
        </div>

        {task?.multipleChoiceQuestions?.map((q, i) => {
          const userAnswer = submission?.multipleChoiceAnswers?.find((a) => a.questionId === q._id)?.selectedOption;

          return (
            <div key={q._id} className="mb-6 border-b pb-4">
              <p className="font-medium mb-2">
                {i + 1}. {q.question}
              </p>

              {/* Menampilkan jawaban user */}
              <p className="text-sm text-gray-700 mb-2">
                Jawaban siswa: <span className="font-semibold text-blue-600">{userAnswer || "-"}</span>
              </p>

              {/* Input manual skor oleh admin */}
              <div className="mt-2">
                <label className="text-sm text-gray-600">Skor untuk jawaban ini:</label>
                <input type="number" min={0} max={100} value={responses[q._id]?.manualScore || ""} onChange={(e) => handleScoreChange(q._id, e.target.value)} className="border rounded px-3 py-1 w-24 ml-2" />
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default KbkAnswerDetail;
