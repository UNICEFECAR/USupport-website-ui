import React, { useContext } from "react";
import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  RadialCircle,
  // StaticImage,
} from "@USupport-components-library/src";
import { Trans, useTranslation } from "react-i18next";
import { ThemeContext } from "@USupport-components-library/utils";

import "./hero.scss";

// import imageSrc from "./assets/PeopleCollage.png";
// import imageSrcWebp from "./assets/PeopleCollage.webp";
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
  const { t } = useTranslation("blocks", { keyPrefix: "hero" });
  const { theme } = useContext(ThemeContext);

  return (
    <Block
      classes={`hero ${theme === "light" ? "" : "hero--dark"}`}
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
                <Trans components={[<br></br>]}>{t("heading_1")}</Trans>
              </h1>
            </GridItem>
            <GridItem md={8} lg={12} classes="hero__text-item">
              <p className="paragraph">{t("paragraph_1")}</p>
              <br />
              <p className="paragraph">{t("paragraph_1_1")}</p>
            </GridItem>
            <GridItem md={8} lg={12} classes="hero__buttons-item">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <StoreButton
                    downloadText={t("download_text")}
                    size="lg"
                    store="google-play"
                  />
                </div>
                <div>
                  <StoreButton
                    downloadText={t("download_text")}
                    size="lg"
                    store="app-store"
                  />
                </div>
                <div>
                  <StoreButton
                    browserLabel={t("web_browser")}
                    downloadText={t("click_to_use")}
                    size="lg"
                    store="web"
                  />
                </div>
              </div>
            </GridItem>
            {/* <GridItem md={6} lg={6} classes="hero__buttons-item">
          
            </GridItem>
            <GridItem md={8} lg={12} classes="hero__buttons-item">
 
            </GridItem> */}
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
