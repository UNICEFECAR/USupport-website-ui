import React from "react";
import { SOSCenter as SOSCenterBlock, Question, Page } from "#blocks";
import { useTranslation } from "react-i18next";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = () => {
  const { t } = useTranslation("pages", { keyPrefix: "sos-center-page" });
  return (
    <Page heading={t("heading")}>
      <SOSCenterBlock description={t("subheading")} />
      <Question />
    </Page>
  );
};
