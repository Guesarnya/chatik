
import React, { createContext, useState, useContext } from 'react';

const MacroContext = createContext();

export const useMacro = () => useContext(MacroContext);

export const MacroProvider = ({ children }) => {
  const [macros, setMacros] = useState({
    protein: 197,
    fat: 40,
    carbs: 130,
    target: 3000
  });

  return (
    <MacroContext.Provider value={{ macros, setMacros }}>
      {children}
    </MacroContext.Provider>
  );
};
