import React from "react";
import PropTypes from "prop-types";
import {
  Block,
  Grid,
  GridItem,
  CardNumber,
  StaticImage,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./how-it-works.scss";

import imageSrc from "./assets/HowItWorks.png";
import imageSrcWebp from "./assets/HowItWorks.webp";

/**
 * HowItWorks
 *
 * The HowItWorks block
 *
 * @return {jsx}
 */
export const HowItWorks = ({ summary = false }) => {
  const { t } = useTranslation("how-it-works");
  const { width } = useWindowDimensions();

  return (
    <Block classes="how-it-works" animation="fade-left">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>{t("heading")}</h2>
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
        {width >= 1366 && (
          <GridItem lg={6} classes="how-it-works__image-collage-item">
            <StaticImage
              png={imageSrc}
              webp={imageSrcWebp}
              alt="happy-people-collage"
            />
          </GridItem>
        )}
      </Grid>
      {width > 768 && width < 1366 && (
        <div className="how-it-works__tablet-image-container">
          <StaticImage
            png={imageSrc}
            webp={imageSrcWebp}
            alt="happy-people-collage"
          />
        </div>
      )}
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
