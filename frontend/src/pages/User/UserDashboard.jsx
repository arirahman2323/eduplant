import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import InfoCard from "../../components/Cards/InfoCard";
import { addThousandsSeparator } from "../../utils/helper";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import heroImg from "../../assets/images/hero-img.png";
import logo from "../../assets/images/logo.png";

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const PriorityLevelData = [
      { priority: "High", count: taskPriorityLevels?.High || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">Selamat Datang! {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">{moment().format("dddd Do MMM YYYY")}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <img src={heroImg} alt="hero-img" className="w-full" />
        <div className="flex mt-4 gap-5">
          <img src={logo} alt="logo" className="h-20" />
          <div className="flex flex-col">
            <h4 className="text-2xl font-medium">Hubungan Tumbuhan dengan Air</h4>
            <p className="text-md text-gray-600">Topik ini membahas peran esensial air dalam menunjang kehidupan tumbuhan. Kajian ini mencakup aspek fisiologis yang menentukan keberlangsungan pertumbuhan dan perkembangannya.</p>
          </div>
        </div>
      </div>

      <div className="card my-5">
        <h2 className="text-2xl font-semibold mb-4">Apa yang akan Anda pelajari</h2>
        <p className="text-gray-700 mb-4">
          Topik Hubungan Tumbuhan dengan Air membahas peran esensial air dalam menunjang kehidupan tumbuhan. Kajian ini mencakup aspek fisiologis yang menentukan keberlangsungan pertumbuhan dan perkembangan tumbuhan. Materi utama yang
          difokuskan meliputi:
        </p>
        <ul className="list-disc pl-5 text-gray-800 mb-6 space-y-2">
          <li>Sel dan Air pada Tumbuhan</li>
          <li>Keseimbangan Air dalam Tubuh Tumbuhan</li>
          <li>Nutrisi dan Transport Nutrisi pada Tumbuhan</li>
        </ul>
        <p className="text-gray-700 mb-6">
          Penguasaan materi ini diharapkan mampu membekali mahasiswa dengan pemahaman mendalam mengenai fungsi air dalam proses fisiologis tumbuhan, sekaligus memperluas perspektif tentang keterkaitannya dengan upaya menjaga keberlanjutan
          ekosistem.
        </p>

        {/* Mengapa Materi Ini Penting? */}
        <h2 className="text-2xl font-semibold mb-4">🎯 Mengapa Materi Ini Penting?</h2>
        <p className="text-gray-700 mb-6">
          Air berperan sebagai faktor utama yang menentukan kelangsungan hidup tumbuhan. Pemahaman mengenai peran tersebut menjadi dasar untuk menjelaskan proses fisiologis pada tingkat sel maupun jaringan, sekaligus memberi ruang bagi
          mahasiswa untuk menumbuhkan keterampilan kreatif dalam menafsirkan mekanisme biologis secara mendalam. Kajian tentang transpirasi, keseimbangan air, dan transport nutrisi melatih mahasiswa untuk mengembangkan gagasan baru, mencari
          hubungan yang tidak biasa, serta merancang solusi inovatif terhadap tantangan lingkungan. Materi ini bukan hanya memperkaya pengetahuan fisiologi tumbuhan, tetapi juga membekali mahasiswa kemampuan kreatif dalam menghubungkan
          teori dengan konteks nyata yang relevan dengan keberlanjutan ekosistem.
        </p>

        {/* Model Pembelajaran */}
        <h2 className="text-2xl font-semibold mb-4">📘 Model Pembelajaran</h2>
        <p className="text-gray-700 mb-4">
          Problem-Based Learning (PBL) adalah model pembelajaran yang menggunakan masalah nyata sebagai awal proses belajar. Melalui masalah tersebut, mahasiswa belajar menemukan pengetahuan sendiri, berlatih berpikir tingkat tinggi, serta
          mengembangkan kreativitas dalam menemukan berbagai alternatif solusi.
        </p>
        <p className="font-semibold text-gray-800 mb-2">Tahapan PBL:</p>
        <ul className="list-decimal pl-5 text-gray-700 space-y-2 mb-6">
          <li>
            <strong>Orient Students to the Problem:</strong> Mahasiswa mencari dan merumuskan permasalahan yang berkaitan dengan hubungan tumbuhan dan air, sebagai pemicu lahirnya ide kreatif.
          </li>
          <li>
            <strong>Organize Students for Study:</strong> Mahasiswa mempelajari materi yang relevan untuk memperkaya wawasan dan membuka peluang munculnya beragam gagasan.
          </li>
          <li>
            <strong>Assist Independent and Group Investigation:</strong> Mahasiswa melakukan praktikum, observasi, dan kajian literatur untuk menghasilkan temuan yang dapat dikembangkan secara kreatif.
          </li>
          <li>
            <strong>Develop and Present Artifacts and Exhibits:</strong> Mahasiswa menyusun rancangan solusi dan mengomunikasikannya secara kreatif.
          </li>
          <li>
            <strong>Analyze and Evaluate the Problem-Solving Process:</strong> Mahasiswa menganalisis proses pembelajaran, mengevaluasi solusi yang dihasilkan, serta merefleksikan potensi gagasan baru untuk perbaikan di masa depan.
          </li>
        </ul>
        <p className="text-gray-700 mb-6">
          Model PBL memberi ruang bagi mahasiswa untuk mengasah keterampilan kreatif, mulai dari merancang pertanyaan, mengeksplorasi ide, hingga menghasilkan solusi inovatif yang relevan dengan konteks fisiologi tumbuhan.
        </p>

        {/* Pendekatan Pembelajaran */}
        <h2 className="text-2xl font-semibold mb-4">📘 Pendekatan Pembelajaran</h2>
        <p className="text-gray-700 mb-4">Pembelajaran menggunakan pendekatan Deep Learning yang berfokus pada pengalaman belajar yang menyenangkan, sadar, dan bermakna. Tiga aspek deep learning adalah:</p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
          <li>
            <strong>Joyful Learning:</strong> Mengukur tingkat kesenangan mahasiswa melalui respons emoticon dan visualisasi streak pertumbuhan tanaman.
          </li>
          <li>
            <strong>Mindful Learning:</strong> Menganalisis kesadaran belajar melalui kualitas, ketelitian, dan konsistensi tugas yang dikumpulkan.
          </li>
          <li>
            <strong>Meaningful Learning:</strong> Mengukur sejauh mana mahasiswa mampu mengaitkan konsep dengan konteks nyata dan merefleksikan proses belajarnya.
          </li>
        </ul>

        {/* Evaluasi Pembelajaran */}
        <h2 className="text-2xl font-semibold mb-4">🧠 Evaluasi Pembelajaran</h2>
        <p className="text-gray-700 mb-4">Proses pembelajaran akan dinilai melalui beberapa instrumen, yaitu:</p>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-6">
          <li>
            <strong>Angket Learning Ownership & Keterampilan Berpikir Kreatif:</strong> digunakan untuk mengukur tingkat kemandirian belajar serta kemampuan berpikir kreatif mahasiswa.
          </li>
          <li>
            <strong>Esai Deskriptif & Reflektif:</strong> berfungsi untuk menilai pemahaman konsep serta kemampuan merefleksikan pengalaman belajar.
          </li>
          <li>
            <strong>E-Portfolio:</strong> menjadi bukti nyata hasil karya mahasiswa yang memuat solusi, ide, dan perkembangan pembelajaran.
          </li>
        </ul>
        <p className="text-gray-700">Penilaian tidak hanya menekankan pada penguasaan materi, tetapi juga pada kemampuan mahasiswa dalam mengembangkan ide, melakukan refleksi, serta menghasilkan karya yang kreatif.</p>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
