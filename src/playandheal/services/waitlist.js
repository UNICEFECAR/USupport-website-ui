/**
 * Add a facilitator to the Play and Heal network waiting list.
 *
 * Placeholder: nothing is sent or stored yet. The submission destination is
 * still to be decided (possibly Google Forms) - connect it here and the
 * waiting-list form will use it without further changes.
 *
 * @param {object} payload
 * @param {string} payload.fullName
 * @param {string} payload.email
 * @param {string} payload.location
 * @param {string} payload.language
 * @returns {Promise<{success: boolean}>}
 */
// eslint-disable-next-line no-unused-vars
export async function joinWaitlist(payload) {
  // Short delay so the form's loading state still behaves like a real request
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}
