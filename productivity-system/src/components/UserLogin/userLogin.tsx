import { useState } from "react";
import { useNavigate } from "react-router-dom"; // För att skicka användaren vidare
// import { authService } from "../../services/authService";
// import { useAuth } from "../../context/AuthContext";
import "./userLogin.css";

export default function UserLogin() {
  // const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  // NYTT: State för användarnamn
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const cleanEmail = email.trim();
    if (isRegisterMode && username.trim().length < 2) {
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
    return { cleanEmail, password, username: username.trim() };
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const validated = validateForm();
    if (!validated) return;

    setIsLoading(true);
    setStatus("Vänta...");

    try {
      if (isRegisterMode) {
        // Skickar med username till tjänsten
        // await authService.register(validated.cleanEmail, validated.password, validated.username);
        setStatus("Konto skapat! Kontrollera din mejl för bekräftelse.");
        setIsRegisterMode(false);
      } else {
        navigate("/dashboard"); // Skicka användaren till t.ex. dashboard efter loginh
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

        {/* Visas bara vid registrering */}
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

          <button
            type="button"
            className="reg-link-btn"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setStatus("");
              setUsername(""); // Rensa namn vid växling
            }}
          >
            {isRegisterMode ? "Har du redan ett konto? Logga in" : "Inget konto? Registrera dig här"}
          </button>
        </div>

        {status && <p className="statusInfo">{status}</p>}
      </form>
    </div>
  );
}
