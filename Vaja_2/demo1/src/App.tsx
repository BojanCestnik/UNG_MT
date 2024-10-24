import React, { useState } from "react";
import FormulaMenu from "./components/FormulaMenu";
import InputForm from "./components/InputForm";
import Result from "./components/Result";
import "./App.css";

const App: React.FC = () => {
  const [selectedFormula, setSelectedFormula] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const selectFormula = (formula: string) => {
    setSelectedFormula(formula);
    setResult(null);
  };

  const calculateResult = (inputs: number[]) => {
    let calculatedResult = 0;
    if (selectedFormula.includes("P = F / A")) {
      calculatedResult = inputs[0] / inputs[1]; // P = F / A
    } else if (selectedFormula.includes("F = m * a")) {
      calculatedResult = inputs[0] * inputs[1]; // F = m * a
    } else if (selectedFormula.includes("V = d / t")) {
      calculatedResult = inputs[0] / inputs[1]; // V = d / t
    }
    setResult(calculatedResult);
  };

  return (
    <div className="app">
      <FormulaMenu selectFormula={selectFormula} />
      {selectedFormula && (
        <>
          <InputForm
            selectedFormula={selectedFormula}
            calculateResult={calculateResult}
          />
          {result !== null && <Result result={result} />}
        </>
      )}
    </div>
  );
};

export default App;

/* import React, { useState } from "react";
import FormulaMenu from "./components/FormulaMenu";
import InputForm from "./components/InputForm";
import Result from "./components/Result";

const formulas = {
  pressure: { equation: "p = F / A", variables: ["F", "A"] },
  // Add more formulas here
};

const App = () => {
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(null);

  const handleSelectFormula = (formulaKey) => {
    if (formulaKey) {
      setSelectedFormula(formulaKey);
      setInputs({});
      setResult(null);
    }
  };

  const handleSubmit = (inputs) => {
    let res = null;
    if (selectedFormula === "pressure") {
      const { F, A } = inputs;
      res = F / A;
    }
    // Handle other formulas here
    setResult(res);
  };

  return (
    <div>
      <h1>Physics Formula Solver</h1>
      <FormulaMenu onSelectFormula={handleSelectFormula} />
      {selectedFormula && (
        <InputForm
          formula={formulas[selectedFormula].equation}
          variables={formulas[selectedFormula].variables}
          onSubmit={handleSubmit}
        />
      )}
      <Result result={result} />
    </div>
  );
};

export default App; */

/* import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App */

/* import { useState } from "react";

function App() {
  // State to hold the three input numbers
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [num3, setNum3] = useState(0);

  // State to hold the result of the calculations
  const [result, setResult] = useState(null);

  // Handlers for the calculations based on different formulas
  const calculateFormula1 = () => {
    // Example formula 1: sum of all three numbers
    setResult(num1 + num2 + num3);
  };

  const calculateFormula2 = () => {
    // Example formula 2: product of all three numbers
    setResult(num1 * num2 * num3);
  };

  const calculateFormula3 = () => {
    // Example formula 3: average of the numbers
    setResult((num1 + num2 + num3) / 3);
  };

  const calculateFormula4 = () => {
    // Example formula 4: (num1 + num2) - num3
    setResult(num1 + num2 - num3);
  };

  const calculateFormula5 = () => {
    // Example formula 5: max of the three numbers
    setResult(Math.max(num1, num2, num3));
  };

  return (
    <div className="App">
      <h1>Three Numbers Calculator</h1>

      <div>
        <label>Number 1: </label>
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Number 2: </label>
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Number 3: </label>
        <input
          type="number"
          value={num3}
          onChange={(e) => setNum3(Number(e.target.value))}
        />
      </div>

      <div>
        <button onClick={calculateFormula1}>Formula 1</button>
        <button onClick={calculateFormula2}>Formula 2</button>
        <button onClick={calculateFormula3}>Formula 3</button>
        <button onClick={calculateFormula4}>Formula 4</button>
        <button onClick={calculateFormula5}>Formula 5</button>
      </div>

      {result !== null && <h2>Result: {result}</h2>}
    </div>
  );
}

export default App; */
