import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  Grid,
  GridItem,
  EmergencyCenter,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { getFilteredData } from "@USupport-components-library/utils";

import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = () => {
  const { i18n, t } = useTranslation("sos-center");

  const getSOSCenters = async () => {
    // Request SOS Centers ids from the master DB based for website platform
    const sosCentersIds = await adminSvc.getSOSCenters("website");
    console.log("sosCentersIds", sosCentersIds);
    const sosCenters = [];

    if (sosCentersIds.length > 0) {
      let { data } = await cmsSvc.getSOSCenters("all", true, sosCentersIds);

      data = getFilteredData(data, i18n.language);

      data.forEach((sosCenter) => {
        sosCenters.push({
          title: sosCenter.attributes.title,
          text: sosCenter.attributes.text,
          phone: sosCenter.attributes.phone,
          email: sosCenter.attributes.email,
        });
      });
    }

    return sosCenters;
  };

  const {
    data: SOSCentersData,
    isLoading: SOSCentersLoading,
    isFetched: isSOSCentersFetched,
  } = useQuery(["SOSCenters", i18n.language], getSOSCenters);

  return (
    <Block classes="soscenter" animation="fade-right">
      {SOSCentersData && (
        <Grid classes="soscenter__grid">
          <GridItem xs={4} md={8} lg={12} classes="soscenter__heading-item">
            <h2>{t("heading")}</h2>
          </GridItem>
          <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
            <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
              {SOSCentersData.map((sosCenter, index) => {
                return (
                  <GridItem
                    classes="soscenter__secondary-grid__item"
                    md={4}
                    lg={12}
                    key={index}
                  >
                    <EmergencyCenter
                      title={sosCenter.title}
                      text={sosCenter.text}
                      link={sosCenter.link}
                      phone={sosCenter.phone}
                      btnLabel={t("button")}
                    />
                  </GridItem>
                );
              })}
            </Grid>
          </GridItem>
        </Grid>
      )}
      {!SOSCentersData && SOSCentersLoading && <Loading />}
      {!SOSCentersData?.length && !SOSCentersLoading && isSOSCentersFetched && (
        <h3 className="soscenter__no-results">{t("no_results")}</h3>
      )}
    </Block>
  );
};
