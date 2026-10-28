import React from "react";
import { useTranslation } from "react-i18next";

import { HHButton } from "@USupport-components-library/src/hosnelhal";

import { useHosnPath } from "../../hooks/useHosnPath";

import "./new-to-hosn.scss";

/**
 * NewToHosn
 *
 * Invitation to the How to Use page for first-time visitors
 *
 * @returns {JSX.Element}
 */
export const NewToHosn = () => {
  const toPath = useHosnPath();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "home" });

  return (
    <section className="hosn-new-to-hosn" aria-labelledby="hosn-new-title">
      <div className="hosn-new-to-hosn__copy">
        <h2 className="hosn-new-to-hosn__title" id="hosn-new-title">
          {t("new_title")}
        </h2>
        <p className="hosn-new-to-hosn__subtitle">{t("new_subtitle")}</p>
        <p className="hosn-new-to-hosn__text">{t("new_text")}</p>
      </div>
      <HHButton to={toPath("how-to-use")} className="hosn-home__pill">
        {t("new_cta")}
      </HHButton>
    </section>
  );
};
