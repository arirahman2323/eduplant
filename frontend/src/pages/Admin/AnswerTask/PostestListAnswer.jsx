import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import { HiChevronLeft } from "react-icons/hi";

const PostestListAnswer = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  const getUserAnswers = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.TASKS.GET_SUBMISSION_BY_TASK_ID(taskId));
      setAnswers(res.data.submissions || []);
    } catch (error) {
      console.error("Gagal mengambil data jawaban:", error);
    }
  };

  useEffect(() => {
    getUserAnswers();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-6xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="p-6 max-w-6xl mt-4 mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Jawaban Siswa</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Email</th>
                <th className="p-3">Nilai</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {answers.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="4">
                    Belum ada yang menjawab.
                  </td>
                </tr>
              ) : (
                answers.map((answer) => (
                  <tr key={answer._id} className="border-t">
                    <td className="p-3">{answer.user?.name}</td>
                    <td className="p-3">{answer.user?.email}</td>
                    <td className="p-3">{answer.score ?? "-"}</td>
                    <td className="p-3">
                      <button onClick={() => navigate(`/admin/answer/postest/${answer.user._id}`)} className="text-blue-600 hover:underline cursor-pointer">
                        Lihat & Nilai
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostestListAnswer;
