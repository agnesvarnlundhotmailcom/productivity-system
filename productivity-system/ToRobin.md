Boiler Room – Reflektionsfrågor per vecka
GitHub-repo
VECKA 1 – Projektuppstart och planering
Syfte: Visa hur ni organiserade projektet.
Frågor:
Hur organiserade ni teamet och vilka roller tog varje medlem?
Vi har inte haft så många uppdelade roller, bara en repo-ansvarig. Vi har inga ansvarsroller, eftersom alla har velat prova olika roller.
Hur satte ni upp GitHub-repot och vilken struktur valde ni?
Vi har haft olika brancher för olika features och syften. Vidare har vi jobbat med en funktionsbaserad komponentstruktur där varje komponent ligger i en separat mapp med tillhörande css-fil. CSS Modules används för att isolera styling mellan komponenter och undvika konflikter i designen.
src/
├── components/
│ 	├── Analys/
│ 	├── Calendar/
│ 	├── Energy/
│ 	├── EnergyCare/
│ 	├── FlowTimer/
│ 	├── FocusMode/
│ 	├── Layout/
│ 	├── Schedule/
│ 	├── SessionLogs/
│ 	├── Settings/
│ 	├── Statistics/
│ 	├── Taskview/
│ 	├── Theme/
│ 	├── ToDo/
│ 	├── UserLogin/
├── contexts/
├── hooks/
├── pages/
├── contexts/
Hur skapade ni er Scrum-board och hur organiserades backloggen?
Vi skapade en kanban på github som vi la in issues. Vi har även arbetat med trello men vi valt att lämna och använda oss av kalkylark.
Hur skrev ni era user stories och vilka var de viktigaste funktionerna i backloggen?
Vi byggde först vår fokusapp och skapade sedan user stories baserade på de exempel vi fick från Boiler Room-projekten. Därefter anpassade vi dem efter vår egen slutprodukt.
Som användare vill jag kunna planera in mina arbetspass direkt i en kalender så att jag får en tydlig visuell översikt över min dag.
Som användare vill jag kunna koppla specifika att-göra-listor till mina inbokade kalenderpass så att jag vet exakt vad jag ska fokusera på när passet börjar.
Som användare vill jag att mitt planerade pass är direkt kopplat till en timer så att jag slipper ställa in tiden manuellt när det är dags att börja arbeta.
Som användare vill jag själv kunna välja vilket läge (t.ex. Deep Work eller Möte) jag startar timern i så att jag kan anpassa tidsspårningen efter aktivitetens karaktär.
Som användare vill jag logga in min energinivå i samband med mina arbetspass så att jag i efterhand kan se hur olika typer av arbete påverkar min energi och produktivitet.

Hur planerade ni Sprint 1 och hur bestämde ni vad som skulle ingå?
Vi följde planeringslistorna i Boiler Room-projektets dokument och tog fram en skiss utifrån de grundläggande kraven. Därefter delade vi upp komponenterna baserat på skissen, så att varje gruppmedlem ansvarade för en komponent.

Vilka verktyg använde ni för samarbete (GitHub Projects, Discord, etc.)?
Slack, GitHub Projects och Kalkylark.

Vilka utmaningar uppstod i början av projektet och hur löste ni dem?
Eftersom planeringen låg en vecka efter blev det lite stressigt för oss att komma ikapp och förstå vad vi skulle bygga och var vi skulle börja. I början blev det därför en del AI-stöd i arbetet för att hjälpa oss förstå hur vi skulle gå vidare och komma vidare i projektet

VECKA 2 – Grundläggande UI-komponenter
Syfte: Beskriva hur ni byggde komponentstrukturen.
Frågor:
Hur strukturerade ni projektets mappar och filer?
Vi använde oss av en funktionbaserad komponentstruktur där varje komponent ligger i sin egna mapp tillsammans med tillhörande CSS.

Vilka layout-komponenter skapade ni (Header, Sidebar, MainContent etc.)?
För att strukturera användargränssnittet i applikationen delade vi upp layouten i flera komponenter. Vi använde en Header högst upp på sidan som innehåller navigering och information om applikationen. På sidan finns också en Sidebar som fungerar som en meny där användaren kan navigera mellan olika delar av systemet, till exempel kalender, statistik och timer.

