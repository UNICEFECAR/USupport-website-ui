import React, { useContext, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Page, WeHelp, OurPartners, ContactUs, About } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import mobileHero from "../../blocks/Page/assets/mobile-hero.png";
import tabletHero from "../../blocks/Page/assets/tablet-hero.png";
import desktopHero from "../../blocks/Page/assets/hero.png";

import "./about-us.scss";

/**
 * AboutUs
 *
 * About Us page.
 *
 * @returns {JSX.Element}
 */
export const AboutUs = () => {
  const { theme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const to = searchParams.get("to");
  const contactFormRef = useRef(null);

  useEffect(() => {
    if (to === "contact-us") {
      contactFormRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [to]);

  return (
    <Page
      classes={[
        "page__about-us",
        theme === "dark" ? "page__about-us--dark" : "",
      ].join(" ")}
      showBackground={true}
    >
      <div className="page__about-us__hero">
        <div className="page__about-us__hero-image" aria-hidden="true">
          <picture>
            <source media="(min-width: 1050px)" srcSet={desktopHero} />
            <source media="(min-width: 768px)" srcSet={tabletHero} />
            <img src={mobileHero} alt="" />
          </picture>
        </div>
        {/* <About /> */}
      </div>
      <WeHelp />
      <OurPartners />
      <div ref={contactFormRef}>
        <ContactUs />
      </div>
      <div className="page__about-us__radial-circle">
        <RadialCircle color="blue" />
      </div>
    </Page>
  );
};
