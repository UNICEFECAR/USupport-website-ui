import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {
  Block,
  Button,
  Grid,
  GridItem,
  Loading,
  CardProviderSmall,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import {
  useGetProvidersData,
  useEventListener,
  useCustomNavigate as useNavigate,
} from "#hooks";

import "./meet-our-providers.scss";

/**
 * MeetOurProviders
 *
 * Meet our providers block
 *
 * @return {jsx}
 */
export const MeetOurProviders = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("blocks", {
    keyPrefix: "meet-our-providers",
  });
  const { width } = useWindowDimensions();
  const { language } = useParams();

  const buttonLabel = useMemo(() => {
    return t("show_more_btn");
  }, [i18n.language, language]);

  const isGlobalOrRomania =
    localStorage.getItem("country") === "global" ||
    localStorage.getItem("country") === "RO";

  const [showContent, setShowContent] = useState(!isGlobalOrRomania);

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");

    const shouldHide = country === "global" || country === "RO";

    setShowContent(!shouldHide);
  });
  console.log("showContent", showContent);
  const providersQuery = useGetProvidersData({
    random: false,
    limit: 3,
    width,
    enabled: showContent,
  });

  const redirectToDetails = (id) => {
    navigate(`/provider?id=${id}`);
  };

  if (!showContent) {
    return null;
  }

  return (
    <Block classes="meet-our-providers" id="meet-our-providers">
      <Grid classes="meet-our-providers__main-grid">
        <GridItem md={8} lg={12}>
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="meet-our-providers__subheading">
          <p className="text">{t("paragraph")}</p>
        </GridItem>

        <GridItem md={8} lg={12} classes="meet-our-providers__providers-item">
          <Grid classes="meet-our-providers__secondary-grid">
            {providersQuery.isLoading ? (
              <GridItem md={8} lg={12}>
                <Loading size="lg" />
              </GridItem>
            ) : (
              providersQuery.data?.pages.flat().map((provider, index) => {
                const specializations = Array.isArray(provider.specializations)
                  ? provider.specializations.map((x) => t(x)).join(", ")
                  : "";

                return (
                  <GridItem md={4} lg={4} key={index}>
                    <CardProviderSmall
                      providerName={`${provider.name} ${provider.patronym} ${provider.surname}`}
                      description={specializations}
                      image={provider.image}
                      onClick={() =>
                        redirectToDetails(provider.providerDetailId)
                      }
                    />
                  </GridItem>
                );
              })
            )}
            {providersQuery.isFetchingNextPage && (
              <GridItem md={8} lg={12}>
                <Loading padding="5rem" />
              </GridItem>
            )}
            {providersQuery.hasNextPage ? (
              <GridItem
                md={8}
                lg={12}
                classes="meet-our-providers__providers-item__load-more"
              >
                <Button
                  onClick={providersQuery.fetchNextPage}
                  size="lg"
                  label={buttonLabel}
                />
              </GridItem>
            ) : null}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
