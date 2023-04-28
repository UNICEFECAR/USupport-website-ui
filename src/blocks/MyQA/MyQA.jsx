import React from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Tabs,
  Button,
  Answer,
} from "@USupport-components-library/src";

import "./my-qa.scss";

/**
 * MyQA
 *
 * MyQA block
 *
 * @return {jsx}
 */
export const MyQA = ({
  handleAskAnonymous,
  handleReadMore,
  handleScheduleConsultationClick,
  questions,
  tabs,
  setTabs,
  isUserQuestionsEnabled,
}) => {
  const { t } = useTranslation("my-qa");

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

  const renderQuestions = () => {
    return questions.map((question, index) => {
      return (
        <Answer
          question={question}
          key={index}
          classes="my-qa__answer"
          isInYourQuestions={isUserQuestionsEnabled}
          handleReadMore={() => handleReadMore(question)}
          handleScheduleConsultationClick={handleScheduleConsultationClick}
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
            <GridItem md={5} lg={7} classes="my-qa__categories-item">
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
            </GridItem>
            <GridItem md={3} lg={5}>
              <Button
                label={t("ask_button_label")}
                size="md"
                web
                classes="my-qa__ask-question-button"
                onClick={handleScheduleConsultationClick}
              />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem classes="my-qa__questions-item" xs={4} md={8} lg={12}>
          {questions?.length > 0 ? (
            <div className="my-qa__answers-container">{renderQuestions()}</div>
          ) : (
            <p>{t("no_answers")}</p>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
