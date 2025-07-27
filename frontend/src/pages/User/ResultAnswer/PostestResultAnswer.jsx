import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/userContext";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { HiChevronLeft } from "react-icons/hi";
import { GiBackwardTime } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const PostestResultAnswer = () => {
  const { user } = useContext(UserContext);
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskAndSubmission = async () => {
      try {
        const [taskRes, submissionRes] = await Promise.all([axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_TYPE("postest")), axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("postest", user._id))]);

        setTask(taskRes.data.tasks[0]);
        const data = submissionRes.data.submissions.find((s) => s.task._id === taskRes.data.tasks[0]._id);
        setSubmission(data);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTaskAndSubmission();
  }, [user]);

  if (loading) return <div className="text-center mt-10">Memuat hasil postest...</div>;

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
            <p className="mt-4 text-sm text-black">{(task.multipleChoiceQuestions?.length || 0) + (task.essayQuestions?.length || 0)} Soal</p>
            <div className="mt-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <p className="mt-2 text-sm w-20 text-center rounded-lg py-2 font-medium mb-4 text-blue-500 border border-blue-500">Nilai: {submission.score ?? 0}</p>
            {task.multipleChoiceQuestions?.map((q, i) => {
              const userAnswer = submission.multipleChoiceAnswers.find((a) => a.questionId === q._id);
              const isCorrect = userAnswer?.selectedOption === q.answer;
              return (
                <div key={q._id} className="mb-4">
                  <h4 className="font-semibold">Soal Pilihan Ganda {i + 1}</h4>
                  <p className="mb-2">{q.question}</p>
                  <ul className="list-disc ml-5 text-sm text-gray-700">
                    {q.options.map((opt, idx) => (
                      <li key={idx} className={userAnswer?.selectedOption === opt ? (isCorrect ? "text-green-600" : "text-red-600") : ""}>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">
                    Jawaban kamu: <strong>{userAnswer?.selectedOption || "-"}</strong>
                  </p>
                  <p className="text-sm">
                    Jawaban benar: <strong>{q.answer}</strong>
                  </p>
                </div>
              );
            })}

            {task.essayQuestions?.map((q, i) => {
              const userEssay = submission.essayAnswers.find((a) => a.questionId === q._id);
              return (
                <div key={q._id} className="mb-4">
                  <h4 className="font-semibold">Soal Essai {i + 1}</h4>
                  <p className="mb-2">{q.question}</p>
                  <p className="text-sm text-gray-800">Jawaban kamu:</p>
                  <p className="bg-gray-100 p-3 rounded mt-1 text-sm">{userEssay?.answer || "-"}</p>
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
            <h4 className="font-semibold mb-2">Course Deadline</h4>
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
              <li>Soal Pilihan Ganda</li>
              <li>Soal Essai</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostestResultAnswer;
