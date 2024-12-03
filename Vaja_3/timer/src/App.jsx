import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import TimerInput from './components/TimerInput';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import './App.css'

function App() {
  // const [count, setCount] = useState(0)
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
    // Effect to handle countdown
    useEffect(() => {
      let timer;
      if (isRunning && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0 && isRunning) {
        setIsRunning(false);
        alert("Time's up!");
      }
      return () => clearInterval(timer); // Cleanup
    }, [isRunning, timeLeft]);
  
    const handleStart = () => {
      if (duration > 0 && timeLeft === 0) {
        setTimeLeft(duration);
      }
      setIsRunning(true);
    };
  
    const handlePause = () => {
      setIsRunning(false);
    };
  
    const handleReset = () => {
      setIsRunning(false);
      setTimeLeft(0);
    };

  return (
    <>
      <div className="card">
        <h1>Timer</h1>
        <TimerInput setDuration={setDuration} />
        <TimerDisplay timeLeft={timeLeft} />
        <TimerControls onStart={handleStart} onPause={handlePause} onReset={handleReset} />
      </div>
    </>
  )
}
export default App


/* Previous version:
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <h1>Timer</h1>
        <label for="duration">Enter time in seconds:</label><br></br>
        <input type="number" id="duration" name="duration" min="1" max="1800"></input>
        <p>00</p>
        <button id="start">start</button>
        <button id="pause">pause</button>
        <button id="reset">reset</button>
      </div>
      
    </>
  )
}
export default App */