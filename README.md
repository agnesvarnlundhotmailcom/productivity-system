# FlowTime
Maximera din fokus – Hitta din FlowState.

FlowTime är en allt-i-ett-lösning för dig som vill få bättre kontroll över din arbetsdag. Genom att kombinera en smart timer med ett interaktivt schema och energimätning hjälper appen dig att förstå när du är som mest produktiv och när du behöver vila.

---

## Vad gör FlowTime speciellt?

### Smart tidtagning (FlowTimer)

FlowTimer är kärnan i applikationen och gör det möjligt att arbeta strukturerat genom olika arbetslägen.

Tillgängliga lägen:

- Deep Work – för koncentrerat arbete
- Möte – för samarbeten och mötestid
- Paus – för återhämtning

Quick Switch gör det möjligt att snabbt växla mellan arbete och paus. När ett arbetspass avslutas sparas det automatiskt i historiken och en paus startas direkt.

---

## Din dagliga plan (Schema och Tasks)

FlowTime innehåller ett interaktivt schema som hjälper användaren att planera dagen.

Funktioner:

- Dagens block där dagen delas upp i kategorier som arbete, möte eller personligt
- Varje block har en egen färg för att ge en tydlig visuell översikt
- Inbyggda att-göra-listor där uppgifter kan kopplas till specifika schemablock

### Just nu-vyn

En intelligent vy analyserar aktuell tid och visar vad användaren bör arbeta med just nu. Den visar även hur mycket tid som återstår av det aktuella schemablocket.

---

## Energi och insikter

FlowTime fokuserar inte bara på tid utan också på energi.

### Energilogg

När ett arbetspass avslutas kan användaren registrera sin energinivå. Detta gör det möjligt att identifiera när under dagen produktiviteten är som högst.

### Statistik

Applikationen visar statistik över:

- energinivåer
- arbetstid
- aktivitetsmönster under de senaste sju dagarna

### Historik

Alla tidigare arbetspass sparas i en historik där användaren kan följa sina framsteg över tid.

---

## Plattformar

FlowTime utvecklas för två plattformar.

### Webbapplikation

- React
- TypeScript

### Mobilapplikation

- React Native
- Expo

Affärslogik och centrala funktioner delas mellan plattformarna genom gemensamma hooks och utilities.

---

## Tekniken bakom

FlowTime är byggt med modern frontend-teknik för att skapa en snabb och stabil användarupplevelse.

### React och TypeScript

Applikationen är byggd med React och TypeScript vilket ger en tydlig struktur och typsäker kod som är lätt att underhålla.

### Context API

Context API används som global state-hantering och fungerar som applikationens centrala datalager. Den håller exempelvis reda på:

- timerstatus
- användarinställningar
- sparad applikationsdata

### CSS Modules

CSS Modules används för att isolera styling mellan komponenter och undvika konflikter i designen.

### LocalStorage

All användardata sparas lokalt i webbläsaren genom LocalStorage. Det innebär att inget konto krävs och att all data stannar hos användaren.

### Delad logik

Projektet är designat för att kunna fungera både som webbapplikation och mobilapp. Delad affärslogik gör det möjligt att återanvända hooks och funktioner mellan React och React Native.

---

## Design och användarupplevelse

### Teman

Applikationen stödjer både mörkt och ljust tema för att förbättra läsbarheten och minska ögonbelastning.

### Responsiv design

Gränssnittet är responsivt och fungerar på både stora skärmar och mobila enheter.

### Ikoner

Ikoner i gränssnittet implementeras med hjälp av Lucide React för ett modernt och tydligt visuellt uttryck.

---

## Projektstruktur

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


---

## UserStories

- Som en användare vill jag kunna planera in mina arbetspass direkt i en kalender, så att jag får en tydlig visuell översikt över min dag.

- Som en användare vill jag koppla specifika att-göra-listor till mina inbokade kalenderpass, så att jag vet exakt vad jag ska fokusera på när passet börjar.

- Som en användare vill jag att mitt planerade pass är direkt kopplat till en timer, så att jag slipper ställa in tiden manuellt när det är dags att börja jobba.

- Som en användare vill jag själv kunna välja vilket läge (t.ex. Deep Work eller Möte) jag startar timern i, så att jag kan anpassa appens tidsspårning efter aktivitetens karaktär.

- Som en användare vill jag logga min energinivå i samband med mina pass, så att jag i efterhand kan se hur olika typer av arbete påverkar mitt mående.