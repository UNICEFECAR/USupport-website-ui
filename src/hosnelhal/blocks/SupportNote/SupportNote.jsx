import React from "react";
import { useTranslation } from "react-i18next";

import { HHPanel } from "@USupport-components-library/src/hosnelhal";

import "./support-note.scss";

/**
 * SupportNote
 *
 * Full "When you need more support" copy used on About and the dedicated page
 *
 * @param {string} [idPrefix="hosn-support"] - prefix for heading ids
 * @returns {JSX.Element}
 */
export const SupportNote = ({ idPrefix = "hosn-support" }) => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "support_note" });
  const paragraphs = t("body", { returnObjects: true });
  const titleId = `${idPrefix}-title`;

  return (
    <HHPanel className="hosn-support-note" aria-labelledby={titleId}>
      <h2 id={titleId}>{t("title")}</h2>
      <div className="hosn-support-note__body">
        {(Array.isArray(paragraphs) ? paragraphs : [paragraphs]).map(
          (paragraph, index) => (
            <p key={index}>{paragraph}</p>
          )
        )}
      </div>
    </HHPanel>
  );
};
