import React, { useState } from 'react';
import Map from 'react-map-gl';
import NodeTooltip from './node/NodeTooltip';
import NodeEditorModal from './node/NodeEditorModal';

const MapView = ({ nodes, onUpdateNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="h-full w-full relative">
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {nodes.map(node => (
          <NodeTooltip key={node.id} node={node} onView={setSelectedNode}>
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
              <div className="w-4 h-4 bg-red-500 rounded-full" />
            </div>
          </NodeTooltip>
        ))}
      </Map>
      <NodeEditorModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onUpdate={onUpdateNode}
      />
    </div>
  );
};

export default MapView;