import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router-dom";
import { Page, ProviderOverview as ProviderOverviewBlock } from "#blocks";
import { useWindowDimensions } from "@USupport-components-library/src/utils";
import { RadialCircle } from "@USupport-components-library/src";

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview page
 *
 * @returns {JSX.Element}
 */
export const ProviderOverview = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("pages", {
    keyPrefix: "provider-overview-page",
  });
  const { width } = useWindowDimensions();
  const providerId = new URLSearchParams(window.location.search).get("id");

  if (!providerId) return <Navigate to="/about-us" />;

  const handleGoBack = () => navigate(-1);
  return (
    <Page
      classes="page__provider-overview"
      heading={t("heading")}
      handleGoBack={handleGoBack}
      showGoBackArrow
    >
      <ProviderOverviewBlock providerId={providerId} />
      {width < 768 && <RadialCircle />}
    </Page>
  );
};
