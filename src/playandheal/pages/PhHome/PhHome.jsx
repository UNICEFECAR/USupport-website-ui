import React from "react";

import { PhHero } from "../../blocks/PhHero/PhHero";
import { PhIntroVideo } from "../../blocks/PhIntroVideo/PhIntroVideo";
import { PhToolkit } from "../../blocks/PhToolkit/PhToolkit";
import { PhCharacters } from "../../blocks/PhCharacters/PhCharacters";
import { PhGettingStarted } from "../../blocks/PhGettingStarted/PhGettingStarted";
import { PhStories } from "../../blocks/PhStories/PhStories";
import { PhNetworkInvite } from "../../blocks/PhNetworkInvite/PhNetworkInvite";
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
        <PhGettingStarted />
        <PhStories />
        <PhNetworkInvite />
      </div>
      {viewer}
    </div>
  );
};
