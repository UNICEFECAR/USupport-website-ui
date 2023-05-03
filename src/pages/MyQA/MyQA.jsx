import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  FilterQuestions,
  HowItWorksMyQA,
  QuestionDetails,
  RedirectToLogin,
} from "#modals";
import { MascotHeaderMyQA, MyQA as MyQABlock, Page } from "#blocks";
import { useGetQuestions } from "#hooks";
import "./my-qa.scss";

/**
 * MyQA
 *
 * MyQA page
 *
 * @returns {JSX.Element}
 */
export const MyQA = () => {
  const { t } = useTranslation("my-qa-page");

  const [isRedirectToLoginBackdropOpen, setIsRedirectToLoginBackdropOpen] =
    useState(false);
  const [isQuestionDetailsOpen, setIsQuestionDetailsOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isFilterQuestionsOpen, setIsFilterQuestionsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState([]);
  const [tabs, setTabs] = useState([
    { label: "All", value: "all", isSelected: true },
    { label: "Most popular", value: "most_popular", isSelected: false },
    { label: "New", value: "newest", isSelected: false },
  ]);
  const [filterTag, setFilterTag] = useState("");

  const isUserQuestionsEnabled =
    tabs.filter((tab) => tab.value === "your_questions" && tab.isSelected)
      .length > 0;

  const allQuestions = useGetQuestions(
    tabs.find((tab) => tab.isSelected).value,
    !isUserQuestionsEnabled
  );

  useEffect(() => {
    setQuestions(allQuestions.data);
  }, [tabs, allQuestions.data]);

  useEffect(() => {
    if (selectedQuestion)
      setSelectedQuestion(
        questions.find((question) => question.answerId === question.answerId)
      );
  }, [questions]);

  const handleSetIsQuestionDetailsOpen = (question) => {
    setSelectedQuestion(question);
    setIsQuestionDetailsOpen(true);
  };

  return (
    <Page classes="page__my-qa" showGoBackArrow={false}>
      <MascotHeaderMyQA
        handleSeeHowItWorksClick={() => setIsHowItWorksOpen(true)}
        handleHowItWorks={() => setIsHowItWorksOpen(true)}
      />
      <MyQABlock
        handleAskAnonymous={() => setIsCreateQuestionOpen(true)}
        handleReadMore={handleSetIsQuestionDetailsOpen}
        handleScheduleConsultationClick={() =>
          setIsRedirectToLoginBackdropOpen(true)
        }
        questions={questions}
        tabs={tabs}
        setTabs={setTabs}
        isUserQuestionsEnabled={isUserQuestionsEnabled}
        filterTag={filterTag}
        handleFilterTags={() => setIsFilterQuestionsOpen(true)}
      />
      <HowItWorksMyQA
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
      {selectedQuestion && (
        <QuestionDetails
          isOpen={isQuestionDetailsOpen}
          onClose={() => setIsQuestionDetailsOpen(false)}
          question={selectedQuestion}
          handleScheduleClick={() => {
            setIsQuestionDetailsOpen(false);
            setIsRedirectToLoginBackdropOpen(true);
          }}
        />
      )}
      <RedirectToLogin
        heading={t("modal_heading")}
        text={t("modal_text")}
        buttonLabel={t("modal_button_label")}
        isOpen={isRedirectToLoginBackdropOpen}
        onClose={() => setIsRedirectToLoginBackdropOpen(false)}
        handleLoginRedirect={() => {
          window.location.href = "/client/login";
          scrollTop();
        }}
      />
      <FilterQuestions
        isOpen={isFilterQuestionsOpen}
        onClose={() => setIsFilterQuestionsOpen(false)}
        setTag={setFilterTag}
      />
    </Page>
  );
};
