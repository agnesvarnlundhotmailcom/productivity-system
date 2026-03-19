import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userLogin.css";

type ValidatedForm = {
  cleanInput: string;
  password: string;
  username: string;
};


/**
 * Returnerar ett användarvänligt felmeddelande oavsett feltyp.
 * @param {unknown} error - Det fel som fångats.
 * @returns {string} - Ett användarvänligt felmeddelande.
 */

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Något gick fel. Försök igen.";
}


/**
 * UserLogin-komponenten hanterar login och registrering.
 * - Visar formulär för login eller registrering beroende på state.
 * - Validerar input och visar statusmeddelanden.
 * - Efter lyckad login visas ett välkomstmeddelande.
 */
export default function UserLogin() {
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

/**
 * Validerar formuläret för login eller registrering.
 * @returns {ValidatedForm | null} - Städad data om validering lyckas, annars null.
 */
  const validateForm = (): ValidatedForm | null => {
    const cleanInput = input.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
// Kontrollera att användarnamnet är tillräckligt långt vid registrering
    if (isRegisterMode) {
      if (cleanUsername.length < 2) {
        setStatus("Användarnamnet är för kort.");
        return null;
      }
      if (!cleanEmail.includes("@")) {
        setStatus("Ange en giltig e-postadress.");
        return null;
      }
    } else {
      // Om login: kontrollera att input är tillräckligt långt
      if (cleanInput.length < 2) {
        setStatus("Ange e-post eller användarnamn.");
        return null;
      }
    }

    if (password.length < 6) {
      setStatus("Lösenordet måste vara minst 6 tecken.");
      return null;
    }

    if (isRegisterMode && password !== confirmPassword) {
      setStatus("Lösenorden matchar inte.");
      return null;
    }

    // Vid login kan användaren ange både e-post eller användarnamn, därför används cleanInput här.
    return isRegisterMode
      ? { cleanInput: cleanEmail, password, username: cleanUsername }
      : { cleanInput, password, username: "" };
  };

/**
 * Hanterar submit för login och registrering.
 * @param {React.FormEvent} event - Formulärets submit-event.
 */
  const handleModeToggle = () => {
    setIsRegisterMode((prev) => !prev);
    setStatus("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };


/**
 * Hanterar submit för login och registrering.
 * @param {React.FormEvent} event - Formulärets submit-event.
 */
  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();

    const validated = validateForm();
    if (!validated) return;

    setIsLoading(true);
    setStatus("Vänta...");

    try {
      if (isRegisterMode) {
        // TODO: Koppla till authService när backend är klar.
        // await authService.register(validated.cleanEmail, validated.password, validated.username);
        setStatus("Konto skapat! Kontrollera din mejl för bekräftelse.");
        setIsRegisterMode(false);
      } else {
        // Visa vem som är inloggad (kan vara e-post eller användarnamn)
          setStatus(`Välkommen, {input}!`);
          setLoginSuccess(true);
      }
    } catch (error: unknown) {
      setStatus(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

return (
  <div className="login-wrapper">
    {!loginSuccess ? (
      <form className="form" onSubmit={handleAuth}>
        <h2>{isRegisterMode ? "Skapa konto" : "Logga in"}</h2>


        {isRegisterMode ? (
          <>
            <input
              className="input"
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="input"
              type="email"
              placeholder="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </>
        ) : (
          <input
            className="input"
            type="text"
            placeholder="E-post eller användarnamn"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
        )}

        <input
          className="input"
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isRegisterMode && (
          <input
            className="input"
            type="password"
            placeholder="Upprepa lösenord"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}

        <div className="button-container">
          <button className="LogInBtn" type="submit" disabled={isLoading}>
            {isLoading ? "Laddar..." : isRegisterMode ? "Registrera" : "Logga in"}
          </button>

          <button type="button" className="reg-link-btn" onClick={handleModeToggle}>
            {isRegisterMode
              ? "Har du redan ett konto? Logga in"
              : "Inget konto? Registrera dig här"}
          </button>
        </div>

         {status && <p className="statusInfo">{status}</p>}
      </form>
    ) : (
      <div className="success-message">
        <p>Du är inloggad som {input}!</p>
      </div>
    )}
  </div>
);
}