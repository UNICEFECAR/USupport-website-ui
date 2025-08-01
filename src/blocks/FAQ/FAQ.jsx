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
  Animation,
} from "@USupport-components-library/src";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useEventListener } from "#hooks";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import "./faq.scss";

/**
 * FAQ
 *
 * FAQ block
 *
 * @return {jsx}
 */
export const FAQ = ({ showMascot, showLearnMore, showAll = true }) => {
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "faq" });
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

  const fetchFaqIds = !!(currentCountry && currentCountry !== "global");
  const getFAQIds = async () => {
    // Request faq ids from the master DB based for website platform
    const faqIds = await adminSvc.getFAQs("website");

    return faqIds;
  };

  const faqIdsQuery = useQuery(
    ["faqIds", currentCountry, fetchFaqIds],
    getFAQIds,
    {
      enabled: fetchFaqIds,
    }
  );

  const getFAQs = async () => {
    const faqs = [];
    let data;
    if (fetchFaqIds) {
      const { data: faqsData } = await cmsSvc.getFAQs({
        locale: i18n.language,
        ids: faqIdsQuery.data,
      });
      data = faqsData;
    } else {
      const { data: faqsData } = await cmsSvc.getGlobalFAQs({
        locale: i18n.language,
      });
      data = faqsData;
    }

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
  } = useQuery(
    ["FAQs", faqIdsQuery.data, i18n.language, currentCountry, fetchFaqIds],
    getFAQs,
    {
      // Run the query when the getCategories and getAgeGroups queries have finished running
      // Dont the query if the country is global
      enabled: fetchFaqIds
        ? !faqIdsQuery.isLoading && faqIdsQuery.data?.length > 0
        : true,
    }
  );

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
                  {FAQsData && (
                    <CollapsibleFAQ
                      data={showAll ? FAQsData : FAQsData.slice(0, 5)}
                    />
                  )}
                  {faqIdsQuery.data?.length > 0 && !FAQsData && FAQsLoading && (
                    <Loading />
                  )}
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
                        navigateTo(`/${localStorage.getItem(
                          "language"
                        )}/how-it-works
                          `);
                      }}
                    />
                  </GridItem>
                )}
              </Grid>
            </GridItem>
            {showMascot && (
              <GridItem md={2} lg={6} classes="faq__mascot-item">
                <Animation name="MascotBlueConfused" />
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

  /**
   * Should show all FAQ's
   */
  showAll: PropTypes.bool,
};

FAQ.defaultProps = {
  questions: [],
  showMascot: false,
  showLearnMore: false,
};
