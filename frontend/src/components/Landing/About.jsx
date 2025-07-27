import React from "react";
import imageAbout from "../../assets/images/teacher.png";

function About() {
  return (
    <section id="tentang" className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="h-full overflow-hidden">
            <img src={imageAbout} alt="Tentang Kami" className="w-[70%] mx-auto md:mx-0 md:w-full md:h-full object-cover" />
          </div>
        </div>

        {/* Text */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Tentang Kami</h2>
          <p className="text-sm text-gray-600">
            EduPlant Metrics adalah media e-portfolio inovatif yang dirancang untuk mendukung proses pembelajaran Fisiologi Tumbuhan secara terstruktur, terukur, dan berorientasi pada pengembangan keterampilan abad ke-21.
          </p>
          <p className="text-sm text-gray-600">
            Platform ini memfasilitasi keterlibatan aktif mahasiswa dalam pembelajaran berbasis masalah (Problem-Based Learning), dengan integrasi pendekatan Deep Learning yang mencakup aspek joyful, mindful, dan meaningful learning.
            E-portfolio ini difokuskan pada materi “Hubungan Air dan Tumbuhan”, yang mencakup topik air dan sel, transpirasi, nutrisi, dan transport pada tumbuhan.
          </p>
          <a href="#fitur" className="mt-4 px-5 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-900 transition cursor-pointer">
            Kenali Fitur Kami →
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
