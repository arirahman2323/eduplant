import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { FaQuoteLeft } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import "swiper/css";
import { Link } from "react-router-dom";

const testimonialData = [
  {
    quote: "Byway’s tech courses are top-notch! As someone who's always looking to stay ahead in the rapidly evolving tech world, I appreciate the up-to-date content and engaging multimedia.",
    name: "M. Rafli",
    role: "Siswa",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "Materi yang diberikan sangat relevan dengan kebutuhan industri saat ini. Saya jadi lebih percaya diri untuk menghadapi dunia kerja.",
    name: "A. Putri",
    role: "Mahasiswa",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "Fitur diskusi dan studi kasus membuat pembelajaran terasa lebih hidup. Saya bisa belajar dari pengalaman teman-teman juga.",
    name: "R. Dwi",
    role: "Siswa",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    quote: "E-portofolio sangat membantu saya menyimpan hasil belajar dan menunjukkan progress saya ke dosen maupun recruiter.",
    name: "L. Sari",
    role: "Pelajar",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    quote: "Sangat recommended untuk yang ingin upgrade skill digital. Pembelajaran interaktif dan tidak membosankan.",
    name: "T. Budi",
    role: "Fresh Graduate",
    image: "https://randomuser.me/api/portraits/men/23.jpg",
  },
];

const Testimonials = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading dan Navigasi */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-semibold text-gray-800">Testimoni</h2>
          <div className="flex gap-2">
            <button ref={prevRef} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
              <HiChevronLeft className="text-xl" />
            </button>
            <button ref={nextRef} className="p-2 rounded-md border border-gray-300 hover:bg-gray-100">
              <HiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          loop
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          onInit={(swiper) => {
            // Hubungkan tombol kustom ke navigation swiper
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {testimonialData.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 min-h-[250px] flex flex-col justify-between h-full">
                <div>
                  <FaQuoteLeft className="text-blue-500 text-2xl mb-4" />
                  <p className="text-sm text-gray-700 mb-6">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