Hur fungerade navigationen mellan olika vyer?
Vi använder <routes> för att växla mellan olika pages.

Vilka återanvändbara UI-komponenter byggde ni?
I vårt projekt byggde vi komponenterna på ett sätt så att alla komponenter är återanvändbara. Vi delade upp gränssnittet i mindre komponenter som kan användas på flera ställen i applikationen, till exempel Timer, Kalender och Energinivå.

Hur arbetade ni med props mellan komponenter?
Vi arbetade med props genom att skicka data och funktioner från föräldrakomponenter till barnkomponenter. På så sätt kunde barnkomponenterna visa information och anropa funktioner utan att själva behöva hantera den globala logiken. Till exempel skickade vi in data som valda datum eller objekt som skulle visas, samt funktioner för att uppdatera eller ta bort innehåll. Det gjorde komponenterna mer återanvändbara och strukturen tydligare.

Vilka designbeslut tog ni kring komponenthierarki?
Vi valde att separera logik och UI i olika delar av projektet. Logiken hanteras med React hooks som UseState,UseEffect ect. medan UI komponenterna ansvar för att visa innehållet. Detta gör strukturen mer organiserad och komponenterna mer återanvändbara.

Vilka problem uppstod när ni byggde komponenterna och hur löste ni dem?
Ett problem var att dela data mellan flera komponenter. Vi löste genom att använda Context API, vilket gör att data kan delas globalt i applikationen utan att behöva skicka props genom många nivåer.

VECKA 3 – State och interaktivitet
Hur implementerade vi timer-funktionen?
Timer-funktionen byggdes i komponenten flowtimer där tiden lagras i seconds Elapsed. Timern använder state från fokusModeContext och uppdateras varje sekund när den körs.

Hur använde vi useState i applikationen?
useState används för att lagra lokalt state, till exempel om timern kör (isRunning), hur många sekunder som har gått och om energimodalen ska visas (showEnergyModal)
Vi använde use State för UI-lägen (t.ex. öppna/stänga), timer status (tid, aktivt läge, körs/paus) och formulär värden.

Hur implementerade vi start / stopp / paus?
Start och paus hanteras genom att ändra boolean-state isRunning. när användaren klickar på start eller paus ändras värdet, vilket gör att timern börjar eller slutar uppdatera tiden.

Hur använde vi useEffect i timer-logiken?
useEffect används för att kontrollera när timern ska avslutas och för att hantera när användaren lämnar fliken. Om tiden når måltiden avslutas sessionen automatiskt.


Hur byggde vi formuläret för att logga arbetspass?
när ett pass är klart öppnas en EnergyModal där användaren kan välja energinivå och vad som ska hända härnäst. Informationen sparas sedan som en session i historiken.

Hur hanterade vi formulärdata med controlled components?
Formlärdata hanteras med state, till exempel selectEnergy. När användaren klickar på ett alternativ uppdateras state och vädret används när sessionen sparas.

Vad var den största tekniska utmaningen denna vecka?
Den största utmaningen var att få timer-logiken att fungera korrekt tillsammans med context, session-loggning och när användaren byter flik eller pausar timern. detta löstes genom att använda useEffect, state och context tillsammans.

VECKA 4 – Custom Hooks och komplex state
Syfte: Förklara hur ni förbättrade kodstrukturen.
Frågor:
Varför valde ni att skapa Custom Hooks?
Vi skapade custom hooks för att separera logik från UI komponenter. på så sätt blir komponenterna renare och koden organiserad och återanvändbar.


Hur fungerar er useTimer hook?
Vår Timer använder useEffekt och setInterval för att uppdatera tid varje sekund när timern är aktiv. Den uppdaterar arbetstid eller paustid i DataContext beroende på vilket läge som är aktivt och stoppar automatiskt timern när arbetstiden når den satta måltiden.


Hur implementerade ni useReducer för arbetspass?
Vi anväde useReducer för att hantera mer komplex state kopplat till arbetspass. Reducern gör det möjligt att hantera olika actions, till exempel att starta, stoppa eller uppdatera ett arbetspass, vilket gör state-hanteringen mer strukturerad.


