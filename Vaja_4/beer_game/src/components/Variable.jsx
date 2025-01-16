import React, { createContext, useContext, useState } from "react";

// Create the Context
const GlobalStateContext = createContext();

// Create a Provider Component
export const Variable = ({ children }) => {
  // Define all global variables here
  const [variablet11, setVariablet11] = useState(5);
  const [variablet12, setVariablet12] = useState(5);
  const [variableps, setVariableps] = useState(15);
  const [variablepp, setVariablepp] = useState(0);
  // Add more variables as needed
  const [variablepc, setVariablepc] = useState(0);
  const [variablepo, setVariablepo] = useState("Value1");
  const [variablet21, setVariablet21] = useState(5);
  const [variablet22, setVariablet22] = useState(5);
  const [variableds, setVariableds] = useState(15);
  const [variabledp, setVariabledp] = useState(0);
  const [variabledc, setVariabledc] = useState(0);
  const [variabledo, setVariabledo] = useState("Value2");
  const [variablet31, setVariablet31] = useState(5);
  const [variablet32, setVariablet32] = useState(5);
  const [variablegs, setVariablegs] = useState(15);
  const [variablegp, setVariablegp] = useState(0);
  const [variablegc, setVariablegc] = useState(0);
  const [variablego, setVariablego] = useState("Value3");
  const [variablet41, setVariablet41] = useState(5);
  const [variablet42, setVariablet42] = useState(5);
  const [variablems, setVariablems] = useState(15);
  const [variablemp, setVariablemp] = useState(0);
  const [variablemc, setVariablemc] = useState(0);
  const [variablemo, setVariablemo] = useState("Value4");
  const [variableko, setVariableko] = useState(5);

  // Combine state and setters into a single object
  const globalState = {
    variablet11,
    setVariablet11,
    variablet12,
    setVariablet12,
    variableps,
    setVariableps,
    variablepp,
    setVariablepp,
    // Add remaining variables
    variablepc,
    setVariablepc,
    variablepo,
    setVariablepo,
    variablet21,
    setVariablet21,
    variablet22,
    setVariablet22,
    variableds,
    setVariableds,
    variabledp,
    setVariabledp,
    variabledc,
    setVariabledc,
    variabledo,
    setVariabledo,
    variablet31,
    setVariablet31,
    variablet32,
    setVariablet32,
    variablegs,
    setVariablegs,
    variablegp,
    setVariablegp,
    variablegc,
    setVariablegc,
    variablego,
    setVariablego,
    variablet41,
    setVariablet41,
    variablet42,
    setVariablet42,
    variablems,
    setVariablems,
    variablemp,
    setVariablemp,
    variablemc,
    setVariablemc,
    variablemo,
    setVariablemo,
    variableko,
    setVariableko,
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
