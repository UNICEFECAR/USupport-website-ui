import React from "react";
import {
  Block,
  CardIconAndLabel,
  Grid,
  GridItem,
  RadialCircle,
} from "usupport-components-library/src";

import "./about.scss";

import mascot from "../../assets/MascotBlueClipped.png";

/**
 * About
 *
 * The About block
 *
 * @returns {JSX.Element}
 */
export const About = () => {
  return (
    <Block classes={["about"]} animation="fade-right">
      <Grid classes={["about__main-grid"]}>
        <GridItem md={8} lg={12}>
          <h2 classes="about__heading">About USupport</h2>
        </GridItem>
        <GridItem md={8} lg={7} classes="about__description-item">
          <p className="paragraph about__description-item__paragraph">
            Do you feel like something is happening to you and you can't
            pinpoint exactly what? We are helping you learn more about the
            condition you are going through and how to deal with it with the
            help of the free resources that the platform provides, as well as
            with the help of our specialists.
          </p>
        </GridItem>

        <GridItem xs={4} md={6} lg={5} classes="about__icons-grid">
          <Grid>
            <GridItem xs={4} md={8} lg={12} classes="about__icon-item first">
              <CardIconAndLabel
                iconName="self-care"
                size="lg"
                label="Self care"
              />
            </GridItem>

            <GridItem md={8} lg={12} classes="about__icon-item second">
              <CardIconAndLabel
                iconName="community"
                size="sm"
                label="Peer support"
              />
            </GridItem>

            <GridItem md={8} lg={12} classes="about__icon-item third">
              <CardIconAndLabel iconName="therapy" size="md" label="Therapy" />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
      <img src={mascot} className="about__mascot" />
      <RadialCircle color="blue" />
    </Block>
  );
};
