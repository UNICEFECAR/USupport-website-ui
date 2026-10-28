import { useQuery } from "@tanstack/react-query";

import { cmsSvc } from "@USupport-components-library/services";

import { toAsset } from "../utils/assets";

/**
 * @param {object} query - see cmsSvc.getHosnAssets
 */
export const useHosnAssets = (query) => {
  return useQuery(
    ["hosn-assets", query],
    async () => {
      const { data } = await cmsSvc.getHosnAssets(query);
      const assets = data.data.map(toAsset);
      // A list of ids is a curated selection - keep its order
      if (!query.ids) return assets;
      return query.ids
        .map((id) => assets.find((asset) => asset.id === id))
        .filter(Boolean);
    },
    { enabled: !query.ids || query.ids.length > 0 }
  );
};

/**
 * @param {string|number} id
 */
export const useHosnAsset = (id) => {
  return useQuery(
    ["hosn-asset", id],
    async () => {
      const { data } = await cmsSvc.getHosnAssetById(id);
      return toAsset(data.data);
    },
    { enabled: !!id, retry: false }
  );
};

const toPlainText = (value) => {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  return value
    .map((block) =>
      (block?.children || []).map((child) => child?.text || "").join("")
    )
    .filter(Boolean)
    .join("\n\n");
};

/**
 * Pillars, offered as the topics in the topic filter and as the categories
 * on the resources overview
 *
 * @param {string} language
 */
export const useHosnPillars = (language) => {
  return useQuery(["hosn-pillars", language], async () => {
    const { data } = await cmsSvc.getHosnPillars(language);
    return data.data.map(({ attributes }) => ({
      value: attributes.key,
      label: attributes.name,
      description: toPlainText(
        attributes.description || attributes.summary || attributes.intro
      ),
    }));
  });
};
