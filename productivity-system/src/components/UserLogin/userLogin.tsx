import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./userLogin.css";

type ValidatedForm = {
  cleanEmail: string;
  password: string;
  username: string;
};

/**
 * Returnerar ett användarvänligt felmeddelande oavsett feltyp.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Något gick fel. Försök igen.";
}

/**
 * Login/registreringsformulär.
 * Hanterar lokal validering och växling mellan inloggning och registrering.
 */
export default function UserLogin() {
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validerar formuläret och returnerar städad data vid godkänd input.
   * Returnerar null om något fält är ogiltigt.
   */
  const validateForm = (): ValidatedForm | null => {
    const cleanEmail = email.trim();
    const cleanUsername = username.trim();

    if (isRegisterMode && cleanUsername.length < 2) {
      setStatus("Användarnamnet är för kort.");
      return null;
    }

    if (!cleanEmail.includes("@")) {
      setStatus("Ange en giltig e-postadress.");
      return null;
    }

    if (password.length < 6) {
      setStatus("Lösenordet måste vara minst 6 tecken.");
      return null;
    }

    if (isRegisterMode && password !== confirmPassword) {
      setStatus("Lösenorden matchar inte.");
      return null;
    }

    return { cleanEmail, password, username: cleanUsername };
  };

  /**
   * Växlar mellan login/register och rensar formulärstatus.
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
   * Hanterar submit för både login och registrering.
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
        // TODO: Ersätt med riktig login när useAuth/authService finns.
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      setStatus(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="form" onSubmit={handleAuth}>
        <h2>{isRegisterMode ? "Skapa konto" : "Logga in"}</h2>

        {isRegisterMode && (
          <input
            className="input"
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}

        <input
          className="input"
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

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
    </div>
  );
}