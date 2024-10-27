import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NodeNavigator from './text-view/NodeNavigator';
import { motion, AnimatePresence } from 'framer-motion';

const SidePanel = ({ 
  nodes, 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <AnimatePresence>
      {isExpanded ? (
        <motion.div 
          className="fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg z-50 w-[250px]"
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          exit={{ x: -250 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full z-50"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="mt-12 flex-grow overflow-hidden">
            <NodeNavigator
              nodes={nodes}
              onUpdateNode={onUpdateNode}
              onNodeFocus={onNodeFocus}
              selectedNode={selectedNode}
              onAddNode={onAddNode}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-20 left-4 bg-white shadow-lg hover:bg-gray-100 rounded-full z-50 w-10 h-10"
            onClick={() => setIsExpanded(true)}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;