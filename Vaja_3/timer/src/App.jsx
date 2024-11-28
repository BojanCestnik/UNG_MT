import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="card">
        <h1>Timer</h1>
        <label for="duration">Enter time in seconds:</label><br></br>
        <input type="number" id="duration" name="duration" min="1" max="1800"></input>
        <p>00</p>
        <button id="start" /*onClick={}*/>start</button>
        <button id="pause">pause</button>
        <button id="reset">reset</button>
      </div>
      
    </>
  )
}
export default App