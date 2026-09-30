import React, { useState } from "react";

import { PhReaderModal } from "../modals/PhReaderModal/PhReaderModal";
import { PhVideoModal } from "../modals/PhVideoModal/PhVideoModal";

/**
 * useResourceViewer
 *
 * Opens a toolkit resource in the matching modal - PDF reader for articles,
 * video player for videos.
 *
 * @returns {{ openResource: function, viewer: JSX.Element }}
 */
export const useResourceViewer = () => {
  const [activeResource, setActiveResource] = useState(null);

  const close = () => setActiveResource(null);

  const viewer = (
    <>
      <PhReaderModal
        resource={activeResource?.type === "article" ? activeResource : null}
        onClose={close}
      />
      <PhVideoModal
        resource={activeResource?.type === "video" ? activeResource : null}
        onClose={close}
      />
    </>
  );

  return { openResource: setActiveResource, viewer };
};
