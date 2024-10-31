import React, { useState } from "react";

type InputFormProps = {
  selectedFormula: string;
  calculateResult: (inputs: number[]) => void;
};

const InputForm: React.FC<InputFormProps> = ({
  selectedFormula,
  calculateResult,
}) => {
  const [input1, setInput1] = useState(0);
  const [input2, setInput2] = useState(0);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    calculateResult([input1, input2]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Formula: {selectedFormula}</h3>
      <label>
        Input 1:
        <input
          type="number"
          value={input1}
          onChange={(e) => setInput1(parseFloat(e.target.value))}
        />
      </label>
      <label>
        Input 2:
        <input
          type="number"
          value={input2}
          onChange={(e) => setInput2(parseFloat(e.target.value))}
        />
      </label>
      <button type="submit">Calculate</button>
    </form>
  );
};

export default InputForm;
