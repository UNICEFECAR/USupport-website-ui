import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import { PhModal } from "../../components/PhModal/PhModal";
import { PhButton } from "../../components/PhButton/PhButton";
import { PhIcon } from "../../components/PhIcon/PhIcon";
import { joinWaitlist } from "../../services/waitlist";

import "./ph-waitlist-modal.scss";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INITIAL_VALUES = { fullName: "", email: "", location: "" };

/**
 * PhWaitlistModal
 *
 * "A community, in the making" - facilitators network waiting list form.
 * Submission is a placeholder for now - see services/waitlist.js.
 *
 * @param {boolean} isOpen
 * @param {function} onClose
 * @returns {JSX.Element}
 */
export const PhWaitlistModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("playandheal", { keyPrefix: "waitlist" });

  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const mutation = useMutation(joinWaitlist);

  // Start fresh every time the modal is opened
  useEffect(() => {
    if (isOpen) {
      setValues(INITIAL_VALUES);
      setErrors({});
      mutation.reset();
    }
  }, [isOpen]);

  const validate = () => {
    const nextErrors = {};
    if (!values.fullName.trim()) nextErrors.fullName = t("error_name");
    if (!EMAIL_REGEX.test(values.email.trim()))
      nextErrors.email = t("error_email");
    return nextErrors;
  };

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`ph-waitlist-${firstInvalid}`)?.focus();
      return;
    }

    mutation.mutate({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      location: values.location.trim(),
      language: i18n.language,
    });
  };

  const renderField = (field, type = "text", autoComplete) => {
    const id = `ph-waitlist-${field}`;
    const errorId = `${id}-error`;

    return (
      <div className="ph-waitlist__field">
        <label htmlFor={id} className="ph-waitlist__label">
          {t(`label_${field}`)}
        </label>
        <input
          id={id}
          type={type}
          className="ph-waitlist__input"
          value={values[field]}
          onChange={handleChange(field)}
          placeholder={t(`placeholder_${field}`)}
          autoComplete={autoComplete}
          aria-invalid={!!errors[field]}
          aria-describedby={errors[field] ? errorId : undefined}
          maxLength={field === "email" ? 254 : 150}
        />
        {errors[field] && (
          <p className="ph-waitlist__error" id={errorId}>
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const benefits = [t("benefit_1"), t("benefit_2"), t("benefit_3")];

  return (
    <PhModal isOpen={isOpen} onClose={onClose} heading={t("heading")}>
      <div className="ph-waitlist">
        <span className="ph-waitlist__badge">{t("badge")}</span>

        {mutation.isSuccess ? (
          <div className="ph-waitlist__success" role="status">
            <span className="ph-waitlist__success-icon">
              <PhIcon name="check" size={28} />
            </span>
            <p className="ph-waitlist__success-title">{t("success_title")}</p>
            <p className="ph-waitlist__text">{t("success_text")}</p>
            <PhButton onClick={onClose} fullWidth>
              {t("close")}
            </PhButton>
          </div>
        ) : (
          <>
            <p className="ph-waitlist__text">{t("text")}</p>
            <ul className="ph-waitlist__benefits">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <PhIcon name="check" size={18} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <form className="ph-waitlist__form" onSubmit={handleSubmit} noValidate>
              {renderField("fullName", "text", "name")}
              {renderField("email", "email", "email")}
              {renderField("location", "text", "address-level2")}

              <p className="ph-waitlist__hint">{t("privacy_hint")}</p>

              {mutation.isError && (
                <p className="ph-waitlist__error" role="alert">
                  {t("error_submit")}
                </p>
              )}

              <PhButton
                type="submit"
                fullWidth
                disabled={mutation.isLoading}
                aria-busy={mutation.isLoading}
              >
                {mutation.isLoading ? t("submitting") : t("submit")}
              </PhButton>
            </form>
          </>
        )}
      </div>
    </PhModal>
  );
};
