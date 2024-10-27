import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from '../Navigator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NodeNavigator = ({ nodes, onUpdateNode, onNodeFocus, selectedNode, onAddNode }) => {
  const [selectedType, setSelectedType] = useState('all');

  const handleAddNode = () => {
    const position = {
      x: Math.random() * 500,
      y: Math.random() * 500
    };

    onAddNode({
      id: Date.now().toString(),
      type: 'text',
      title: `New Node ${nodes.length + 1}`,
      description: '',
      x: position.x,
      y: position.y
    });
  };

  const filteredNodes = selectedType === 'all' 
    ? nodes 
    : nodes.filter(node => node.nodeType === selectedType);

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Node Navigator</h2>
      <div className="mb-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="generic">Generic Note</SelectItem>
              <SelectItem value="node_person">Person</SelectItem>
              <SelectItem value="node_organization">Organization</SelectItem>
              <SelectItem value="node_object">Object</SelectItem>
              <SelectItem value="node_concept">Concept</SelectItem>
              <SelectItem value="node_location">Location</SelectItem>
              <SelectItem value="node_event">Event</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Navigator 
          items={filteredNodes} 
          setItems={onUpdateNode} 
          onDocumentClick={(node) => onNodeFocus(node.id)}
          focusedNode={selectedNode}
        />
      </div>
      <Button onClick={handleAddNode} className="mt-4 w-full">Add Node</Button>
    </div>
  );
};

export default NodeNavigator;