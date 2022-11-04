import React from "react";
import { Page } from "#blocks";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Block, Loading, Markdown } from "@USupport-components-library/src";

import { cmsSvc } from "@USupport-components-library/services";

import "./privacy-policy.scss";

/**
 * PrivacyPolicy
 *
 * Privacy Policy Page
 *
 * @returns {JSX.Element}
 */
export const PrivacyPolicy = () => {
  const { i18n, t } = useTranslation("privacy-policy");

  const countryAlpha2 = "AD"; // TODO: get country code

  const getPolicies = async () => {
    const { data } = await cmsSvc.getPolicies(
      i18n.language,
      countryAlpha2,
      "website"
    );

    let res = null;
    if (data.length > 0) {
      res = data[0].attributes.website;
    }

    return res;
  };

  const {
    data: policiesData,
    isLoading: policiesLoading,
    isFetched: isPoliciesFetched,
  } = useQuery(["policies"], getPolicies);

  return (
    <Page classes="page__privacy-policy">
      <h2 className="page__privacy-policy__heading">{t("heading")}</h2>

      <Block classes="page__privacy-policy__block">
        {policiesData && <Markdown markDownText={policiesData}></Markdown>}
        {!policiesData && policiesLoading && <Loading />}
        {!policiesData && !policiesLoading && isPoliciesFetched && (
          <h3 className="page__privacy-policy__no-results">
            {t("no_results")}
          </h3>
        )}
      </Block>
    </Page>
  );
};
