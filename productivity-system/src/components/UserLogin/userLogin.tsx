import { useState } from "react";
import { authService } from "../../services/authService"; // Justera sökvägen om det behövs
import "./userLogin.css";

export default function UserLogin() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // En gemensam validering för både login och register
  const validateForm = () => {
    const cleanUser = user.trim();
    const cleanPassword = password.trim();

    if (!cleanUser || !cleanPassword) {
      setStatus("Användarnamn och lösenord krävs.");
      return false;
    }
    if (cleanUser.length < 6 || cleanPassword.length < 6) {
      setStatus("Både namn och lösenord måste vara minst 6 tecken.");
      return false;
    }
    return { cleanUser, cleanPassword };
  };

  const handleAuth = async (type: "login" | "register") => {
    const validated = validateForm();
    if (!validated) return;

    setIsLoading(true);
    setStatus("Vänta...");

    try {
      const data = await (type === "login"
        ? authService.login(validated.cleanUser, validated.cleanPassword)
        : authService.register(validated.cleanUser, validated.cleanPassword));

      authService.saveToken(data.token);
      setStatus(`Framgång! ${type === "login" ? "Inloggad som" : "Konto skapat för"} ${data.user.username}`);
      setPassword(""); // Rensa lösenord av säkerhetsskäl

      // Här kan du lägga till navigation, t.ex:
      // navigate("/dashboard");

    } catch (err: any) {
      // Här fångas felen som vi "kastade" i authService (t.ex. 401 Unauthorized)
      setStatus(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          className="userName input"
          type="text"
          placeholder="Användarnamn"
          value={user}
          disabled={isLoading}
          onChange={(e) => setUser(e.target.value)}
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

          <button
            className="RegBtn"
            type="button"
            disabled={isLoading}
            onClick={() => handleAuth("register")}
          >
            Registrera dig
          </button>
        </div>

        {status && (
          <div className="statusInfo">
            <p>{status}</p>
          </div>
        )}
      </form>
    </div>
  );
}