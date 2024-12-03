import React from 'react';

const TimerControls = ({ onStart, onPause, onReset }) => {
  return (
    <div>
      <button onClick={onStart}>
        start
      </button>
      <button onClick={onPause}>
        pause
      </button>
      <button onClick={onReset}>
        reset
      </button>
    </div>
  );
};

export default TimerControls;
