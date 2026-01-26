import { useState } from "react";
import "./FlowTimer.css";

export default function FlowTimer({appName = "FlowTime", tagline = "Din produktivitetspartner"}) {

const [secondsWork, setSecondsWork] = useState(0);


  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatMMSS(totalSeconds) {
    const m= Math.floor(totalSeconds/60);
    const s= totalSeconds % 60;
    return `${pad2(m)}:${pad2(s)}`;
  }

  return (
    <div className="ftWrap">
      {/* Lägg header + card + stats här, men utan logik först */}
      <header className="ftHeader">
        <h1>{appName}</h1>
        <p>{tagline}</p>
        <div>{formatMMSS(secondsWork)}</div>
        <button onClick={() => setSecondsWork(secondsWork + 1)}>+1 sekund</button>
      </header>
    </div>
  );
}