import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { Loading } from "@USupport-components-library/src";

import "./pdf-viewer.scss";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * PDFViewer
 *
 * PDF viewer component with smooth infinite scroll loading
 *
 * @param {Object} props
 * @param {string} props.pdfUrl - URL of the PDF file
 * @returns {JSX.Element}
 */
export const PDFViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [visiblePages, setVisiblePages] = useState(8);
  const loaderRef = useRef(null);

  // Disable right-click (prevent save-as on images)
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Load additional pages when the sentinel (loaderRef) becomes visible
  useEffect(() => {
    if (!numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisiblePages((prev) => Math.min(prev + 5, numPages));
        }
      },
      {
        root: null, // observe viewport
        rootMargin: "400px", // prefetch ahead of time
        threshold: 0.1,
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [numPages]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const pageWidth =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth * 0.9, 900)
      : 900;

  return (
    <div className="pdf-viewer-container">
      <Document
        file={pdfUrl}
        loading={<Loading size="lg" />}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from({ length: visiblePages }, (_, index) => (
          <div
            key={index}
            className="pdf-page-wrapper"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <Page
              key={index}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              width={pageWidth}
            />
          </div>
        ))}

        {/* Sentinel element — triggers when user scrolls near bottom */}
        {visiblePages < (numPages ?? 0) && (
          <div
            ref={loaderRef}
            style={{
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loading size="sm" />
          </div>
        )}
      </Document>
    </div>
  );
};
