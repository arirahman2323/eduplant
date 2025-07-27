import React from "react";
import { LuBookMarked } from "react-icons/lu";
import { PiExam } from "react-icons/pi";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { AiOutlineFolderOpen } from "react-icons/ai";

const features = [
  {
    title: "Modul Pembelajaran",
    icon: <LuBookMarked className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Soal Latihan",
    icon: <PiExam className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Studi Kasus",
    icon: <RiQuestionAnswerLine className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "Grup Chat",
    icon: <HiOutlineChatBubbleLeftRight className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "E-Portofolio",
    icon: <AiOutlineFolderOpen className="w-8 h-8 text-blue-500" />,
  },
];

const Features = () => {
  return (
    <section id="fitur" className="py-24 px-6 bg-white text-center">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-8">Fasilitas Pembelajaran yang Tersedia</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 justify-items-center">
          {features.map((item, index) => (
            <div key={index} className="border border-blue-100 rounded-lg p-6 w-full flex flex-col items-center shadow-sm hover:shadow-md transition">
              <div className="mb-3 rounded-full bg-blue-50 p-5">{item.icon}</div>
              <p className="text-sm font-medium text-gray-700">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
