import React, { useState } from 'react';

const InputForm = ({ formula, variables, onSubmit }) => {
  const [inputs, setInputs] = useState({});

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputs);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Input values for {formula}</h3>
      {variables.map((variable) => (
        <div key={variable}>
          <label>{variable}:</label>
          <input
            type="number"
            name={variable}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit">Calculate</button>
    </form>
  );
};

export default InputForm;
