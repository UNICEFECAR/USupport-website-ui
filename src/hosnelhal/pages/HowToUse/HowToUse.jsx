import React from "react";
import { useTranslation } from "react-i18next";

import {
  HHButton,
  HHInfoCard,
  HHPageIntro,
  HHPanel,
} from "@USupport-components-library/src/hosnelhal";

import { UsageGuidance } from "../../blocks/UsageGuidance/UsageGuidance";
import { useHosnPath } from "../../hooks/useHosnPath";

import "./how-to-use.scss";

const STEPS = [
  { key: "find", marker: "1" },
  { key: "open", marker: "2" },
  { key: "download", marker: "3" },
];

/**
 * HowToUse
 *
 * Ways to use the hub, how to find and use resources, and using them in
 * trainings and staff meetings
 *
 * @returns {JSX.Element}
 */
export const HowToUse = () => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "how_to_use" });
  const toPath = useHosnPath();

  return (
    <div className="hh__container hh__stack hosn-how-to-use">
      <HHPageIntro eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} />

      <UsageGuidance />

      <section aria-labelledby="hosn-steps-title">
        <h2 className="hh__visually-hidden" id="hosn-steps-title">
          {t("steps_title")}
        </h2>
        <ol className="hosn-how-to-use__steps">
          {STEPS.map(({ key, marker }) => (
            <li key={key}>
              <HHInfoCard marker={marker} title={t(`step_${key}_title`)}>
                {t(`step_${key}_text`)}
              </HHInfoCard>
            </li>
          ))}
        </ol>
      </section>

      <HHPanel
        className="hosn-how-to-use__practical"
        aria-labelledby="hosn-practical-title"
      >
        <h2 id="hosn-practical-title">{t("practical_title")}</h2>
        <p>{t("practical_text")}</p>
        <HHButton className="hosn-how-to-use__browse" to={toPath("resources")}>
          {t("browse")}
        </HHButton>
      </HHPanel>
    </div>
  );
};
