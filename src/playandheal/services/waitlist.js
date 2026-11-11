import { httpSvc } from "@USupport-components-library/services";

const API_ENDPOINT = `${import.meta.env.VITE_API_ENDPOINT}/v1/user`;

/**
 * Add a facilitator to the Play and Heal network waiting list.
 *
 * @param {object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.location
 * @param {string} payload.language
 * @returns {Promise<{success: boolean}>}
 */
export async function joinWaitlist(payload) {
  const response = await httpSvc.post(
    `${API_ENDPOINT}/playandheal-waitlist`,
    payload
  );
  return response.data;
}
