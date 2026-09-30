import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import { PhModal } from "../../components/PhModal/PhModal";
import { PhPdfReader } from "../../components/PhPdfReader/PhPdfReader";
import { PH_LANGUAGES } from "../../config";

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

  useEffect(() => {
    if (resource?.id) cmsSvc.addArticleReadCount(resource.id).catch(() => {});
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
          onDownload={() =>
            cmsSvc.addArticleDownloadCount(resource.id).catch(() => {})
          }
        />
      )}
    </PhModal>
  );
};
