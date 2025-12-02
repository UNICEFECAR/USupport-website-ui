import { useMutation } from "@tanstack/react-query";
import { emailSvc, userSvc } from "@USupport-components-library/services";
import { useError } from "../hooks";

export default function useSendIssueEmail(onSuccess, onError) {
  /**
   *
   * @param {Object} payload with fields "subjectValue","subjectLabel", "title" and "text"
   * @returns {Promise}
   */
  const sendIssueEmail = async (payload) => {
    const emailPromise = emailSvc.sendAdmin({
      subject: payload.subjectLabel,
      title: payload.title,
      text: payload.text,
    });

    const promises = [emailPromise];
    if (localStorage.getItem("country") !== "global") {
      const addFormPromise = userSvc.addContactForm({
        subject: payload.subjectValue,
        email: payload.email,
        message: payload.text,
        sentFrom: "website",
      });

      promises.push(addFormPromise);
    }
    await Promise.all(promises);
    return true;
  };

  const sendIssueEmailMutation = useMutation(sendIssueEmail, {
    onSuccess,
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage);
    },
  });

  return sendIssueEmailMutation;
}

export { useSendIssueEmail };
