import React, { useEffect, useId, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useScrollLock } from "@USupport-components-library/src/utils/scrollLock";

import { PhIcon } from "../PhIcon/PhIcon";

import "./ph-modal.scss";

const FOCUSABLE =
  "a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex='-1'])";

/**
 * PhModal
 *
 * Dialog with a heading, close button, Escape to close and focus trapping.
 * Rendered inside the Play and Heal root so it inherits tokens and direction.
 *
 * @param {boolean} isOpen - whether the modal is visible
 * @param {function} onClose - close handler
 * @param {string} heading - dialog title
 * @param {string} description - optional text under the title
 * @returns {JSX.Element|null}
 */
export const PhModal = ({ isOpen, onClose, heading, description, children }) => {
  const { t } = useTranslation("playandheal", { keyPrefix: "common" });
  const headingId = useId();
  const dialogRef = useRef(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    dialog?.querySelector(FOCUSABLE)?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !dialog) return;

      const focusable = [...dialog.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="ph-modal"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="ph-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        ref={dialogRef}
      >
        <div className="ph-modal__header">
          <h2 className="ph-modal__heading" id={headingId}>
            {heading}
          </h2>
          <button
            type="button"
            className="ph-modal__close"
            onClick={onClose}
            aria-label={t("close")}
          >
            <PhIcon name="close" size={20} />
          </button>
        </div>
        {description && <p className="ph-modal__description">{description}</p>}
        {children}
      </div>
    </div>
  );
};
