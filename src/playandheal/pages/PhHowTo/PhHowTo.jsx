import React from "react";
import { useTranslation } from "react-i18next";

import { PhBackLink } from "../../components/PhBackLink/PhBackLink";
import { PhPageBanner } from "../../components/PhPageBanner/PhPageBanner";
import { PhCallout } from "../../components/PhCallout/PhCallout";
import { PhStory } from "../../blocks/PhStory/PhStory";
import { PhGuidance } from "../../blocks/PhGuidance/PhGuidance";
import { PhFaq } from "../../blocks/PhFaq/PhFaq";
import { PhNetworkInvite } from "../../blocks/PhNetworkInvite/PhNetworkInvite";
import { usePhPath } from "../../hooks/usePhPath";

/**
 * PhHowTo
 *
 * "Make the toolkit your own." - how to use the Play and Heal toolkit
 *
 * @returns {JSX.Element}
 */
export const PhHowTo = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "how_to" });
  const { t: tCommon } = useTranslation("playandheal", { keyPrefix: "common" });
  const toPath = usePhPath();

  return (
    <div className="ph__container ph__stack">
      <div className="ph-page-top">
        <PhBackLink to={toPath("")}>{tCommon("back_to_home")}</PhBackLink>
        <PhPageBanner
          tone="lavender"
          icon="book"
          eyebrow={t("banner.eyebrow")}
          heading={t("banner.heading")}
          description={t("banner.text")}
        />
      </div>

      <PhStory
        sections={[
          { heading: t("story.heading_1"), text: t("story.text_1") },
          { heading: t("story.heading_2"), text: t("story.text_2") },
        ]}
        cta={{
          label: tCommon("explore_booklet"),
          to: toPath("/toolkit/booklet"),
        }}
        caption={tCommon("artwork_caption")}
        artworkAlt={tCommon("artwork_alt")}
      />

      <PhCallout tone="mint" icon="shield" title={t("safeguarding.title")}>
        {t("safeguarding.text")}
      </PhCallout>

      <PhGuidance />
      <PhFaq />
      <PhNetworkInvite />
    </div>
  );
};
