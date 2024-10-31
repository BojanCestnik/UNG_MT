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
