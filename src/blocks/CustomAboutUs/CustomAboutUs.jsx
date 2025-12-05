import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useEventListener } from "#hooks";

import { Block, Box, Loading } from "@USupport-components-library/src";
import { Markdown } from "@USupport-components-library/src";
import { cmsSvc } from "@USupport-components-library/services";

import "./custom-about-us.scss";

/**
 * CustomAboutUs
 *
 * CustomAboutUs block
 *
 * @return {jsx}
 */
export const CustomAboutUs = () => {
  const queryClient = useQueryClient();
  const { i18n, t } = useTranslation("blocks", {
    keyPrefix: "custom-about-us",
  });
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("country") || "KZ"
  );

  const country = window.location.hostname.split(".")[0];

  const countries = queryClient.getQueryData(["countries"]);
  const IS_PS = localStorage.getItem("country") === "PS";

  const IS_RTL = localStorage.getItem("language") === "ar";

  const handler = useCallback(() => {
    const newCountry = localStorage.getItem("country");
    if (newCountry) {
      if (newCountry === selectedCountry) return;
      navigate(`/about-us/${localStorage.getItem("country").toLowerCase()}`);
      setSelectedCountry(localStorage.getItem("country"));
    }
  }, []);

  useEventListener("countryChanged", handler);

  const { isLoading, data } = useQuery({
    queryKey: ["about-us", country, selectedCountry, i18n.language, countries],
    queryFn: async () => {
      const localStorageCountry = localStorage.getItem("country");
      const params = {
        country: localStorageCountry.toLocaleUpperCase(),
        language: i18n.language,
      };
      if (IS_PS) {
        params.is_playandheal = true;
      }
      const res = await cmsSvc.getAbousUsContentForCountry(params);
      return res;
    },
    enabled: !!countries,
  });

  return (
    <Block classes={`custom-about-us ${IS_RTL ? "custom-about-us--rtl" : ""}`}>
      {isLoading ? (
        <Loading />
      ) : (
        <Box classes="custom-about-us__box">
          {data ? (
            <Markdown markDownText={data.content}></Markdown>
          ) : (
            <p>{t("no_data_found")}</p>
          )}
        </Box>
      )}
    </Block>
  );
};
