import { useEffect } from "react";

import { syncClarityConsent } from "#services/clarity";

/**
 * Starts or stops Microsoft Clarity from the website cookie choice.
 * Waits until the saved choice has been read, so a returning visitor who
 * already accepted is not treated as a rejection on the first render.
 *
 * @param {boolean} hasAcceptedCookies
 * @param {boolean} isReady - true after localStorage has been read
 */
export const useClarity = (hasAcceptedCookies, isReady) => {
  useEffect(() => {
    if (!isReady) return;
    syncClarityConsent(hasAcceptedCookies);
  }, [hasAcceptedCookies, isReady]);
};

export default useClarity;
