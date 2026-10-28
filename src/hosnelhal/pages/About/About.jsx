import React from "react";
import { useTranslation } from "react-i18next";

import { HHButton } from "@USupport-components-library/src/hosnelhal";

import { SupportNote } from "../../blocks/SupportNote/SupportNote";
import { HOSN_CONTACT_EMAILS, HOSN_PARTNERS } from "../../config";
import { useHosnPath } from "../../hooks/useHosnPath";

import illustration from "../../assets/about-illustration.png";
import palette from "../../assets/about/palette.webp";
import logoRound from "../../assets/about/logo-mark-round.webp";
import logoTiles from "../../assets/about/logo-mark-tiles.webp";

import "./about.scss";

// Sections in page order; each one is a jump link under the intro
const SECTIONS = ["why", "how", "different", "design", "support"];

const sectionId = (key) => `about-${key}`;

// Small marks for the "What makes Hosn el Hal different" cards
const DIFFERENT_ICONS = [
  <path key="plus" d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  <path key="leaf" d="M18 6c-7 0-12 4-12 10v2h2c6 0 10-5 10-12z" fill="currentColor" />,
  <circle key="dot" cx="12" cy="12" r="4.5" fill="currentColor" />,
  <g key="dots">
    <circle cx="9" cy="10" r="3.5" fill="currentColor" />
    <circle cx="15.5" cy="15" r="3.5" fill="var(--hh-color-warm-link)" />
  </g>,
];

/**
 * Section heading: small terracotta label over the title
 */
const SectionHeading = ({ id, eyebrow, title }) => (
  <div className="hosn-about__heading">
    <p className="hosn-about__eyebrow">{eyebrow}</p>
    <h2 id={id}>{title}</h2>
  </div>
);

/**
 * About
 *
 * Why Hosn el Hal exists, how it was made, what makes it different, the
 * design behind it, and where to go when more support is needed
 *
 * @returns {JSX.Element}
 */
export const About = () => {
  const { t } = useTranslation("hosnelhal", { keyPrefix: "about" });
  const toPath = useHosnPath();
  const list = (key) => t(key, { returnObjects: true });

  return (
    <div className="hh__container hh__stack hosn-about">
      <header className="hosn-about__intro">
        <p className="hosn-about__intro-eyebrow">{t("eyebrow")}</p>
        <h1>{t("title")}</h1>
        <p className="hosn-about__name">
          <span lang="ar" dir="rtl">
            {t("name_word")}
          </span>
          <span>{t("name_text")}</span>
        </p>
        <p className="hosn-about__lead">{t("lead")}</p>
      </header>

      <nav className="hosn-about__nav" aria-label={t("nav_label")}>
        <ul>
          {SECTIONS.map((key) => (
            <li key={key}>
              <a href={`#${sectionId(key)}`}>{t(`nav.${key}`)}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section
        className="hosn-about__section hosn-about__why"
        id={sectionId("why")}
        aria-labelledby="about-why-title"
      >
        <SectionHeading
          id="about-why-title"
          eyebrow={t("why.eyebrow")}
          title={t("why.title")}
        />
        <div className="hosn-about__why-layout">
          <div className="hosn-about__body">
            {list("why.body").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="hosn-about__aside" aria-labelledby="about-why-aside">
            <h3 id="about-why-aside">{t("why.aside_title")}</h3>
            <ul>
              {list("why.aside_items").map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section
        className="hosn-about__section"
        id={sectionId("how")}
        aria-labelledby="about-how-title"
      >
        <SectionHeading
          id="about-how-title"
          eyebrow={t("how.eyebrow")}
          title={t("how.title")}
        />
        <div className="hosn-about__body hosn-about__body--wide">
          {list("how.body").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="hosn-about__partners">
          <h3>{t("how.partners_label")}</h3>
          <ul>
            {HOSN_PARTNERS.map(({ key, logo }) => (
              <li key={key} className={logo ? "hosn-about__partner-logo" : undefined}>
                {logo ? (
                  <img src={logo} alt={t(`how.partners.${key}`)} />
                ) : (
                  t(`how.partners.${key}`)
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="hosn-about__credits">
          {t("how.team_title") && <h3>{t("how.team_title")}</h3>}
          <dl>
            {list("how.team").map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div>
              <dt>{t("how.contact_label")}</dt>
              <dd className="hosn-about__emails">
                {HOSN_CONTACT_EMAILS.map((email) => (
                  <a key={email} href={`mailto:${email}`} dir="ltr">
                    {email}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
          <p className="hosn-about__thanks">{t("how.thanks")}</p>
        </div>
      </section>

      <section
        className="hosn-about__section"
        id={sectionId("different")}
        aria-labelledby="about-different-title"
      >
        <SectionHeading
          id="about-different-title"
          eyebrow={t("different.eyebrow")}
          title={t("different.title")}
        />
        <ul className="hosn-about__cards">
          {list("different.items").map(({ title, text }, index) => (
            <li key={title} className="hosn-about__card">
              <span className="hosn-about__card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  {DIFFERENT_ICONS[index]}
                </svg>
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="hosn-about__section"
        id={sectionId("design")}
        aria-labelledby="about-design-title"
      >
        <SectionHeading
          id="about-design-title"
          eyebrow={t("design.eyebrow")}
          title={t("design.title")}
        />

        <div className="hosn-about__design-card">
          <div className="hosn-about__design-copy">
            <p className="hosn-about__design-label">{t("design.theme_label")}</p>
            <h3 className="hosn-about__theme-name">{t("design.theme_name")}</h3>
            <p className="hosn-about__theme-tagline">{t("design.theme_tagline")}</p>
            {list("design.theme_body").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <figure className="hosn-about__palette">
            {t("design.palette_label") && (
              <figcaption>{t("design.palette_label")}</figcaption>
            )}
            <img src={palette} alt={t("design.palette_alt")} loading="lazy" />
          </figure>
        </div>

        <div className="hosn-about__design-card">
          <div className="hosn-about__design-copy">
            <h3>{t("design.logo_title")}</h3>
            {list("design.logo_body").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="hosn-about__logos">
            <img src={logoTiles} alt={t("design.logo_alt")} loading="lazy" />
            <img src={logoRound} alt="" loading="lazy" />
          </div>
        </div>
      </section>

      <section className="hosn-about__hub" aria-labelledby="about-hub-title">
        <img className="hosn-about__illustration" src={illustration} alt="" />
        <div>
          <h2 id="about-hub-title">{t("hub.title")}</h2>
          <p>{t("hub.text")}</p>
          <p className="hosn-about__hub-closing">{t("hub.closing")}</p>
        </div>
      </section>

      <div className="hosn-about__section" id={sectionId("support")}>
        <SupportNote idPrefix="hosn-about-support" showIcon />
      </div>

      <HHButton className="hosn-about__explore" to={toPath("resources")}>
        {t("explore")}
      </HHButton>
    </div>
  );
};
