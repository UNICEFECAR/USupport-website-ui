import React, { useContext } from "react";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";

import { InputSearch, NewButton } from "@USupport-components-library/src";

import informationPortal from "../../pages/InformationPortal/assets/information-portal.png";
import informationPortalPs from "../../pages/InformationPortal/assets/information-portal-ps.png";
import informationPortalPsDark from "../../pages/InformationPortal/assets/information-portal-ps-dark.png";
import informationPortalMobile from "../../pages/InformationPortal/assets/information-portal-mobile.png";
import informationPortalPsMobile from "../../pages/InformationPortal/assets/information-portal-ps-mobile.png";
import informationPortalPsMobileDark from "../../pages/InformationPortal/assets/information-portal-ps-mobile-dark.png";

import myQaMobile from "../../pages/InformationPortal/assets/my-qa-mobile.jpg";
import myQaDesktop from "../../pages/InformationPortal/assets/my-qa.jpg";

import "./information-portal-hero.scss";

/**
 * InformationPortalHero
 *
 * Reusable hero component for information portal pages (website)
 *
 * @returns {JSX.Element}
 */
export const InformationPortalHero = ({
  showSearch = false,
  searchValue = "",
  onSearchChange,
  placeholder = "Search",
  buttonLabel,
  buttonOnClick,
  heroType = "information-portal",
}) => {
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();

  const IS_PS = localStorage.getItem("country") === "PS";
  const IS_RTL = localStorage.getItem("language") === "ar";
  const isDark = theme === "dark";

  const informationPortalMobileImage = IS_PS
    ? isDark
      ? informationPortalPsMobileDark
      : informationPortalPsMobile
    : informationPortalMobile;

  const informationPortalImage = IS_PS
    ? isDark
      ? informationPortalPsDark
      : informationPortalPs
    : informationPortal;

  const heroImageSrc =
    heroType === "my-qa"
      ? width < 768
        ? myQaMobile
        : myQaDesktop
      : width < 768
        ? informationPortalMobileImage
        : informationPortalImage;

  const altText = heroType === "my-qa" ? "My Q&A" : "Information Portal";

  return (
    <div className="information-portal-hero">
      <img
        src={heroImageSrc}
        alt={altText}
        className={`information-portal-hero__image ${
          width < 768
            ? "information-portal-hero__image--mobile"
            : "information-portal-hero__image--desktop"
        } ${theme !== "dark" ? "information-portal-hero__image--visible" : ""}`}
      />
      {showSearch && (
        <InputSearch
          onChange={onSearchChange}
          value={searchValue}
          classes={`information-portal-hero__input ${
            IS_RTL ? "information-portal-hero__input--rtl" : ""
          }`}
          placeholder={placeholder}
        />
      )}
      {buttonLabel && buttonOnClick && (
        <NewButton
          label={buttonLabel}
          classes="information-portal-hero__button"
          onClick={buttonOnClick}
          type="white"
        />
      )}
    </div>
  );
};
