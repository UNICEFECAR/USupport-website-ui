import React from "react";
import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  RadialCircle,
  Animation,
} from "@USupport-components-library/src";

import "./hero.scss";

import MascotAnimation from "./assets/Mascot.json";
import { useTranslation } from "react-i18next";

/**
 * Hero
 *
 * The Hero block
 *
 * @return {jsx}
 */
export const Hero = () => {
  const { t } = useTranslation("hero");
  return (
    <Block classes="hero" animation="fade-right">
      <Grid classes="hero__main-grid">
        <GridItem md={5} lg={6}>
          <Grid classes="hero__content-grid">
            <GridItem md={8} lg={12} classes="hero__heading-item">
              <h1>
                {t("heading_1")} <span>{t("heading_1_1")}</span>
              </h1>
            </GridItem>
            <GridItem md={8} lg={12} classes="hero__text-item">
              <p className="paragraph">{t("paragraph")}</p>
            </GridItem>
            <GridItem md={4} lg={6} classes="hero__buttons-item">
              <StoreButton size="lg" store="google-play" />
            </GridItem>
            <GridItem md={4} lg={6} classes="hero__buttons-item">
              <StoreButton size="lg" store="app-store" />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem md={3} lg={6} classes="hero__mascot-item">
          <Animation json={MascotAnimation} />
        </GridItem>
      </Grid>
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
    </Block>
  );
};
