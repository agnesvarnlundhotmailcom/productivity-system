// React-koncept: Hooks - useState, useMemo, useCallback för state management och optimization
import "./Form.css";
import {useState, useMemo, useCallback} from "react";

export default function Form() {
  // React-koncept: useState Hook - skapar state variabler för formulärdata
  // State = data som komponenten lagrar och kan uppdatera
  // setUsername/setPassword = funktioner för att uppdatera state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // React-koncept: useMemo Hook - memorerar (cachelagren) beräkning
  // Varför: Undviker onödig omräkning vid varje render - förbättrar performance
  // Dependency array [username, password] = beräkningen körs endast när dessa ändras
  // Memoization = sparar tidigare resultat för att slippa räkna om samma sak igen
  const isFormValid = useMemo(() => {
    return username.trim() !== "" && password.trim() !== "" && password.length >= 6;
  }, [username, password]);

  // React-koncept: useCallback Hook - memorerar funktionen
  // Varför: Undviker att skapa ny funktion vid varje render - bättre performance och referensstabilitet
  // Closure = funktionen "minns" username och password värden från omgivningen
  // Dependency array [username, password] = funktionen uppdateras bara när dessa ändras
  const handleSubmit = useCallback((e) => {
    e.preventDefault(); // Förhindrar standard formulärbeteende (sidladdning)

    // React-koncept: Conditional rendering/Validering - if-satser för att kontrollera indata
    // Varför: Säkerställer att användardata är giltig innan den skickas vidare
    
    // Kontrollera om användarnamn eller lösenord är tomt
    if (username.trim() === "" || password.trim() === "") {
      alert("Vänligen fyll i både användarnamn och lösenord.");
      return; // Stoppa exekveringen här
    }
    
    // Kontrollera om lösenordet är långt nog
    if (password.length < 6) {
      alert("Lösenordet måste vara minst 6 tecken långt.");
      return; // Stoppa exekveringen här
    }

    // Om alla validieringar är godkända, visa success-meddelande
    alert(`Inloggning lyckades för användare: ${username}`);

    // React-koncept: State access - använder state variabler i logiken
    // Varför: Läser aktuella värden från state för att skicka till server eller spara
    console.log("Användarnamn:", username);
    console.log("Lösenord:", password);
  }, [username, password]);

  return (
    // React-koncept: JSX - HTML-liknande syntax i JavaScript
    // Varför: Gör det enkelt att skriva UI-kod tillsammans med logik
    <form className="form" onSubmit={handleSubmit}>
      <h2>Logga in</h2>

      {/* React-koncept: Controlled component - value och onChange för tvåvägs databindning */}
      {/* Tvåvägs databindning = state → input OCH input → state (synkroniserad) */}
      {/* Varför: React kontrollerar alla formulärvärden, inte webbläsaren */}
      <input
        type="text"
        placeholder="Användarnamn"
        value={username} // Visar state värde i input
        onChange={(e) => setUsername(e.target.value)} // Uppdaterar state när användaren skriver
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {/* React-koncept: Conditional rendering - button disabled baserat på isFormValid */}
      {/* Varför: Förhindrar att användaren skickar ogiltigt formulär */}
      <button type="submit" disabled={!isFormValid}>Logga in</button>
    </form>
  );
}