import React from "react";
import {
  Block,
  Grid,
  GridItem,
  CardPartner,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./our-partners.scss";

/**
 * OurPartners
 *
 * OurPartners block
 *
 * @return {jsx}
 */
export const OurPartners = () => {
  const { t } = useTranslation("our-partners");
  const goToLink = "https://www.unicef.org/";
  return (
    <Block classes="our-partners">
      <Grid classes="our-partners__grid">
        <GridItem classes="out-partners__grid-item" md={8} lg={12}>
          <h2 className="our-partners__heading">{t("heading")}</h2>
        </GridItem>

        <GridItem classes="our-partners__paragraph" md={8} lg={12}>
          <p className="text">{t("paragraph")}</p>
        </GridItem>

        <GridItem md={8} lg={12}>
          <CardPartner
            title={t("partner_1_title")}
            description={t("partner_1_description")}
            link={goToLink}
            linkPlaceholder={t("partner_1_link_placeholder")}
          />
        </GridItem>
        <GridItem md={8} lg={12}>
          <CardPartner
            title={t("partner_1_title")}
            description={t("partner_1_description")}
            link={goToLink}
            linkPlaceholder={t("partner_1_link_placeholder")}
          />
        </GridItem>
        <GridItem md={8} lg={12}>
          <CardPartner
            title={t("partner_1_title")}
            description={t("partner_1_description")}
            link={goToLink}
            linkPlaceholder={t("partner_1_link_placeholder")}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
