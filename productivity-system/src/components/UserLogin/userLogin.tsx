import { useState } from "react";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import "./userLogin.css";

export default function UserLogin() {
  const { login } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Växlar mellan lägen
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // För x2 lösenord
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const cleanEmail = email.trim();
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
    return { cleanEmail, password };
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const validated = validateForm();
    if (!validated) return;

    setIsLoading(true);
    setStatus("Vänta...");

    try {
      if (isRegisterMode) {
        await authService.register(validated.cleanEmail, validated.password);
        setStatus("Konto skapat! Du kan nu logga in.");
        setIsRegisterMode(false); // Gå tillbaka till inloggning efter skapat konto
      } else {
        await login(validated.cleanEmail, validated.password);
      }
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form className="form" onSubmit={handleAuth}>
        <h2>{isRegisterMode ? "Skapa konto" : "Logga in"}</h2>

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

        {/* Visas bara i registreringsläget */}
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

          <button
            type="button"
            className="reg-link-btn"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setStatus(""); // Rensa gamla felmeddelanden
            }}
          >
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