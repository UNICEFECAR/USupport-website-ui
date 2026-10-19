import { useCallback } from "react";

import { shouldTrackContentView } from "@USupport-components-library/utils";

import { useAddContentEngagement } from "#hooks";

/**
 * Records a content_engagement_event view for a Hosn El Hal asset
 * (content_type hosn_asset). Deduped per asset for the session window.
 *
 * @returns {function(number|string): void}
 */
export const useHosnTrackView = () => {
  const addContentEngagementMutation = useAddContentEngagement();

  return useCallback(
    (assetId) => {
      if (assetId === undefined || assetId === null) return;
      if (!shouldTrackContentView("hosn_asset", assetId)) return;

      addContentEngagementMutation({
        contentId: Number(assetId),
        contentType: "hosn_asset",
        action: "view",
      });
    },
    [addContentEngagementMutation]
  );
};
