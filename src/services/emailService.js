import http from "./httpService";

const apiEndpoint = import.meta.env.VITE_EMAIL_API;
const receivers = import.meta.env.VITE_EMAIL_RECEIVERS.split(",");

/**
 * used to send an email
 *
 * @param {string[]} to array of receivers
 * @param {string} subject text written in the subjet of the email
 * @param {string} plainText the content of the email as plain text
 * @param {string} html the content of the email as html
 *
 * @returns {boolean} false if there was a problem with the email
 */
async function send({ to = receivers, subject, plainText, html, details }) {
  const response = await http.post(`${apiEndpoint}/`, {
    to,
    subject,
    plainText,
    html,
    details,
  });

  return response.status === 204;
}

const exportedFunctions = {
  send,
};

export default exportedFunctions;
