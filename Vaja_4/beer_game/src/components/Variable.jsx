import React, { createContext, useContext, useState } from "react";

// Create the Context
const GlobalStateContext = createContext();

// Create a Provider Component
export const Variable = ({ children }) => {
  // Define all global variables here
  const [variable1, setVariable1] = useState("value1");
  const [variable2, setVariable2] = useState("value2");
  const [variable3, setVariable3] = useState(0);
  const [variable4, setVariable4] = useState(true);
  // Add more variables as needed
  const [variable15, setVariable15] = useState("value15");

  // Combine state and setters into a single object
  const globalState = {
    variable1,
    setVariable1,
    variable2,
    setVariable2,
    variable3,
    setVariable3,
    variable4,
    setVariable4,
    // Add remaining variables
    variable15,
    setVariable15,
  };

  return (
    <GlobalStateContext.Provider value={globalState}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom Hook for accessing the Global State
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
