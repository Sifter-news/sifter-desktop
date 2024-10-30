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

    const handleMouseOver = (e) => {
      if (!showInspector) return;
      
      const element = e.target;
      const componentName = element.getAttribute('data-component-name');
      if (componentName) {
        const rect = element.getBoundingClientRect();
        setHoveredElement({
          component: componentName,
          metadata: {
            id: element.id,
            className: element.className,
            rect: {
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }
          }
        });

        // Add outline to hovered element
        element.style.outline = '2px solid rgba(99, 102, 241, 0.5)';
        element.style.outlineOffset = '2px';
      }
    };

    const handleMouseOut = (e) => {
      if (!showInspector) return;
      
      const element = e.target;
      if (element.getAttribute('data-component-name')) {
        setHoveredElement(null);
        element.style.outline = '';
        element.style.outlineOffset = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [showInspector]);

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
      {showInspector && hoveredElement && hoveredElement.metadata?.rect && (
        <div 
          className="fixed bg-black/90 text-white px-3 py-2 rounded-lg shadow-lg z-[99999] text-sm"
          style={{
            top: hoveredElement.metadata.rect.top + hoveredElement.metadata.rect.height + 8,
            left: hoveredElement.metadata.rect.left,
          }}
        >
          <p className="font-medium text-blue-400">{hoveredElement.component}</p>
          {hoveredElement.metadata && Object.entries(hoveredElement.metadata).map(([key, value]) => (
            key !== 'rect' && (
              <p key={key} className="text-xs mt-1">
                <span className="text-gray-400">{key}:</span>{' '}
                <span className={`${value ? 'text-green-400' : 'text-orange-400'}`}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </p>
            )
          ))}
        </div>
      )}
    </DebugContext.Provider>
  );
};

export const useDebug = () => useContext(DebugContext);