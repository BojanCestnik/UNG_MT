import React from 'react';

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

export default FormulaMenu;