Hur fungerar er useLocalStorage hook?
useLocalStorage används för att spara data i localStorage så att informationen finns kvar även om sidan laddas om. Hooken synkroniserar React-state med localStorage så att ändringar automatiskt sparas.
Varför använde ni useMemo eller useCallback?
Vi använder useMemo och useCallback för att optimera prestanda. De gör att funktioner och behandlingar inte skapas om i onödan vid varje render, vilket minskar onödiga uppdateringar i komponent trädet.


Hur förbättrades kod strukturen efter refaktoreringen?
Efter refaktoreringen flyttades mycket logik från komponenterna till custom hooks. detta gjorde komponenterna enklare, mer fokuserade på UI och gjorde projektet mer modulärt och lättare att underhålla.


Vilka lärdomar fick ni om React Hooks?
Vi lärde oss hur hooks kan användas för att hantera state dela logik mellan komponenter och strukturera kod bättre. Custom hooks gjorde det också möjligt att återanvända logik i flera delar av applikationer.

VECKA 5 – Global state med Context
Syfte: Förklara arkitekturen för global state.
Frågor:
Varför valde ni att använda Context API?
Vi använde Context API för att hantera global data som delas mellan många komponenter till exempel schema, inställningar och statistik. Det gör att komponenter kan komma åt datan direkt utan att behöva skicka props genom flera nivåer.
Hur fungerar er AppContext?
Vår AppContext (DataContext) innehåller global data och funktioner för att uppdatera den. DataProvider omsluter hela applikationen och gör data tillgänglig för alla komponenter, till exempel schema, enegiloggar och inställningar.

Hur implementerade ni UserContext?
Vi implementerade flera contexts för olika delar av appen, till exempel DataContext,FocusModeContext,SessionContext och ThemeContext. Varje context har en provider som hanterar state och gör datan tillgänglig för resten av applikationen.


Hur byggde ni tema-systemet (dark/light)?
Vi skapade en ThemeContext som lagrar vilket tema som används. Temat sparas i LocalStorage och appliceras på hela dokumentet via data-theme, vilket gör att css automatiskt ändrar färger i hela appen.
Hur kombinerade ni Context med useReducer?
Vi kombinerade Context med strukturerad state-hantering där context används för att dela global state och funktioner som uppdaterar datan på att kontrollerat sätt.
Vilka fördelar gav Context jämfört med props?
Context gjorde att vi kunde undvika prop drilling. komponenter kan få data direkt från context istället för att skicka props genom många komponent nivåer.


Fanns det några problem med Context-arkitekturen?
En utmaning var att hålla context-strukturen organiserad. Vi löste detta genom att dela upp funktionaliteten i flera olika contexts, till exempel för data, sessioner, fokusläge och tema.

VECKA 6 – TypeScript-konvertering
Syfte: Beskriva hur ni gjorde projektet typsäkert.
Frågor:
Hur konfigurerade ni TypeScript i projektet?
Vi installerade typescript och @types/react, skapade en tsconfig.json, och lade till en global.d.ts för CSS-moduler och Vite-typer. Projektet är nu redo för TS/TSX-filer.

Vilka interfaces skapade ni (TimeEntry, User, Settings)?
Vi har inte skapat några globala interfaces. Endast en lokal typ (type ValidatedForm) i UserLogin-komponenten.

Hur typade ni React-komponenternas props?
UserLogin tar inga props, så vi har inte behövt typa props. All logik och state är intern.

Hur konverterade ni Custom Hooks till TypeScript?
Vi har inte konverterat några custom hooks, men om vi hade gjort det skulle vi ha typat argument och returvärde med type/interface.

Vilka typer av TypeScript-fel stötte ni på?
Vi fick fel där JSX-element som <div> inte kändes igen, vilket löstes genom att lägga till rätt typdefinitioner i global.d.ts.

