import http from "@USupport-components-library/src/services/http";

const CMS_API_URL = `${import.meta.env.VITE_CMS_API_URL}`;

/**
 * Get the published Play and Heal testimonials for a language, in display order
 *
 * @param {string} locale - "en" | "ar"
 * @returns {Promise<Array<{id: number, quote: string, author: string}>>}
 */
export async function getTestimonials(locale) {
  const { data } = await http.get(
    `${CMS_API_URL}/play-and-heal-testimonials?locale=${locale}&sort[0]=order%3Aasc&sort[1]=createdAt%3Aasc&pagination[limit]=50`
  );

  return (data?.data || []).map(({ id, attributes }) => ({
    id,
    quote: attributes.quote,
    author: attributes.author,
  }));
}
