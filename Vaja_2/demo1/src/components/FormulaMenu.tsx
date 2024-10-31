import React from "react";

type FormulaMenuProps = {
  selectFormula: (formula: string) => void;
};

const formulas = [
  {
    symbol: "P",
    equation: "P = F / A",
    description: "Pressure = Force / Area",
  },
  {
    symbol: "F",
    equation: "F = m * a",
    description: "Force = mass * acceleration",
  },
  {
    symbol: "V",
    equation: "V = d / t",
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
            {formula.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormulaMenu;
