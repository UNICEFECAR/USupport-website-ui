import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  Grid,
  GridItem,
  Loading,
  Markdown,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useEventListener } from "#hooks";
import { cmsSvc } from "@USupport-components-library/services";

import "./privacy-policy.scss";

/**
 * PrivacyPolicy
 *
 * PrivacyPolicy block
 *
 * @return {jsx}
 */
export const PrivacyPolicy = () => {
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "privacy-policy" });

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Policies ----------------------//
  const getPolicies = async () => {
    const { data } = await cmsSvc.getPolicies(
      i18n.language,
      currentCountry,
      "website"
    );

    return data;
  };

  const {
    data: policiesData,
    isLoading: policiesLoading,
    isFetched: isPoliciesFetched,
  } = useQuery(["policies", currentCountry, i18n.language], getPolicies);

  return (
    <Block classes="privacy-policy">
      <Grid>
        <GridItem xs={4} md={8} lg={12} classes="privacy-policy__heading-item">
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem xs={4} md={8} lg={12} classes="privacy-policy__text-item">
          {policiesData && <Markdown markDownText={policiesData}></Markdown>}
          {!policiesData && policiesLoading && <Loading />}
          {!policiesData && !policiesLoading && isPoliciesFetched && (
            <h3 className="privacy-policy__no-results">{t("no_results")}</h3>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
