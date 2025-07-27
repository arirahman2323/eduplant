import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaAngry, FaFrown, FaMeh, FaSmile, FaGrinBeam } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const SurveyPage = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const taskTitle = location.state?.taskTitle || "Tugas";
  const taskId = location.state?.taskId;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected === null) return toast.error("Silakan pilih tingkat kepuasan!");

    // const payload = {
    //   idUser: user._id,
    //   typeSurvei: "kepuasan",
    //   nilai: selected,
    // };

    try {
      await axiosInstance.post(API_PATHS.TASKS.POST_SURVEY, {
        idUser: user._id,
        typeSurvei: "kepuasan",
        nilai: selected,
        idTask: taskId,
      });

      toast.success("Survei berhasil dikirim!");
      navigate("/user/tasks");
    } catch (err) {
      toast.error("Gagal mengirim survei.");
      console.error(err);
    }
  };

  const options = [
    { id: 5, icon: <FaGrinBeam size={32} className="text-green-500" />, label: "Sangat Puas" },
    { id: 4, icon: <FaSmile size={32} className="text-yellow-500" />, label: "Puas" },
    { id: 3, icon: <FaMeh size={32} className="text-gray-500" />, label: "Biasa" },
    { id: 2, icon: <FaFrown size={32} className="text-orange-400" />, label: "Kurang" },
    { id: 1, icon: <FaAngry size={32} className="text-red-500" />, label: "Tidak Puas" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2">
          Selamat telah mengerjakan <br />
          {taskTitle}
        </h2>
        <p className="text-gray-600 mb-4">Kami ingin mendengar pendapatmu. Seberapa puas kamu dengan pengalaman materi ini?</p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center gap-3 mb-6 px-3">
            {options.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={`p-2 rounded-full border-2 ${selected === opt.id ? "border-blue-600 scale-110" : "border-transparent"} transition cursor-pointer`}
                aria-label={opt.label}
              >
                {opt.icon}
              </button>
            ))}
          </div>
          <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded-lg font-semibold text-lg hover:bg-blue-700 transition cursor-pointer">
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyPage;
