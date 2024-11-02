import React, { useEffect, useState } from 'react';
import Canvas3D from '@/01_components/05_investigation/views/02_MindView/Canvas3D';
import { mapNodePositions } from '@/utils/positionMapping';
import { toast } from 'sonner';

const MindMapView = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus 
}) => {
  const [mappedNodes, setMappedNodes] = useState(nodes);

  useEffect(() => {
    const initializeNodes = async () => {
      try {
        const mapped = await mapNodePositions(nodes);
        setMappedNodes(mapped);
        toast.success('Node positions mapped successfully');
      } catch (error) {
        console.error('Error mapping nodes:', error);
        toast.error('Failed to map node positions');
      }
    };

    initializeNodes();
  }, [nodes]);

  return (
    <div className="h-full w-full relative">
      <Canvas3D 
        nodes={mappedNodes}
        setNodes={setNodes}
        onNodeUpdate={onUpdateNode}
        onNodeDelete={onDeleteNode}
        focusedNodeId={focusedNodeId}
        onNodeFocus={onNodeFocus}
        onAddNode={onAddNode}
      />
    </div>
  );
};

export default MindMapView;