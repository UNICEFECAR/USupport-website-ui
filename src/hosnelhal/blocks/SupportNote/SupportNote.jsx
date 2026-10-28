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
 * @param {boolean} [showIcon=false] - heart before the title
 * @returns {JSX.Element}
 */
export const SupportNote = ({ idPrefix = "hosn-support", showIcon = false }) => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "support_note" });
  const paragraphs = t("body", { returnObjects: true });
  const titleId = `${idPrefix}-title`;

  return (
    <HHPanel className="hosn-support-note" aria-labelledby={titleId}>
      <h2 id={titleId}>
        {showIcon && (
          <svg
            className="hosn-support-note__icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M12 21s-7.5-4.6-9.6-9.4C1 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.6h2c.7-1.5 2.2-2.6 4.3-2.6 3.7 0 5.7 3.8 4.3 7.1C19.5 16.4 12 21 12 21z"
              fill="currentColor"
            />
          </svg>
        )}
        {t("title")}
      </h2>
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
