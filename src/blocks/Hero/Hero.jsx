import React from "react";
import { Block } from "/USupport-components-library/src";
import { StoreButton } from "/USupport-components-library/src";

import MascotOrange from "../../assets/MascotOrange.png";
import "./hero.scss";

/**
 * Hero
 *
 * The Hero block
 *
 * @return {jsx}
 */
export function Hero() {
  return (
    <Block classes={["hero"]}>
      <div className="hero__content">
        <div className="hero__information-container">
          <h3 className="hero__heading">
            Make your mental health <span>a priority!</span>
          </h3>
          <p className="small-text hero__description">
            USupport is the first platform that provides you with personalized
            care for your mental health and personal development and provides
            you with easy access to resources and proven specialists. Start by
            telling your story!
          </p>
          <div className="hero__buttons-container">
            <StoreButton size="lg" store="google-play" />
            <StoreButton size="lg" store="app-store" />
          </div>
        </div>

        <div className="hero__mascot-container">
          <img src={MascotOrange} className="hero__mascot" />
        </div>
      </div>
      <div className="radial-gradient-purple" />
      <div className="radial-gradient-blue" />
    </Block>
  );
}
