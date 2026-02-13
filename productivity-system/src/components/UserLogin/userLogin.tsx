import { useState } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./userLogin.css";

export default function UserLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showForgot, setShowForgot] = useState<boolean>(false);

  const validateForm = () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setStatus("E-post och lösenord krävs.");
      return false;
    }

    if (!cleanEmail.includes("@")) {
      setStatus("Vänligen ange en giltig e-postadress.");
      return false;
    }

    if (cleanPassword.length < 6) {
      setStatus("Lösenordet måste vara minst 6 tecken.");
      return false;
    }

    return { cleanEmail, cleanPassword };
  };

  const handleAuth = async (type: "login" | "register") => {
    const validated = validateForm();
    if (!validated) return;

    setIsLoading(true);
    setStatus("Vänta...");
    setShowForgot(false);

    try {
      if (type === "login") {
        await login(validated.cleanEmail, validated.cleanPassword);
        setStatus(`Välkommen tillbaka!`);
      } else {
        const data = await authService.register(validated.cleanEmail, validated.cleanPassword);
        authService.saveToken(data.token);
        setStatus("Konto skapat! Du kan nu logga in.");
      }
      setPassword("");
    } catch (err: any) {
      if (type === "login" && err.message.includes("Invalid login credentials")) {
        setStatus("Fel e-postadress eller lösenord.");
        setShowForgot(true);
      } else {
        setStatus(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email.includes("@")) {
      setStatus("Vänligen ange din e-postadress ovan först.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(email);
      setStatus("En återställningslänk har skickats till din e-post.");
      setShowForgot(false);
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form
        className="form"
        onSubmit={(e) => e.preventDefault()}>
        <input
          className="userName input"
          type="email"
          placeholder="E-post"
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="password input"
          type="password"
          placeholder="Lösenord"
          value={password}
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="button-container">
          <button
            className="LogInBtn"
            type="button"
            disabled={isLoading}
            onClick={() => handleAuth("login")}
          >
            {isLoading ? "Laddar..." : "Logga in"}
          </button>

          {/* Registrera-länk som en tillgänglig knapp */}
          <button
            type="button"
            className="reg-link-btn"
            disabled={isLoading}
            onClick={() => handleAuth("register")}
          >
            Inget konto? Registrera dig här
          </button>
        </div>

        {/* Glömt lösenord visas endast vid felaktig inloggning */}
        {showForgot && (
          <button
            type="button"
            className="forgot-password-link"
            onClick={handleResetPassword}
          >
            Glömt lösenordet? Klicka här för att återställa.
          </button>
        )}

        {status && (
          <div className="statusInfo">
            <p>{status}</p>
          </div>
        )}
      </form>
    </div>
  );
}