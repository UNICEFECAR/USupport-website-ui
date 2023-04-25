import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Page, MascotHeaderMyQA, MyQA as MyQABlock } from "#blocks";
import { RedirectToLogin, QuestionDetails, HowItWorksMyQA } from "#modals";
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
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questions, setQuestions] = useState([]);
  const [tabs, setTabs] = useState([
    { label: "All", value: "all", isSelected: true },
    { label: "Most popular", value: "most_popular", isSelected: false },
    { label: "New", value: "newest", isSelected: false },
  ]);

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

  const handleLike = (vote, answerId) => {
    const questionsCopy = [...questions];
    const isLike = vote === "like" || vote === "remove-like";

    for (let i = 0; i < questionsCopy.length; i++) {
      if (questionsCopy[i].answerId === answerId) {
        if (isLike) {
          if (questionsCopy[i].isLiked) {
            questionsCopy[i].likes--;
          } else {
            questionsCopy[i].likes++;
          }

          if (questionsCopy[i].isDisliked) {
            questionsCopy[i].dislikes--;
          }
        } else {
          if (questionsCopy[i].isDisliked) {
            questionsCopy[i].dislikes--;
          } else {
            questionsCopy[i].dislikes++;
          }
          if (questionsCopy[i].isLiked) {
            questionsCopy[i].likes--;
          }
        }
        questionsCopy[i].isLiked = questionsCopy[i].isLiked ? false : isLike;
        questionsCopy[i].isDisliked = !isLike
          ? questionsCopy[i].isDisliked
            ? false
            : !isLike
          : !isLike;
      }
    }

    setQuestions(questionsCopy);
    addQuestionMutation.mutate({ vote, answerId });
  };

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
          handleLike={handleLike}
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
      />
    </Page>
  );
};
