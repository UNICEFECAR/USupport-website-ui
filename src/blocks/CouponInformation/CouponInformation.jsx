import React from "react";
import { useTranslation } from "react-i18next";

import { Block, Grid, GridItem, Icon } from "@USupport-components-library/src";
import { mascotHappyOrange } from "@USupport-components-library/assets";

import "./coupon-information.scss";

/**
 * CouponInformation
 *
 * Coupon block used in Landing page
 *
 * @return {jsx}
 */
export const CouponInformation = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "coupon-information" });

  return (
    <Block classes="coupon-information">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Grid classes="coupon-information__content-grid">
            <GridItem md={4} lg={6}>
              <h4>{t("how")}</h4>
              <p className="text">{t("how_text")}</p>
              <h4>{t("where")}</h4>
              <p className="text">{t("where_text")}</p>
              <p className="text">{t("where_text_2")}</p>
            </GridItem>
            <GridItem md={4} lg={6}>
              <div className="coupon-information__content-grid__reason-container">
                <div>
                  <img src={mascotHappyOrange} alt="mascot" />
                </div>
                <p className="text">{t("reason_1")}</p>
              </div>
              <div className="coupon-information__content-grid__reason-container">
                <div>
                  <Icon name="instagram" size="lg" color="#c39af9" />
                </div>
                <p className="text">{t("reason_2")}</p>
              </div>
              <div className="coupon-information__content-grid__reason-container">
                <div>
                  <Icon name="time-expire" size="lg" color="#c1eaea" />
                </div>
                <p className="text">{t("reason_3")}</p>
              </div>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
