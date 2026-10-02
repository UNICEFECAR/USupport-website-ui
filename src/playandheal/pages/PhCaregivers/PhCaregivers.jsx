import React from "react";
import { useTranslation } from "react-i18next";

import { PhBackLink } from "../../components/PhBackLink/PhBackLink";
import { PhButton } from "../../components/PhButton/PhButton";
import { PhResourceCard } from "../../components/PhResourceCard/PhResourceCard";
import { usePhPath } from "../../hooks/usePhPath";
import { usePhResources } from "../../hooks/usePhResources";
import { useResourceViewer } from "../../hooks/useResourceViewer";

import heroArtwork from "../../assets/hero-artwork.jpg";
import safetyImage from "../../assets/character-safety.png";
import connectionImage from "../../assets/character-connection.png";
import expressionImage from "../../assets/character-expression.png";
import masteryImage from "../../assets/character-mastery.png";
import selfImage from "../../assets/character-self.png";

import "./ph-caregivers.scss";

const INVITATIONS = ["start_small", "follow_lead", "be_present"];

const CHARACTERISTICS = [
  { key: "safety", image: safetyImage },
  { key: "connection", image: connectionImage },
  { key: "expression", image: expressionImage },
  { key: "mastery", image: masteryImage },
  { key: "self", image: selfImage },
];

const QUESTIONS = ["question_1", "question_2", "question_3"];

/**
 * Numbered section heading used throughout the caregivers page
 */
const SectionHeading = ({ id, eyebrow, heading, text }) => (
  <div className="ph-caregivers__heading">
    <p className="ph-caregivers__eyebrow">{eyebrow}</p>
    <h2 className="ph-caregivers__title" id={id}>
      {heading}
    </h2>
    {text && <p className="ph-caregivers__text">{text}</p>}
  </div>
);

/**
 * PhCaregivers
 *
 * "Keep play going at home." - guidance for caregivers to continue playful
 * learning at home
 *
 * @returns {JSX.Element}
 */
export const PhCaregivers = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "caregivers" });
  const { t: tCommon } = useTranslation("playandheal", { keyPrefix: "common" });
  const { t: tCharacters } = useTranslation("playandheal", {
    keyPrefix: "characters",
  });
  const toPath = usePhPath();
  const { videos, isLoading } = usePhResources();
  const { openResource, viewer } = useResourceViewer();

  return (
    <div className="ph__container ph__stack ph-caregivers">
      <div className="ph-page-top">
        <PhBackLink to={`${toPath("")}#ph-toolkit`}>
          {tCommon("back_to_toolkit")}
        </PhBackLink>

        <header className="ph-caregivers__welcome">
          <div className="ph-caregivers__welcome-copy">
            <p className="ph-caregivers__eyebrow">{t("welcome.eyebrow")}</p>
            <h1 className="ph-caregivers__welcome-title">
              {t("welcome.heading")}
            </h1>
            <p className="ph-caregivers__text">{t("welcome.text")}</p>
            <PhButton tone="dark" href="#ph-caregivers-play">
              {t("welcome.cta")}
            </PhButton>
          </div>
          <img
            className="ph-caregivers__welcome-artwork"
            src={heroArtwork}
            alt={tCommon("artwork_alt")}
            width="850"
            height="570"
          />
        </header>
      </div>

      {/* 01 · Make time for play */}
      <section
        className="ph-caregivers__section"
        id="ph-caregivers-play"
        aria-labelledby="ph-caregivers-play-heading"
      >
        <SectionHeading
          id="ph-caregivers-play-heading"
          eyebrow={t("play.eyebrow")}
          heading={t("play.heading")}
          text={t("play.text")}
        />
        <ul className="ph-caregivers__grid ph-caregivers__grid--three">
          {INVITATIONS.map((item) => (
            <li key={item} className="ph-caregivers__invitation">
              <h3 className="ph-caregivers__card-title">
                {t(`play.${item}_title`)}
              </h3>
              <p className="ph-caregivers__text">{t(`play.${item}_text`)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 02 · In a Play and Heal session */}
      <section
        className="ph-caregivers__section"
        aria-labelledby="ph-caregivers-learn-heading"
      >
        <SectionHeading
          id="ph-caregivers-learn-heading"
          eyebrow={t("learn.eyebrow")}
          heading={t("learn.heading")}
          text={t("learn.text")}
        />
        <ul className="ph-caregivers__grid ph-caregivers__grid--five">
          {CHARACTERISTICS.map(({ key, image }) => (
            <li key={key} className="ph-caregivers__characteristic">
              <img src={image} alt="" loading="lazy" />
              <h3 className="ph-caregivers__card-title">
                {tCharacters(`${key}.name`)}
              </h3>
              <p className="ph-caregivers__text">{t(`learn.${key}`)}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 · After the session */}
      <section
        className="ph-caregivers__panel ph-caregivers__panel--lavender"
        aria-labelledby="ph-caregivers-questions-heading"
      >
        <SectionHeading
          id="ph-caregivers-questions-heading"
          eyebrow={t("questions.eyebrow")}
          heading={t("questions.heading")}
          text={t("questions.text")}
        />
        <ol className="ph-caregivers__grid ph-caregivers__grid--three">
          {QUESTIONS.map((question, index) => (
            <li key={question} className="ph-caregivers__question">
              <p className="ph-caregivers__eyebrow">
                {t("questions.label", { number: index + 1 })}
              </p>
              <p className="ph-caregivers__card-title">
                {t(`questions.${question}`)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* 04 · Watch and try */}
      <section
        className="ph-caregivers__section"
        aria-labelledby="ph-caregivers-videos-heading"
      >
        <SectionHeading
          id="ph-caregivers-videos-heading"
          eyebrow={t("videos.eyebrow")}
          heading={t("videos.heading")}
          text={t("videos.text")}
        />
        {isLoading ? (
          <p className="ph-caregivers__status" role="status">
            {t("videos.loading")}
          </p>
        ) : (
          <ul className="ph-caregivers__grid ph-caregivers__grid--videos">
            {videos.map((video) => (
              <li key={video.id}>
                <PhResourceCard resource={video} onOpen={openResource} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 05 · Games across generations */}
      <section
        className="ph-caregivers__panel ph-caregivers__panel--sand"
        aria-labelledby="ph-caregivers-games-heading"
      >
        <SectionHeading
          id="ph-caregivers-games-heading"
          eyebrow={t("games.eyebrow")}
          heading={t("games.heading")}
          text={t("games.text")}
        />
        <p className="ph-caregivers__text">{t("games.text_2")}</p>
        <div className="ph-caregivers__actions">
          <PhButton tone="dark" to={toPath("/toolkit/activity-cards")}>
            {t("games.explore_cards")}
          </PhButton>
          <PhButton tone="outline" to={`${toPath("")}#ph-toolkit`}>
            {tCommon("back_to_toolkit")}
          </PhButton>
        </div>
      </section>

      {viewer}
    </div>
  );
};