Hur hjälpte TypeScript er att förbättra koden?
Fångar fel tidigt, t.ex. felaktiga typer på formulärdata. Gör koden mer självdokumenterande. Säkerställer att funktioner och data är korrekt typade.
Hur hjälpte TypeScript er att förbättra koden?
Att rätt typdefinitioner och konfiguration är avgörande för att TypeScript ska fungera med JSX och CSS-moduler i React-projekt.

VECKA 8 – Routing
Syfte: Beskriv navigationssystemet.
Frågor:
Hur implementerade ni React Router?
Vi implementerade React Router genom att använd BrowserRouter i projektet och sedan definiera våra routes i App.jsx med Routes och Route. Varje sida kopplades till en egen komponent, till exempel /flow, /calendar och /login. Vi använde även Navigate för att automatiskt omdirigera startsidan(/) till /flow. På så sätt kunde användningen navigera mellan olika sidor utan att ladda om sidan.

Vilka routes skapade ni (Dashboard, Timer, History, Settings)?
Vi skapade flera routes med React Router för att dela upp applikationen i olika sidor. Vi hade routes för Timer (/flow), Kalender (/calendar), Historik (/history), Statistik (/stats) och Login (/login). Vi använde även en redirect från startsidan (/) till Timer-sidan. Inställningar hanterades via en modal istället för en egen route.

Hur använde ni nested routes?
Vi använde inte nested routes i projektet. Istället skapade vi separata routes för varje sida i App.jsx. Varje route kopplades direkt till en egen komponent.

Hur fungerade layout-komponenterna tillsammans med router?
Layout-komponenterna fungerade tillsammans med React Router genom att ligga utanför Routes i App.jsx. Det gjorde att delar som Header och sidans struktur alltid visades, medan innehållet i mitten ändrades beroende på vilken route användaren var på. På så sätt fick vi en gemensam layout för hela applikationen.

Implementerade ni protected routes?
Nej, det gjorde vi inte.

Hur använde ni URL-parametrar?
Vi använde inte URL-parametrar i projektet. Vi skapade istället separata routes för varje sida utan dynamiska delar i URL:en.

VECKA 10 – Testning
Syfte: Visa hur ni säkerställde kvalitet.
Frågor:
Hur satte ni upp Jest och React Testing Library?
Vi installerade Jest och React Testing Library via npm för att kunna skriva och köra tester i projektet. Vi skapade bland annat ett TypeScript-test för userlogin.ts i en egen branch. Även våra Jest-tester utvecklades och kördes i en separat branch för att inte påverka huvudkoden.

Vilka delar av applikationen testade ni?
Vi testade FlowTimer.jsx och UserLogin.tsx

Hur testade ni Custom Hooks?
Vi testade funktioner som använder våra custom hooks med Jest och React Testing Library. I testerna mockade vi våra hooks och contexts för att kunna styra vilket state de hade. Sedan renderade vi komponenten och simulerade klick från användaren för att kontrollera att rätt funktioner anropades och att state uppdaterades korrekt.

Hur mockade ni API-anrop?
Vi använde inget API då det ej var ett av baskraven.

Hur testade ni användarinteraktioner?
Vi testade användarinteraktioner med React Testing Library genom att simulera hur en användare klickar på knappar i gränssnittet. Till exempel testade vi att klick på knappar som Starta, Ta en paus och Nollställ klockan anropade rätt funktioner och uppdaterade state. Tester kördes med Jest.


Vad lärde ni er om testning i React?
Att det var många dependencies som behövdes installeras för att kunna köra testerna

Tips:
Slutreflektion:
Exempel på slutfrågor:
Vad fungerade bra i ert arbetssätt?
Den tidsmässiga planeringen.

Vad skulle ni göra annorlunda nästa gång?
Mer daily-standups och följa agila metoder under projektets gång.

Vilka tekniska kunskaper utvecklade ni mest?
Att dela upp arbetet och arbetat i olika brancher/features.

Hur fungerade teamarbetet?











Boiler Room – Reflektion per vecka

Under vecka 1 arbetade vi med projektuppstart och planering. Vi hade inga fasta roller, förutom en som ansvarade för repot, eftersom alla ville testa olika delar av arbetet. Vi strukturerade GitHub-repot med olika brancher för features och använde en komponentbaserad struktur där varje komponent låg i en egen mapp med tillhörande CSS. CSS Modules användes för att undvika stylingkonflikter.

