import { useState } from "react";
import { authService } from "../../services/authService";
import "./userLogin.css";

export default function UserLogin() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    try {
      const data = await (type === "login"
        ? authService.login(validated.cleanEmail, validated.cleanPassword)
        : authService.register(validated.cleanEmail, validated.cleanPassword));

      authService.saveToken(data.token);

      if (type === "register") {
        setStatus("Konto skapat! Kolla din e-post för bekräftelse.");
      } else {
        setStatus(`Välkommen tillbaka, ${data.user.username}!`);
      }

      setPassword("");

    } catch (err: any) {
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