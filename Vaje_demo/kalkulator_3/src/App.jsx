import { useEffect, useReducer } from "react";
import { calculatorReducer, initialState } from "./calculator.js";
import "./App.css";

const buttons = [
  { label: "AC", action: "CLEAR", className: "wide" },
  { label: "DEL", action: "DELETE" },
  { label: "÷", action: "OPERATOR", value: "/" },
  { label: "1", action: "DIGIT", value: "1" },
  { label: "2", action: "DIGIT", value: "2" },
  { label: "3", action: "DIGIT", value: "3" },
  { label: "*", action: "OPERATOR", value: "*" },
  { label: "4", action: "DIGIT", value: "4" },
  { label: "5", action: "DIGIT", value: "5" },
  { label: "6", action: "DIGIT", value: "6" },
  { label: "+", action: "OPERATOR", value: "+" },
  { label: "7", action: "DIGIT", value: "7" },
  { label: "8", action: "DIGIT", value: "8" },
  { label: "9", action: "DIGIT", value: "9" },
  { label: "-", action: "OPERATOR", value: "-" },
  { label: ".", action: "DECIMAL" },
  { label: "0", action: "DIGIT", value: "0" },
  { label: "=", action: "EQUALS", className: "wide equals" },
];

function CalculatorButton({ button, onPress }) {
  return (
    <button
      type="button"
      className={`key ${button.className || ""}`}
      onClick={() => onPress({ type: button.action, value: button.value })}
      aria-label={button.label === "÷" ? "Deljenje" : button.label}
    >
      {button.label}
    </button>
  );
}

function CalculatorDisplay({ expression, display }) {
  return (
    <div className="display" aria-live="polite" aria-atomic="true">
      <div className="expression">{expression || "\u00a0"}</div>
      <div className="result">{display}</div>
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key;
      let action = null;
      if (/^[0-9]$/.test(key)) action = { type: "DIGIT", value: key };
      else if (key === "." || key === ",") action = { type: "DECIMAL" };
      else if (["+", "-", "*", "/"].includes(key)) {
        action = { type: "OPERATOR", value: key };
      } else if (key === "Enter" || key === "=") action = { type: "EQUALS" };
      else if (key === "Backspace") action = { type: "DELETE" };
      else if (key === "Escape") action = { type: "CLEAR" };

      if (action) {
        event.preventDefault();
        dispatch(action);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="page">
      <section className="calculator" aria-label="Kalkulator">
        <CalculatorDisplay
          expression={state.expression}
          display={state.display}
        />
        <div className="keyboard">
          {buttons.map((button) => (
            <CalculatorButton
              key={`${button.action}-${button.label}`}
              button={button}
              onPress={dispatch}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
