import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Answer,
  Block,
  Button,
  ButtonWithIcon,
  Grid,
  GridItem,
  InputSearch,
  Tabs,
  Loading,
  Dropdown,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { useEventListener, useGetLanguages } from "#hooks";

import "./my-qa.scss";

/**
 * MyQA
 *
 * MyQA block
 *
 * @return {jsx}
 */
export const MyQA = ({
  handleFilterTags,
  handleReadMore,
  handleScheduleConsultationClick,
  questions,
  tabs,
  setTabs,
  isUserQuestionsEnabled,
  filterTag,
  isLoading,
  selectedLanguage,
  setSelectedLanguage,
  setShouldFetchQuestions,
}) => {
  const { t } = useTranslation("my-qa");
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const { data: languages } = useGetLanguages();

  const handler = useCallback(() => {
    const lang = localStorage.getItem("language");
    const languageId = languages?.find((x) => x.alpha2 === lang)?.language_id;
    setSelectedLanguage(languageId || "all");
  }, [languages]);

  useEventListener("languageChanged", handler);

  useEffect(() => {
    if (languages?.length) {
      const currentLang = localStorage.getItem("language");
      const langObject = languages.find((x) => x.alpha2 === currentLang);
      setSelectedLanguage(langObject?.language_id || "all");
      setShouldFetchQuestions(true);
    }
  }, [languages]);

  const languageOptions = useMemo(() => {
    const showAllOption = {
      value: "all",
      label: t("all_languages"),
    };

    if (!languages) return [showAllOption];

    return [
      showAllOption,
      ...languages.map((x) => ({
        value: x.language_id,
        label: x.local_name,
      })),
    ];
  }, [languages, t]);

  const handleTabChange = (index) => {
    const tabsCopy = [...tabs];

    for (let i = 0; i < tabsCopy.length; i++) {
      if (i === index) {
        tabsCopy[i].isSelected = true;
      } else {
        tabsCopy[i].isSelected = false;
      }
    }
    setTabs(tabsCopy);
  };

  const handleProviderClick = (providerId) => {
    navigate(`/about-us/provider?id=${providerId}`);
  };

  const renderQuestions = () => {
    return questions.map((question, index) => {
      // if (!questions.length) {
      // }

      if (filterTag) {
        const tags = question.tags;
        if (!tags.includes(filterTag)) {
          return null;
        }
      }

      const value = searchValue.toLowerCase();

      if (value) {
        if (
          !question.answerTitle?.toLowerCase().includes(value) &&
          !question.answerText?.toLowerCase().includes(value) &&
          !question.tags?.find((x) => x.toLowerCase().includes(value))
        )
          return null;
      }

      return (
        <Answer
          question={question}
          key={index}
          classes="my-qa__answer"
          isInYourQuestions={isUserQuestionsEnabled}
          handleReadMore={() => handleReadMore(question)}
          handleScheduleConsultationClick={handleScheduleConsultationClick}
          handleProviderClick={handleProviderClick}
          t={t}
          renderIn="website"
        />
      );
    });
  };

  return (
    <Block classes="my-qa">
      <Grid>
        <GridItem xs={4} md={8} lg={12}>
          <Grid classes="my-qa__tabs-grid">
            <GridItem
              md={8}
              lg={12}
              classes="my-qa__tabs-grid__search-container"
            >
              <InputSearch
                placeholder={t("search_placeholder")}
                value={searchValue}
                onChange={(value) => setSearchValue(value.toLowerCase())}
                classes="my-qa__tabs-grid__search-container__input"
              />
              <Dropdown
                options={languageOptions}
                selected={selectedLanguage}
                setSelected={(lang) => {
                  console.log(lang);
                  setSelectedLanguage(lang);
                }}
                placeholder={t("placeholder")}
                classes="my-qa__categories-item__language-dropdown"
              />
            </GridItem>
            <GridItem
              md={8}
              lg={8}
              classes="my-qa__tabs-grid__filter-button-item"
            >
              <Tabs
                options={tabs.map((tab) => {
                  return {
                    label: t(tab.value),
                    value: tab.value,
                    isSelected: tab.isSelected,
                  };
                })}
                handleSelect={handleTabChange}
              />
              <div>
                <ButtonWithIcon
                  label={t("filter")}
                  iconName="filter"
                  iconColor="#ffffff"
                  iconSize="sm"
                  color="purple"
                  size="sm"
                  onClick={handleFilterTags}
                  classes="my-qa__tabs-grid__filter-button"
                />
              </div>
            </GridItem>
            <GridItem md={8} lg={4} classes="my-qa__button-item">
              <Button
                label={t("ask_button_label")}
                size={width < 980 && width > 768 ? "lg" : "lg"}
                classes="my-qa__ask-question-button"
                onClick={handleScheduleConsultationClick}
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem classes="my-qa__questions-item" xs={4} md={8} lg={12}>
          {isLoading ? (
            <Loading />
          ) : questions?.length > 0 ? (
            <div className="my-qa__answers-container">{renderQuestions()}</div>
          ) : (
            <p className="my-qa__questions-item__no-data">{t("no_answers")}</p>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
