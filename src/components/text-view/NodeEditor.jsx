import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NodeEditor = ({ selectedNode, onUpdateNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedNode?.title || '');
  const [editedDescription, setEditedDescription] = useState(selectedNode?.description || '');
  const [nodeType, setNodeType] = useState(selectedNode?.nodeType || 'generic');

  React.useEffect(() => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title || '');
      setEditedDescription(selectedNode.description || '');
      setNodeType(selectedNode.nodeType || 'generic');
    }
  }, [selectedNode]);

  const handleSave = async () => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        title: editedTitle,
        description: editedDescription,
        nodeType: nodeType
      };

      try {
        const { error } = await supabase
          .from('node')
          .update({
            title: editedTitle,
            description: editedDescription,
            type: nodeType
          })
          .eq('id', selectedNode.id);

        if (error) throw error;

        onUpdateNode(updatedNode);
        setIsEditing(false);
        toast.success("Node updated successfully");
      } catch (error) {
        console.error('Error updating node:', error);
        toast.error("Failed to update node");
      }
    }
  };

  const renderMetadataFields = () => {
    switch (nodeType) {
      case 'node_person':
        return (
          <div className="space-y-2">
            <Input placeholder="Full Name" className="w-full" />
            <Input placeholder="Age" type="number" className="w-full" />
            <Input placeholder="Occupation" className="w-full" />
          </div>
        );
      case 'node_organization':
        return (
          <div className="space-y-2">
            <Input placeholder="Organization Name" className="w-full" />
            <Input placeholder="Founded Date" type="date" className="w-full" />
            <Input placeholder="Industry" className="w-full" />
          </div>
        );
      case 'node_event':
        return (
          <div className="space-y-2">
            <Input placeholder="Event Date" type="datetime-local" className="w-full" />
            <Input placeholder="Location" className="w-full" />
            <Input placeholder="Duration" className="w-full" />
          </div>
        );
      case 'node_location':
        return (
          <div className="space-y-2">
            <Input placeholder="Address" className="w-full" />
            <Input placeholder="Coordinates" className="w-full" />
            <Input placeholder="Type of Location" className="w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-center text-gray-500">
        <div>
          <h2 className="text-lg font-semibold mb-4">Node Editor</h2>
          Select a node from the navigator to view its content.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white bg-opacity-80 shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Node Editor</h2>
      <div className="flex-grow flex flex-col space-y-4">
        <Select value={nodeType} onValueChange={setNodeType}>
          <SelectTrigger>
            <SelectValue placeholder="Select node type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
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

        {isEditing ? (
          <>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-bold"
              placeholder="Enter title..."
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description..."
            />
            {renderMetadataFields()}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-500" 
                onClick={() => setIsEditing(true)}>
              {selectedNode.title}
            </h2>
            <div className="flex-grow cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                 onClick={() => setIsEditing(true)}>
              {selectedNode.description}
            </div>
            {renderMetadataFields()}
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(true)}
              className="mt-4"
            >
              Edit
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NodeEditor;