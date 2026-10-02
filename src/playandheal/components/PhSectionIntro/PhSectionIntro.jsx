import React from "react";
import classNames from "classnames";

import "./ph-section-intro.scss";

/**
 * PhSectionIntro
 *
 * Eyebrow, heading and optional description shown at the top of a section
 *
 * @param {string} eyebrow - small uppercase label
 * @param {string} heading - section heading
 * @param {string} description - supporting paragraph
 * @param {string} headingLevel - heading element, h1 or h2
 * @returns {JSX.Element}
 */
export const PhSectionIntro = ({
  eyebrow,
  heading,
  description,
  headingLevel = "h2",
  id,
  classes,
}) => {
  const Heading = headingLevel;

  return (
    <div className={classNames("ph-section-intro", classes)}>
      {eyebrow && <p className="ph-section-intro__eyebrow">{eyebrow}</p>}
      <Heading className="ph-section-intro__heading" id={id}>
        {heading}
      </Heading>
      {description && (
        <p className="ph-section-intro__description">{description}</p>
      )}
    </div>
  );
};
