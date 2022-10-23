import http from "./http";

const CMS_API_URL = `${import.meta.env.VITE_CMS_API_URL}`;

const articlesEndpoint = CMS_API_URL + "/articles";
const ageGroupsEndpoint = CMS_API_URL + "/age-groups";
const categoriesEndpoint = CMS_API_URL + "/categories";

/**
 * send request to get all articles data with a predefined limit and filtered by age group, category and search string
 *
 * @param {string} limit - the number of articles to return
 * @param {string} contains - the string to search for in the title
 * @param {string} ageGroupId - the id of the age group to filter by
 * @param {string} categoryId - the id of the category to filter by
 * @param {string} locale - the locale for which to retrieve articles
 *
 * @returns {object} the articles data
 */
async function getArticlesLimit(
  limit,
  contains,
  ageGroupId,
  categoryId,
  locale
) {
  const { data } = await http.get(
    `${articlesEndpoint}?pagination[limit]=${limit}&populate=*&filters[title][$containsi]=${contains}&filters[age_groups][id][$in]=${ageGroupId}&filters[category][id][$in]=${categoryId}&locale=${locale}`
  );

  return data;
}

/**
 * send request to get artcicles data starting from a specific index within the articles collection, with predefined limit and filtered by age group, category and search string
 *
 * @param {string} start - the index of the first article to return
 * @param {string} limit - the number of articles to return
 * @param {string} contains - the string to search for in the title
 * @param {string} ageGroupId - the id of the age group to filter by
 * @param {string} categoryId - the id of the category to filter by
 * @param {string} locale - the locale for which to retrieve articles
 *
 * @returns {object} the articles data
 */
async function getArticlesStartLimit(
  start,
  limit,
  contains,
  ageGroupId,
  categoryId,
  locale
) {
  const { data } = await http.get(
    `${articlesEndpoint}?pagination[start]=${start}&pagination[limit]=${limit}&populate=*&filters[title][$containsi]=${contains}&filters[age_groups][id][$in]=${ageGroupId}&filters[category][id][$in]=${categoryId}&locale=${locale}`
  );

  return data;
}

/**
 * send request to get data for a specific article by id
 *
 * @param {string} id - the id of the article
 * @param {string} locale - the locale for which to retrieve articles
 *
 * @returns {object} the articles data
 */
async function getArticleById(id, locale) {
  const { data } = await http.get(
    `${articlesEndpoint}/${id}?populate=*&locale=${locale}`
  );

  return data;
}

/**
 * send request to get the newest articles
 *
 * @param {string} limit - the number of articles to return
 * @param {string} locale - the locale for which to retrieve articles
 *
 * @returns {object} the articles data
 */
async function getNewestArticles(limit, locale) {
  const { data } = await http.get(
    `${articlesEndpoint}?pagination[limit]=${limit}&sort[0]=createdAt%3Adesc&populate=*&locale=${locale}`
  );

  return data;
}

/**
 * send request to get the similar articles
 *
 * @param {string} limit - the number of articles to return
 * @param {string} categoryId - the caterogy id for which to search articles
 * @param {string} articleIdToExclude - the id of the article to not be included
 * @param {string} locale - the locale for which to retrieve articles
 *
 * @returns {object} the articles data
 */
async function getSimilarArticles(
  limit,
  categoryId,
  articleIdToExclude,
  locale
) {
  const { data } = await http.get(
    `${articlesEndpoint}?populate=*&filters[category][id][$in]=${categoryId}&pagination[limit]=${limit}&filters[id][$notIn]=${articleIdToExclude}`
  );

  return data;
}

/**
 *
 * send request to get all the categories
 * @param {string} locale - the locale for which to retrieve categories
 *
 * @returns {object} the categories data
 *
 */
async function getCategories(locale) {
  const { data } = await http.get(`${categoriesEndpoint}?locale=${locale}`);
  return data;
}

/**
 *
 * send request to get all ageGroups
 *
 * @param {string} locale - the locale for which to retrieve ageGroups
 *
 * @returns {object} the ageGroups data
 */
async function getAgeGroups(locale) {
  const { data } = await http.get(`${ageGroupsEndpoint}?locale=${locale}`);
  return data;
}

const exportedFunctions = {
  getArticlesLimit,
  getArticlesStartLimit,
  getArticleById,
  getNewestArticles,
  getSimilarArticles,
  getCategories,
  getAgeGroups,
};

export default exportedFunctions;
