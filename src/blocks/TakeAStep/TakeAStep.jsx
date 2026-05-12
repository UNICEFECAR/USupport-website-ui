import React from "react";
import {
  Block,
  CardNumber,
  Grid,
  GridItem,
  Animation,
  RadialCircle,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./take-a-step.scss";

/**
 * TakeAStep
 *
 * About-like layout rendering the "How it works" number cards.
 *
 * @returns {JSX.Element}
 */
export const TakeAStep = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "how-it-works" });
  const IS_RO = localStorage.getItem("country") === "RO";

  return (
    <Block classes={["take-a-step"]} animation="fade-right">
      <Grid classes="take-a-step__main-grid">
        <GridItem md={8} lg={12} classes="take-a-step__heading-and-description">
          <Grid>
            <GridItem md={4} lg={6}>
              <GridItem md={8} lg={12}>
                <h1 className="take-a-step__heading">{t("heading")}</h1>
                <p className="paragraph take-a-step__heading-and-description__description">
                  {t("paragraph_normal")}
                </p>
              </GridItem>
            </GridItem>
            <GridItem md={4} lg={6}>
              <div className="take-a-step__mascot-cell">
                <Animation
                  name="MascotBlueQuestions"
                  classes="take-a-step__mascot"
                />
              </div>
            </GridItem>
          </Grid>
        </GridItem>

        <GridItem xs={4} md={8} lg={12}>
          <Grid classes="take-a-step__cards-grid">
            <GridItem xs={4} md={4} lg={3}>
              <CardNumber number="1" iconName="community" text={t("card_1")} />
            </GridItem>
            <GridItem xs={4} md={4} lg={3}>
              <CardNumber number="2" iconName="coaching" text={t("card_2")} />
            </GridItem>
            <GridItem xs={4} md={4} lg={3}>
              <CardNumber
                number="3"
                iconName={IS_RO ? "calm" : "therapy"}
                text={t(IS_RO ? "card_3_ro" : "card_3")}
              />
            </GridItem>
            <GridItem xs={4} md={4} lg={3}>
              <CardNumber
                number="4"
                iconName={IS_RO ? "community" : "calm"}
                text={t(IS_RO ? "card_4_ro" : "card_4")}
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <RadialCircle color="blue" />
    </Block>
  );
};
