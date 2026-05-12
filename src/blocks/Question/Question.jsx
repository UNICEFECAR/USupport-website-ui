import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Block,
  Grid,
  GridItem,
  NewButton,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./question.scss";

/**
 * Question
 *
 * Question Block component
 *
 * @return {jsx}
 */
export const Question = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "question" });
  const { width } = useWindowDimensions();

  const navigate = useNavigate();

  return (
    <Block classes="question" animation="fade-left">
      <Grid>
        <GridItem md={8} lg={12} classes="question__heading-item">
          <h1>{t("heading")}</h1>
          <p>{t("paragraph")}</p>
        </GridItem>
        <GridItem md={8} lg={12}>
          <NewButton
            label={t("button")}
            size="lg"
            web={width > 768}
            classes="question__button"
            onClick={() =>
              navigate(`/${localStorage.getItem("language")}/contact-us`)
            }
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
