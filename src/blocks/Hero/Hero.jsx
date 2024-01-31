import React, { useContext } from "react";
import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  RadialCircle,
  StaticImage,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@USupport-components-library/utils";

import "./hero.scss";

import imageSrc from "./assets/PeopleCollage.png";
import imageSrcWebp from "./assets/PeopleCollage.webp";
// import unicefSquareLogoSrc from "./assets/UnicefSquareLogo.png";
// import unicefSquareLogoSrcWebp from "./assets/UnicefSquareLogo.png";

/**
 * Hero
 *
 * The Hero block
 *
 * @return {jsx}
 */
export const Hero = () => {
  const { t } = useTranslation("hero");
  const { theme } = useContext(ThemeContext);
  console.log(theme, "theme");
  return (
    <Block
      classes={`hero ${theme === "dark" ? "hero--dark" : ""}`}
      animation="fade-right"
    >
      <Grid classes="hero__main-grid">
        <GridItem md={5} lg={6}>
          <Grid
            classes="hero__content-grid"
            role="contentinfo"
            aria-label="Hero section"
          >
            <GridItem md={8} lg={12} classes="hero__heading-item">
              <h1>
                {t("heading_1")} <span>{t("heading_1_1")}</span>
              </h1>
            </GridItem>
            <GridItem md={8} lg={12} classes="hero__text-item">
              <p className="paragraph">{t("paragraph_1")}</p>
              <br />
              <p className="paragraph">{t("paragraph_1_1")}</p>
            </GridItem>
            <GridItem md={4} lg={6} classes="hero__buttons-item">
              <StoreButton
                downloadText={t("download_text")}
                size="lg"
                store="google-play"
              />
            </GridItem>
            <GridItem md={4} lg={6} classes="hero__buttons-item">
              <StoreButton
                downloadText={t("download_text")}
                size="lg"
                store="app-store"
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem md={3} lg={6} classes="hero__collage-item">
          {/* <StaticImage png={imageSrc} webp={imageSrcWebp} alt="happy-people" /> */}
        </GridItem>
      </Grid>
      {/* Commented out until comms team confirm, whether we can use the UNICEF logo in the Hero section of the commercial website */}
      {/* <div className="hero__unicef-logo-container">
        <StaticImage
          png={unicefSquareLogoSrc}
          webp={unicefSquareLogoSrcWebp}
          imageClasses="hero__unicef-logo"
          alt="unicef-round-logo"
        />
      </div> */}
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
    </Block>
  );
};
