# Kurskompass React + TypeScript (Vecka 5-6)

Detta dokument sammanfattar kursens riktlinjer och ska vara första referens innan kodsvar.

## Syfte
- Använd TypeScript som kontrakt mellan delar av appen.
- Fanga fel tidigt i editor/build i stallet for runtime.
- Migrera gradvis: borja med delade kontrakt (context, reducer, API-modeller), sedan UI.

## Grundprinciper vecka 5
- TypeScript ar JavaScript + typinformation (typer forsvinner i runtime).
- Lat inferens gora jobbet, annotera nar kontraktet behover tydlighet.
- Undvik any; anvand unknown nar typen ar okand och narrowa innan anvandning.
- Modellera tillstand med unioner, t.ex. status-falt och User | null.
- Skriv tydliga funktionssignaturer for indata och returtyper.
- Type alias for unioner/smarta kontrakt, interface ofta for objekt som ska byggas ut.
- Anvand discriminated unions i reducer/actions.
- Anvand generics for ateranvandbarhet utan tappad typinformation.
- LocalStorage/API-data ar osakra i runtime: validera eller fallbacka kontrollerat.

## React + TypeScript vecka 6
- Anvand .ts for logik utan JSX, .tsx for komponenter med JSX.
- Typa props som tydliga kontrakt (obligatoriskt/valfritt/tillatna varianter).
- Modellera state efter verkliga UI-lagen (idle/loading/success/error).
- Hantera null/undefined med early return och narrowing.
- Typa events nar eventobjektet anvands:
  - React.ChangeEvent<HTMLInputElement>
  - React.FormEvent<HTMLFormElement>
  - React.MouseEvent<HTMLButtonElement>
- Kanna skillnaden mellan target och currentTarget.
- Anvand utility types: Partial, Required, Pick, Omit for tydliga typvarianter.
- Hall strict-tank: robust kod, minimera genvagar (any, overdriven non-null assertion).

## Praktisk migreringsordning
1. Byt filandelse (.jsx -> .tsx, .js -> .ts) i sma steg.
2. Typa props och delade datamodeller.
3. Typa context/reducer-kontrakt och actions.
4. Typa state dar initialvarden ar tomma eller nullable.
5. Typa handlers/events dar behov finns.
6. Forfina util-typer och generics efter hand.

## Kvalitetscheck innan merge
- Ar delade kontrakt typade (context, reducer, API-svar)?
- Finns onodig any som kan ersattas med unknown + narrowing?
- Ar null-fall hanterade explicit i UI?
- Ar actions och status uttryckta med unioner?
- Ar typerna tydliga och lasbara (inte onodigt smarta)?

## Nar externa moderna val avviker fran kursmaterial
Nar ett modernare eller smartare alternativ avviker fran kurslinjen ska det markas tydligt i svaret:
- Kurslinje: vad kursen lar ut och varfor.
- Modern avvikelse: vad som ar nyare/smartare i branschen.
- Rekommendation: vad som passar detta projekt just nu.

Exempel pa vanliga avvikelser att flagga:
- Runtime-validering (t.ex. Zod) ovanpa TypeScript for API/localStorage.
- TS-funktioner som satisfies, const assertions och striktare lint-regler.
- React 19-monstren (dar relevant) som inte alltid ingar i grundkursen.
