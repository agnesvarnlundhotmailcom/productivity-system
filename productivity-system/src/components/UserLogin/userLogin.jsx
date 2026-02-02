import {useState} from "react";
import "./userLogin.css";


export default function UserLogin () {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState ("");

      // function handleUserRegistration () {

      // }

      function handleLogin () {
        const cleanUser = user.trim();
        const cleanPassword = password.trim();

        if (!cleanUser||!cleanPassword){
        setStatus("Användarnamn / lösenord saknas.");
        return;
        }
        if (cleanUser.length <6) {
        setStatus("Användarnamnet måste vara minst 6 tecken.");
        return;
        }
        if (cleanPassword.length<6) {
        setStatus("Lösenordet måste vara minst 6 tecken.");
        return;
        }

        setStatus(`Inloggad som ${cleanUser}`);
        setPassword(""); //rensa lösenord efter login

      }

  return (
      <>
      <input
        className="userName"
        type="username"
        placeholder="användarnamn"
        value={user}
        onChange={(e) => setUser(e.target.value)} />

      <input
        className="password"
        type="password"
        placeholder="lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />

      <button
        className="LogInBtn"
        onClick={handleLogin}>
          Logga in
      </button>

      <div
      className="statusInfo">
        {status && <p>{status}</p>}

      </div>


      </>
  );
}