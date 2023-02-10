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
  const { t } = useTranslation("about");
  return (
    <Block classes={["about"]} animation="fade-right">
      <Grid classes={["about__main-grid"]}>
        <GridItem md={8} lg={12}>
          <h2 classes="about__heading">{t("heading")}</h2>
        </GridItem>
        <GridItem md={8} lg={7} classes="about__description-item">
          <p className="paragraph about__description-item__paragraph">
            {t("paragraph")}
          </p>
        </GridItem>

        <GridItem xs={4} md={6} lg={5} classes="about__icons-grid">
          <Grid>
            <GridItem xs={4} md={8} lg={12} classes="about__icon-item first">
              <CardIconAndLabel
                iconName="self-care"
                size="lg"
                label={t("card_text_1")}
              />
            </GridItem>

            <GridItem md={8} lg={12} classes="about__icon-item second">
              <CardIconAndLabel
                iconName="community"
                size="sm"
                label={t("card_text_2")}
              />
            </GridItem>

            <GridItem md={8} lg={12} classes="about__icon-item third">
              <CardIconAndLabel
                iconName="therapy"
                size="md"
                label={t("card_text_3")}
              />
            </GridItem>
            <GridItem md={8} lg={12} classes="about__icon-item forth">
              <CardIconAndLabel
                iconName="dedicated-space"
                size="md"
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
      <Animation name="MascotBlueWavingCutOff" classes="about__mascot" />
      <RadialCircle color="blue" />
    </Block>
  );
};
