import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import { GiBackwardTime } from "react-icons/gi";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";

const ProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const { user } = useContext(UserContext);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [submission, setSubmission] = useState(null);

  // Cek dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`selectedGroup_${id}_${user?._id}`);
    if (stored) {
      setSelectedGroupId(stored);
    }
  }, [id, user]);

  useEffect(() => {
    const getTaskAndSubmission = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id));
        setTask(res.data);

        // Fetch submission user
        const submissionRes = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_ID_USER("problem", user._id));
        const found = submissionRes.data.submissions.find((s) => s.task._id === id);
        if (found) {
          setSubmission(found);

          // Cek groupId dari jawaban
          const answered = found.problemAnswer?.[0];
          if (answered?.groupId) {
            setSelectedGroupId(answered.groupId);
            localStorage.setItem(`selectedGroup_${id}_${user._id}`, answered.groupId);
          }
        }
      } catch (e) {
        console.error("Error loading task or submission:", e);
      }
    };

    if (user?._id) {
      getTaskAndSubmission();
    }
  }, [id, user?._id]);

  const handleSelectGroup = (problemId, index) => {
    // Simpan ke localStorage agar tidak bisa pilih ulang
    localStorage.setItem(`selectedGroup_${id}_${user._id}`, problemId);
    setSelectedGroupId(problemId);

    navigate(`/user/problem/group/${problemId}`, {
      state: { groupNumber: index + 1, taskId: task._id },
    });
  };

  if (!task) return <div className="text-center mt-10">Memuat...</div>;

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

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold text-lg mb-4">Pilih Kelompok</h4>
            {task.problem.length === 6 && (
              <div className="flex gap-2 mt-2 mb-4">
                {task.problem.map((item, index) => {
                  const isDisabled = selectedGroupId && selectedGroupId !== item.groupId;

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => handleSelectGroup(item._id, index)}
                      disabled={isDisabled}
                      className={`w-full py-4 rounded text-white cursor-pointer transition
            ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                      Kelompok {index + 1}
                    </button>
                  );
                })}
              </div>
            )}
            {submission && selectedGroupId && <p className="text-sm text-green-600">Kamu sudah memilih kelompok dan tidak bisa mengubahnya.</p>}
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
              <li>Soal Studi Kasus</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProblemPage;
