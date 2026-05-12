import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  CardProviderSmall,
  Loading,
  NewButton,
  CustomCarousel,
} from "@USupport-components-library/src";

import {
  useGetProvidersData,
  useEventListener,
  useCustomNavigate as useNavigate,
} from "#hooks";

import "./meet-our-providers-overview.scss";

/**
 * MeetOurProvidersOverview
 *
 * MeedOurProvidersOverview block
 *
 * @return {jsx}
 */
export const MeetOurProvidersOverview = () => {
  const { t } = useTranslation("blocks", {
    keyPrefix: "meet-our-providers-overview",
  });
  const navigate = useNavigate();
  const localStorageCountry = localStorage.getItem("country");
  const [isInGlobalCountry, setIsInGlobalCountry] = useState(
    localStorageCountry === "global" || !localStorageCountry,
  );

  useEventListener("countryChanged", () => {
    const country = localStorage.getItem("country");

    setIsInGlobalCountry(country === "global");
  });

  const providersQuery = useGetProvidersData({
    random: true,
    isInGlobalCountry,
  });

  const redirectToDetails = (id) => {
    navigate(`/provider-overview?id=${id}`);
  };

  const providers =
    providersQuery.data && Array.isArray(providersQuery.data.pages)
      ? providersQuery.data.pages.flat()
      : [];

  const responsiveItems = {
    desktop: { breakpoint: { max: 5000, min: 1366 }, items: 3 },
    smallLaptop: { breakpoint: { max: 1366, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
  };

  return (
    <Block classes="meet-our-providers-overview">
      <Grid classes="meet-our-providers-overview__grid">
        <GridItem md={8} lg={12}>
          <Grid classes="meet-our-providers-overview__content-grid">
            <GridItem md={8} lg={12}>
              <div className="meet-our-providers-overview__content-grid__text-container">
                <h2 className="meet-our-providers-overview__heading">
                  {t("heading")}
                </h2>
                <p className="meet-our-providers-overview__text">{t("text")}</p>
              </div>
            </GridItem>
            <GridItem md={8} lg={12}>
              {providersQuery.isLoading ? (
                <Loading size="lg" />
              ) : (
                <CustomCarousel
                  classes="meet-our-providers-overview__carousel"
                  autoPlay={true}
                  breakpointItems={responsiveItems}
                >
                  {providers.map((provider, index) => {
                    const specializations = Array.isArray(
                      provider.specializations,
                    )
                      ? provider.specializations.map((x) => t(x)).join(", ")
                      : "";

                    return (
                      <div
                        key={provider.providerDetailId || index}
                        className="meet-our-providers-overview__slide"
                      >
                        <CardProviderSmall
                          providerName={`${provider.name} ${provider.patronym} ${provider.surname}`}
                          description={specializations}
                          image={provider.image}
                          onClick={() =>
                            redirectToDetails(provider.providerDetailId)
                          }
                          classes="meet-our-providers-overview__card"
                        />
                      </div>
                    );
                  })}
                </CustomCarousel>
              )}
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem
          md={8}
          lg={12}
          classes="meet-our-providers-overview__button-item"
        >
          <NewButton
            label={t("button_label")}
            size="lg"
            isFullWidth={true}
            onClick={() => navigate("/how-it-works?to=providers")}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
