import React, { useState, useCallback, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Block,
  Button,
  Grid,
  GridItem,
  EmergencyCenter,
  Loading,
} from "@USupport-components-library/src";
import {
  cmsSvc,
  adminSvc,
  clientSvc,
} from "@USupport-components-library/services";

import { useEventListener, useCustomNavigate as useNavigate } from "#hooks";

import "./sos-center.scss";

/**
 * SOSCenter
 *
 * The SOSCenter block
 *
 * @return {jsx}
 */
export const SOSCenter = () => {
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "sos-center" });
  const navigate = useNavigate();

  const IS_RO = localStorage.getItem("country") === "RO";

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  //--------------------- SOS Centers ----------------------//

  const getSOSCenterIds = async () => {
    // Request faq ids from the master DB based for website platform
    const sosCenterIds = await adminSvc.getSOSCenters();

    return sosCenterIds;
  };

  const sosCenterIdsQuerry = useQuery(
    ["sosCenterIds", currentCountry, shouldFetchIds],
    getSOSCenterIds,
    {
      enabled: shouldFetchIds,
    }
  );

  const getOrganizationSpecializations = async () => {
    const { data } = await clientSvc.getOrganizationSpecializations();
    return data;
  };

  const { data: specializationsData } = useQuery(
    ["organizationSpecializations", currentCountry],
    getOrganizationSpecializations,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const emergencyServiceSpecialization = specializationsData?.find(
    (specialization) => specialization.name === "emergency_situations"
  );

  const getSOSCenters = async () => {
    let queryParams = {
      locale: i18n.language,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = sosCenterIdsQuerry.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    let { data } = await cmsSvc.getSOSCenters(queryParams);

    const sosCenters = data.data;

    return sosCenters;
  };

  const {
    data: SOSCentersData,
    isLoading: SOSCentersLoading,
    isFetched: isSOSCentersFetched,
  } = useQuery(
    ["SOSCenters", sosCenterIdsQuerry.data, i18n.language, shouldFetchIds],
    getSOSCenters,
    {
      enabled: shouldFetchIds
        ? !sosCenterIdsQuerry.isLoading && sosCenterIdsQuerry.data?.length > 0
        : true,
    }
  );

  return (
    <Block classes="soscenter" animation="fade-right">
      {SOSCentersData && (
        <Grid classes="soscenter__grid">
          <GridItem xs={4} md={8} lg={12} classes="soscenter__heading-item">
            <h2>{t("heading")}</h2>
          </GridItem>
          <GridItem xs={4} md={8} lg={12} classes="soscenter__text-item">
            <Grid classes="soscenter__secondary-grid" xs={4} md={8} lg={12}>
              {IS_RO && emergencyServiceSpecialization && (
                <GridItem
                  classes="soscenter__secondary-grid__item soscenter__secondary-grid__item--romania-button"
                  md={8}
                  lg={12}
                >
                  <p>{t("other_emergency_services")}</p>
                  <Button
                    color="purple"
                    onClick={() =>
                      navigate(
                        `/organizations?specialisations=[${emergencyServiceSpecialization.id}]`
                      )
                    }
                  >
                    {t("browse")}
                  </Button>
                </GridItem>
              )}
              {SOSCentersData.map((sosCenter, index) => {
                return (
                  <GridItem
                    classes="soscenter__secondary-grid__item"
                    md={4}
                    lg={12}
                    key={index}
                  >
                    <EmergencyCenter
                      title={sosCenter.attributes.title}
                      text={sosCenter.attributes.text}
                      link={sosCenter.attributes.url}
                      phone={sosCenter.attributes.phone}
                      btnLabelLink={t("button_link")}
                      btnLabelCall={t("button_call")}
                      image={
                        sosCenter.attributes.image?.data?.attributes?.formats
                          ?.medium?.url
                      }
                    />
                  </GridItem>
                );
              })}
            </Grid>
          </GridItem>
        </Grid>
      )}
      {sosCenterIdsQuerry.data?.length > 0 &&
        !SOSCentersData &&
        SOSCentersLoading && <Loading />}
      {!SOSCentersData?.length && !SOSCentersLoading && isSOSCentersFetched && (
        <h4 className="soscenter__no-results">{t("no_results")}</h4>
      )}
    </Block>
  );
};
