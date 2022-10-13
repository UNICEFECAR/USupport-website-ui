import React from "react";
import {
  Block,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./question.scss";
import { useTranslation } from "react-i18next";

/**
 * Question
 *
 * Question Block component
 *
 * @return {jsx}
 */
export const Question = () => {
  const { t } = useTranslation("question");
  const { width } = useWindowDimensions();

  return (
    <Block classes="question" animation="fade-left">
      <Grid>
        <GridItem md={4} lg={6} classes="question__heading-item">
          <h3>{t("heading")}</h3>
          <p className="text">{t("paragraph")}</p>
        </GridItem>
        <GridItem md={4} lg={6}>
          <Button
            label={t("button")}
            size={width > 768 ? "sm" : "lg"}
            web={width > 768}
            classes="question__button"
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
