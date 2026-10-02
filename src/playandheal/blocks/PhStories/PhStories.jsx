import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { getTestimonials } from "../../services/testimonials";

import "./ph-stories.scss";

/**
 * PhStories
 *
 * "Shaped by experience." - horizontally scrolling facilitator stories.
 * Stories are managed in the CMS (PlayAndHealTestimonial). The section is
 * hidden until at least one story is published for the current language.
 *
 * @returns {JSX.Element|null}
 */
export const PhStories = () => {
  const { t, i18n } = useTranslation("playandheal", {
    keyPrefix: "home.stories",
  });
  const trackRef = useRef(null);
  const language = i18n.language || "en";

  const { data: stories = [] } = useQuery(
    ["ph-testimonials", language],
    () => getTestimonials(language),
    { staleTime: 5 * 60 * 1000, retry: 1 }
  );

  if (stories.length === 0) return null;

  const scroll = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector("li");
    const distance = card ? card.offsetWidth + 24 : track.clientWidth;
    const isRtl = getComputedStyle(track).direction === "rtl";

    track.scrollBy({
      left: distance * direction * (isRtl ? -1 : 1),
      behavior: "smooth",
    });
  };

  // Scroll controls are only useful when there are more stories than fit
  const hasControls = stories.length > 1;

  return (
    <section className="ph-stories" aria-labelledby="ph-stories-heading">
      <PhSectionIntro
        id="ph-stories-heading"
        eyebrow={t("eyebrow")}
        heading={t("heading")}
      />

      <ul className="ph-stories__track" ref={trackRef} tabIndex={0}>
        {stories.map((story) => (
          <li key={story.id} className="ph-stories__card">
            <PhIcon name="quote" size={24} filled classes="ph-stories__icon" />
            <blockquote className="ph-stories__quote">{story.quote}</blockquote>
            <p className="ph-stories__author">{story.author}</p>
          </li>
        ))}
      </ul>

      {hasControls && (
        <div className="ph-stories__controls">
          <button
            type="button"
            className="ph-stories__control"
            onClick={() => scroll(-1)}
          >
            <PhIcon name="arrow-back" size={16} />
            <span>{t("previous")}</span>
          </button>
          <button
            type="button"
            className="ph-stories__control"
            onClick={() => scroll(1)}
          >
            <span>{t("next")}</span>
            <PhIcon name="arrow" size={16} />
          </button>
        </div>
      )}
    </section>
  );
};
