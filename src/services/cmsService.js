import http from "./http";

const CMS_API_URL = `${import.meta.env.VITE_CMS_API_URL}`;

const articlesEndpoint = CMS_API_URL + "/articles";
const ageGroupsEndpoint = CMS_API_URL + "/age-groups";
const categoriesEndpoint = CMS_API_URL + "/categories";

/**
 * generate a querry string from an object
 *
 * @param {object} querryObj - the object to generate the querry string from
 * @param {string} querryObj.limit  - the number of documents to return
 * @param {number} querryObj.populate - whether to populate the data fully or not
 * @param {number} querryObj.startFrom - the starting index of the document to return
 * @param {string} querryObj.contains - the string to search for in the document title
 * @param {string} querryObj.ageGroupId - the age group id to filter by
 * @param {string} querryObj.categoryId - the category id to filter by
 * @param {string} querryObj.locale - the locale to filter by
 * @param {string} querryObj.sortBy - the field to sort by
 * @param {string} querryObj.sortOrder - the order to sort by, possible values are "asc" and "desc"
 * @param {string} querryObj.excludeId - the id to exclude from the results
 *
 */
function generateQuerryString(querryObj) {
  let querry = `?locale=${querryObj.locale}`;

  if (querryObj.populate) {
    querry += "&populate=*";
  }

  if (querryObj.limit) {
    querry += `&pagination[limit]=${querryObj.limit}`;
  }

  if (querryObj.startFrom) {
    querry += `&pagination[start]=${querryObj.startFrom}`;
  }

  if (querryObj.contains && querryObj.contains !== "") {
    querry += `&filters[title][$containsi]=${querryObj.contains}`;
  }

  if (querryObj.ageGroupId) {
    querry += `&filters[age_groups][id][$in]=${querryObj.ageGroupId}`;
  }

  if (querryObj.categoryId) {
    querry += `&filters[category][id][$in]=${querryObj.categoryId}`;
  }

  if (querryObj.sortBy && querryObj.sortOrder) {
    querry += `&sort[0]=${querryObj.sortBy}%3A${querryObj.sortOrder}`;
  }

  if (querryObj.excludeId) {
    querry += `&filters[id][$notIn]=${querryObj.excludeId}`;
  }

  return querry;
}

/**
 * send request to get multiple articles
 *
 * @param {object} querryObj - the object to generate the querry string from
 * @param {string} querryObj.limit  - the number of documents to return
 * @param {number} querryObj.populate - whether to populate the data fully or not
 * @param {number} querryObj.startFrom - the starting index of the document to return
 * @param {string} querryObj.contains - the string to search for in the document title
 * @param {string} querryObj.ageGroupId - the age group id to filter by
 * @param {string} querryObj.categoryId - the category id to filter by
 * @param {string} querryObj.locale - the locale to filter by
 * @param {string} querryObj.sortBy - the field to sort by
 * @param {string} querryObj.sortOrder - the order to sort by, possible values are "asc" and "desc"
 * @param {string} querryObj.excludeId - the id to exclude from the results
 *
 */

async function getArticles(querryObj) {
  const querryString = generateQuerryString(querryObj);

  const { data } = await http.get(`${articlesEndpoint}${querryString}`);

  return data;
}

/**
 * send request to get data for a specific article by id
 *
 * @param {string} id - the id of the article
 * @param {string} locale - the locale for which to retrieve articles
 *
 * @returns {object} the article data
 */
async function getArticleById(id, locale) {
  const querryString = generateQuerryString({ locale: locale, populate: true });

  const { data } = await http.get(`${articlesEndpoint}/${id}?${querryString}`);

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
  const querryString = generateQuerryString({
    limit: limit,
    locale: locale,
    sortBy: "createdAt",
    sortOrder: "desc",
    populate: true,
  });

  const { data } = await http.get(`${articlesEndpoint}${querryString}`);

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
async function getSimilarArticles(limit, categoryId, excludeId, locale) {
  const querryString = generateQuerryString({
    limit: limit,
    categoryId: categoryId,
    locale: locale,
    excludeId: excludeId,
    populate: true,
  });

  const { data } = await http.get(`${articlesEndpoint}${querryString}`);

  return data;
}

/**
 * send request to get all the categories
 *
 * @param {string} locale - the locale for which to retrieve categories
 *
 * @returns {object} the categories data
 */

async function getCategories(locale) {
  const querryString = generateQuerryString({
    locale: locale,
  });

  const { data } = await http.get(`${categoriesEndpoint}${querryString}`);
  return data;
}

/**
 * send request to get all ageGroups
 *
 * @param {string} locale - the locale for which to retrieve ageGroups
 *
 * @returns {object} the ageGroups data
 */
async function getAgeGroups(locale) {
  const querryString = generateQuerryString({
    locale: locale,
  });
  const { data } = await http.get(`${ageGroupsEndpoint}${querryString}`);
  return data;
}

const exportedFunctions = {
  getArticles,
  getArticleById,
  getNewestArticles,
  getSimilarArticles,
  getCategories,
  getAgeGroups,
};

export default exportedFunctions;
