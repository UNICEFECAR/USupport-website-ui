import { useSearchParams } from "react-router-dom";

import { HOSN_LENGTHS } from "../config";

export const FILTER_KEYS = ["q", "topic", "format", "length", "lang"];

/**
 * Resource filters, kept in the URL so filtered lists can be shared and the
 * home page search can hand over to the resources page.
 *
 * @returns {{filters: object, setFilters: function, resetFilters: function}}
 */
export const useResourceFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = Object.fromEntries(
    FILTER_KEYS.map((key) => [key, searchParams.get(key) || ""])
  );

  const setFilters = (changes) => {
    const next = { ...filters, ...changes };
    setSearchParams(
      Object.fromEntries(Object.entries(next).filter(([, value]) => value)),
      { replace: true }
    );
  };

  const resetFilters = () => setSearchParams({}, { replace: true });

  return { filters, setFilters, resetFilters };
};

/**
 * @param {object} filters - from useResourceFilters
 * @param {string} language - interface language, used when no language is picked
 * @returns {object} query for cmsSvc.getHosnAssets
 */
export const toAssetQuery = (filters, language) => ({
  locale: filters.lang || language,
  search: filters.q,
  format: filters.format,
  pillar: filters.topic,
  ...(HOSN_LENGTHS[filters.length] || {}),
});

/**
 * @param {object} filters
 * @returns {string} "?q=...&format=..." without empty values
 */
export const toSearchString = (filters) => {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value)
  ).toString();
  return params ? `?${params}` : "";
};
