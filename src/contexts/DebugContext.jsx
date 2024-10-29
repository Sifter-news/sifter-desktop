import React, { createContext, useContext, useState, useEffect } from 'react';

const DebugContext = createContext({
  isDebugOpen: true,
  setIsDebugOpen: () => {},
  debugData: {},
  setDebugData: () => {},
  showGuides: true,
  setShowGuides: () => {},
});

export const DebugProvider = ({ children }) => {
  const [isDebugOpen, setIsDebugOpen] = useState(true);
  const [debugData, setDebugData] = useState({});
  const [showGuides, setShowGuides] = useState(true);

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
      showGuides,
      setShowGuides
    }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);