import React from "react";
import { Block } from "/USupport-components-library/src";
import { StoreButton } from "/USupport-components-library/src";

import MascotOrange from "../../assets/MascotOrange.png";
import "./landing-hero.scss";

export default function LandingHero() {
  return (
    <Block classes={["landing-hero"]}>
      <div className="landing-hero__content">
        <div className="landing-hero__information-container">
          <h3 className="landing-hero__heading">
            Make your mental health <span>a priority!</span>
          </h3>
          <p className="small-text landing-hero__description">
            USupport is the first platform that provides you with personalized
            care for your mental health and personal development and provides
            you with easy access to resources and proven specialists. Start by
            telling your story!
          </p>
          <div className="landing-hero__buttons-container">
            <StoreButton size="lg" store="google-play" />
            <StoreButton size="lg" store="app-store" />
          </div>
        </div>

        <div className="landing-hero__mascot-container">
          <img src={MascotOrange} className="landing-hero__mascot" />
        </div>
      </div>
      <div className="radial-gradient-purple" />
      <div className="radial-gradient-blue" />
    </Block>
  );
}