Vi planerade arbetet med en kanban-tavla i GitHub och använde även Trello och senare kalkylark. User stories skapades efter att vi byggt en första version av appen och anpassades efter vår slutprodukt. Funktionerna handlade bland annat om att planera arbetspass i en kalender, koppla uppgifter till passen, använda en timer, välja arbetsläge och logga energinivå. Sprint 1 planerades utifrån projektets krav och en skiss, och komponenterna delades upp mellan oss. Vi använde Slack, GitHub Projects och kalkylark för samarbete. En utmaning var att vi låg efter i början, vilket gjorde att vi behövde ta hjälp av AI för att komma igång.

Under vecka 2 byggde vi UI-komponenter. Vi fortsatte med vår komponentstruktur och skapade layout med Header och Sidebar för navigation. Vi använde routes för att växla mellan sidor. Komponenterna gjordes återanvändbara, till exempel timer och kalender. Vi skickade data mellan komponenter med props och delade upp logik och UI med hjälp av React hooks. Ett problem var att dela data mellan komponenter, vilket vi löste med Context API.

Vecka 3 fokuserade på state och interaktivitet. Vi byggde timer-funktionen med state och context så att den uppdateras varje sekund. useState användes för att hantera tillstånd som tid, om timern körs och modaler. Start och paus styrdes med ett boolean-värde. useEffect användes för att hantera timerlogik och vad som händer när användaren lämnar sidan. Efter ett arbetspass öppnades en modal där energinivå loggades och sparades. Formulär hanterades med state. Den största utmaningen var att få allt att fungera tillsammans, vilket vi löste med en kombination av state, effect och context.

Under vecka 4 förbättrade vi koden med custom hooks. De gjorde att vi kunde separera logik från UI och få renare komponenter. Vi använde useEffect och setInterval i timern, samt useReducer för mer komplex state. Vi skapade också en useLocalStorage-hook för att spara data lokalt. useMemo och useCallback användes för bättre prestanda. Efter detta blev koden mer organiserad och lättare att underhålla. Vi lärde oss också mer om hur hooks kan användas för att strukturera kod.

Vecka 5 handlade om global state med Context API. Vi använde det för data som delas mellan flera komponenter, som schema, inställningar och statistik. Vi skapade flera contexts, till exempel för data, fokusläge, sessioner och tema. Temat (dark/light) sparades i localStorage och applicerades globalt. Context hjälpte oss att undvika att skicka props genom många nivåer, men det var en utmaning att hålla strukturen tydlig. Det löstes genom att dela upp context i flera delar.

Under vecka 6 började vi använda TypeScript. Vi installerade det och gjorde grundläggande inställningar för att kunna använda TS och TSX. Vi använde bara enklare typning i projektet, men lärde oss vikten av rätt konfiguration. TypeScript hjälpte oss att hitta fel tidigare och gjorde koden tydligare.

Vecka 8 handlade om routing. Vi använde React Router med BrowserRouter, Routes och Route för att skapa olika sidor som timer, kalender, historik, statistik och login. Startsidan skickades automatiskt vidare till timern. Layout-komponenter låg utanför routes så att de alltid visades. Vi använde inte nested routes eller URL-parametrar, utan höll det enkelt.

Under vecka 10 arbetade vi med testning. Vi installerade Jest och React Testing Library och skrev tester i egna brancher. Vi testade bland annat FlowTimer och UserLogin samt funktioner med custom hooks genom att mocka data. Vi testade även användarinteraktioner genom att simulera klick. Vi använde inget API. En viktig lärdom var att testning kräver många dependencies och en del konfiguration.

Avslutningsvis fungerade vår tidsplanering bra och hjälpte oss att hålla struktur. Nästa gång hade vi velat arbeta mer med daily stand-ups och följa agila metoder mer konsekvent. Vi utvecklade särskilt våra tekniska kunskaper inom att dela upp arbete och arbeta med brancher och features. Teamarbetet fungerade bra, och vi hade ett flexibelt samarbete där alla bidrog och hjälpte varandra.

