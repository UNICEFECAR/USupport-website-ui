import React, { useContext } from "react";
import PropTypes from "prop-types";
import {
  Block,
  Grid,
  GridItem,
  CardNumber,
  StaticImage,
  StoreButton,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import {
  useWindowDimensions,
  ThemeContext,
} from "@USupport-components-library/utils";

import "./how-it-works.scss";

import imageSrc from "./assets/HowItWorks2.png";
import imageSrcDark from "./assets/HowItWorks2-dark.png";
import image1 from "./assets/HowItWorks3.png";
import image2 from "./assets/HowItWorks4.png";
import image1Dark from "./assets/HowItWorks3-dark.png";
import image2Dark from "./assets/HowItWorks4-dark.png";

/**
 * HowItWorks
 *
 * The HowItWorks block
 *
 * @return {jsx}
 */
export const HowItWorks = ({
  summary = false,
  showSummaryBellow = false,
  onPage = false,
  isTitleWhite = true,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "how-it-works" });
  const IS_RO = localStorage.getItem("country") === "RO";

  const { width } = useWindowDimensions();

  const { theme } = useContext(ThemeContext);

  return (
    <Block classes="how-it-works" animation="fade-left">
      <Grid classes={onPage ? "how-it-works__grid" : ""}>
        <GridItem classes="how-it-works__heading" md={8} lg={12}>
          <h2
            className={[
              "how-it-works__heading-text",
              isTitleWhite && "how-it-works__heading-text--white",
            ].join(" ")}
          >
            {t("heading")}
          </h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="how-it-works__text-item">
          {!showSummaryBellow && (
            <p className="paragraph">
              {summary ? t("paragraph_summary") : t("paragraph_normal")}
            </p>
          )}
        </GridItem>
        {width > 768 && width < 1366 && (
          <GridItem md={8}>
            <Grid classes="how-it-works__images-grid">
              <GridItem md={4}>
                <div className="how-it-works__tablet-image-container">
                  <StaticImage
                    png={theme === "dark" ? image1Dark : image1}
                    webp={theme === "dark" ? image1Dark : image1}
                    alt="happy-people-collage"
                  />
                </div>
              </GridItem>
              <GridItem md={4}>
                <div className="how-it-works__tablet-image-container">
                  <StaticImage
                    png={theme === "dark" ? image2Dark : image2}
                    webp={theme === "dark" ? image2Dark : image2}
                    alt="happy-people-collage"
                  />
                </div>
              </GridItem>
            </Grid>
          </GridItem>
        )}
        <GridItem md={8} lg={6}>
          <Grid>
            <GridItem lg={6}>
              <CardNumber number="1" iconName="community" text={t("card_1")} />
            </GridItem>
            <GridItem lg={6}>
              <CardNumber number="2" iconName="coaching" text={t("card_2")} />
            </GridItem>
            <GridItem lg={6}>
              <CardNumber
                number="3"
                iconName={IS_RO ? "calm" : "therapy"}
                text={t(IS_RO ? "card_3_ro" : "card_3")}
              />
            </GridItem>
            <GridItem lg={6}>
              <CardNumber
                number="4"
                iconName={IS_RO ? "community" : "calm"}
                text={t(IS_RO ? "card_4_ro" : "card_4")}
              />
            </GridItem>
          </Grid>
        </GridItem>
        {width >= 1366 && (
          <GridItem lg={6} classes="how-it-works__image-collage-item">
            <StaticImage
              png={theme === "dark" ? imageSrcDark : imageSrc}
              webp={theme === "dark" ? imageSrcDark : imageSrc}
              alt="happy-people-collage"
            />
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="how-it-works__download-buttons">
          <div className="how-it-works__download-buttons__store">
            <StoreButton
              downloadText={t("download_text")}
              size="lg"
              store="google-play"
            />
            <StoreButton
              downloadText={t("download_text")}
              size="lg"
              store="app-store"
            />
            <StoreButton
              browserLabel={t("web_browser")}
              downloadText={t("click_to_use")}
              size="lg"
              store="web"
            />
          </div>
        </GridItem>
      </Grid>
      <div>
        {showSummaryBellow && (
          <p className="paragraph how-it-works__summary-text-bellow">
            {summary ? t("paragraph_summary") : t("paragraph_normal")}
          </p>
        )}
      </div>
    </Block>
  );
};

HowItWorks.propTypes = {
  /**
   * If true, the block will show a summary text
   * If false, the block will show a full text
   * */
  summary: PropTypes.bool,

  /**
   * If true, the summary text will be shown bellow the cards
   * If false, the summary text will be shown above the cards
   * */
  showSummaryBellow: PropTypes.bool,

  /**
   * If true, the block will be displayed on a page
   * If false, the block will be displayed on the home page
   * */
  onPage: PropTypes.bool,
};
