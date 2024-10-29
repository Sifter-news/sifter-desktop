import React, { createContext, useContext, useState, useEffect } from 'react';

const DebugContext = createContext({
  isDebugOpen: true,
  setIsDebugOpen: () => {},
  debugData: {},
  setDebugData: () => {},
  showGuides: false,
  setShowGuides: () => {},
  hoveredElement: null,
  setHoveredElement: () => {},
});

export const DebugProvider = ({ children }) => {
  const [isDebugOpen, setIsDebugOpen] = useState(true);
  const [debugData, setDebugData] = useState({});
  const [showGuides, setShowGuides] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);

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
      setShowGuides,
      hoveredElement,
      setHoveredElement
    }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);