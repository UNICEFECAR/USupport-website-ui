import React from "react";
import { useTranslation } from "react-i18next";

import { PhHero } from "../../blocks/PhHero/PhHero";
import { PhIntroVideo } from "../../blocks/PhIntroVideo/PhIntroVideo";
import { PhToolkit } from "../../blocks/PhToolkit/PhToolkit";
import { PhCharacters } from "../../blocks/PhCharacters/PhCharacters";
import { PhGettingStarted } from "../../blocks/PhGettingStarted/PhGettingStarted";
import { PhStories } from "../../blocks/PhStories/PhStories";
import { PhNetworkInvite } from "../../blocks/PhNetworkInvite/PhNetworkInvite";
import { PhSectionIntro } from "../../components/PhSectionIntro/PhSectionIntro";
import { usePhResources } from "../../hooks/usePhResources";
import { useResourceViewer } from "../../hooks/useResourceViewer";

import "./ph-home.scss";

/**
 * PhHome
 *
 * Play and Heal homepage
 *
 * @returns {JSX.Element}
 */
export const PhHome = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "home" });
  const { all, videos } = usePhResources();
  const { openResource, viewer } = useResourceViewer();

  return (
    <div className="ph-home">
      <div className="ph-home__hero">
        <PhHero />
      </div>
      <div className="ph__container ph__stack">
        <PhIntroVideo videos={videos} />
        <PhToolkit resources={all} onOpenResource={openResource} />
        <PhCharacters copyKey="home" />
        <section
          className="ph-home__power-of-play"
          aria-labelledby="ph-power-of-play-heading"
        >
          <PhSectionIntro
            id="ph-power-of-play-heading"
            heading={t("power_of_play.heading")}
            description={t("power_of_play.text")}
          />
        </section>
        <PhGettingStarted />
        <PhStories />
        <PhNetworkInvite />
      </div>
      {viewer}
    </div>
  );
};
