import React from "react";

type FormulaMenuProps = {
  selectFormula: (formula: string) => void;
};

const formulas = [
  {
    symbol: "P",
    equation: "P = F / A (Pressure)",
    description: "Pressure = Force / Area",
  },
  {
    symbol: "F",
    equation: "F = m * a (Force)",
    description: "Force = mass * acceleration",
  },
  {
    symbol: "V",
    equation: "V = d / t (Velocity)",
    description: "Velocity = distance / time",
  },
];

const FormulaMenu: React.FC<FormulaMenuProps> = ({ selectFormula }) => {
  return (
    <div className="menu">
      <h2>Select a Formula:</h2>
      <ul>
        {formulas.map((formula, index) => (
          <li key={index} onClick={() => selectFormula(formula.equation)}>
            {formula.symbol} - {formula.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormulaMenu;

/* import React from 'react';

const formulas = {
  pressure: { equation: 'p = F / A', variables: ['F', 'A'] },
  // Add more formulas here
};

const FormulaMenu = ({ onSelectFormula }) => {
  return (
    <div>
      <h2>Select a Formula</h2>
      <select onChange={(e) => onSelectFormula(e.target.value)}>
        <option value="">Select</option>
        {Object.keys(formulas).map((key) => (
          <option key={key} value={key}>
            {formulas[key].equation}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormulaMenu; */
