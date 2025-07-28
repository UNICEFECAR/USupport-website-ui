import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Box,
  Button,
} from "@USupport-components-library/src";
import {
  useWindowDimensions,
  ThemeContext,
} from "@USupport-components-library/utils";

import en from "./assets/en.png";
import enSmall from "./assets/en-small.png";
import kk from "./assets/kk.png";
import kkSmall from "./assets/kk-small.png";
import pl from "./assets/pl.png";
import plSmall from "./assets/pl-small.png";
import ru from "./assets/ru.png";
import ruSmall from "./assets/ru-small.png";
import ro from "./assets/ro.png";
import roSmall from "./assets/ro-small.png";
import uk from "./assets/uk.png";
import ukSmall from "./assets/uk-small.png";

import "./my-qa-landing.scss";

/**
 * MyQALanding
 *
 * MyQA block used in Landing page
 *
 * @return {jsx}
 */
export const MyQALanding = () => {
  const { theme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation("blocks", { keyPrefix: "my-qa-landing" });

  const { width } = useWindowDimensions();

  const languageImages = {
    en: { large: en, small: enSmall },
    kk: { large: kk, small: kkSmall },
    pl: { large: pl, small: plSmall },
    ru: { large: ru, small: ruSmall },
    ro: { large: ro, small: roSmall },
    uk: { large: uk, small: ukSmall },
  };

  const currentLanguage = i18n.language;

  const currentImages = languageImages[currentLanguage] || languageImages.en;
  const image = currentImages.large;
  const imageSmall = currentImages.small;

  return (
    <Block classes="my-qa-landing">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2 className="my-qa-landing__heading">{t("heading")}</h2>
          <p className="my-qa-landing__subheading-text">{t("subheading")}</p>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid>
            <GridItem md={4} lg={5}>
              <div className="my-qa-landing__button-container">
                <Box
                  classes="my-qa-landing__ask-anonymous-card"
                  boxShadow={theme === "dark" ? 2 : 1}
                >
                  <h4>{t("ask_anonymous_card_heading")}</h4>
                  <p className="text">{t("ask_anonymous_card_text")}</p>
                </Box>
                <Button
                  label={t("button_label")}
                  size="lg"
                  classes="my-qa-landing__button"
                  onClick={() => {
                    window.location.href = "/client/my-qa";
                  }}
                />
              </div>
            </GridItem>
            <GridItem md={4} lg={7}>
              <img
                src={width >= 1366 ? image : imageSmall}
                className="my-qa-landing__image"
                alt="My Q&A question example"
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
