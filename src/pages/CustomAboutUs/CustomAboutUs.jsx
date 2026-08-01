import React, { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import { Page, CustomAboutUs as CustomAboutUsBlock, ContactUs } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import aboutUsMobile from "../AboutUs/assets/about-us-mobile.png";
import aboutUsLight from "../AboutUs/assets/about-us-light.jpg";
import aboutUsDark from "../AboutUs/assets/about-us.png";

import informationPortalPsMobile from "../InformationPortal/assets/information-portal-ps-mobile.png";
import informationPortalPsMobileDark from "../InformationPortal/assets/information-portal-ps-mobile-dark.png";
import informationPortalPs from "../InformationPortal/assets/information-portal-ps.png";
import informationPortalPsDark from "../InformationPortal/assets/information-portal-ps-dark.png";

import "./custom-about-us.scss";

/**
 * CustomAboutUs
 *
 * Custom About us page
 *
 * @returns {JSX.Element}
 */
export const CustomAboutUs = () => {
  const IS_PS = localStorage.getItem("country") === "PS";
  const [searchParams] = useSearchParams();
  const to = searchParams.get("to");

  const contactFormRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const IS_DARK = theme === "dark";

  useEffect(() => {
    if (to === "contact-us") {
      contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [to]);

  return (
    <Page
      classes={`page__custom-about-us ${
        IS_PS ? "page__custom-about-us--ps" : ""
      } ${IS_DARK ? "page__custom-about-us--ps--dark" : ""}`}
      showBackground={true}
    >
      <div className="page__custom-about-us__hero-image" aria-hidden="true">
        {IS_PS ? (
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={IS_DARK ? informationPortalPsDark : informationPortalPs}
            />
            <img
              src={
                IS_DARK
                  ? informationPortalPsMobileDark
                  : informationPortalPsMobile
              }
              alt=""
            />
          </picture>
        ) : (
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet={IS_DARK ? aboutUsDark : aboutUsLight}
            />
            <img src={aboutUsMobile} alt="" />
          </picture>
        )}
      </div>
      <CustomAboutUsBlock />
      {!IS_PS && (
        <div ref={contactFormRef}>
          <ContactUs />
        </div>
      )}
      <div className="page__about-us__radial-circle">
        <RadialCircle color="blue" />
      </div>
    </Page>
  );
};
