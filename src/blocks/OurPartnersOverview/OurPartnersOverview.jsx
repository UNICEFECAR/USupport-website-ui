import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";

import ministryEducationKZ from "../../assets/ministry-education-kz.png";
import ministryHealthKZ from "../../assets/ministry-health-kz.png";

import "./our-partners-overview.scss";

/**
 * OurPartnersOverview
 *
 * ]OurPartnersOverview block
 *
 * @return {jsx}
 */
export const OurPartnersOverview = () => {
  const { t } = useTranslation("our-partners-overview");
  const navigate = useNavigate();

  const partners = [
    {
      name: t("partner_1_title"),
      link: t("partner_1_link"),
      image: ministryHealthKZ,
    },
    {
      name: t("partner_2_title"),
      link: t("partner_2_link"),
      image: ministryEducationKZ,
    },
  ];

  const renderAllPartners = () => {
    return partners.map((partner, index) => {
      return (
        <GridItem xs={2} md={4} lg={6} key={index}>
          <PartnerOverview
            name={partner.name}
            link={partner.link}
            image={partner.image}
            key={index}
          />
        </GridItem>
      );
    });
  };

  return (
    <Block classes="our-partners-overview">
      <Grid classes="our-partners-overview__grid">
        <GridItem md={8} lg={12}>
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem
          md={8}
          lg={12}
          classes="our-partners-overview__grid__partners-item"
        >
          <Grid classes="our-partners-overview__partners-grid">
            {renderAllPartners()}
          </Grid>
        </GridItem>
        <GridItem md={8} lg={12}>
          <Button
            label={t("button_label")}
            size="lg"
            type="secondary"
            onClick={() =>
              navigate(`/${localStorage.getItem("language")}/about-us`)
            }
          />
        </GridItem>
      </Grid>
    </Block>
  );
};

const PartnerOverview = ({ name, link, image }) => {
  return (
    <div className="our-partners-overview__partner-overview">
      <img
        src={image}
        alt="partner-logo"
        className="our-partners-overview__partner-overview__partner-logo"
      />
      <a href={link}>
        <h4 className="our-partners-overview__partner-overview__text">
          {name}
        </h4>
      </a>
    </div>
  );
};
