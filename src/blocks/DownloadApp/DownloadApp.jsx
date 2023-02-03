import React from "react";
import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  StaticImage,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./download-app.scss";

import imageSrc from "./assets/StartScreen.png";
import imageSrcWebp from "./assets/StartScreen.webp";

/**
 * DownloadApp
 *
 * DownloadApp block component
 *
 * @return {jsx}
 */
export const DownloadApp = () => {
  const { t } = useTranslation("download-app");
  return (
    <Block classes="download-app" animation="fade-up">
      <Grid>
        <GridItem md={5} lg={6} classes="download-app__content-item">
          <Grid classes="download-app__content-grid">
            <GridItem md={8} lg={12} classes="download-app__heading-item">
              <h3>{t("heading")}</h3>
            </GridItem>
            <GridItem md={8} lg={12} classes="download-app__sub-heading">
              <p className="text">{t("paragraph")}</p>
            </GridItem>
            <GridItem md={4} lg={6} classes="download-app__buttons-item">
              <StoreButton
                downloadText={t("download_text")}
                size="lg"
                store="google-play"
              />
            </GridItem>
            <GridItem md={4} lg={6} classes="download-app__buttons-item">
              <StoreButton
                downloadText={t("download_text")}
                size="lg"
                store="app-store"
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem md={3} lg={6} classes="download-app__image-item">
          <StaticImage
            png={imageSrc}
            webp={imageSrcWebp}
            imageClasses="download-app__image"
            alt="mobile-app"
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
