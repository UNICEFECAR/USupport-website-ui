import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Markdown } from "@USupport-components-library/src";
import {
  HHBackLink,
  HHLoadingRegion,
  HHPageIntro,
  HHSkeleton,
} from "@USupport-components-library/src/hosnelhal";
import { cmsSvc } from "@USupport-components-library/services";

import { HOSN_PROGRAM, USUPPORT_THEME_CLASS } from "../../config";
import { useHosnPath } from "../../hooks/useHosnPath";

import "./legal.scss";

const TITLE_KEYS = {
  "privacy-policy": "privacy_policy",
  "terms-of-use": "terms_of_use",
  "cookie-policy": "cookie_policy",
};

/**
 * Legal
 *
 * Hosn El Hal privacy policy, terms of use or cookie policy from the CMS
 *
 * @param {string} page - "privacy-policy" | "terms-of-use" | "cookie-policy"
 * @returns {JSX.Element}
 */
export const Legal = ({ page }) => {
  const { language } = useParams();
  const { t } = useTranslation("hosnelhal");
  const toPath = useHosnPath();

  const { data, isLoading } = useQuery(["hosn-legal", page, language], async () => {
    const { data } = await cmsSvc.getProgramPolicy(page, language, HOSN_PROGRAM);
    return data;
  });

  return (
    <div className="hh__container hh__stack hosn-legal">
      <HHBackLink to={toPath("")}>{t("common.nav_home")}</HHBackLink>
      <HHPageIntro title={t(`common.${TITLE_KEYS[page]}`)} />
      {isLoading ? (
        <HHLoadingRegion label={t("common.loading")} className="hosn-legal__content">
          <HHSkeleton lines={8} height="1.5rem" />
        </HHLoadingRegion>
      ) : data ? (
        <div className={`hosn-legal__content ${USUPPORT_THEME_CLASS}`}>
          <Markdown markDownText={data} />
        </div>
      ) : (
        <p>{t("legal.no_content")}</p>
      )}
    </div>
  );
};
