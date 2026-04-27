import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { PasswordModal } from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";

import { useError } from "#hooks";

import "./reports.scss";

/**
 * Reports
 *
 * Reports page that loads static report content in an iframe.
 *
 * @returns {JSX.Element}
 */
export const Reports = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "page" });

  const { language = "en" } = useParams();
  const queryClient = useQueryClient();
  const hasPassedValidation = queryClient.getQueryData(["hasPassedValidation"]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(
    !hasPassedValidation
  );
  const [passwordError, setPasswordError] = useState("");

  const validatePlatformPasswordMutation = useMutation(
    async (value) => {
      return await userSvc.validatePlatformPassword(value);
    },
    {
      onError: (error) => {
        const { message: errorMessage } = useError(error);
        setPasswordError(errorMessage);
      },
      onSuccess: () => {
        queryClient.setQueryData(["hasPassedValidation"], true);
        setIsPasswordModalOpen(false);
      },
    }
  );
  const handlePasswordCheck = (value) => {
    validatePlatformPasswordMutation.mutate(value);
  };

  const isPolandDomain = window.location.hostname.includes("poland");
  if (!isPolandDomain) {
    return <Navigate to={`/${language}`} />;
  }

  if (isPasswordModalOpen)
    return (
      <PasswordModal
        label={t("password")}
        btnLabel={t("submit")}
        isOpen={isPasswordModalOpen}
        isLoading={validatePlatformPasswordMutation.isLoading}
        error={passwordError}
        handleSubmit={handlePasswordCheck}
        placeholder={t("password_placeholder")}
      />
    );

  return (
    <div className="reports-page__iframe-container">
      <iframe
        className="reports-page__iframe"
        title="Reports"
        src={`${import.meta.env.BASE_URL}static/index.html`}
      />
    </div>
  );
};
