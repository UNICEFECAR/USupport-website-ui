import React from "react";
import { Block, Grid, GridItem } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./find-yourself.scss";

/**
 * FindYourself
 *
 * The FindYourself block
 *
 * @returns {JSX.Element}
 */
export const FindYourself = () => {
  const { t } = useTranslation("find-yourself");
  return (
    <Block classes="find-yourself" animation="fade-up">
      <Grid classes="find-yourself__grid">
        <GridItem md={8} lg={12} classes="find-yourself__heading-item">
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="find-yourself__text-item">
          <p className="paragraph">{t("paragraph")}</p>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-1">
          <div className="overlay" />
          <h3>{t("card_text_1")}</h3>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-2">
          <div className="overlay" />
          <h3>{t("card_text_2")}</h3>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-3">
          <div className="overlay" />
          <h3>{t("card_text_3")}</h3>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-4">
          <div className="overlay" />
          <h3>{t("card_text_4")}</h3>
        </GridItem>
      </Grid>
    </Block>
  );
};
