import React from "react";
import { Block, Grid, GridItem, Box } from "/USupport-components-library/src";

import "./we-help.scss";

import mascot from "../../assets/MascotBlue.png";

/**
 * WeHelp
 *
 * The first block of the About us page
 *
 * @return {jsx}
 */
export const WeHelp = () => {
  return (
    <Block classes="we-help">
      <Grid>
        <GridItem md={8} lg={12} classes="we-help__heading">
          <h2>About Us</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Box classes="we-help__content-box">
            <Grid classes="we-help__secondary-grid">
              <GridItem
                md={6}
                lg={6}
                classes="we-help__secondary-grid__descriptions-item"
              >
                <h3>We help you find yourself</h3>

                <p className="text we-help__secondary-grid__text-two">
                  Do you feel like something is happening to you and you can't
                  pinpoint exactly what? We are helping you learn more about the
                  condition you are going through and how to deal with it with
                  the help of the free resources that the platform provides, as
                  well as with the help of our specialists.
                </p>
                <p className="text we-help__secondary-grid__text-three">
                  Learn more about the condition you are going through and how
                  to deal with it with the help of the free resources that the
                  platform provides, as well as with the help of our
                  specialists.
                </p>
              </GridItem>

              <GridItem md={2} lg={6} classes="we-help__mascot-item">
                <img src={mascot} className="we-help__mascot-item__image" />
              </GridItem>
            </Grid>
          </Box>
        </GridItem>
      </Grid>
    </Block>
  );
};
