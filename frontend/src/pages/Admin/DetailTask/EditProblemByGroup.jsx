import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";
import toast from "react-hot-toast";
import { HiChevronLeft } from "react-icons/hi";

const EditProblem = () => {
  const { problemId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { taskId, groupNumber } = location.state || {};

  const [task, setTask] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(null);

  useEffect(() => {
    if (!taskId || !groupNumber) {
      toast.error("Data tidak lengkap");
      navigate("/admin/tasks");
      return;
    }

    axiosInstance
      .get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId))
      .then((res) => {
        const data = res.data;
        const problemItem = (data.problem || []).find((item) => item._id === problemId);
        if (!problemItem) {
          toast.error("Problem tidak ditemukan");
          navigate("/admin/tasks");
          return;
        }
        setTask(data);
        setCurrentProblem(problemItem);
      })
      .catch(() => {
        toast.error("Gagal memuat data problem");
        navigate("/admin/tasks");
      });
  }, [taskId, problemId]);

  const handleChange = (e) => {
    setCurrentProblem((prev) => ({
      ...prev,
      problem: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const updatedProblems = (task.problem || []).map((p) => (p._id === problemId ? { ...p, problem: currentProblem.problem } : p));

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK_BY_ID(taskId, "problem"), {
        ...task,
        problem: updatedProblems,
      });

      toast.success("Problem berhasil disimpan");
      navigate("/admin/tasks");
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyimpan problem");
    }
  };

  if (!currentProblem) return null;

  return (
    <DashboardLayout activeMenu="Manage Courses">
      <div className="max-w-4xl mt-4 mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center mb-2 text-blue-600 hover:underline cursor-pointer">
          <HiChevronLeft className="mr-1" /> Kembali
        </button>
      </div>
      <div className="p-6 mt-4 max-w-4xl mx-auto bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Edit Problem - Kelompok {groupNumber}</h2>
        <label className="block text-sm font-medium mb-1">Soal Kelompok {groupNumber}</label>
        <textarea className="border border-gray-300 w-full rounded p-2 mb-4" rows={4} value={currentProblem.problem} onChange={handleChange} />
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Simpan
        </button>
      </div>
    </DashboardLayout>
  );
};

export default EditProblem;
