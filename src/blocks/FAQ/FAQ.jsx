import React, { useState, useCallback } from "react";
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
import { useEventListener } from "@USupport-components-library/hooks";
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

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- FAQs ----------------------//

  const getFAQIds = async () => {
    // Request faq ids from the master DB based for website platform
    const faqIds = await adminSvc.getFAQs("website");

    return faqIds;
  };

  const faqIdsQuerry = useQuery(["faqIds", currentCountry], getFAQIds);

  const getFAQs = async () => {
    // Request faq ids from the master DB based for website platform
    const faqIds = await adminSvc.getFAQs("website");

    const faqs = [];

    let { data } = await cmsSvc.getFAQs({
      locale: i18n.language,
      ids: faqIdsQuerry.data,
    });

    data.data.forEach((faq) => {
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
  } = useQuery(["FAQs", faqIdsQuerry.data, i18n.language], getFAQs, {
    // Run the query when the getCategories and getAgeGroups queries have finished running
    enabled: !faqIdsQuerry.isLoading && faqIdsQuerry.data?.length > 0,
  });

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
                  {faqIdsQuerry.data?.length > 0 &&
                    !FAQsData &&
                    FAQsLoading && <Loading />}
                  {(!FAQsData?.length && !FAQsLoading && isFAQsFetched) ||
                    (faqIdsQuerry.data?.length === 0 && (
                      <h3 className="page__faq__no-results">
                        {t("no_results")}
                      </h3>
                    ))}
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
