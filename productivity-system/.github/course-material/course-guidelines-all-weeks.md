# Kurskompass – React, TypeScript och React Native (Alla veckor)

Detta är agentens primära referensdokument. Svar och rekommendationer ska utgå från vad kursen lär ut här, med tydlig markering om något modernt alternativ avviker från kurslinjen.

---

## Kursvecka 1 – Introduktion till React och komponentbaserad utveckling

### Nyckelkoncept
- React är ett **bibliotek** (inte ramverk) – fokuserar på UI-lagret, resten väljer du.
- **Deklarativ** approach: beskriv HUR gränssnittet ska se ut, inte hur DOM:en ska uppdateras.
- **Virtual DOM + Reconciliation**: React jämför nytt och gammalt vDOM, uppdaterar bara det som ändrats.
- **Komponentbaserad arkitektur**: separation of concerns, återanvändbarhet, testbarhet, teamvänlighet.

### Funktionella komponenter
- Komponenter skrivs som JavaScript-funktioner som returnerar JSX.
- Komponentnamn börjar alltid med **stor bokstav** (React skiljer på `div` och `MyComp`).
- Klasskomponenter existerar men är inte modern standard – fokus på funktionella + hooks.

### JSX
- HTML-liknande syntax som kompileras till `React.createElement`.
- `className` istället för `class`, `htmlFor` istället för `for`.
- Alla element måste stängas (`<img />`, `<br />`).
- Returnera alltid ett rotelement (eller `<>...</>` Fragment).
- JavaScript-uttryck inuti `{}` – **inte** satser (inga `if`, `for`, `let` direkt i JSX).

### Props
- Props = funktionsparametrar för komponenter. Skickas som attribut i JSX.
- **Read-only** – en komponent får aldrig modifiera sina props.
- Destrukturera i signaturen: `function Card({ title, children })`.
- Standardvärden: `function Btn({ text = "Klicka" })`.
- `children` = allt mellan öppnings- och stängningstaggen.
- Props kan vara strängar, nummer, booleans, arrayer, objekt och **funktioner** (callbacks).

### Unidirektionellt dataflöde
- Data flödar **nedåt** via props, aldrig uppåt.
- Barnkomponenten anropar en callback-prop för att "meddela" föräldern.
- Props är read-only → state används för föränderlig data.

### Listrendering
- Använd `array.map()` för att rendera listor.
- Varje element behöver ett unikt `key`-prop – helst databas-id, ej index om listan kan ändras.
- `key` används internt av React och skickas **inte** vidare som prop till barnkomponenten.

### Villkorlig rendering
- `if`-satser med early return för binära fall.
- Ternär operator `villkor ? a : b` direkt i JSX.
- Logisk AND `villkor && <Element />` – var noga: `0 && ...` renderar `0`, använd `villkor > 0 && ...`.

### Komponentkomposition
- **Composition over inheritance** – kombinera komponenter snarare än klassa upp.
- **Containment-mönstret**: använd `children` för flexibla wrappers (Modal, Card).
- **Specialisering**: en specifik komponent konfigurerar en generell (`SuccessAlert` → `Alert`).

### Styling
- Inline styles: camelCase-egenskaper, pixelvärden som nummer.
- Externa CSS-filer: importera och använd `className`.
- **CSS Modules** (`.module.css`): automatiskt unika klassnamn, importeras som objekt.

### Projektuppsättning
- `npm create vite@latest mitt-projekt -- --template react`
- Struktur: `src/components/`, `src/pages/`, `src/hooks/`, `src/contexts/`
- `main.jsx` monterar appen via `ReactDOM.createRoot(...).render(<App />)`.
- `React.StrictMode` aktiverar extra kontroller i development.

---

## Kursvecka 2 – State och Hooks

### Vad är State?
- State = komponentens **minne**. Data som kan förändras och påverkar UI.
- Till skillnad från vanliga variabler: state triggar **omrendering** när det ändras.
- State vs props: state är privat och ägs av komponenten; props kommer utifrån.
- **Lifting state up**: när syskon behöver dela data lyfts state till gemensam förfader.

### useState
```js
const [count, setCount] = useState(0);
```
- Initialvärdet används **endast vid första render**.
- Namnkonvention: `[värde, setVärde]`.
- Deklarera alltid på toppnivå i komponenten (Rules of Hooks).

### Funktionell uppdatering
- Använd när nya värdet beror på föregående:
```js
setCount(prev => prev + 1);   // RÄTT
setCount(count + 1);           // Kan ge fel vid batching
```

