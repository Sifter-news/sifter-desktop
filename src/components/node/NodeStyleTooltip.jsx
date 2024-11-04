import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle, Pencil, Type, ChevronDown } from 'lucide-react';
import UnifiedNodeEditModal from '../modals/ModalEdit_Node';
import ColorMenu from './tooltip/ColorMenu';
import StyleMenu from './tooltip/StyleMenu';
import TypeMenu from './tooltip/TypeMenu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const textSizes = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  huge: 'Huge'
};

const NodeStyleTooltip = ({
  position,
  onStyleChange,
  onTextSizeChange,
  onAlignmentChange,
  onTypeChange,
  onColorChange,
  onEdit,
  onAIChat,
  node,
  onUpdateNode,
  onDelete
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);
  const [typeMenuOpen, setTypeMenuOpen] = useState(false);
  const [textSizeMenuOpen, setTextSizeMenuOpen] = useState(false);
  
  const currentColor = node?.color || 'bg-white';
  const currentStyle = node?.visualStyle || 'default';
  const currentType = node?.nodeType || 'generic';
  const currentTextSize = node?.textSize || 'medium';

  return (
    <>
      <div 
        className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex items-center gap-1 p-1.5 bg-black rounded-lg shadow-lg"
        style={{ zIndex: 9999 }} // Ensure tooltip is above all other elements
      >
        <TooltipProvider>
          <Tooltip>
            <Popover open={textSizeMenuOpen} onOpenChange={setTextSizeMenuOpen}>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
                    <Type className="h-4 w-4" />
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <PopoverContent className="w-32">
                <div className="flex flex-col space-y-0.5">
                  {Object.entries(textSizes).map(([size, label]) => (
                    <Button
                      key={size}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onTextSizeChange(size);
                        setTextSizeMenuOpen(false);
                      }}
                      className={`justify-start h-7 ${currentTextSize === size ? 'bg-accent' : ''}`}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <TooltipContent side="top" className="bg-black text-white">
              <p>Text Size</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="bg-white/20 h-4" />

        <ColorMenu
          currentColor={currentColor}
          onColorChange={onColorChange}
          isOpen={colorMenuOpen}
          setIsOpen={setColorMenuOpen}
        />

        <StyleMenu
          currentStyle={currentStyle}
          onStyleChange={onStyleChange}
          isOpen={styleMenuOpen}
          setIsOpen={setStyleMenuOpen}
        />

        <TypeMenu
          currentType={currentType}
          onTypeChange={onTypeChange}
          isOpen={typeMenuOpen}
          setIsOpen={setTypeMenuOpen}
        />

        <Separator orientation="vertical" className="bg-white/20 h-4" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-7 px-2"
                onClick={() => setShowEditModal(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black text-white">
              <p>Edit Node</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-purple-700 bg-purple-600 h-7 px-2"
                onClick={onAIChat}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black text-white">
              <p>AI Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <UnifiedNodeEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={onUpdateNode}
        onDelete={onDelete}
      />
    </>
  );
};

export default NodeStyleTooltip;