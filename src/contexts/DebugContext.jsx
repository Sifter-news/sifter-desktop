import React, { createContext, useContext, useState, useEffect } from 'react';

const DebugContext = createContext({
  isDebugOpen: false,
  setIsDebugOpen: () => {},
  debugData: {},
  setDebugData: () => {},
});

export const DebugProvider = ({ children }) => {
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [debugData, setDebugData] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.metaKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDebugOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DebugContext.Provider value={{ isDebugOpen, setIsDebugOpen, debugData, setDebugData }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);