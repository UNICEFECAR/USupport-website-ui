import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Page, HowItWorks as HowItWorksBlock, Question } from "#blocks";
import {
  CollapsibleFAQ,
  Block,
  Grid,
  GridItem,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import "./how-it-works.scss";

/**
 * HowItWorks
 *
 * How It Works page.
 *
 * @returns {JSX.Element}
 */
export const HowItWorks = () => {
  const { i18n, t } = useTranslation("how-it-works-page");

  const getFAQs = async () => {
    const { data } = await cmsSvc.getFAQs(i18n.language, true);

    return data;
  };

  const {
    data: FAQsData,
    isLoading: FAQsLoading,
    isFetched: isFAQsFetched,
  } = useQuery(["FAQs"], getFAQs);

  return (
    <Page classes="page__how-it-works">
      <HowItWorksBlock />
      <Block animation="fade-right">
        <Grid>
          <GridItem md={8} lg={12}>
            <h2>{t("heading")}</h2>
          </GridItem>
          <GridItem md={8} lg={12} classes="page__how-it-works__faq-item">
            {FAQsData && <CollapsibleFAQ data={FAQsData} />}
            {!FAQsData && FAQsLoading && <Loading />}
            {!FAQsData && !FAQsLoading && isFAQsFetched && (
              <h3 className="page__faq__no-results">{t("no_results")}</h3>
            )}
          </GridItem>
        </Grid>
      </Block>
      <Question />
    </Page>
  );
};
