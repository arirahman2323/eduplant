import React from "react";
import imageHero from "../../assets/images/students.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="bg-white">
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 max-w-6xl mx-auto gap-10">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Belajar Terstruktur <br /> Nilai Terukur
          </h1>
          <p className="text-gray-600 text-sm">
            EduPlant Metrics tidak hanya menjadi media pengumpulan tugas, tetapi juga sebagai alat refleksi, dokumentasi, dan visualisasi pertumbuhan belajar mahasiswa dalam memahami fisiologi tumbuhan secara mendalam, bermakna, dan
            menyenangkan.
          </p>
          <Link to="/login" className="px-5 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition cursor-pointer">
            Mulai Belajar
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <div className="w-[80%] overflow-hidden">
            <img src={imageHero} alt="Student" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
