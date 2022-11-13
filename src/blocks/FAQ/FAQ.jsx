import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Block,
  Grid,
  GridItem,
  CollapsibleFAQ,
  Button,
  Loading,
} from "@USupport-components-library/src";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getFilteredData } from "@USupport-components-library/utils";

import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import "./faq.scss";

import { mascotConfusedBlue } from "@USupport-components-library/assets";

/**
 * FAQ
 *
 * FAQ block
 *
 * @return {jsx}
 */
export const FAQ = ({ showMascot, showLearnMore }) => {
  const { i18n, t } = useTranslation("faq");
  const navigateTo = useNavigate();

  const getFAQs = async () => {
    // Request faq ids from the master DB based for website platform
    const faqIds = await adminSvc.getFAQs("website");

    let { data } = await cmsSvc.getFAQs("all", true, faqIds);

    data = getFilteredData(data, i18n.language);

    const faqs = [];
    data.forEach((faq) => {
      faqs.push({
        question: faq.attributes.question,
        answer: faq.attributes.answer,
      });
    });
    return faqs;
  };

  const {
    data: FAQsData,
    isLoading: FAQsLoading,
    isFetched: isFAQsFetched,
  } = useQuery(["FAQs", i18n.language], getFAQs);

  return (
    <Block classes="faq" animation="fade-right">
      <Grid>
        <GridItem md={8} lg={12}>
          <h2>{t("heading")}</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="faq__content-item">
          <Grid>
            <GridItem md={showMascot ? 6 : 8} lg={showMascot ? 6 : 12}>
              <Grid>
                <GridItem md={8} lg={12}>
                  {FAQsData && <CollapsibleFAQ data={FAQsData} />}
                  {!FAQsData && FAQsLoading && <Loading />}
                  {!FAQsData?.length && !FAQsLoading && isFAQsFetched && (
                    <h3 className="page__faq__no-results">{t("no_results")}</h3>
                  )}
                </GridItem>
                {showLearnMore && (
                  <GridItem md={8} lg={12} classes="faq__button-item">
                    <Button
                      size="lg"
                      type="secondary"
                      label={t("button")}
                      onClick={() => {
                        navigateTo("/about-us");
                      }}
                    />
                  </GridItem>
                )}
              </Grid>
            </GridItem>
            {showMascot && (
              <GridItem md={2} lg={6} classes="faq__mascot-item">
                <img src={mascotConfusedBlue} />
              </GridItem>
            )}
          </Grid>
        </GridItem>
      </Grid>
    </Block>
  );
};

FAQ.propTypes = {
  /**
   * Show mascot
   * */
  showMascot: PropTypes.bool,

  /**
   * Show learn more button
   * */
  showLearnMore: PropTypes.bool,
};

FAQ.defaultProps = {
  questions: [],
  showMascot: false,
  showLearnMore: false,
};
