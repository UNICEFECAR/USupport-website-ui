import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, pdfjs } from "react-pdf";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import { PhIcon } from "../PhIcon/PhIcon";
import {
  PhFlipbook,
  getNextPage,
  getPreviousPage,
  getView,
} from "./PhFlipbook";

import "./ph-pdf-reader.scss";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;

// Two-page spreads need at least this much room, otherwise show single pages
const MIN_SPREAD_WIDTH = 640;
const SPREAD_TURN_MS = 700;
const SINGLE_TURN_MS = 450;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * PhPdfReader
 *
 * Issuu-style PDF reader. Portrait documents open as a book with two-page
 * spreads and a page-turn animation; landscape documents and small screens
 * show one page at a time. Includes zoom, download and fullscreen.
 *
 * @param {string} pdfUrl - url of the PDF
 * @param {string} language - language label shown in the meta line
 * @param {function} onDownload - called when the user downloads the PDF
 * @param {boolean} showMeta - show the "Original PDF · n pages" line
 * @returns {JSX.Element}
 */
export const PhPdfReader = ({
  pdfUrl,
  language,
  onDownload,
  showMeta = true,
}) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "reader" });
  const readerRef = useRef(null);
  const viewportRef = useRef(null);
  const turnTimeoutRef = useRef(null);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [turning, setTurning] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  // Reset when a different document is opened
  useEffect(() => {
    clearTimeout(turnTimeoutRef.current);
    setNumPages(0);
    setPage(1);
    setTurning(null);
    setZoom(1);
    setAspectRatio(null);
    setHasError(false);
  }, [pdfUrl]);

  useEffect(() => () => clearTimeout(turnTimeoutRef.current), []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    // Arabic documents are bound on the right, so the book reads right-to-left
    setIsRtl(!!viewport.closest("[dir='rtl']"));

    const observer = new ResizeObserver(([entry]) => {
      setViewportWidth(entry.contentRect.width);
    });
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleChange = () =>
      setIsFullscreen(document.fullscreenElement === readerRef.current);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const isLandscape = aspectRatio !== null && aspectRatio >= 1;
  const isSpread =
    aspectRatio !== null && !isLandscape && viewportWidth >= MIN_SPREAD_WIDTH;

  // Size a single page so the whole book fits the reader
  const getBasePageWidth = () => {
    if (!viewportWidth) return 0;
    if (!aspectRatio) return Math.min(viewportWidth, 480);
    if (isLandscape) return viewportWidth;

    const maxHeight = isFullscreen
      ? window.innerHeight - 160
      : Math.min(720, window.innerHeight * 0.75);
    const availableWidth = isSpread ? viewportWidth / 2 : viewportWidth;
    return Math.min(availableWidth, maxHeight * aspectRatio);
  };

  const pageWidth = Math.floor(getBasePageWidth() * zoom);
  const pageHeight = aspectRatio ? Math.floor(pageWidth / aspectRatio) : 0;

  const nextPage = numPages ? getNextPage(page, numPages, isSpread) : null;
  const previousPage = numPages
    ? getPreviousPage(page, numPages, isSpread)
    : null;

  const turn = useCallback(
    (direction) => {
      if (turning || !numPages) return;

      const target = direction === "next" ? nextPage : previousPage;
      if (!target) return;

      if (prefersReducedMotion()) {
        setPage(target);
        return;
      }

      setTurning({
        direction: direction === "next" ? "next" : "previous",
        from: getView(page, numPages, isSpread),
        to: getView(target, numPages, isSpread),
      });

      turnTimeoutRef.current = setTimeout(
        () => {
          setPage(target);
          setTurning(null);
        },
        isSpread ? SPREAD_TURN_MS : SINGLE_TURN_MS
      );
    },
    [turning, numPages, nextPage, previousPage, page, isSpread]
  );

  const handleKeyDown = (e) => {
    const forward = isRtl ? "ArrowLeft" : "ArrowRight";
    const backward = isRtl ? "ArrowRight" : "ArrowLeft";

    if (e.key === forward) {
      e.preventDefault();
      turn("next");
    }
    if (e.key === backward) {
      e.preventDefault();
      turn("previous");
    }
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      readerRef.current?.requestFullscreen?.();
    }
  };

  const getPositionLabel = () => {
    if (!numPages) return " ";

    const view = getView(page, numPages, isSpread);
    if (view.left && view.right) {
      return t("pages_range", {
        from: view.left,
        to: view.right,
        total: numPages,
      });
    }

    return t("position", {
      unit: isLandscape ? t("spread") : t("page"),
      current: view.left || view.right,
      total: numPages,
    });
  };

  return (
    <div className="ph-pdf-reader" ref={readerRef}>
      <div
        className="ph-pdf-reader__viewport"
        ref={viewportRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={t("viewport_label")}
      >
        {hasError ? (
          <p className="ph-pdf-reader__status">{t("error")}</p>
        ) : (
          <Document
            file={pdfUrl}
            loading={<p className="ph-pdf-reader__status">{t("loading")}</p>}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setHasError(true)}
          >
            {pageWidth > 0 && numPages > 0 && (
              <PhFlipbook
                page={page}
                numPages={numPages}
                isSpread={isSpread}
                isRtl={isRtl}
                turning={turning}
                pageWidth={pageWidth}
                pageHeight={pageHeight || Math.round(pageWidth * 1.414)}
                turnDuration={isSpread ? SPREAD_TURN_MS : SINGLE_TURN_MS}
                canTurn={zoom <= 1}
                onTurn={turn}
                onFirstPageLoad={(firstPage) => {
                  if (!aspectRatio) {
                    setAspectRatio(
                      firstPage.originalWidth / firstPage.originalHeight
                    );
                  }
                }}
              />
            )}
          </Document>
        )}
      </div>

      <div className="ph-pdf-reader__toolbar">
        <div className="ph-pdf-reader__pagination">
          <button
            type="button"
            className="ph-pdf-reader__button"
            onClick={() => turn("previous")}
            disabled={!previousPage || !!turning}
            aria-label={t("previous")}
          >
            <PhIcon name="arrow-back" size={20} />
          </button>
          <p className="ph-pdf-reader__position" aria-live="polite">
            {getPositionLabel()}
          </p>
          <button
            type="button"
            className="ph-pdf-reader__button"
            onClick={() => turn("next")}
            disabled={!nextPage || !!turning}
            aria-label={t("next")}
          >
            <PhIcon name="arrow" size={20} />
          </button>
        </div>

        <div className="ph-pdf-reader__tools">
          <button
            type="button"
            className="ph-pdf-reader__button"
            onClick={() => setZoom((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP))}
            disabled={zoom <= MIN_ZOOM}
            aria-label={t("zoom_out")}
          >
            <PhIcon name="minus" size={20} />
          </button>
          <p className="ph-pdf-reader__zoom" aria-live="polite">
            {Math.round(zoom * 100)}%
          </p>
          <button
            type="button"
            className="ph-pdf-reader__button"
            onClick={() => setZoom((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP))}
            disabled={zoom >= MAX_ZOOM}
            aria-label={t("zoom_in")}
          >
            <PhIcon name="plus" size={20} />
          </button>
          <a
            className="ph-pdf-reader__button"
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            download
            onClick={onDownload}
            aria-label={t("download")}
          >
            <PhIcon name="download" size={20} />
          </a>
          <button
            type="button"
            className="ph-pdf-reader__button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? t("exit_fullscreen") : t("fullscreen")}
          >
            <PhIcon name={isFullscreen ? "close" : "fullscreen"} size={20} />
          </button>
        </div>
      </div>

      {showMeta && numPages > 0 && (
        <p className="ph-pdf-reader__meta">
          {t(isLandscape ? "meta_spreads" : "meta_pages", {
            count: numPages,
            language,
          })}
        </p>
      )}

      <a
        className="ph-pdf-reader__download-link"
        href={pdfUrl}
        target="_blank"
        rel="noreferrer"
        download
        onClick={onDownload}
      >
        <span>{t("download_original")}</span>
        <PhIcon name="download" size={20} />
      </a>
    </div>
  );
};
