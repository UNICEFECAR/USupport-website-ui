import React from "react";
import { Block, Grid, GridItem } from "/USupport-components-library/src";

import "./find-yourself.scss";

/**
 * FindYourself
 *
 * The FindYourself block
 *
 * @returns {JSX.Element}
 */
export const FindYourself = () => {
  return (
    <Block classes="find-yourself" animation="fade-up">
      <Grid classes="find-yourself__grid">
        <GridItem md={8} lg={12} classes="find-yourself__heading-item">
          <h2>We help you find yourself</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="find-yourself__text-item">
          <p className="paragraph">
            Do you feel like something is happening to you and you can't
            pinpoint exactly what? We are helping you learn more about the
            condition you are going through and how to deal with it with the
            help of the free resources that the platform provides, as well as
            with the help of our specialists.
          </p>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item need-help">
          <div className="overlay" />
          <h3>I need help</h3>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item sos-center">
          <div className="overlay" />
          <h3>SOS Center</h3>
        </GridItem>
      </Grid>
    </Block>
  );
};
