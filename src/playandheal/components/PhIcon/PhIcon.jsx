import React from "react";
import classNames from "classnames";

// Stroke icons (24px grid) used across the Play and Heal screens
const PATHS = {
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-back": <path d="M19 12H5M11 18l-6-6 6-6" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  play: <path d="M7 4.5v15l12-7.5-12-7.5Z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  heart: (
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.5 3.8 4.5 7 4.5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.2 0 5.3 3 4.2 6.2C19.5 15.4 12 20 12 20Z" />
  ),
  book: (
    <path d="M2.5 5.5c3-1.3 6.2-1.3 9.5 0v14c-3.3-1.3-6.5-1.3-9.5 0v-14ZM21.5 5.5c-3-1.3-6.2-1.3-9.5 0v14c3.3-1.3 6.5-1.3 9.5 0v-14Z" />
  ),
  cards: (
    <>
      <rect x="8" y="3" width="12" height="15" rx="2" />
      <path d="M5 6.5v12A2.5 2.5 0 0 0 7.5 21H16" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5M15.5 4.7a3.5 3.5 0 0 1 0 6.6M18.5 14.2c1.8 1.1 3 3.1 3 5.8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5c2.5 2.7 3.8 6 3.8 9.5s-1.3 6.8-3.8 9.5c-2.5-2.7-3.8-6-3.8-9.5s1.3-6.8 3.8-9.5Z" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  check: <path d="m4.5 12.5 5 5 10-11" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M12 5v14M5 12h14" />,
  download: <path d="M12 3.5v11M7 10l5 5 5-5M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />,
  fullscreen: (
    <path d="M4 9V5.5A1.5 1.5 0 0 1 5.5 4H9M15 4h3.5A1.5 1.5 0 0 1 20 5.5V9M20 15v3.5a1.5 1.5 0 0 1-1.5 1.5H15M9 20H5.5A1.5 1.5 0 0 1 4 18.5V15" />
  ),
  volume: (
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4ZM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  ),
  mute: <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5H4ZM16 9.5l5 5M21 9.5l-5 5" />,
  refresh: (
    <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4.5h-4.5" />
  ),
  shield: (
    <>
      <path d="M12 2.8 4.5 5.5v6c0 4.6 3.1 8.5 7.5 9.8 4.4-1.3 7.5-5.2 7.5-9.8v-6L12 2.8Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  quote: (
    <path d="M9.5 6.5C6.5 7.5 5 9.7 5 13v4.5h5V13H7.5c0-2 .8-3.3 2.5-4l-.5-2.5ZM18.5 6.5c-3 1-4.5 3.2-4.5 6.5v4.5h5V13h-2.5c0-2 .8-3.3 2.5-4l-.5-2.5Z" />
  ),
};

// Icons that indicate reading direction and must be mirrored for RTL
const DIRECTIONAL = ["arrow", "arrow-back", "arrow-up-right"];

/**
 * PhIcon
 *
 * Inline stroke icon for the Play and Heal screens. Inherits the text colour.
 *
 * @param {string} name - icon name
 * @param {number} size - icon size in px
 * @param {string} classes - additional class names
 * @returns {JSX.Element}
 */
export const PhIcon = ({ name, size = 20, classes, filled = false }) => {
  return (
    <svg
      className={classNames(
        "ph-icon",
        DIRECTIONAL.includes(name) && "ph-icon--flip-rtl",
        classes
      )}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
};
