import {useState} from "react";
import "./userLogin.css";


export default function UserLogin () {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [status, setStatus] = useState<string> ("");

      // function handleUserRegistration () {

      // }

      const handleLogin = (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
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

      <form onSubmit= {handleLogin}>
        <input
          className="userName input"
          type="text"
          placeholder="användarnamn"
          value={user}
          onChange={(e) => setUser(e.target.value)} />

        <input
          className="password input"
          type="password"
          placeholder="lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        <button
          className="LogInBtn"
          type="submit">
            Logga in
        </button>

        <div
        className="statusInfo">
          {status && <p>{status}</p>}
        </div>
      </form>

  );
}
