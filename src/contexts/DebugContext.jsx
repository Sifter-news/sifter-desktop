import React, { createContext, useContext, useState, useEffect } from 'react';

const DebugContext = createContext({
  isDebugOpen: true,
  setIsDebugOpen: () => {},
  debugData: {},
  setDebugData: () => {},
  showNodeDebug: false,
  setShowNodeDebug: () => {},
  addError: () => {},
  clearErrors: () => {},
});

export const DebugProvider = ({ children }) => {
  const [isDebugOpen, setIsDebugOpen] = useState(true);
  const [debugData, setDebugData] = useState({ errors: [] });
  const [showNodeDebug, setShowNodeDebug] = useState(false);

  const addError = (error) => {
    setDebugData(prev => ({
      ...prev,
      errors: [...(prev.errors || []), {
        timestamp: new Date().toISOString(),
        message: error.message || String(error),
        stack: error.stack,
      }]
    }));
  };

  const clearErrors = () => {
    setDebugData(prev => ({ ...prev, errors: [] }));
  };

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
    <DebugContext.Provider value={{ 
      isDebugOpen, 
      setIsDebugOpen, 
      debugData, 
      setDebugData,
      showNodeDebug,
      setShowNodeDebug,
      addError,
      clearErrors
    }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);