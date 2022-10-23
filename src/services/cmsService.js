import http from "./http";
import { CMS_API_URL } from "../config/config.json";

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
 *
 * @returns {object} the articles data
 */
async function getArticlesLimit(limit, contains, ageGroupId, categoryId) {
  const { data } = await http.get(
    `${articlesEndpoint}?pagination[limit]=${limit}&populate=*&filters[title][$containsi]=${contains}&filters[age_groups][id][$in]=${ageGroupId}&filters[category][id][$in]=${categoryId}`
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
 *
 * @returns {object} the articles data
 */
async function getArticlesStartLimit(
  start,
  limit,
  contains,
  ageGroupId,
  categoryId
) {
  const { data } = await http.get(
    `${articlesEndpoint}?pagination[start]=${start}&pagination[limit]=${limit}&populate=*&filters[title][$containsi]=${contains}&filters[age_groups][id][$in]=${ageGroupId}&filters[category][id][$in]=${categoryId}`
  );

  return data;
}

/**
 * send request to get data for a specific article by id
 *
 * @param {string} id - the id of the article
 *
 * @returns {object} the articles data
 */
async function getArticleById(id) {
  const { data } = await http.get(`${articlesEndpoint}/${id}?populate=*`);

  return data;
}

/**
 * send request to get the newest articles
 *
 * @param {string} limit - the number of articles to return
 *
 * @returns {object} the articles data
 */
async function getNewestArticles(limit) {
  const { data } = await http.get(
    `${articlesEndpoint}?pagination[limit]=${limit}&sort[0]=createdAt%3Adesc&populate=*`
  );

  return data;
}

/**
 * send request to get the similar articles
 *
 * @param {string} limit - the number of articles to return
 * @param {string} categoryId - the caterogy id for which to search articles
 * @param {string} articleIdToExclude - the id of the article to not be included
 *
 * @returns {object} the articles data
 */
async function getSimilarArticles(limit, categoryId, articleIdToExclude) {
  const { data } = await http.get(
    `${articlesEndpoint}?populate=*&filters[category][id][$in]=${categoryId}&pagination[limit]=${limit}&filters[id][$notIn]=${articleIdToExclude}`
  );

  return data;
}

/**
 *
 * send request to get all the categories
 *
 * @returns {object} the categories data
 *
 */
async function getCategories() {
  const { data } = await http.get(`${categoriesEndpoint}`);
  return data;
}

/**
 *
 * send request to get all ageGroups
 *
 * @returns {object} the ageGroups data
 */
async function getAgeGroups() {
  const { data } = await http.get(`${ageGroupsEndpoint}`);
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
