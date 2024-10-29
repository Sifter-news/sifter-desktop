import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

const ToolbarButton = ({ 
  icon, 
  label, 
  shortcut,
  onClick, 
  isActive, 
  onDragStart, 
  draggable,
  activeClassName = 'bg-black text-white'
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          size="icon" 
          variant="ghost" 
          className={`
            relative rounded-full 
            transition-all duration-200 
            hover:bg-gray-100 
            active:scale-95
            ${isActive ? activeClassName : ''}
          `}
          onClick={onClick}
          onDragStart={onDragStart}
          draggable={draggable}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={false}
            animate={{
              backgroundColor: isActive ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0)',
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            initial={false}
            animate={{
              color: isActive ? 'white' : 'black',
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm">
        <p>{label} {shortcut && <span className="text-gray-400">({shortcut})</span>}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default ToolbarButton;