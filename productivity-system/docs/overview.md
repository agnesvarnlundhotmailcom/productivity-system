# Productivity System – Projektöversikt

---

## För dig som användare

Productivity System är en webbaserad app som hjälper dig att strukturera din dag, hålla fokus och följa din energinivå över tid. Appen är byggd för att vara enkel att använda men kraftfull nog att ge dig verklig insikt i dina vanor och produktivitet.

### Vad kan du göra i appen?

#### ⏱️ Flow Timer (`/flow`)
Starta fokussessioner med en inbyggd timer. Du väljer ett fokusläge – **Deep Work**, **Möte** eller **Paus** – och timern räknar upp mot det valda intervallet. När tiden är ute loggas sessionen automatiskt och du får fylla i din energinivå.

Du kan när som helst:
- **Pausa och återuppta** timern
- **Snabbväxla** direkt till paus (och tillbaka) utan att starta om – det du hunnit med sparas
- **Stoppa manuellt** och logga sessionen i förtid

Under timern ser du även **dagens schema** med dina inplanerade aktiviteter och kan bocka av dem direkt från timervyn.

#### 🎯 Fokuslägen
I högerkolumnen på timersidan väljer du vilket läge du befinner dig i. Varje läge har ett eget tidsintervall som du kan anpassa i inställningarna.

| Läge | Standardtid | Syfte |
|------|-------------|-------|
| Deep Work | 25 min | Intensivt fokusarbete utan avbrott |
| Möte | 45 min | Samarbete och kommunikation |
| Paus | 5 min | Vila och återhämtning |

#### ⚙️ Inställningar
Öppnas via kugghjulet i headern. Här kan du:
- **Justera tidsintervall** för varje fokusläge med en slider (5–120 min för Deep Work och Möte, 1–60 min för Paus)
- **Radera all sparad data** om du vill börja om från noll (obs: kan inte ångras)

All data sparas lokalt i din webbläsare – inget skickas till någon server.

#### 📅 Kalender (`/calendar`)
Planera din dag, vecka eller månad. Du kan:
- Växla mellan **veckovy** och **månadsvy**
- Klicka på ett datum för att se och redigera schemat för den dagen
- Lägga till **schemablock** med titel, tid och egna deluppgifter (checklistor) kopplade till blocket
- Hantera din **att-göra-lista** för varje dag separat

Deluppgifterna i ett schemablock kan bockas av direkt i kalender- och timervyn.

#### ⚡ Energi
När ett fokuspass avslutas (automatiskt eller manuellt) visas en ruta där du loggar din energinivå. Över tid ger detta dig insikt i när du mår och presterar som bäst.

#### 📋 Historik (`/history`)
Se alla dina avslutade fokussessioner – vilket läge, hur lång tid och när de ägde rum.

#### 📊 Statistik (`/stats`)
Visualisering av din produktivitet och dina sessioner över tid.

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
| API | Status | Används för |
|-----|--------|------------|
| `Nager.Date` (öppet API) | Ej inkopplad | Finns implementerad i `calendarApi.jsx` men används inte ännu i appen. Tanken är att hämta svenska helgdagar per år och visa dem i kalendern. |

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
│   └── calendarApi.jsx            ← Implementering för Nager.Date API (ej inkopplad ännu)
├── App.jsx                        ← Rotkomponent – providers, routes, layout
├── App.css
└── main.jsx                       ← Entry point – BrowserRouter mountas här
```

---

*Dokumentationen underhålls på branchen `docs/documentation-agent` och mergas till `main` via Pull Request.*
git checkout origin/main -- docs/overview.md
*Mappstrukturen uppdateras automatiskt av `.github/agenter/generate-structure.js` vid varje push till `main`.*
