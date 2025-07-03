import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Block,
  OrganizationDetails,
  Loading,
} from "@USupport-components-library/src";

import { countriesMap } from "@USupport-components-library/utils";

import { useGetOrganizationById } from "#hooks";

// const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./organization-overview.scss";

const constructShareUrl = (organizationId) => {
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language");
  const countryName = countriesMap[country.toLocaleLowerCase()];
  return `https://${countryName}.usupport.online/${language}/organization-overview/${organizationId}`;
};

/**
 * OrganizationOverview
 *
 * OrganizationOverview block
 *
 * @return {jsx}
 */
export const OrganizationOverview = ({ organizationId }) => {
  const { t } = useTranslation("blocks", {
    keyPrefix: "organization-overview",
  });

  const {
    data: organization,
    isLoading,
    isError,
  } = useGetOrganizationById(organizationId);

  const url = constructShareUrl(organizationId);

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("copy_link_success"));
  };

  return (
    <Block classes="organization-profile">
      {isError ? (
        <h5>{t("error-loading-data")}</h5>
      ) : isLoading ? (
        <Loading size="lg" />
      ) : (
        <OrganizationDetails
          organization={organization}
          t={t}
          handleCopyLink={handleCopyLink}
        />
      )}
    </Block>
  );
};
