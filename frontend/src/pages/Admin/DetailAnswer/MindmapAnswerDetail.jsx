import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const MindmapAnswerDetail = () => {
  const { taskId, userId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const taskRes = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_MINDMAP_BY_ID(taskId));
        setTask(taskRes.data);

        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_MINDMAP_ADMIN_BY_ID_USER(userId));

        if (!submissionRes.data) {
          toast.error("Jawaban tidak ditemukan");
          return;
        }

        setSubmission(submissionRes.data[0]);
        setScore(submissionRes.data.score ?? 0);
      } catch (err) {
        console.error(err);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    if (taskId && userId) {
      fetchData();
    }
  }, [taskId, userId]);

  const handleScoreSubmit = async () => {
    if (!taskId || !userId) return toast.error("ID tidak valid");

    try {
      setIsSubmitting(true);
      await axiosInstance.patch(API_PATHS.TASKS.UPDATE_MINDMAP_SCORE(submission._id), { score });
      toast.success("Nilai berhasil disimpan");
      navigate(`/admin/list-answer/mindmap/${taskId}`);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan nilai");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout activeMenu="Manage Courses">
        <div className="max-w-4xl mx-auto my-10 text-center text-gray-600">Memuat data jawaban mindmap...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="max-w-4xl mx-auto my-4 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Penilaian Mindmap</h2>

        <div className="mb-6">
          {/* Petunjuk Pengerjaan */}
          <h3 className="text-lg font-semibold mb-2">Petunjuk Pengerjaan</h3>
          {task?.instructions ? (
            <ul className="list-disc ml-5 space-y-1 text-sm text-gray-800">
              {task.instructions.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Tidak ada petunjuk tersedia.</p>
          )}

          {/* Rubrik Mindmap */}
          <h3 className="text-lg mt-4 font-semibold mb-2">Rubrik Mindmap</h3>
          {task?.rubric?.[0]?.file ? (
            <iframe src={encodeURI(task.rubric[0].file)} width="100%" height="600px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} title="Rubrik PDF" />
          ) : (
            <p className="text-gray-500 text-sm">Tidak ada rubrik tersedia</p>
          )}

          <h4 className="text-md mt-4 font-semibold mb-2">File Jawaban</h4>
          {submission?.answerPdf ? (
            <iframe src={encodeURI(submission.answerPdf)} width="100%" height="600px" style={{ border: "1px solid #ccc", borderRadius: "8px" }} title="Jawaban Mindmap PDF" />
          ) : (
            <p className="text-sm text-gray-500">Tidak ada file jawaban diunggah.</p>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Nilai (0–100):</label>
          <input type="number" className="border rounded px-3 py-2 w-32" min={0} max={100} value={score !== undefined && score !== null ? parseInt(score) || "" : ""} onChange={(e) => setScore(Number(e.target.value))} />
          <button onClick={handleScoreSubmit} disabled={isSubmitting} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
            {isSubmitting ? "Menyimpan..." : "Simpan Nilai"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MindmapAnswerDetail;
