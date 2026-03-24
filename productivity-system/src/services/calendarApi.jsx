import axios from "axios";

/**
 * Hämtar svenska helgdagar för ett visst år från Nager.Date API.
 *
 * @param {number} year - Året du vill hämta helgdagar för (t.ex. 2026).
 * @param {object} [options={}] - (Valfritt) Axios request options, t.ex. cancelToken för att kunna avbryta anropet.
 * @returns {Promise<Array<{date: string, localName: string, [key: string]: any}>>} - Promise som returnerar en array av helgdagar.
 *
 * @example
 * // Hämta helgdagar för 2026
 * fetchPublicHolidaysSE(2026).then(holidays => console.log(holidays));
 *
 * @example
 * // Hämta helgdagar med CancelToken
 * const source = axios.CancelToken.source();
 * fetchPublicHolidaysSE(2026, { cancelToken: source.token })
 *   .then(holidays => ...)
 *   .catch(err => ...);
 * // Avbryt vid behov:
 * source.cancel("Avbrutet av användaren");
 */

// Hämtar svenska helgdagar för ett visst år, returnerar en array [{date, localName, ...}]
// Om du vill kunna avbryta anropet, skicka in en axios CancelToken via options.cancelToken
export async function fetchPublicHolidaysSE(year, options = {}) {
  // Bygg API-url för svenska helgdagar
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/SE`;
  try {
    // Gör GET-anrop med eventuella extra options (t.ex. cancelToken)
    const res = await axios.get(url, options);
    return res.data;
  } catch (err) {
    // Hantera avbrutet anrop
    if (axios.isCancel && axios.isCancel(err)) {
      throw new Error("Holiday API request cancelled");
    }
    // Hantera övriga fel
    throw new Error(`Holiday API error: ${err.response ? err.response.status : err.message}`);
  }
}