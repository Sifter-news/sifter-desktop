import React from 'react';
import ThreeDCanvas from './ThreeDCanvas';

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
  return (
    <div className="h-full w-full relative">
      <ThreeDCanvas 
        nodes={nodes}
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