import React from "react";

type ResultProps = {
  result: number;
};

const Result: React.FC<ResultProps> = ({ result }) => {
  return (
    <div className="result">
      <h3>Result: {result}</h3>
    </div>
  );
};

export default Result;

/* import React from 'react';

const Result = ({ result }) => (
  <div>
    <h3>Result</h3>
    {result !== null ? <p>{result}</p> : <p>Please enter values.</p>}
  </div>
);

export default Result; */
