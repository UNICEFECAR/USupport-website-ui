import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import { PhModal } from "../../components/PhModal/PhModal";
import { PhPdfReader } from "../../components/PhPdfReader/PhPdfReader";
import { PH_LANGUAGES } from "../../config";
import { usePhTrackView } from "../../hooks/usePhTrackView";

/**
 * PhReaderModal
 *
 * Opens a booklet or activity-card PDF in the paged reader
 *
 * @param {object} resource - article resource from usePhResources, or null
 * @param {function} onClose
 * @returns {JSX.Element}
 */
export const PhReaderModal = ({ resource, onClose }) => {
  const { t, i18n } = useTranslation("playandheal", { keyPrefix: "reader" });
  const trackView = usePhTrackView();

  useEffect(() => {
    if (!resource?.id) return;
    cmsSvc.addArticleReadCount(resource.id).catch(() => {});
    trackView(resource);
  }, [resource?.id]);

  const language = PH_LANGUAGES.find((x) => x.value === i18n.language)?.name;

  return (
    <PhModal
      isOpen={!!resource}
      onClose={onClose}
      heading={resource?.title}
      description={t("modal_description")}
    >
      {resource && (
        <PhPdfReader
          pdfUrl={resource.pdfUrl}
          language={language}
        />
      )}
    </PhModal>
  );
};