### Oföränderlig (immutable) state
- Modifiera **aldrig** objekt/arrayer direkt – skapa alltid nya instanser:
```js
setUser({ ...user, age: 26 });                         // Objekt
setItems([...items, nytt]);                             // Lägg till
setItems(items.filter(i => i.id !== id));               // Ta bort
setItems(items.map(i => i.id === id ? { ...i, done: true } : i)); // Uppdatera
```

### Lazy initialization
```js
const [data, setData] = useState(() => expensiveComputation());
// Funktionen körs bara vid första render – bra för t.ex. localStorage
```

### useEffect
```js
useEffect(() => {
  // Sidoeffekt
  return () => { /* cleanup */ };   // Körs vid avmontering eller innan ny effekt
}, [beroenden]);
```
- **Inga beroenden** angett → körs efter VARJE render (undvik).
- **Tom array `[]`** → körs bara vid montering.
- **Med beroenden** → körs vid montering och när beroende ändras.
- Inkludera ALLA värden från komponentens scope som effekten använder.
- **Cleanup**: clearInterval, clearTimeout, AbortController.abort(), avregistrera events.

### Rules of Hooks
1. Anropa hooks **bara på toppnivån** – aldrig i if, for, nästlad funktion.
2. Anropa hooks **bara från React-funktionskomponenter** eller custom hooks.
- React identifierar hooks via anropsordning – bryt aldrig ordningen.
- `eslint-plugin-react-hooks` varnar automatiskt.

### Controlled vs Uncontrolled Components
- **Controlled**: `value={state}` + `onChange` → React är källan till sanningen.
- **Uncontrolled**: `ref={inputRef}` + läs `inputRef.current.value` vid submit.
- Föredra controlled – full kontroll, enkel validering, konsekvent state.
- `defaultValue` på uncontrolled sätter startvärde utan binding.

### Formulärvalidering
- Ha ett `errors`-objekt i state.
- Validera i `onChange` (realtid) och/eller `onSubmit`.
- `event.preventDefault()` i submit-handler.

### Vanliga state-mönster
- **Toggle**: `setIsOpen(prev => !prev)`
- **Lista (CRUD)**: `map`, `filter`, `spread` – aldrig `push/splice`.
- **Loading state**: separata `isLoading`, `error`, `data` – early return för varje.

---

## Kursvecka 3 – Avancerade Hooks och Custom Hooks

### useReducer
```js
const [state, dispatch] = useReducer(reducer, initialState);
```
- Välj `useReducer` när state har flera sammankopplade fält, eller när uppdateringslogik är komplex.
- **Reducer ska vara ren** – inga API-anrop, inga sidoeffekter. Bara `(state, action) => nextState`.
- Actions som objekt: `{ type: "increment" }` eller med payload `{ type: "set_step", payload: 2 }`.
- **Mönster**: `switch (action.type)` med `default: return state`.
- Sidoeffekter (t.ex. spara till localStorage) hanteras i `useEffect`, inte i reducer.
- Lazy init: `useReducer(reducer, defaultState, initFn)` – `initFn` körs bara vid montering.

### Typiskt reducer-formulär (pattern från kursen)
```js
const initialFormState = {
  values: { email: "", password: "" },
  touched: { email: false, password: false },
  errors: { email: null, password: null },
  status: "idle",   // "idle" | "submitting" | "success" | "error"
  submitError: null,
};
```
- Actions: `"change_field"`, `"blur_field"`, `"submit_start"`, `"submit_success"`, `"submit_error"`, `"reset"`.

### useRef – två användningsområden
1. **DOM-referens**: `const ref = useRef(null)` + `<input ref={ref} />` → `ref.current.focus()`.
2. **Persistens utan re-render**: lagra `intervalId`, föregående värde, flaggor som inte ska trigga UI-update.
- Ändring av `ref.current` triggar **ingen** omrendering.
- Tumregel: använd ref för DOM-interaktion och interna "mekaniska" värden, inte för data som visas i UI.

### useMemo
```js
const filtered = useMemo(() => items.filter(f), [items, f]);
```
- Memoiserar ett **beräknat värde**. Räknas bara om när beroenden ändras.
- Använd när beräkningen är dyr (stor filtrering/sortering).
- `useMemo` är optimering, **inte korrekthet** – React kan kasta bort memoiserade värden.
- Undvik för enkla beräkningar – overhead + svårare att läsa.

