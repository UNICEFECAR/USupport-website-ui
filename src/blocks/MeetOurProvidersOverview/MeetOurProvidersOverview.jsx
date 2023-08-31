import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Grid,
  GridItem,
  CardProviderSmall,
  Loading,
  Button,
} from "@USupport-components-library/src";

import { useGetProvidersData } from "#hooks";

import "./meet-our-providers-overview.scss";

/**
 * MeetOurProvidersOverview
 *
 * MeedOurProvidersOverview block
 *
 * @return {jsx}
 */
export const MeetOurProvidersOverview = () => {
  const { t } = useTranslation("meet-our-providers-overview");
  const navigate = useNavigate();

  const providersQuery = useGetProvidersData(true);

  const redirectToDetails = (id) => {
    navigate(`/about-us/provider?id=${id}`);
  };

  return (
    <Block classes="meet-our-providers-overview">
      <Grid classes="meet-our-providers-overview__grid">
        <GridItem md={8} lg={12}>
          <Grid classes="meet-our-providers-overview__content-grid">
            <GridItem md={8} lg={6}>
              <div className="meet-our-providers-overview__content-grid__text-container">
                <h2>{t("heading")}</h2>
                <p className="meet-our-providers-overview__text">{t("text")}</p>
              </div>
            </GridItem>
            <GridItem md={8} lg={6}>
              {providersQuery.isLoading ? (
                <Loading size="lg" />
              ) : (
                providersQuery.data?.pages.flat().map((provider, index) => {
                  const specializations = Array.isArray(
                    provider.specializations
                  )
                    ? provider.specializations.map((x) => t(x)).join(", ")
                    : "";

                  //TODO: remove this condition
                  if (index < 3) {
                    return (
                      <CardProviderSmall
                        providerName={`${provider.name} ${provider.patronym} ${provider.surname}`}
                        description={specializations}
                        image={provider.image}
                        onClick={() =>
                          redirectToDetails(provider.providerDetailId)
                        }
                        classes="meet-our-providers-overview__card"
                        key={index}
                      />
                    );
                  }
                })
              )}
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem
          md={8}
          lg={12}
          classes="meet-our-providers-overview__button-item"
        >
          <Button
            label={t("button_label")}
            size="lg"
            type="secondary"
            onClick={() => navigate("/how-it-works")}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
