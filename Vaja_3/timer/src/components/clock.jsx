import React, { useState, useEffect } from "react";
import "./App.css"; // Ustvari CSS datoteko ali uporabi style inline

const CircleTimer = ({ duration }) => {
  const [remainingTime, setRemainingTime] = useState(duration);
  const circumference = 2 * Math.PI * 100; // Obseg kroga (r = 100)

  useEffect(() => {
    if (remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Počisti interval
  }, [remainingTime]);

  // Izračunaj preostali del kroga
  const offset = (remainingTime / duration) * circumference;

  return (
    <div className="circle-timer">
      <svg width="200" height="200">
        <circle
          className="background"
          cx="100"
          cy="100"
          r="100"
          stroke="#ddd"
          strokeWidth="12"
          fill="none"
        />
        <circle
          className="progress"
          cx="100"
          cy="100"
          r="100"
          stroke="#3498db"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="time">{remainingTime > 0 ? remainingTime : "Done!"}</div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <h1>Circular Timer</h1>
      <CircleTimer duration={10} /> {/* Nastavi čas v sekundah */}
    </div>
  );
};

export default App;
