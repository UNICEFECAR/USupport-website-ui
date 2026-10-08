import { useCallback } from "react";

import { shouldTrackContentView } from "@USupport-components-library/utils";

import { useAddContentEngagement } from "#hooks";

/**
 * usePhTrackView
 *
 * Records a content engagement "view" for a toolkit resource, the same way
 * the main website's ArticleView / VideoView do. Views are deduped per
 * content item for the session window, so reopening a resource does not
 * count again.
 *
 * @returns {function({ id: number|string, type: "article"|"video" }): void}
 */
export const usePhTrackView = () => {
  const addContentEngagementMutation = useAddContentEngagement();

  return useCallback(
    (resource) => {
      if (!resource?.id || !resource?.type) return;
      if (!shouldTrackContentView(resource.type, resource.id)) return;

      addContentEngagementMutation({
        contentId: resource.id,
        contentType: resource.type,
        action: "view",
      });
    },
    [addContentEngagementMutation]
  );
};
