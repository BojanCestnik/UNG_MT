import React from "react";
import { useGlobalState } from "./Variable";

const Kupec = () => {
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

export default Kupec;

/* import React, { useState, useEffect } from "react";

const kupec = ({ teden, onNarocilo }) => {
  const [narocilo, setNarocilo] = useState(5); // Začetno naročilo je 5 enot

  useEffect(() => {
    // Logika za spreminjanje naročil glede na trenutni teden
    if (teden > 5) {
      setNarocilo(9); // Po 5. tednu naročilo postane 9 enot
    }
    if (onNarocilo && typeof onNarocilo === "function") {
      onNarocilo(narocilo); // Pošlje naročilo ob spremembi
    }
  }, [teden]); // Ob spremembi tedna prilagodi naročilo

  return (
    <div className="kupec-container" style={{ border: "1px solid red", padding: "10px", borderRadius: "5px" }}>
      <h3>Kupec</h3>
      <p>Trenutni teden: {teden}</p>
      <p>Naročilo za ta teden: {narocilo}</p>
    </div>
  );
}; */
