import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { HHButton, HHIcon } from "@USupport-components-library/src/hosnelhal";

import { ResourceGrid } from "../ResourceGrid/ResourceGrid";
import { HOSN_HOME_FEELINGS } from "../../config";
import { useHosnAssets } from "../../hooks/useHosnAssets";
import { useHosnPath } from "../../hooks/useHosnPath";

import calmIcon from "../../assets/home/feeling-calm-icon.webp";
import energyIcon from "../../assets/home/feeling-energy-icon.webp";
import reconnectIcon from "../../assets/home/feeling-reconnect-icon.webp";
import supportedIcon from "../../assets/home/feeling-supported-icon.webp";

import "./feeling-picker.scss";

const ICONS = {
  calm: calmIcon,
  energy: energyIcon,
  reconnect: reconnectIcon,
  supported: supportedIcon,
};

// The open card is kept in the URL so it survives reloads and can be shared
const PARAM = "feeling";

/**
 * FeelingPicker
 *
 * "How are you feeling today?" cards. Choosing one opens the resources picked
 * for that feeling underneath; choosing it again closes them.
 *
 * @returns {JSX.Element}
 */
export const FeelingPicker = () => {
  const { language } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation("hosnelhal");

  const selected = HOSN_HOME_FEELINGS.find(
    ({ key }) => key === searchParams.get(PARAM)
  );

  const toggle = (key) => {
    const next = new URLSearchParams(searchParams);
    if (selected?.key === key) next.delete(PARAM);
    else next.set(PARAM, key);
    setSearchParams(next, { replace: true });
  };

  return (
    <section className="hosn-feelings" aria-labelledby="hosn-feelings-title">
      <div className="hosn-feelings__intro">
        <h2 className="hosn-feelings__title" id="hosn-feelings-title">
          {t("home.feeling_title")}
        </h2>
        <p className="hosn-feelings__subtitle">{t("home.feeling_subtitle")}</p>
        <p className="hosn-feelings__hint">{t("home.feeling_hint")}</p>
      </div>

      <ul className="hosn-feelings__cards">
        {HOSN_HOME_FEELINGS.map(({ key }) => (
          <li key={key}>
            <button
              type="button"
              className={classNames(
                "hosn-feeling-card",
                `hosn-feeling-card--${key}`,
                { "hosn-feeling-card--selected": selected?.key === key }
              )}
              aria-expanded={selected?.key === key}
              aria-controls="hosn-feelings-resources"
              onClick={() => toggle(key)}
            >
              <img className="hosn-feeling-card__icon" src={ICONS[key]} alt="" />
              <span className="hosn-feeling-card__title">
                {t(`home.feeling_${key}_title`)}
              </span>
              <span className="hosn-feeling-card__text">
                {t(`home.feeling_${key}_text`)}
              </span>
              <span className="hosn-feeling-card__arrow" aria-hidden="true">
                <HHIcon name="chevronEnd" size={18} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div id="hosn-feelings-resources" aria-live="polite">
        {selected && <FeelingResources feeling={selected} language={language} />}
      </div>
    </section>
  );
};

/**
 * The resources picked for one feeling
 *
 * @param {object} feeling - entry of HOSN_HOME_FEELINGS
 * @param {string} language
 */
const FeelingResources = ({ feeling, language }) => {
  const toPath = useHosnPath();
  const { t } = useTranslation("hosnelhal");
  const titleId = `hosn-feeling-${feeling.key}-title`;

  const { data, isLoading, isError } = useHosnAssets({
    locale: language,
    ids: feeling.ids[language] || [],
  });

  return (
    <div className="hosn-feelings__resources">
      <h3 className="hosn-feelings__resources-title" id={titleId}>
        {t(`home.feeling_${feeling.key}_title`)}
      </h3>
      <ResourceGrid
        assets={data}
        isLoading={isLoading}
        isError={isError}
        labelledBy={titleId}
        skeletonCount={feeling.ids[language]?.length || 4}
      />
      {feeling.showSupportLink && (
        <HHButton
          variant="text"
          to={toPath("when-you-need-more-support")}
          className="hosn-feelings__support-link"
        >
          {t("support_note.link")}
        </HHButton>
      )}
    </div>
  );
};
