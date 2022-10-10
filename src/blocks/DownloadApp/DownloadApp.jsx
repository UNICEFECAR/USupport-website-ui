import React from "react";
import {
  Block,
  Grid,
  GridItem,
  StoreButton,
} from "usupport-components-library/src";

import "./download-app.scss";

import imageSrc from "./assets/StartScreen.png";

/**
 * DownloadApp
 *
 * DownloadApp block component
 *
 * @return {jsx}
 */
export const DownloadApp = () => {
  return (
    <Block classes="download-app" animation="fade-up">
      <Grid>
        <GridItem md={5} lg={6} classes="download-app__content-item">
          <Grid classes="download-app__content-grid">
            <GridItem md={8} lg={12} classes="download-app__heading-item">
              <h3>Download our mobile app</h3>
            </GridItem>
            <GridItem md={8} lg={12} classes="download-app__sub-heading">
              <p className="text">Now available for iOS and Android</p>
            </GridItem>
            <GridItem md={4} lg={6} classes="download-app__buttons-item">
              <StoreButton size="lg" store="google-play" />
            </GridItem>
            <GridItem md={4} lg={6} classes="download-app__buttons-item">
              <StoreButton size="lg" store="app-store" />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem md={3} lg={6} classes="download-app__image-item">
          <img src={imageSrc} className="download-app__image" />
        </GridItem>
      </Grid>
    </Block>
  );
};
