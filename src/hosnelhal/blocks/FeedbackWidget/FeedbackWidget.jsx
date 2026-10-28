import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { HHButton } from "@USupport-components-library/src/hosnelhal";

import { HOSN_FEEDBACK } from "../../config";

import "./feedback-widget.scss";

const CARD_ID = "hosn-feedback-card";

const ThumbIcon = ({ down }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    aria-hidden="true"
    focusable="false"
    style={down ? { transform: "rotate(180deg)" } : undefined}
  >
    <path
      d="M7 10v10H4V10zm2 10h7.6a2 2 0 0 0 2-1.6l1.3-6.5A2 2 0 0 0 18 9.5h-4.6l.8-3.7a1.6 1.6 0 0 0-2.9-1.2L9 9.3z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Adds the language and the answer to the survey link
 *
 * @param {string} url
 * @param {string} language
 * @param {string} vote - "up" | "down"
 * @returns {string}
 */
const toSurveyUrl = (url, language, vote) => {
  const survey = new URL(url);
  survey.searchParams.set("lang", language);
  survey.searchParams.set("vote", vote);
  return survey.toString();
};

/**
 * FeedbackWidget
 *
 * Small feedback card: "Would you recommend the resources?" with a thumbs up or
 * down, then an invitation to UNICEF's survey. It can be opened from the
 * sticky tab in the corner (`showTab`) or from elsewhere, e.g. the footer.
 *
 * @param {boolean} isOpen
 * @param {function} onOpen
 * @param {function} onClose
 * @param {boolean} [showTab=true] - the sticky tab in the corner
 * @returns {JSX.Element}
 */
export const FeedbackWidget = ({ isOpen, onOpen, onClose, showTab = true }) => {
  const { language } = useParams();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "feedback" });
  const [vote, setVote] = useState(null);
  const cardRef = useRef(null);

  const surveyUrl = HOSN_FEEDBACK.surveyUrls[language];

  // Start again each time the card opens, and focus the thumbs up
  useEffect(() => {
    if (!isOpen) return;
    setVote(null);
    cardRef.current?.querySelector(".hosn-feedback__vote")?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <div className="hosn-feedback">
      {isOpen && (
        <div
          className="hosn-feedback__card"
          id={CARD_ID}
          ref={cardRef}
          role="dialog"
          aria-labelledby="hosn-feedback-question"
        >
          <button
            type="button"
            className="hosn-feedback__close"
            aria-label={t("close")}
            onClick={onClose}
          >
            ×
          </button>

          {!vote ? (
            <>
              <p
                className="hosn-feedback__question"
                id="hosn-feedback-question"
              >
                {t("question")}
              </p>
              <div className="hosn-feedback__votes">
                <button
                  type="button"
                  className="hosn-feedback__vote hosn-feedback__vote--up"
                  aria-label={t("yes")}
                  onClick={() => setVote("up")}
                >
                  <ThumbIcon />
                </button>
                <button
                  type="button"
                  className="hosn-feedback__vote hosn-feedback__vote--down"
                  aria-label={t("no")}
                  onClick={() => setVote("down")}
                >
                  <ThumbIcon down />
                </button>
              </div>
            </>
          ) : surveyUrl ? (
            <>
              <p
                className="hosn-feedback__question"
                id="hosn-feedback-question"
              >
                {t("invite")}
              </p>
              <div className="hosn-feedback__actions">
                <HHButton
                  href={toSurveyUrl(surveyUrl, language, vote)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hosn-feedback__cta"
                >
                  {t("cta")}
                </HHButton>
                <HHButton variant="text" onClick={onClose}>
                  {t("later")}
                </HHButton>
              </div>
            </>
          ) : (
            // No survey link yet: just thank them
            <p
              className="hosn-feedback__question hosn-feedback__thanks"
              id="hosn-feedback-question"
            >
              {t("thanks")}
            </p>
          )}
        </div>
      )}

      {showTab && (
        <button
          type="button"
          className="hosn-feedback__tab"
          aria-expanded={isOpen}
          aria-controls={CARD_ID}
          onClick={isOpen ? onClose : onOpen}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          {t("tab")}
        </button>
      )}
    </div>
  );
};
