import { useState } from 'react';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);

  const handleConnectionStart = (startX, startY) => {
    setActiveConnection({
      startX,
      startY,
      endX: startX,
      endY: startY
    });
  };

  const handleConnectionEnd = (endX, endY) => {
    if (activeConnection) {
      setConnections(prev => [...prev, {
        ...activeConnection,
        endX,
        endY
      }]);
      setActiveConnection(null);
    }
  };

  return {
    connections,
    activeConnection,
    setActiveConnection,
    handleConnectionStart,
    handleConnectionEnd
  };
};