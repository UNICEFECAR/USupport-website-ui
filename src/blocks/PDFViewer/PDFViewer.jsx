import React, { useState, useEffect } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { Loading } from "@USupport-components-library/src";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

import "./pdf-viewer.scss";

/**
 * PDFViewer
 *
 * PDF viewer component with smooth scrolling through all pages
 *
 * @param {Object} props
 * @param {string} props.pdfUrl - URL of the PDF file
 * @returns {JSX.Element}
 */
export const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [visiblePages, setVisiblePages] = useState(5);

  useEffect(() => {
    // disable right click
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    return () => {
      document.removeEventListener("contextmenu", (e) => {
        e.preventDefault();
      });
    };
  }, []);

  // Load pages in batches on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 800
      ) {
        setVisiblePages((prev) => Math.min(prev + 3, numPages));
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [numPages]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <React.Fragment>
      <Document
        loading={<Loading size="lg" />}
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from({ length: visiblePages }, (_, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Page
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading=""
              width={
                window.innerWidth * 0.9 > 900 ? 900 : window.innerWidth * 0.9
              }
              key={index}
              pageNumber={index + 1}
            />
          </div>
        ))}
      </Document>
    </React.Fragment>
  );
};
