import React, { useState, useRef, useEffect } from 'react';
import { useZoomPan } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import AISidePanel from './AISidePanel';
import NodeEditorModal from './node/NodeEditorModal';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import ThreeDCanvas from './ThreeDCanvas';

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
  return (
    <div className="h-full w-full relative">
      <ThreeDCanvas />
    </div>
  );
};

export default MindMapView;
