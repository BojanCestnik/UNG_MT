import React, { useState } from 'react';

const TimerInput = ({ setDuration }) => {
  const [input, setInput] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setInput(value);
    }
  };

  const handleSetDuration = () => {
    setDuration(Number(input));
  };

  return (
    <div>
      <label>Enter time in seconds:</label>
      <input
        type="number"
        value={input}
        onChange={handleChange}
        placeholder="Enter seconds"
      />
      <button onClick={handleSetDuration}>
        set timer
      </button>
    </div>
  );
};

export default TimerInput;
