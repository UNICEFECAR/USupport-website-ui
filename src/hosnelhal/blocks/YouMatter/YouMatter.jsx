import React from "react";
import { useTranslation } from "react-i18next";

import "./you-matter.scss";

/**
 * YouMatter
 *
 * "You matter, too." message over the hills illustration
 *
 * @returns {JSX.Element}
 */
export const YouMatter = () => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "home" });

  return (
    <section className="hosn-you-matter" aria-labelledby="hosn-you-matter-title">
      <div className="hosn-you-matter__copy">
        <h2 className="hosn-you-matter__title" id="hosn-you-matter-title">
          {t("matter_title")}
        </h2>
        {t("matter_lead", { returnObjects: true }).map((paragraph) => (
          <p key={paragraph} className="hosn-you-matter__lead">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
};
