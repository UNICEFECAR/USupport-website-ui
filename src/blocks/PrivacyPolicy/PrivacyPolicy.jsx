import React, { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "privacy-policy" });
  const navigate = useNavigate();

  //--------------------- Country Change Event Listener ----------------------//
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("country") || "KZ"
  );

  const country = window.location.hostname.split(".")[0];
  const countries = queryClient.getQueryData(["countries"]);

  const handler = useCallback(() => {
    const newCountry = localStorage.getItem("country");
    if (newCountry) {
      if (newCountry === selectedCountry) return;
      navigate(
        `/privacy-policy/${localStorage.getItem("country").toLowerCase()}`
      );
      setSelectedCountry(localStorage.getItem("country"));
    }
  }, [selectedCountry, navigate]);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Policies ----------------------//
  const { isLoading, data } = useQuery({
    queryKey: [
      "privacy-policy",
      country,
      selectedCountry,
      i18n.language,
      countries,
    ],
    queryFn: async () => {
      const localStorageCountry = localStorage.getItem("country");
      const { data } = await cmsSvc.getPolicies(
        i18n.language,
        localStorageCountry.toLocaleUpperCase(),
        "website"
      );
      return data;
    },
    enabled: !!countries,
  });

  return (
    <Block classes="privacy-policy">
      <Grid>
        <GridItem xs={4} md={8} lg={12} classes="privacy-policy__heading-item">
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem xs={4} md={8} lg={12} classes="privacy-policy__text-item">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {data ? (
                <Markdown markDownText={data}></Markdown>
              ) : (
                <h3 className="privacy-policy__no-results">
                  {t("no_results")}
                </h3>
              )}
            </>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
