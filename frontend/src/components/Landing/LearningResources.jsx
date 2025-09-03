import React from "react";
import { Link } from "react-router-dom";

const resources = [
  {
    title: "LKM Fisiologi Tumbuhan",
    href: "https://docs.google.com/document/d/1q2yZup_EOE3_-C3DLUnQ6hNMK8CYreOq/edit?usp=drive_link&ouid=109908328452741407163&rtpof=true&sd=true",
  },
  {
    title: "RPS Fisiologi Tumbuhan",
    href: "https://docs.google.com/document/d/1auF4n8Czu2VJ7t0UHjL519jrFEByZp3k/edit?usp=drive_link&ouid=109908328452741407163&rtpof=true&sd=true",
  },
  {
    title: "SAP",
    href: "https://docs.google.com/document/d/1zCquUPoHt5ESvR4ihXiHZGpLD2Hz7LpC/edit?usp=drive_link&ouid=109908328452741407163&rtpof=true&sd=true",
  },
];

const LearningResources = () => {
  return (
    <section className="pt-12 bg-gray-50 text-center">
      <div className="max-w-3xl mb-4 mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Perangkat Pembelajaran</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {resources.map((res, index) => (
            <a key={index} href={res.href} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
              {res.title}
            </a>
          ))}
        </div>
      </div>

      <div className="bg-white pb-10">
        <div className="mt-12 mb-2 max-w-6xl mx-auto p-6 bg-white rounded-lg">
          <p className="text-lg font-bold text-gray-800 mb-4">Tim Pengembang</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg shadow-md bg-blue-50">
              <p className="text-md text-gray-600">Pengembang :</p>
              <p className="font-semibold text-blue-700">Luffi Karimah</p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-green-50">
              <p className="text-md text-gray-600">Dosen Pembimbing 1 :</p>
              <p className="font-semibold text-green-700">Dr. Balqis, S.Pd., M.Si.</p>
            </div>
            <div className="p-4 rounded-lg shadow-md bg-yellow-50">
              <p className="text-md text-gray-600">Dosen Pembimbing 2 :</p>
              <p className="font-semibold text-yellow-700">Prof. Dra. Herawati Susilo, M.Sc., Ph.D.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Link to="/login" className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-900 text-sm flex items-center gap-2">
            Mulai Belajar
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LearningResources;
