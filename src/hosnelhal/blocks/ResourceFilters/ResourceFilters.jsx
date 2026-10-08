import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  HHButton,
  HHPanel,
  HHSearchInput,
  HHSelectField,
} from "@USupport-components-library/src/hosnelhal";

import { HOSN_FORMATS, HOSN_LANGUAGES, HOSN_LENGTHS } from "../../config";
import { useHosnPillars } from "../../hooks/useHosnAssets";

import "./resource-filters.scss";

/**
 * ResourceFilters
 *
 * Search field and the topic / format / length / language filters
 *
 * @param {object} filters - see useResourceFilters
 * @param {function} onChange - receives the changed filters
 * @param {function} onReset
 * @returns {JSX.Element}
 */
export const ResourceFilters = ({ filters, onChange, onReset }) => {
  const { language } = useParams();
  const { t } = useTranslation("hosnelhal", { keyPrefix: "filters" });
  const { t: tFormats } = useTranslation("hosnelhal", { keyPrefix: "formats" });
  const { data: pillars = [] } = useHosnPillars(language);

  const currentLanguage = HOSN_LANGUAGES.find((x) => x.value === language);

  const selects = [
    {
      key: "topic",
      options: [{ value: "", label: t("all_topics") }, ...pillars],
    },
    {
      key: "format",
      options: [
        { value: "", label: t("all_formats") },
        ...HOSN_FORMATS.map((format) => ({ value: format, label: tFormats(format) })),
      ],
    },
    {
      key: "length",
      options: [
        { value: "", label: t("any_length") },
        ...Object.keys(HOSN_LENGTHS).map((length) => ({
          value: length,
          label: t(`length_${length}`),
        })),
      ],
    },
    {
      // Resources in the interface language by default
      key: "lang",
      label: t("language"),
      options: [
        { value: "", label: currentLanguage?.name },
        ...HOSN_LANGUAGES.filter((x) => x.value !== language).map((x) => ({
          value: x.value,
          label: x.name,
        })),
        { value: "all", label: t("all_languages") },
      ],
    },
  ];

  return (
    <div className="hosn-resource-filters">
      <HHSearchInput
        value={filters.q}
        label={t("search_label")}
        placeholder={t("search_placeholder")}
        submitLabel={t("search_submit")}
        onSubmit={(q) => onChange({ q })}
      />

      <HHPanel className="hosn-resource-filters__panel" aria-label={t("label")}>
        {selects.map(({ key, label, options }) => (
          <HHSelectField
            key={key}
            id={`hosn-filter-${key}`}
            label={label || t(key)}
            value={filters[key]}
            options={options}
            onChange={(value) => onChange({ [key]: value })}
          />
        ))}
        <HHButton variant="soft" onClick={onReset}>
          {t("reset")}
        </HHButton>
      </HHPanel>
    </div>
  );
};
