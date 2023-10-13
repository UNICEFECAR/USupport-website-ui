import React from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Box,
  Button,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import image from "./assets/image.png";
import imageSmall from "./assets/image-small.png";

import "./my-qa-landing.scss";

/**
 * MyQALanding
 *
 * MyQA block used in Landing page
 *
 * @return {jsx}
 */
export const MyQALanding = () => {
  const { t } = useTranslation("my-qa-landing");

  const { width } = useWindowDimensions();

  return (
    <div className="my-qa-landing-wrapper">
    <Block classes="my-qa-landing">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2 className="my-qa-landing__heading">{t("heading")}</h2>
          <p className="my-qa-landing__subheading-text">{t("subheading")}</p>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid>
            <GridItem md={4} lg={5}>
              <div className="my-qa-landing__button-container">
                <Box classes="my-qa-landing__ask-anonymous-card">
                  <h4>{t("ask_anonymous_card_heading")}</h4>
                  <p className="text">{t("ask_anonymous_card_text")}</p>
                </Box>
                <Button
                  label={t("button_label")}
                  size="lg"
                  classes="my-qa-landing__button"
                  onClick={() => {
                    window.location.href = "/client/my-qa";
                  }}
                />
              </div>
            </GridItem>
            <GridItem md={4} lg={7}>
              <img
                src={width >= 1366 ? image : imageSmall}
                className="my-qa-landing__image"
                alt="My Q&A question example"
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Block>
    </div>
  );
};
