import React from "react";

const steps = [
  {
    number: "1",
    title: "Login ke Sistem",
    description: "Akses tautan EduPlant Metrics, masuk dengan NIM dan kata sandi Anda, lalu pastikan informasi profil sudah benar.",
  },
  {
    number: "2",
    title: "Akses Perangkat Pembelajaran",
    description: "Unduh Rencana Pembelajaran Semester (RPS) dan Satuan Acara Perkuliahan (SAP) dari menu Perangkat Pembelajaran sebagai panduan.",
  },
  {
    number: "3",
    title: "Navigasi ke Course Room",
    description: "Ikuti seluruh rangkaian pembelajaran di Course Room secara berurutan, mulai dari pretest, tahapan PBL, materi, posttest, hingga refleksi dan angket.",
  },
  {
    number: "4",
    title: "Unggah dan Lihat Penilaian Tugas",
    description: "Unggah file tugas Anda sesuai instruksi dan tenggat waktu, kemudian lihat rincian capaian pembelajaran berbasis rubrik setelah dinilai.",
  },
  {
    number: "5",
    title: "Unduh E-Portfolio",
    description: "Anda dapat mengunduh seluruh rekam jejak tugas dan penilaian dalam format PDF melalui menu Unduhan.",
  },
  {
    number: "6",
    title: "Gunakan Forum Diskusi",
    description: "Manfaatkan Forum Diskusi untuk bertanya, menanggapi, dan merefleksikan ide secara kolaboratif dengan rekan satu kelompok.",
  },
  {
    number: "7",
    title: "Pantau Emosi Belajar (Joyful Learning)",
    description: "Berikan respons emoticon setelah setiap sesi untuk mencerminkan pengalaman belajar Anda dan tumbuhkan tanaman virtual dengan menyelesaikan tugas secara rutin.",
  },
  {
    number: "8",
    title: "Konsistensi dan Kualitas (Mindful & Meaningful Learning)",
    description: "Pastikan setiap tugas yang dikirimkan menunjukkan pemikiran kritis dan keterkaitan antara materi dengan konteks nyata.",
  },
];

const HowTo = () => {
  return (
    <section id="petunjuk" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-16">Petunjuk Penggunaan</h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center lg:items-start gap-6`}>
              {/* Step content */}
              <div className="bg-white flex rounded-xl gap-4 shadow-md p-6 w-full max-w-3xl">
                <div className="w-40 h-10 md:w-28 md:h-16 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center text-xl">{step.number}</div>
                <div>
                  <h4 className="text-blue-600 font-semibold text-base">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowTo;
