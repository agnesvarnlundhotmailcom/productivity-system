# Productivity System – Projektöversikt

---

## För dig som användare

Productivity System är en webbaserad app som hjälper dig att strukturera din dag, hålla fokus och följa din energinivå över tid. Appen är byggd för att vara enkel att använda men kraftfull nog att ge dig verklig insikt i dina vanor och produktivitet.

### Vad kan du göra i appen?

#### ⏱️ Flow Timer
Starta fokussessioner inspirerade av Pomodoro-metoden. Timern hjälper dig att arbeta i koncentrerade intervall med pauser emellan. Varje session sparas automatiskt så du kan följa din progress.

#### 📅 Kalender
Se och planera din vecka eller månad. Du kan växla mellan **veckovy** och **månadsvy** och klicka på ett datum för att se vad som är inplanerat den dagen. Svenska helgdagar visas automatiskt.

#### 📋 Historik
Se alla dina tidigare fokussessioner. Här kan du följa hur mycket du jobbat och när du är som mest produktiv.

#### 📊 Statistik
Visualisering av din produktivitet över tid. Hjälper dig att se mönster och trender i ditt arbete.

#### ⚡ Energi
Logga din energinivå under dagen så att du över tid kan förstå när du presterar bäst och när du behöver återhämtning.

---

## För dig som utvecklare

### Teknisk stack
| Teknik | Varför? |
|--------|---------|
| React 18 | Komponentbaserat UI med hooks |
| Vite | Snabb byggprocess och HMR i utveckling |
| React Router v6 | Klientbaserad routing med `<Routes>` |
| Lucide React | Enhetliga och lättviktiga SVG-ikoner |
| CSS Modules | Scoped styling per komponent utan kollisioner |

### Arkitekturella val

#### Separation of concerns
Projektet är uppdelat i tydliga lager där varje lager har ett enda ansvar:
```
Sidor (pages/)            ← Ansvarar bara för layout och routing
        ↓
Komponenter (components/) ← Ansvarar för UI och interaktion
        ↓
Hooks (hooks/)            ← Ansvarar för logik och beräkningar
        ↓
Contexts (contexts/)      ← Ansvarar för global state
        ↓
Services (services/)      ← Ansvarar för externa API-anrop
```

#### Sidor är bara wrappers
Alla filer i `pages/` är avsiktligt tunna. De ansvarar bara för att sätta ihop rätt komponenter och skicka rätt props. All logik lever i hooks eller contexts.

#### En hook per ansvarsområde
Logik är medvetet separerad från UI genom egna hooks. `useCalendar.js` innehåller till exempel all logik för vyer, navigering och datumceller – `Calendar.jsx` vet därför bara hur saker ska visas, inte hur de beräknas.

| Hook | Ansvar |
|------|--------|
| `useCalendar` | Beräknar veckodagar, månadsrutnät och navigering |
| `useSchedule` | CRUD för schemalagda händelser |
| `useTimer` | Start, stopp, återställ och tickning av timer |
| `useData` | Abstraherar läsning från DataContext |

#### Varför Context API och inte Redux?
Appen har ett begränsat globalt state. Context API räcker gott och hållet utan att introducera ett externt beroende eller onödig komplexitet.

| Context | Ansvar |
|---------|--------|
| `SessionContext` | Sparar och läser fokussessioner |
| `DataContext` / `DataProvider` | Global appdata (schema, todos) |
| `FocusModeContext` | Aktivt fokusläge |
| `ThemeContext` | Mörkt / ljust tema |

#### Blandad CSS-strategi
| Stil | Används när |
|------|------------|
| `.module.css` | Komponenten riskerar klassnamnskollisioner |
| `.css` (global) | Enklare komponenter med unik styling |

#### TypeScript-undantag
`userLogin.tsx` är den enda filen skriven i TypeScript. Resten av projektet använder JavaScript med JSX.

#### Externa API:er
| API | Används för |
|-----|------------|
| `Nager.Date` (öppet API) | Hämtar svenska helgdagar per år via `calendarApi.jsx` |

---

## Mappstruktur

Senast uppdaterad: 2026-03-12

```
src/
├── components/
│   ├── Analys/
│   │   ├── StatisticsOverTime.jsx
│   │   └── StatisticsOverTime.css
│   ├── Calendar/
│   │   ├── Calendar.jsx           ← Visar vecko- eller månadsvy
│   │   └── Calendar.css
│   ├── Energy/
│   │   ├── EnergyModal.jsx
│   │   └── EnergyModal.css
│   ├── EnergyCare/
│   │   ├── EnergyCare.jsx
│   │   └── EnergyCare.css
│   ├── FlowTimer/
│   │   ├── FlowTimer.jsx          ← Fokustimer (Pomodoro-inspirerad)
│   │   └── FlowTimer.css
│   ├── focusMode/
│   │   ├── FocusModes.jsx
│   │   └── FocusModes.css
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   └── Layout.css
│   ├── Schedule/
│   │   ├── DailySchedule.jsx
│   │   ├── DashboardSchedule.jsx
│   │   ├── DashboardSchedule.module.css
│   │   ├── ScheduleForm.jsx
│   │   ├── ScheduleItem.jsx
│   │   └── Schedule.module.css
│   ├── SessionLogs/
│   │   ├── SessionLogs.jsx
│   │   └── SessionLogs.module.css
│   ├── Settings/
│   │   ├── SettingsModal.jsx
│   │   └── SettingsModal.css
│   ├── Statistics/
│   │   ├── Statistics.jsx
│   │   └── Statistics.css
│   ├── Taskview/
│   │   ├── CurrentTaskView.jsx
│   │   └── CurrentTask.module.css
│   ├── Theme/
│   │   └── ThemeToggle.jsx
│   ├── ToDo/
│   │   ├── TodoWidget.jsx
│   │   └── TodoWidget.module.css
│   └── UserLogin/
│       ├── userLogin.tsx          ← Enda filen skriven i TypeScript
│       └── userLogin.css
├── contexts/
│   ├── DataContext.jsx            ← Skapar och exporterar DataContext
│   ├── DataProvider.jsx           ← Hanterar global appdata (schema, todos)
│   ├── FocusModeContext.jsx       ← Hanterar aktivt fokusläge
│   ├── SessionContext.jsx         ← Sparar och läser fokussessioner
│   └── ThemeContext.jsx           ← Hanterar mörkt/ljust tema
├── hooks/
│   ├── useCalendar.js             ← Kalenderlogik (vyer, navigering, datumceller)
│   ├── useData.js                 ← Läser från DataContext
│   ├── useSchedule.js             ← Schemalogik (lägg till, ta bort händelser)
│   └── useTimer.js                ← Timerlogik (start, stopp, återställ)
├── pages/
│   ├── CalendarPage.jsx           ← /calendar
│   ├── FlowTimerPage.jsx          ← /flow
│   ├── SessionLogsPage.jsx        ← /history
│   ├── StatisticsOverTimePage.jsx ← /stats
│   └── UserLoginPage.jsx          ← /login
├── services/
│   └── calendarApi.jsx            ← Hämtar svenska helgdagar via Nager.Date API
├── App.jsx                        ← Rotkomponent – providers, routes, layout
├── App.css
└── main.jsx                       ← Entry point – BrowserRouter mountas här
```

---

*Dokumentationen underhålls på branchen `docs/documentation-agent` och mergas till `main` via Pull Request.*
*Mappstrukturen uppdateras automatiskt av `.github/agenter/generate-structure.js` vid varje push till `main`.*
