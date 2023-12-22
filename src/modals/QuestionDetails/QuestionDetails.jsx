import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  Modal,
  Icon,
  Like,
  Label,
  Avatar,
} from "@USupport-components-library/src";
import { isDateToday, ThemeContext } from "@USupport-components-library/utils";
const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./question-details.scss";

/**
 * QuestionDetails
 *
 * The QuestionDetails modal
 *
 * @return {jsx}
 */
export const QuestionDetails = ({
  question,
  isOpen,
  onClose,
  handleScheduleClick,
  handleProviderClick,
}) => {
  const { t } = useTranslation("question-details");
  const { theme } = useContext(ThemeContext);

  const providerInfo = question.providerData;

  const getDateText = () => {
    const date = new Date(question.questionCreatedAt);

    if (isDateToday(date)) {
      return t("today");
    } else {
      return `${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}.${
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`
      }`;
    }
  };

  return (
    <Modal classes="question-details" isOpen={isOpen} closeModal={onClose}>
      <div className="question-details__date-container">
        <Icon
          name="calendar"
          color={theme === "dark" ? "#c1d7e0" : "#92989B"}
        />
        <p
          className={[
            "text",
            "question-details__date-container__text",
            theme === "dark" && "question-details__date-container__text--dark",
          ].join(" ")}
        >
          {getDateText()}
        </p>
      </div>
      <div className="question-details__heading">
        <h4 className="question-details__heading__text">
          {question.answerTitle}
        </h4>
        <Like
          likes={question.likes}
          dislikes={question.dislikes}
          answerId={question.answerId}
          isLiked={question.isLiked}
          isDisliked={question.isDisliked}
        />
      </div>
      {question.tags ? (
        <div className="question-details__labels-container">
          {question.tags.map((label, index) => {
            return (
              <Label
                text={label}
                key={index}
                classes="question-details__labels-container__label"
              />
            );
          })}
        </div>
      ) : null}
      <pre className="text question-details__answer-text">
        {question.answerText}
      </pre>
      <div className="question-details__bottom-container">
        <div className="question-details__answered-by-container">
          <p className="text">{t("answered_by")}</p>
          <Avatar
            image={AMAZON_S3_BUCKET + "/" + providerInfo.image}
            alt="Specialist avatar"
            size="xs"
            classes="question-details__answered-by-container__avatar"
            onClick={() =>
              handleProviderClick(
                providerInfo.providerId || providerInfo.provider_detail_id
              )
            }
          />
          <p
            className="text question-details__answered-by-container__provider-name"
            onClick={() =>
              handleProviderClick(
                providerInfo.providerId || providerInfo.provider_detail_id
              )
            }
          >
            {providerInfo.name} {providerInfo.surname}
          </p>
        </div>
        <div
          className="question-details__schedule-button"
          onClick={() => handleScheduleClick()}
        >
          <Icon name="calendar" color="#20809e" />
          <p className="text">{t("schedule_consultation")}</p>
        </div>
      </div>
    </Modal>
  );
};
