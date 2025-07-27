import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import { GiBackwardTime } from "react-icons/gi";
import axiosInstance from "../../../utils/axiosInstance";
import { API_PATHS } from "../../../utils/apiPaths";
import DashboardLayout from "../../../components/layouts/DashboardLayout";

const GlosariumPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [materi, setMateri] = useState(null);

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.GET_MATERIALS_BY_TYPE("glosarium"));
        setMateri(res.data[0]);
      } catch (err) {
        console.error("Gagal mengambil materi", err);
      }
    };

    fetchMateri();
  }, [id]);

  if (!materi) return <div className="text-center mt-10">Memuat...</div>;

  return (
    <DashboardLayout activeMenu="Courses">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Kiri - Konten Materi */}
        <div className="flex-1">
          <button onClick={() => navigate(-1)} className="flex items-center mb-4 text-blue-600 hover:underline cursor-pointer">
            <HiChevronLeft className="mr-1" /> Kembali
          </button>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold">{materi.term}</h2>
            <p className="text-gray-600">{materi.description}</p>
            <div className="mt-11 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <p className="my-4 text-black text-sm whitespace-pre-line">{materi.content}</p>
            {materi.files && materi.files.length > 0 ? (
              materi.files.map((fileUrl, index) => {
                const isPDF = fileUrl.endsWith(".pdf");
                return isPDF ? (
                  <iframe key={index} src={encodeURI(fileUrl)} width="100%" height="600px" className="mb-4 border rounded" title={`PDF-${index}`} />
                ) : (
                  <img key={index} src={fileUrl} alt={`Lampiran-${index}`} className="mb-4 mt-4 rounded border" />
                );
              })
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada lampiran tersedia</p>
            )}
            <button onClick={() => navigate("/survey", { state: { taskTitle: "glosarium", taskId: materi._id } })} className="bg-blue-600 w-full cursor-pointer text-white px-6 py-2 rounded-md mt-6 hover:bg-blue-700">
              Selesai
            </button>
          </div>
        </div>

        {/* Kanan - Info Materi */}
        <div className="w-full mt-10 md:w-72 space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Deadline Materi</h4>
            <p className="text-sm flex gap-1 text-gray-400 font-medium">
              <GiBackwardTime className="text-xl" /> -
              {/* {new Date(materi.dueDate).toLocaleString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })} */}
            </p>
            <p className="text-sm mt-8 text-gray-400 font-medium">Status: {materi.status}</p>
          </div>

          <div className="bg-white mt-6 p-4 rounded-lg shadow">
            <h4 className="font-semibold mb-2">Kategori</h4>
            <ul className="list-disc mt-3 list-inside text-sm text-gray-700 space-y-1">
              <li>Glosarium</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GlosariumPage;
