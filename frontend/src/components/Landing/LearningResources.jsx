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
    <section className="py-16 px-6 bg-gray-50 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Perangkat Pembelajaran</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {resources.map((res, index) => (
            <a key={index} href={res.href} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
              {res.title}
            </a>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <Link to="/login" className="bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-900 text-sm flex items-center gap-2">
          Mulai Belajar
          <span>→</span>
        </Link>
      </div>
    </section>
  );
};

export default LearningResources;
