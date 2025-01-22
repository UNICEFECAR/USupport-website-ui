import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

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
  const { i18n, t } = useTranslation("custom-about-us");
  const { country } = useParams();
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("country") || "KZ"
  );

  const handler = useCallback(() => {
    setSelectedCountry(localStorage.getItem("country"));
  }, []);
  useEventListener("countryChanged", handler);

  const { isLoading, data } = useQuery({
    queryKey: ["about-us", country, i18n.language],
    queryFn: async () => {
      const res = await cmsSvc.getAbousUsContentForCountry({
        country: country.toLocaleUpperCase(),
        language: i18n.language,
      });
      return res;
    },
  });
  return (
    <Block classes="custom-about-us">
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
