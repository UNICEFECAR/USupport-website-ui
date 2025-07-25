import React from "react";
import { Block, Grid, GridItem } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./find-yourself.scss";

import image1 from "./assets/image_1.png";
import image2 from "./assets/image_2.png";
import image3 from "./assets/image_3.png";
import image4 from "./assets/image_4.png";

/**
 * FindYourself
 *
 * The FindYourself block
 *
 * @returns {JSX.Element}
 */
export const FindYourself = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "find-yourself" });
  const { width } = useWindowDimensions();

  return (
    <Block classes="find-yourself" animation="fade-up">
      <Grid classes="find-yourself__grid">
        <GridItem xs={4} md={8} lg={12} classes="find-yourself__heading-item">
          {width > 768 && (
            <>
              <h3 className="find-yourself__heading-item__h3">
                {t("heading")}
              </h3>
              <div className="find-yourself__text">
                <p className="paragraph">{t("paragraph")}</p>
                <p className="paragraph">{t("paragraph_2")}</p>
              </div>
            </>
          )}
        </GridItem>
        {width <= 768 && (
          <GridItem xs={4} md={8} lg={12} classes="find-yourself__text-item">
            <div className="find-yourself__text">
              <h3 className="find-yourself__heading-item__h3">
                {t("heading")}
              </h3>
              <div className="find-yourself__text__content">
                <p className="paragraph">{t("paragraph")}</p>
                <p className="paragraph">{t("paragraph_2")}</p>
              </div>
            </div>
          </GridItem>
        )}
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-1">
          <div className="overlay">
            <img src={image1} className="box__image" />
            <h3>{t("card_text_1")}</h3>
          </div>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-2">
          <div className="overlay">
            <img src={image2} className="box__image" />
            <h3>{t("card_text_2")}</h3>
          </div>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-3">
          <div className="overlay">
            <img src={image3} className="box__image" />
            <h3>{t("card_text_3")}</h3>
          </div>
        </GridItem>
        <GridItem md={4} lg={6} classes="find-yourself__image-item box box-4">
          <div className="overlay">
            <img src={image4} className="box__image" />
            <h3>{t("card_text_4")}</h3>
          </div>
        </GridItem>
      </Grid>
    </Block>
  );
};
