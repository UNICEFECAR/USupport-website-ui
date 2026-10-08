import { useQuery } from "@tanstack/react-query";

import { cmsSvc } from "@USupport-components-library/services";

import { toAsset } from "../utils/assets";

/**
 * @param {object} query - see cmsSvc.getHosnAssets
 */
export const useHosnAssets = (query) => {
  return useQuery(["hosn-assets", query], async () => {
    const { data } = await cmsSvc.getHosnAssets(query);
    return data.data.map(toAsset);
  });
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

/**
 * Pillars, offered as the topics in the topic filter
 *
 * @param {string} language
 */
export const useHosnPillars = (language) => {
  return useQuery(["hosn-pillars", language], async () => {
    const { data } = await cmsSvc.getHosnPillars(language);
    return data.data.map(({ attributes }) => ({
      value: attributes.key,
      label: attributes.name,
    }));
  });
};
