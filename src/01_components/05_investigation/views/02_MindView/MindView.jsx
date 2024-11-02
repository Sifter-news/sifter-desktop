/**
 * @file MindView.jsx
 * @description Mind map view to represent data connections in 2D or 3D modes
 * 
 * Potential improvements:
 * - Add auto-layout algorithms
 * - Add zoom to fit functionality
 * - Add node grouping
 * - Add connection types
 * - Add mini-map for navigation
 * - Add node filtering
 * - Add node search
 */

import React, { useEffect, useState } from 'react';
import ThreeDCanvas from './ThreeDCanvas';
import { mapNodePositions } from '@/utils/positionMapping';
import { toast } from 'sonner';

const MindView = ({ 
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
      <ThreeDCanvas 
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

export default MindView;