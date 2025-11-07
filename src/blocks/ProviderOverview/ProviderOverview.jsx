import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  Loading,
  ProviderDetails,
} from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";
import { useGetProviderData } from "#hooks";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview block
 *
 * @return {jsx}
 */
export const ProviderOverview = ({ providerId }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "provider-overview" });

  const { cookieState, setCookieState } = useContext(ThemeContext);

  const [providerDataQuery] = useGetProviderData(providerId);
  const provider = providerDataQuery.data;
  const image = AMAZON_S3_BUCKET + "/" + (provider?.image || "default");

  return (
    <Block classes="provider-profile">
      {providerDataQuery.isLoading || !provider ? (
        <Loading size="lg" />
      ) : (
        <ProviderDetails
          provider={provider}
          t={t}
          image={image}
          renderIn="website"
          cookieState={cookieState}
          setCookieState={setCookieState}
        />
      )}
    </Block>
  );
};
