import React from "react";
import {
  Block,
  CardIconAndLabel,
  Grid,
  GridItem,
  RadialCircle,
  Animation,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./about.scss";

/**
 * About
 *
 * The About block
 *
 * @returns {JSX.Element}
 */
export const About = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "about" });
  const IS_RO = localStorage.getItem("country") === "RO";

  return (
    <Block classes={["about"]} animation="fade-right">
      <Grid classes="about__main-grid">
        <GridItem md={8} lg={12} classes="about__heading-and-description">
          <Grid>
            <GridItem md={8} lg={6}>
              <GridItem md={8} lg={12}>
                <h1 className="about__heading">{t("heading")}</h1>
                <p className="paragraph about__heading-and-description__description">
                  {t("paragraph")}
                </p>
              </GridItem>
            </GridItem>
            <GridItem md={8} lg={6}>
              <div className="about__mascot-cell">
                <Animation
                  name="MascotBlueWavingCutOff"
                  classes="about__mascot"
                />
              </div>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem xs={4} md={8} lg={12}>
          <Grid>
            <GridItem xs={4} md={4} lg={3}>
              <CardIconAndLabel
                iconName="self-care"
                size="lg"
                classes="about__card-icon-and-label"
                label={t("card_text_1")}
              />
            </GridItem>

            <GridItem md={4} lg={3}>
              <CardIconAndLabel
                iconName="community"
                size="lg"
                classes="about__card-icon-and-label"
                label={t(IS_RO ? "card_text_2_ro" : "card_text_2")}
              />
            </GridItem>

            <GridItem md={4} lg={3}>
              <CardIconAndLabel
                iconName="therapy"
                size="lg"
                classes="about__card-icon-and-label"
                label={t(IS_RO ? "card_text_3_ro" : "card_text_3")}
              />
            </GridItem>
            <GridItem md={4} lg={3}>
              <CardIconAndLabel
                iconName="dedicated-space"
                size="lg"
                classes="about__card-icon-and-label"
                label={t("card_text_4")}
              />
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem md={8} lg={12} classes="about__description-item-2">
          <p className="paragraph about__description-item-2__paragraph">
            {t("paragraph_2")}
          </p>
        </GridItem>
      </Grid>
      <RadialCircle color="blue" />
    </Block>
  );
};
