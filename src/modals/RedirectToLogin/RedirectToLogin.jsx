import React from "react";

import { Modal } from "@USupport-components-library/src";

/**
 * RedirectToLogin
 *
 * The RedirectToLogin modal
 *
 * @return {jsx}
 */
export const RedirectToLogin = ({
  isOpen,
  onClose,
  heading,
  text,
  buttonLabel,
  handleButtonClick,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={onClose}
      heading={heading}
      text={text}
      ctaLabel={buttonLabel}
      ctaHandleClick={handleButtonClick}
    ></Modal>
  );
};