### useCallback
```js
const handleAdd = useCallback(() => setItems(prev => [...prev, x]), []);
```
- Memoiserar en **funktionsreferens**. Returnerar samma funktion mellan renders om beroenden ej ändrats.
- Viktigt när callback skickas som prop till `React.memo`-komponent.
- Kombinera med **funktionell uppdatering** för att undvika state i dependency array.
- Använd tillsammans med `React.memo` när barnkomponent annars renderas om i onödan.

### Custom Hooks
- En vanlig JS-funktion som börjar på `use` och anropar andra hooks.
- Följer Rules of Hooks, returnerar värden/callbacks komponenten behöver.
- Gör komponenter renare – flytta bort "mekanik".
- Exempel från kursen: `useForm`, `useDebouncedValue`, `useInterval`, `usePrevious`.

### useForm (kursmönster)
```js
export function useForm({ initialValues, validate, onSubmit }) {
  const [state, dispatch] = useReducer(formReducer, buildInitialState(initialValues));
  const handleChange = useCallback(..., [validate]);
  const handleBlur = useCallback(..., []);
  const handleSubmit = useCallback(..., [onSubmit, state.values, validate]);
  const reset = useCallback(..., [initialValues]);
  return { ...state, handleChange, handleBlur, handleSubmit, reset };
}
```

### useDebouncedValue
```js
export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
```

### useInterval (stale closure-säker)
```js
export function useInterval(callback, delayMs) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delayMs == null) return;
    const id = setInterval(() => savedCallback.current(), delayMs);
    return () => clearInterval(id);
  }, [delayMs]);
}
```

---

## Kursvecka 4 – Context API och Global State

### Problemet Context löser
- **Prop drilling**: data skickas genom mellanliggande komponenter som inte bryr sig om den.
- Context delar data "globalt" utan att kräva props på varje nivå.
- Context är **not** en magic global variabel – det är fortfarande Reacts renderingsmodell.

### Tre byggbitar
```js
const MyContext = createContext(null);          // 1. Skapa context
<MyContext.Provider value={...}>{children}</>   // 2. Publicera värde
const val = useContext(MyContext);              // 3. Konsumera värde
```
- `createContext(null)` + kast i custom hook: tydliga fel om Provider saknas.
- `defaultValue` i `createContext` används bara om ingen Provider finns ovanför.

### Vad passar i Context?
**Bra kandidater**: tema, språk/locale, inloggningsstatus, användarinfo, behörigheter, feature flags.
**Dåliga kandidater**: formulärstate för ett specifikt formulär, snabbt uppdaterade värden (60fps), state som bara en sida använder.

### Provider-pattern (kursmönster)
```js
// src/contexts/ThemeContext.jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") ?? "light");
  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");
  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme måste användas inom ThemeProvider");
  return ctx;
}
```
- **Lazy init** för localStorage (från v2).
- **useMemo på value**: förhindrar onödig re-render när providern renderas om utan att tema ändrats.
- **Custom hook**: `useTheme()` istället för `useContext(ThemeContext)` direkt – kapslar + ger fel-skydd.

### Context + useReducer (global state-mönster)
- Reducer hanterar **strukturen** på state-uppdateringar.
- Context hanterar **distributionen** (tillgängligheten i trädet).
- **Separera state och actions i två contexts** för att undvika re-render hos komponenter som bara behöver actions:
```js
const AuthStateContext = createContext(null);
const AuthActionsContext = createContext(null);
// ...
<AuthStateContext.Provider value={state}>
  <AuthActionsContext.Provider value={actions}>
    {children}
  </AuthActionsContext.Provider>
</AuthStateContext.Provider>
```

### Auth-mönster (från kursen)
- Status: `"anonymous" | "loading" | "authenticated" | "error"`.
- Sidoeffekter (localStorage, API) i `useEffect` och action-funktioner – **aldrig i reducer**.
- `login` och `logout` är `useCallback`-stabiliserade.
- `actions`-objektet memoiseras med `useMemo`.

### AppProviders-pattern
```jsx
// src/contexts/AppProviders.jsx
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}
```
- Samlar alla globala providers i en komponent → `main.jsx` förblir ren.

### Vanliga misstag
- `useContext` utan Provider → kasta tydligt fel i custom hook.
- För mycket i en enda context → dela upp i små contexts med tydligt ansvar.
- Asynkrona anrop i reducer → hör hemma i action-funktioner, inte i reducern.
- Inline value-objekt utan `useMemo` → ny referens varje render → onödig re-render.
- Inline callbacks utan `useCallback` → ny referens varje render om de ingår i value.

