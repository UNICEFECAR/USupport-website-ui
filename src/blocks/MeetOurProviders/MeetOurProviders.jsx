import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  Loading,
  CardProviderSmall,
} from "@USupport-components-library/src";
import { useGetProvidersData } from "#hooks";

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
  const { t } = useTranslation("meet-our-providers");

  const providersQuery = useGetProvidersData()[0];

  const redirectToDetails = (id) => {
    navigate(`/provider?id=${id}`);
  };
  return (
    <Block classes="meet-our-providers">
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
              providersQuery.data?.map((provider, index) => {
                return (
                  <GridItem md={4} lg={4} key={index}>
                    <CardProviderSmall
                      providerName={`${provider.name} ${provider.patronym} ${provider.surname}`}
                      description={provider.description}
                      image={provider.image}
                      onClick={() =>
                        redirectToDetails(provider.providerDetailId)
                      }
                    />
                  </GridItem>
                );
              })
            )}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};
