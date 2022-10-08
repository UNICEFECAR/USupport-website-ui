import React from "react";
import {
  Block,
  Grid,
  GridItem,
  StoreButton,
  RadialCircle,
} from "/USupport-components-library/src";

import "./hero.scss";

import MascotOrange from "../../assets/MascotOrange.png";

/**
 * Hero
 *
 * The Hero block
 *
 * @return {jsx}
 */
export const Hero = () => {
  return (
    <Block classes="hero" animation="fade-right">
      <Grid classes="hero__main-grid">
        <GridItem md={5} lg={6}>
          <Grid classes="hero__content-grid">
            <GridItem md={8} lg={12} classes="hero__heading-item">
              <h1>
                Make your mental health <span>a priority!</span>
              </h1>
            </GridItem>
            <GridItem md={8} lg={12} classes="hero__text-item">
              <p className="paragraph">
                USupport is the first platform that provides you with
                personalized care for your mental health and personal
                development and provides you with easy access to resources and
                proven specialists. Start by telling your story!
              </p>
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
          <img src={MascotOrange} />
        </GridItem>
      </Grid>
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
    </Block>
  );
};
