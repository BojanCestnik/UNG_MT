import React from 'react';

const Result = ({ result }) => (
  <div>
    <h3>Result</h3>
    {result !== null ? <p>{result}</p> : <p>Please enter values.</p>}
  </div>
);

export default Result;
