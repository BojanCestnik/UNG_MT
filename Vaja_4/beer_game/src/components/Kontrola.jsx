import React from "react";
import { useGlobalState } from "./GlobalStateProvider";

const Kontrola = () => {
  const {
    variable1,
    setVariable1,
    variable3,
    setVariable3,
  } = useGlobalState();

  const handleUpdate = () => {
    setVariable1("Updated Value");
    setVariable3(variable3 + 1);
  };

  return (
    <div>
      <p>Variable1: {variable1}</p>
      <p>Variable3: {variable3}</p>
      <button onClick={handleUpdate}>Update Variables</button>
    </div>
  );
};

export default Kontrola;