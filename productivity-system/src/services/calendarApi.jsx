import axios from "axios";

// Hämtar svenska helgdagar för ett visst år, returnerar en array [{date, localName, ...}]
// Om du vill kunna avbryta anropet, skicka in en axios CancelToken via options.cancelToken
export async function fetchPublicHolidaysSE(year, options = {}) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/SE`;
  try {
    const res = await axios.get(url, options);
    return res.data;
  } catch (err) {
    if (axios.isCancel && axios.isCancel(err)) {
      throw new Error("Holiday API request cancelled");
    }
    throw new Error(`Holiday API error: ${err.response ? err.response.status : err.message}`);
  }
}