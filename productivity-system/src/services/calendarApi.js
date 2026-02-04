import { useEffect, useMemo, useState } from "react";

/**
 * Gratis kalenderdata: helgdagar (Nager.Date)
 * - Ingen API-nyckel
 * - Bra för att visa "events" som helgdagar
 */

function isoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function fetchPublicHolidaysSE(year, signal) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/SE`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Holiday API error: ${res.status}`);
  return res.json();
}

export default function HolidaysExampleCalendar() {
  // “currentDate” = första dagen i månaden du visar
  const [currentDate, setCurrentDate] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const [holidays, setHolidays] = useState([]); // hela årets helgdagar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1) Fetch helgdagar när året ändras
  useEffect(() => {
    const controller = new AbortController();
    const year = currentDate.getFullYear();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");

    fetchPublicHolidaysSE(year, controller.signal)
      .then((data) => setHolidays(data))
      .catch((e) => {
        if (e.name !== "AbortError") setError(String(e.message || e));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentDate]);

  // 2) Skapa en snabb lookup: "YYYY-MM-DD" => helgdag-objekt
  const holidayByDate = useMemo(() => {
    const map = new Map();
    for (const h of holidays) map.set(h.date, h); // h.date är redan "YYYY-MM-DD"
    return map;
  }, [holidays]);

  // 3) Skapa en enkel lista över dagar i månaden (för demo)
  const daysInMonth = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, i) => {
      const d = new Date(y, m, i + 1);
      const key = isoDate(d);
      return {
        date: d,
        iso: key,
        holiday: holidayByDate.get(key) || null,
      };
    });
  }, [currentDate, holidayByDate]);

  function prevMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }
  function nextMonth() {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 520 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={prevMonth}>‹</button>
        <h3 style={{ margin: 0 }}>
          {currentDate.toLocaleString("sv-SE", { month: "long", year: "numeric" })}
        </h3>
        <button onClick={nextMonth}>›</button>
      </div>

      {loading && <p>Laddar helgdagar…</p>}
      {error && <p style={{ color: "crimson" }}>Fel: {error}</p>}

      <ul style={{ paddingLeft: 18 }}>
        {daysInMonth.map((d) => (
          <li key={d.iso} style={{ marginBottom: 6 }}>
            <strong>{d.date.getDate()}</strong>{" "}
            {d.holiday ? (
              <>
                <span style={{ marginLeft: 8 }}>• 🎉</span>{" "}
                <span>{d.holiday.localName}</span>
              </>
            ) : (
              <span style={{ opacity: 0.6, marginLeft: 8 }}>—</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}