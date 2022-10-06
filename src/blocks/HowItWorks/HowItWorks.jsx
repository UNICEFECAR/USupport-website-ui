import React from "react";
import {
  Block,
  Grid,
  GridItem,
  CardNumber,
} from "/USupport-components-library/src";

import "./how-it-works.scss";

/**
 * HowItWorks
 *
 * The HowItWorks block
 *
 * @return {jsx}
 */
export const HowItWorks = () => {
  return (
    <Block classes="how-it-works">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>How it works</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <p className="paragraph">
            We provide anonymous treatment without the need of full
            registration.
          </p>
        </GridItem>
        <GridItem lg={3}>
          <CardNumber
            number="1"
            iconName="community"
            text="Create your account"
          />
        </GridItem>
        <GridItem lg={3}>
          <CardNumber
            number="2"
            iconName="consultation"
            text="Choose a kind of therapy"
          />
        </GridItem>
        <GridItem lg={3}>
          <CardNumber number="3" iconName="therapy" text="Choose a provider" />
        </GridItem>
        <GridItem lg={3}>
          <CardNumber
            number="4"
            iconName="calm"
            text="Clear your mind and get calm"
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
