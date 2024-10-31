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
