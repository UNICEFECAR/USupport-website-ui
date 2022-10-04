import React from "react";
import { Block } from "/USupport-components-library/src";
import "./find-yourself.scss";

/**
 *
 * @returns {JSX.Element}
 */
export default function FindYourself() {
  return (
    <Block classes={["find-yourself"]}>
      <h3 className="find-yourself__heading">We help you find yourself</h3>
      <p className="text find-yourself__description">
        Do you feel like something is happening to you and you can't pinpoint
        exactly what? We are helping you learn more about the condition you are
        going through and how to deal with it with the help of the free
        resources that the platform provides, as well as with the help of our
        specialists.
      </p>
      <div className="find-yourself__images-container">
        <div className="find-yourself__images-container-single need-help">
          <div className="overlay" />{" "}
          <p className="find-yourself__images-text">I need help</p>
        </div>
        <div className="find-yourself__images-container-single sos-center">
          <div className="overlay" />{" "}
          <p className="find-yourself__images-text">SOS Center</p>
        </div>
      </div>
    </Block>
  );
}
