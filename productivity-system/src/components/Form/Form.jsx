import "./Form.css";
import {useState} from "react";

export default function Form() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logiken kommer här
    if (username.trim() === "" || password.trim() === "") {
      alert("Vänligen fyll i både användarnamn och lösenord.");
    } else {
      alert(`Inloggning lyckades för användare: ${username}`);
    }
    if (password.length < 6) {
      alert("Lösenordet måste vara minst 6 tecken långt.");
    }return;
  }

      console.log("Användarnamn:", username);
      console.log("Lösenord:", password);

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Logga in</h2>
      <input
        type="text"
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Logga in</button>
    </form>
  );
