import React, { useContext } from "react";
import {
  Block,
  Grid,
  GridItem,
  StaticImage,
  StoreButton,
} from "@USupport-components-library/src";
import { Trans, useTranslation } from "react-i18next";
import {
  useWindowDimensions,
  ThemeContext,
} from "@USupport-components-library/utils";

import "./how-it-works-hero.scss";

import imageSrc from "../HowItWorks/assets/HowItWorks2.png";
import imageSrcDark from "../HowItWorks/assets/HowItWorks2-dark.png";
import image1 from "../HowItWorks/assets/HowItWorks3.png";
import image2 from "../HowItWorks/assets/HowItWorks4.png";
import image1Dark from "../HowItWorks/assets/HowItWorks3-dark.png";
import image2Dark from "../HowItWorks/assets/HowItWorks4-dark.png";

/**
 * HowItWorks
 *
 * The HowItWorks block
 *
 * @return {jsx}
 */
export const HowItWorksHero = ({
  showSummaryBellow = false,
  onPage = false,
  isTitleWhite = true,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "how-it-works" });

  const { width } = useWindowDimensions();

  const { theme } = useContext(ThemeContext);

  return (
    <Block classes="how-it-works-hero" animation="fade-left">
      <Grid
        classes={[
          "how-it-works-hero__grid",
          onPage && "how-it-works-hero__grid--on-page",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {width < 1366 && (
          <>
            <GridItem classes="how-it-works-hero__heading" md={8} lg={12}>
              <h1 className={["how-it-works-hero__heading-text"].join(" ")}>
                {
                  <Trans
                    components={[
                      <br key="br"></br>,
                      <span
                        key="highlight"
                        className="how-it-works-hero__heading-text__highlight"
                      ></span>,
                    ]}
                  >
                    {t("heading_hero")}
                  </Trans>
                }
              </h1>
            </GridItem>
            <GridItem md={8} lg={12} classes="how-it-works-hero__text-item">
              {!showSummaryBellow && (
                <p className="paragraph">{t("paragraph_hero")}</p>
              )}
            </GridItem>
          </>
        )}
        {width > 768 && width < 1366 && (
          <GridItem md={8}>
            <Grid classes="how-it-works-hero__images-grid">
              <GridItem md={4}>
                <div className="how-it-works-hero__tablet-image-container">
                  <StaticImage
                    png={theme === "dark" ? image1Dark : image1}
                    webp={theme === "dark" ? image1Dark : image1}
                    alt="happy-people-collage"
                  />
                </div>
              </GridItem>
              <GridItem md={4}>
                <div className="how-it-works-hero__tablet-image-container">
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
            {width >= 1366 && (
              <>
                <GridItem lg={12} classes="how-it-works-hero__heading">
                  <h1
                    className={[
                      "how-it-works-hero__heading-text",
                      isTitleWhite && "how-it-works-hero__heading-text--white",
                    ].join(" ")}
                  >
                    <Trans
                      components={[
                        <br key="br"></br>,
                        <span
                          key="highlight"
                          className="how-it-works-hero__heading-text__highlight"
                        ></span>,
                      ]}
                    >
                      {t("heading_hero")}
                    </Trans>
                  </h1>
                </GridItem>
                {!showSummaryBellow && (
                  <GridItem lg={12} classes="how-it-works-hero__text-item">
                    <p className="paragraph">{t("paragraph_hero")}</p>
                  </GridItem>
                )}
              </>
            )}
          </Grid>
        </GridItem>
        {width >= 1366 && (
          <GridItem lg={6} classes="how-it-works-hero__image-collage-item">
            <StaticImage
              png={theme === "dark" ? imageSrcDark : imageSrc}
              webp={theme === "dark" ? imageSrcDark : imageSrc}
              alt="happy-people-collage"
            />
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="how-it-works-hero__download-buttons">
          <div className="how-it-works-hero__download-buttons__store">
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
          <p className="paragraph how-it-works-hero__summary-text-bellow">
            {t("paragraph_hero")}
          </p>
        )}
      </div>
    </Block>
  );
};
