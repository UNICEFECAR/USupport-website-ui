import React from "react";
import { useTranslation } from "react-i18next";

import { PhButton } from "../../components/PhButton/PhButton";
import { PhIcon } from "../../components/PhIcon/PhIcon";

import heroArtwork from "../../assets/hero-artwork.jpg";

import "./ph-hero.scss";

/**
 * PhHero
 *
 * Homepage welcome banner
 *
 * @returns {JSX.Element}
 */
export const PhHero = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "home.hero" });

  return (
    <section className="ph-hero" aria-labelledby="ph-hero-heading">
      <div className="ph-hero__copy">
        <p className="ph-hero__eyebrow">{t("eyebrow")}</p>
        <h1 className="ph-hero__heading" id="ph-hero-heading">
          <span>{t("heading_1")}</span>{" "}
          <span className="ph-hero__heading-accent">{t("heading_2")}</span>
        </h1>
        <p className="ph-hero__text">{t("text")}</p>
        <div className="ph-hero__actions">
          <PhButton href="#ph-toolkit" icon="arrow">
            {t("explore_toolkit")}
          </PhButton>
          <PhButton tone="text" href="#ph-intro-video" icon="play">
            {t("discover")}
          </PhButton>
        </div>
        <p className="ph-hero__reassurance">
          <PhIcon name="heart" size={16} />
          <span>{t("reassurance")}</span>
        </p>
      </div>

      <figure className="ph-hero__artwork">
        <img
          src={heroArtwork}
          alt={t("artwork_alt")}
          width="850"
          height="570"
        />
        <figcaption>{t("caption")}</figcaption>
      </figure>
    </section>
  );
};
