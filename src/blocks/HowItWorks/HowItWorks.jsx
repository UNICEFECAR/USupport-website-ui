import React from "react";
import PropTypes from "prop-types";
import {
  Block,
  Grid,
  GridItem,
  CardNumber,
} from "@USupport-components-library/src";

import "./how-it-works.scss";
import { useTranslation } from "react-i18next";

/**
 * HowItWorks
 *
 * The HowItWorks block
 *
 * @return {jsx}
 */
export const HowItWorks = ({ summary = false }) => {
  const { t } = useTranslation("how-it-works");
  return (
    <Block classes="how-it-works" animation="fade-left">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>How it works</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="how-it-works__text-item">
          <p className="paragraph">
            {summary ? t("paragraph_summary") : t("paragraph_normal")}
          </p>
        </GridItem>
        <GridItem lg={3}>
          <CardNumber number="1" iconName="community" text={t("card_1")} />
        </GridItem>
        <GridItem lg={3}>
          <CardNumber number="2" iconName="coaching" text={t("card_2")} />
        </GridItem>
        <GridItem lg={3}>
          <CardNumber number="3" iconName="therapy" text={t("card_3")} />
        </GridItem>
        <GridItem lg={3}>
          <CardNumber number="4" iconName="calm" text={t("card_4")} />
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
