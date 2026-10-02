import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { PH_SHOW_WAITLIST } from "../../config";

import "./ph-faq.scss";

// Questions live under how_to.faq.questions.<key> in the locale files.
// Keyed entries (not an array) keep them compatible with POEditor.
const FAQ_KEYS = [
  "who_for",
  "where_to_start",
  "training",
  "lego",
  "phone",
  // Points to the waiting list, so it is shown only while that is enabled
  ...(PH_SHOW_WAITLIST ? ["network"] : []),
];

const EMAIL_PATTERN = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/;

// Answers can hold several paragraphs, separated by a blank line, and email
// addresses in them become mailto links
const renderAnswer = (answer) =>
  answer.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={index}>
      {paragraph.split(EMAIL_PATTERN).map((part, partIndex) =>
        partIndex % 2 === 1 ? (
          <a key={partIndex} href={`mailto:${part}`} dir="ltr">
            {part}
          </a>
        ) : (
          part
        )
      )}
    </p>
  ));

/**
 * PhFaq
 *
 * "Questions, answered." - accordion of frequently asked questions
 *
 * @returns {JSX.Element}
 */
export const PhFaq = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "how_to.faq" });
  const [openIndex, setOpenIndex] = useState(null);

  const items = FAQ_KEYS.map((key) => ({
    question: t(`questions.${key}.question`),
    answer: t(`questions.${key}.answer`),
  }));

  return (
    <section className="ph-faq" aria-labelledby="ph-faq-heading">
      <PhSectionIntro
        id="ph-faq-heading"
        eyebrow={t("eyebrow")}
        heading={t("heading")}
      />
      <div className="ph-faq__list">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const buttonId = `ph-faq-question-${index}`;
          const panelId = `ph-faq-answer-${index}`;

          return (
            <div key={item.question} className="ph-faq__item">
              <h3 className="ph-faq__question">
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{item.question}</span>
                  <PhIcon
                    name="chevron-down"
                    size={18}
                    classes="ph-faq__chevron"
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="ph-faq__answer"
                hidden={!isOpen}
              >
                {renderAnswer(item.answer)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
