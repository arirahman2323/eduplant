// src/components/PdfViewer.jsx

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Import CSS untuk lapisan teks dan anotasi agar PDF bisa diseleksi & link berfungsi
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

// Konfigurasi worker untuk merender PDF
// Kita gunakan CDN agar mudah, tidak perlu setup file lokal
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="border border-gray-300 my-4">
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {/* Loop untuk menampilkan semua halaman PDF */}
        {Array.from(new Array(numPages || 0), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={true} // Pastikan teks bisa di-copy
            renderAnnotationLayer={true} // Pastikan link bisa diklik
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;
