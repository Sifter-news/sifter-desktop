import React, { useState } from 'react';
import { Map as MapGL } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import NodeTooltip from './node/NodeTooltip';
import UnifiedNodeEditModal from './modals/ModalEdit_Node';

const MapView = ({ nodes, onUpdateNode, focusedNodeId, onNodeFocus, onDelete }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;

  const handleNodeClick = (node) => {
    onNodeFocus(node.id);
    setSelectedNode(node);
  };

  if (!token) {
    return <div className="p-4">Please add your Mapbox token to the .env file</div>;
  }

  return (
    <div className="h-full w-full relative">
      <MapGL
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={token}
      >
        {nodes.map(node => (
          <NodeTooltip key={node.id} node={node} onView={handleNodeClick}>
            <div 
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                focusedNodeId === node.id ? 'scale-125 z-10' : ''
              }`}
            >
              <div className={`w-4 h-4 rounded-full ${
                focusedNodeId === node.id 
                  ? 'bg-blue-600 ring-4 ring-blue-200' 
                  : 'bg-red-500 hover:bg-red-600'
              }`} />
            </div>
          </NodeTooltip>
        ))}
      </MapGL>
      <UnifiedNodeEditModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onUpdate={onUpdateNode}
        onDelete={() => {
          onDelete(selectedNode.id);
          setSelectedNode(null);
        }}
      />
    </div>
  );
};

export default MapView;