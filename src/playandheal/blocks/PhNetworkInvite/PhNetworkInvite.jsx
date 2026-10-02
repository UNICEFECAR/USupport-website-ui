import React from "react";
import { useTranslation } from "react-i18next";

import { PhButton } from "../../components/PhButton/PhButton";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { usePhLayout } from "../../layout/PhLayout/PhLayout";
import { PH_SHOW_WAITLIST } from "../../config";

import "./ph-network-invite.scss";

/**
 * PhNetworkInvite
 *
 * "Play connects children. And us." - invitation to the facilitators
 * network waiting list
 *
 * @returns {JSX.Element}
 */
export const PhNetworkInvite = () => {
  const { t } = useTranslation("playandheal", { keyPrefix: "network_invite" });
  const { openWaitlist } = usePhLayout();

  if (!PH_SHOW_WAITLIST) return null;

  return (
    <section
      className="ph-network-invite"
      aria-labelledby="ph-network-invite-heading"
    >
      <span className="ph-network-invite__icon">
        <PhIcon name="people" size={36} />
      </span>
      <div className="ph-network-invite__content">
        <p className="ph-network-invite__eyebrow">{t("eyebrow")}</p>
        <h2
          className="ph-network-invite__heading"
          id="ph-network-invite-heading"
        >
          {t("heading")}
        </h2>
        <p className="ph-network-invite__text">{t("text")}</p>
      </div>
      <PhButton
        icon="arrow-up-right"
        onClick={openWaitlist}
        classes="ph-network-invite__button"
        aria-haspopup="dialog"
      >
        {t("cta")}
      </PhButton>
    </section>
  );
};
