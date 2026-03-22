// Hämtar svenska helgdagar för ett visst år, returnerar en array [{date, localName, ...}]
export async function fetchPublicHolidaysSE(year, signal) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/SE`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Holiday API error: ${res.status}`);
  return res.json();
}