import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  FilterQuestions,
  HowItWorksMyQA,
  QuestionDetails,
  RedirectToLogin,
} from "#modals";
import { MascotHeaderMyQA, MyQA as MyQABlock, Page } from "#blocks";
import { useGetQuestions, useEventListener } from "#hooks";
import "./my-qa.scss";

const getTextAndTitle = (language) => {
  switch (language) {
    case "en":
      return {
        title: "How does the My Q&A work?",
        text: "The My Q&A is a feature that allows you to ask questions and receive answers from the uSupport providers.",
      };
    case "kk":
      return {
        title: "Менің Q&A қалай жұмыс істейді?",
        text: "Менің Q&A - бұл uSupport провайдерлерінен сұрақ қоюға және жауап алуға мүмкіндік беретін функция.",
      };
    case "pl":
      return {
        title: "Jak działa Moje Q&A?",
        text: "Moje Q&A to funkcja, która pozwala zadawać pytania i otrzymywać odpowiedzi od dostawców uSupport.",
      };
    case "ru":
      return {
        title: "Как работает Мой Q&A?",
        text: "Мой Q&A - это функция, которая позволяет задавать вопросы и получать ответы от поставщиков uSupport.",
      };
    case "uk":
      return {
        title: "Як працює My Q&A?",
        text: "My Q&A - це функція, яка дозволяє ставити запитання та отримувати відповіді від постачальників uSupport.",
      };
    default:
      return {
        title: "How does the My Q&A work?",
        text: "The My Q&A is a feature that allows you to ask questions and receive answers from the uSupport providers.",
      };
  }
};

/**
 * MyQA
 *
 * MyQA page
 *
 * @returns {JSX.Element}
 */
export const MyQA = () => {
  const { t } = useTranslation("pages", { keyPrefix: "my-qa-page" });
  const navigate = useNavigate();

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
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [shouldFetchQuestions, setShouldFetchQuestions] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem("country")
  );
  const isInGlobalCountry = selectedCountry === "global";

  const staticQuestion = {
    answerCreatedAt: "2023-10-01T12:00:00Z",
    answerId: 1,
    dislikes: 0,
    isDisliked: false,
    isLiked: false,
    likes: 10,
    providerData: { name: "uSupport Provider", image: "default" },
    providerDetailId: 1,
    question: "What is the question?",
    questionCreatedAt: "2023-10-01T12:00:00Z",
    questionId: 1,
  };

  useEventListener("countryChanged", (e) => {
    setSelectedCountry(e.detail);
  });

  const isUserQuestionsEnabled =
    tabs.filter((tab) => tab.value === "your_questions" && tab.isSelected)
      .length > 0 &&
    shouldFetchQuestions &&
    !!selectedLanguage;

  const allQuestions = useGetQuestions(
    tabs.find((tab) => tab.isSelected).value,
    isInGlobalCountry ? false : !isUserQuestionsEnabled,
    selectedLanguage
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

  const handleProviderClick = (providerId) => {
    navigate(
      `/${localStorage.getItem("language")}/about-us/provider?id=${providerId}`
    );
  };

  return (
    <Page classes="page__my-qa" showGoBackArrow={false}>
      <MascotHeaderMyQA
        handleSeeHowItWorksClick={() => setIsHowItWorksOpen(true)}
        handleHowItWorks={() => setIsHowItWorksOpen(true)}
      />
      <MyQABlock
        // handleAskAnonymous={() => setIsCreateQuestionOpen(true)}
        handleReadMore={handleSetIsQuestionDetailsOpen}
        handleScheduleConsultationClick={() =>
          setIsRedirectToLoginBackdropOpen(true)
        }
        questions={
          isInGlobalCountry
            ? [
                {
                  ...staticQuestion,
                  answerText: getTextAndTitle(selectedLanguage).text,
                  answerTitle: getTextAndTitle(selectedLanguage).title,
                },
              ]
            : questions
        }
        tabs={tabs}
        setTabs={setTabs}
        isUserQuestionsEnabled={isUserQuestionsEnabled}
        filterTag={filterTag}
        handleFilterTags={() => setIsFilterQuestionsOpen(true)}
        isLoading={allQuestions.isFetching}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setShouldFetchQuestions={setShouldFetchQuestions}
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
          handleProviderClick={handleProviderClick}
        />
      )}
      <RedirectToLogin
        heading={t("modal_heading")}
        text={t("modal_text")}
        buttonLabel={t("modal_button_label")}
        isOpen={isRedirectToLoginBackdropOpen}
        onClose={() => setIsRedirectToLoginBackdropOpen(false)}
        handleLoginRedirect={() => {
          window.location.href = `/client/${localStorage.getItem(
            "language"
          )}/login`;
        }}
      />
      <FilterQuestions
        isOpen={isFilterQuestionsOpen}
        onClose={() => setIsFilterQuestionsOpen(false)}
        setTag={setFilterTag}
        isInGlobalCountry={isInGlobalCountry}
      />
    </Page>
  );
};
