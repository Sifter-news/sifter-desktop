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
  showInspector: false,
  setShowInspector: () => {},
});

export const DebugProvider = ({ children }) => {
  const [isDebugOpen, setIsDebugOpen] = useState(true);
  const [debugData, setDebugData] = useState({});
  const [showGuides, setShowGuides] = useState(false);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [showInspector, setShowInspector] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.altKey && e.metaKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDebugOpen(prev => !prev);
      }
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setShowInspector(prev => !prev);
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
      setHoveredElement,
      showInspector,
      setShowInspector
    }}>
      {children}
      {showInspector && hoveredElement && <ElementInspector />}
    </DebugContext.Provider>
  );
};

const ElementInspector = () => {
  const { hoveredElement } = useDebug();
  
  if (!hoveredElement) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg z-[99999] backdrop-blur-sm border border-white/20"
      style={{ maxWidth: '400px' }}
    >
      <div className="text-sm font-mono">
        <div className="text-blue-400 font-bold mb-2">{hoveredElement.component}</div>
        {hoveredElement.metadata && (
          <div className="space-y-1">
            {Object.entries(hoveredElement.metadata).map(([key, value]) => (
              <div key={key} className="grid grid-cols-[100px,1fr] gap-2">
                <span className="text-gray-400">{key}:</span>
                <span className="text-white break-all">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const useDebug = () => useContext(DebugContext);