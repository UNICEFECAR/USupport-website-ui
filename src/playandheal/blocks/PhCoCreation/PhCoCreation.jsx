import React from "react";
import { useTranslation } from "react-i18next";

import "./ph-co-creation.scss";

// Copy lives under about.co_creation.<section> in the locale files.
// Keyed paragraphs (not arrays) keep them compatible with POEditor.
// A paragraph with names has its list of people and organizations under
// <paragraph>_names, kept in English and shown in an isolated <bdi> so it
// reads correctly inside Arabic text.
const SECTIONS = [
  {
    key: "built",
    paragraphs: ["paragraph_1", "paragraph_2", "paragraph_3", "paragraph_4"],
  },
  {
    key: "communities",
    paragraphs: [
      "paragraph_1",
      "paragraph_2",
      { key: "paragraph_3", hasNames: true },
      "paragraph_4",
    ],
  },
  {
    key: "team",
    paragraphs: [{ key: "paragraph_1", hasNames: true }],
    subsection: { heading: "contributors_heading", names: "contributors" },
  },
];

/**
 * PhCoCreation
 *
 * "Built together, through play" - how Play and Heal was co-created and
 * the people who contributed to it. Used on the About us page.
 *
 * @returns {JSX.Element}
 */
export const PhCoCreation = () => {
  const { t } = useTranslation("playandheal", {
    keyPrefix: "about.co_creation",
  });

  return (
    <div className="ph-co-creation">
      {SECTIONS.map(({ key, paragraphs, subsection }) => (
        <section
          key={key}
          className="ph-co-creation__section"
          aria-labelledby={`ph-co-creation-${key}`}
        >
          <h2 className="ph-co-creation__heading" id={`ph-co-creation-${key}`}>
            {t(`${key}.heading`)}
          </h2>
          {paragraphs.map((paragraph) => {
            const { key: paragraphKey, hasNames } =
              typeof paragraph === "string" ? { key: paragraph } : paragraph;

            return (
              <p key={paragraphKey} className="ph-co-creation__text">
                {t(`${key}.${paragraphKey}`)}
                {hasNames && (
                  <>
                    {" "}
                    <bdi>{t(`${key}.${paragraphKey}_names`)}</bdi>
                  </>
                )}
              </p>
            );
          })}
          {subsection && (
            <>
              <h3 className="ph-co-creation__subheading">
                {t(`${key}.${subsection.heading}`)}
              </h3>
              <p className="ph-co-creation__text">
                <bdi>{t(`${key}.${subsection.names}`)}</bdi>
              </p>
            </>
          )}
        </section>
      ))}
    </div>
  );
};
