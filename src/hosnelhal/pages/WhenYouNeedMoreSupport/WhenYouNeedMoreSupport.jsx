import React from "react";
import { useTranslation } from "react-i18next";

import { HHPageIntro } from "@USupport-components-library/src/hosnelhal";

import { SupportNote } from "../../blocks/SupportNote/SupportNote";

import "./when-you-need-more-support.scss";

/**
 * WhenYouNeedMoreSupport
 *
 * Short page with guidance on seeking additional support
 *
 * @returns {JSX.Element}
 */
export const WhenYouNeedMoreSupport = () => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "support_note" });

  return (
    <div className="hh__container hh__stack hosn-more-support">
      <HHPageIntro eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />
      <SupportNote idPrefix="hosn-more-support" />
    </div>
  );
};
