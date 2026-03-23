// Hämtar svenska helgdagar för ett visst år, returnerar en array [{date, localName, ...}]
import axios from "axios";

// Hämtar svenska helgdagar för ett visst år, returnerar en array [{date, localName, ...}]
export async function fetchPublicHolidaysSE(year, signal) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/SE`;
  try {
    const res = await axios.get(url, {
      signal
    });
    return res.data;
  } catch (err) {
    if (axios.isCancel && axios.isCancel(err)) {
      throw new Error("Holiday API request cancelled");
    }
    throw new Error(`Holiday API error: ${err.response ? err.response.status : err.message}`);
  }
}