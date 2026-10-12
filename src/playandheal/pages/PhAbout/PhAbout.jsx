import React from "react";
import { useTranslation } from "react-i18next";

import { PhBackLink } from "../../components/PhBackLink/PhBackLink";
import { PhPageBanner } from "../../components/PhPageBanner/PhPageBanner";
import { PhCallout } from "../../components/PhCallout/PhCallout";
import { PhStory } from "../../blocks/PhStory/PhStory";
import { PhCharacters } from "../../blocks/PhCharacters/PhCharacters";
import { PhCoCreation } from "../../blocks/PhCoCreation/PhCoCreation";
import { PhNetworkInvite } from "../../blocks/PhNetworkInvite/PhNetworkInvite";
import { usePhPath } from "../../hooks/usePhPath";

/**
 * PhAbout
 *
 * "Built together." - the story behind Play and Heal
 *
 * @returns {JSX.Element}
 */
export const PhAbout = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "about" });
  const { t: tCommon } = useTranslation("playandheal", { keyPrefix: "common" });
  const { t: tCharacters } = useTranslation("playandheal", {
    keyPrefix: "characters",
  });
  const toPath = usePhPath();

  return (
    <div className="ph__container ph__stack">
      <div className="ph-page-top">
        <PhBackLink to={toPath("")}>{tCommon("back_to_home")}</PhBackLink>
        <PhPageBanner
          tone="lavender"
          icon="people"
          eyebrow={t("banner.eyebrow")}
          heading={t("banner.heading")}
          description={t("banner.text")}
        />
      </div>

      <PhStory
        cta={{
          label: tCommon("explore_booklet"),
          to: toPath("/toolkit/booklet"),
        }}
        caption={tCommon("artwork_caption")}
        artworkAlt={tCommon("artwork_alt")}
      >
        <PhCoCreation />
      </PhStory>

      <PhCharacters
        copyKey="about"
        showDescriptions
        cta={{
          label: tCharacters("about.cta"),
          to: toPath("/toolkit/booklet"),
        }}
      />

      <PhCallout tone="subtle" icon="people" title={t("developed.title")}>
        {t("developed.text")}
      </PhCallout>

      <PhNetworkInvite />
    </div>
  );
};