### Optimeringskedjan
1. Skriv korrekt och tydlig context.
2. Identifiera onödiga re-renders med React DevTools.
3. Memoisera `value` med `useMemo`.
4. Stabilisera callbacks med `useCallback`.
5. Dela upp i state/actions-contexts vid behov.

---

## Kursvecka 5–6 – TypeScript i React

### Grundprinciper
- TypeScript är JavaScript + typinformation – typer försvinner i runtime.
- Låt **inferens** göra jobbet, annotera när kontraktet behöver tydlighet.
- Undvik `any` – använd `unknown` när typen är okänd, narrow innan användning.
- Modellera tillstånd med unioner: `status: "idle" | "loading" | "success" | "error"`.

### Type alias vs Interface
- `type` för unioner, smarta kontrakt, primitivaliaser.
- `interface` för objekt som kan behöva byggas ut (mergebart).
- React-props: båda fungerar, välj ett och var konsekvent.

### Generics
```ts
function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void]
```
- Återanvändbarhet utan att tappa typinformation.

### Discriminated unions (reducer/actions)
```ts
type Action =
  | { type: "increment" }
  | { type: "set_step"; payload: number }
  | { type: "reset" };
```

### Utility types
- `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>` – tydliga typvarianter.

### Event-typning
```ts
React.ChangeEvent<HTMLInputElement>
React.FormEvent<HTMLFormElement>
React.MouseEvent<HTMLButtonElement>
```

### Migreringsordning (kursens rekommendation)
1. Byt filändelse (`.jsx` → `.tsx`, `.js` → `.ts`) i små steg.
2. Typa props och delade datamodeller.
3. Typa context/reducer-kontrakt och actions.
4. Typa state där initialvärden är tomma eller nullable.
5. Typa handlers/events där behov finns.
6. Förfina utility types och generics.

### Kvalitetskontroll inför merge
- Är delade kontrakt typade (context, reducer, API-svar)?
- Finns onödig `any` som kan ersättas med `unknown` + narrowing?
- Är null-fall hanterade explicit i UI?
- Är actions och status uttryckta med unioner?

---

## Kursvecka 7 – React Router

> *Innehåll läggs till när kursmaterialet för vecka 7 är inlagt.*

Nyckelämnen enligt kursplan: `BrowserRouter`, `Routes`/`Route`, nästlade routes, `Outlet`, `useParams`, `useSearchParams`, `useNavigate`, `useLocation`, `Navigate`, skyddade routes (`RequireAuth`), `generatePath`.

---

## Kursvecka 9 – Testning i React

> *Innehåll läggs till när kursmaterialet för vecka 9 är inlagt.*

Nyckelämnen enligt kursplan: Jest, React Testing Library, `userEvent`, Arrange-Act-Assert, `jest.mock`, mocka Context/hooks, integrationstester med `MemoryRouter`.

---

## Kursvecka 12 – Boiler Room Projekt (Slutleverans)

### Projektmål
Personalized Productivity System – webb (React) + mobilapp (React Native) med delad logik.

### Baskrav
**Tidsspårning**: Timer (start/stopp/paus), logga pass med titel och kategori, historik, redigera/ta bort.
**Energi**: Logga nivå 1–5, visa över tid i enkel graf, grundläggande statistik.
**Fokuslägen**: Minst 3 lägen (Deep Work, Möte, Paus), timer anpassas, visuell indikation.
**UX**: Responsiv desktop, tema-växling, inställningssida, localStorage.

### Tekniska krav
- TypeScript med tydliga interfaces.
- Minst 3 custom hooks.
- Context API för global state.
- React Router för navigation.
- Minst 5 enhetstester.

### React Native
- Timer-funktion, visa loggade pass, återanvänd minst 2 hooks från webben, grundläggande navigation.

### Bedömning
Funktionalitet 40% | Kodkvalitet 30% | Teamarbete 20% | Presentation 10%.

---

## Kurslinjemarkering

När ett modernare alternativ avviker från kurslinjen ska det tydligt märkas:
- **Kurslinje**: vad kursen lär ut och varför.
- **Modern avvikelse**: vad som är nyare/smartare i branschen.
- **Rekommendation**: vad som passar projektet just nu.

Exempel på vanliga avvikelser:
- Runtime-validering (t.ex. Zod) ovanpå TypeScript för API/localStorage.
- `satisfies`, `const assertions` och striktare lint-regler.
- React 19-mönster (när relevant) som inte alltid ingår i grundkursen.
