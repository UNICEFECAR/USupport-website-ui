import React from "react";

import { PhButton } from "../../components/PhButton/PhButton";

import heroArtwork from "../../assets/hero-artwork.jpg";

import "./ph-story.scss";

/**
 * PhStory
 *
 * Two headed paragraphs, a call to action and the characters artwork
 * with a caption. Used on the How to and About us pages.
 *
 * @param {Array<{heading: string, text: string}>} sections
 * @param {{label: string, to: string}} cta
 * @param {string} caption - artwork caption
 * @param {string} artworkAlt - artwork alt text
 * @returns {JSX.Element}
 */
export const PhStory = ({ sections = [], cta, caption, artworkAlt }) => {
  return (
    <section className="ph-story">
      <div className="ph-story__copy">
        {sections.map((section) => (
          <div key={section.heading} className="ph-story__section">
            <h2 className="ph-story__heading">{section.heading}</h2>
            <p className="ph-story__text">{section.text}</p>
          </div>
        ))}
        {cta && (
          <PhButton to={cta.to} icon="arrow" classes="ph-story__cta">
            {cta.label}
          </PhButton>
        )}
      </div>

      <figure className="ph-story__artwork">
        <img
          src={heroArtwork}
          alt={artworkAlt}
          width="850"
          height="570"
          loading="lazy"
        />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </section>
  );
};
