import React from "react";
import PropTypes from "prop-types";
import {
  Block,
  Grid,
  GridItem,
  CardNumber,
} from "@USupport-components-library/src";

import "./how-it-works.scss";

/**
 * HowItWorks
 *
 * The HowItWorks block
 *
 * @return {jsx}
 */
export const HowItWorks = ({ summary = false }) => {
  return (
    <Block classes="how-it-works" animation="fade-left">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>How it works</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="how-it-works__text-item">
          <p className="paragraph">
            {summary
              ? "We provide anonymous treatment without the need of full registration."
              : "We provide anonymously treatment without the need full registration. We provide anonymously treatment without the need full registration. We provide anonymously treatment without the need full registration. We provide anonymously treatment without the need full registration."}
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
            iconName="coaching"
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

HowItWorks.propTypes = {
  /**
   * If true, the block will show a summary text
   * If false, the block will show a full text
   * */
  summary: PropTypes.bool,
};
