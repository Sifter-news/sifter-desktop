import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConnectionDot from './ConnectionDot';
import NodeContent from './NodeContent';

const NodeRenderer = ({ node, onDragStart, zoom, onNodeUpdate, onFocus, isFocused, onAIConversation, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [hoveredDot, setHoveredDot] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleStyleChange = (value) => {
    onNodeUpdate(node.id, { visualStyle: value });
    setIsEditing(false);
  };

  const handleTypeChange = (value) => {
    onNodeUpdate(node.id, { nodeType: value });
    setIsEditing(false);
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  const handleEditSave = () => {
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
    setShowEditDialog(false);
  };

  const styles = {
    compact: "Compact",
    expanded: "Expanded",
    postit: "Post-it"
  };

  const nodeTypes = {
    generic: "Generic Note",
    node_person: "Person",
    node_organization: "Organization",
    node_object: "Object",
    node_concept: "Concept",
    node_location: "Location",
    node_event: "Event"
  };

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        scale={zoom}
        className={`relative rounded-lg ${
          isFocused 
            ? 'ring-2 ring-blue-500/20 ring-offset-2 shadow-lg scale-[1.02]' 
            : 'hover:ring-1 hover:ring-blue-300/20 hover:ring-offset-1 hover:shadow-md hover:scale-[1.01]'
        }`}
      >
        <NodeContent
          style={node.visualStyle}
          isEditing={isEditing}
          node={node}
          localTitle={localTitle}
          localDescription={localDescription}
          handleBlur={handleEditSave}
          setLocalTitle={setLocalTitle}
          setLocalDescription={setLocalDescription}
          handleNodeClick={handleNodeClick}
        />
        {['top', 'bottom', 'left', 'right'].map(position => (
          <ConnectionDot
            key={position}
            position={position}
            isHovered={hoveredDot === position}
            onHover={() => setHoveredDot(position)}
            onLeaveHover={() => setHoveredDot(null)}
            onStartConnection={() => console.log(`Starting connection from ${position}`)}
          />
        ))}
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 cursor-move" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="flex gap-2 bg-black text-white border-black p-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                    <Layout className="h-4 w-4 mr-2" />
                    {styles[node.visualStyle] || "Style"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32">
                  <div className="flex flex-col space-y-1">
                    {Object.entries(styles).map(([value, label]) => (
                      <Button
                        key={value}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStyleChange(value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
                    <Type className="h-4 w-4 mr-2" />
                    {nodeTypes[node.nodeType] || "Type"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="flex flex-col space-y-1">
                    {Object.entries(nodeTypes).map(([value, label]) => (
                      <Button
                        key={value}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTypeChange(value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-purple-700 bg-purple-600"
                onClick={() => onAIConversation(node)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-gray-800"
                onClick={() => onDelete(node.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Node</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="title" className="text-right">
                  Title
                </label>
                <Input
                  id="title"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleEditSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Rnd>
    </div>
  );
};

export default NodeRenderer;