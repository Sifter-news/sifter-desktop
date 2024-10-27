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
    <div className="relative">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div 
            className="fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg z-50 w-[250px]"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="mt-4 flex-grow overflow-hidden">
              <NodeNavigator
                nodes={nodes}
                onUpdateNode={onUpdateNode}
                onNodeFocus={onNodeFocus}
                selectedNode={selectedNode}
                onAddNode={onAddNode}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-20 left-0 z-50"
      >
        <Button
          variant="secondary"
          size="icon"
          className={`flex items-center justify-center w-8 h-8 rounded-full shadow-lg bg-white hover:bg-gray-100 ${
            isExpanded ? 'ml-[250px]' : 'ml-4'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default SidePanel;