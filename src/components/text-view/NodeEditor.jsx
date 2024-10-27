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
  const [metadata, setMetadata] = useState(selectedNode?.metadata || {});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  React.useEffect(() => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title || '');
      setEditedDescription(selectedNode.description || '');
      setNodeType(selectedNode.nodeType || 'generic');
      setMetadata(selectedNode.metadata || {});
      setHasUnsavedChanges(false);
    }
  }, [selectedNode]);

  const updateNodeInDatabase = async (updates) => {
    try {
      const { error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', selectedNode.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating node:', error);
      throw error;
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
    
    // Update the node in real-time for the navigator
    const updatedNode = {
      ...selectedNode,
      metadata: {
        ...metadata,
        [field]: value
      }
    };
    onUpdateNode(updatedNode);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditedTitle(newTitle);
    setHasUnsavedChanges(true);
    
    // Update the node in real-time for the navigator
    const updatedNode = {
      ...selectedNode,
      title: newTitle
    };
    onUpdateNode(updatedNode);
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setEditedDescription(newDescription);
    setHasUnsavedChanges(true);
    
    // Update the node in real-time for the navigator
    const updatedNode = {
      ...selectedNode,
      description: newDescription
    };
    onUpdateNode(updatedNode);
  };

  const handleSave = async () => {
    if (!selectedNode) return;

    try {
      const updates = {
        title: editedTitle,
        description: editedDescription,
        type: nodeType,
        metadata: metadata,
        updated_at: new Date().toISOString()
      };

      await updateNodeInDatabase(updates);

      const updatedNode = {
        ...selectedNode,
        ...updates
      };

      onUpdateNode(updatedNode);
      setHasUnsavedChanges(false);
      toast.success("Node updated successfully");
    } catch (error) {
      toast.error("Failed to update node");
    }
  };

  const renderMetadataFields = () => {
    switch (nodeType) {
      case 'node_person':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Full Name"
              value={metadata.fullName || ''}
              onChange={(e) => handleMetadataChange('fullName', e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Age"
              type="number"
              value={metadata.age || ''}
              onChange={(e) => handleMetadataChange('age', e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Occupation"
              value={metadata.occupation || ''}
              onChange={(e) => handleMetadataChange('occupation', e.target.value)}
              className="w-full"
            />
          </div>
        );
      case 'node_organization':
        return (
          <div className="space-y-2">
            <Input
              placeholder="Organization Name"
              value={metadata.organizationName || ''}
              onChange={(e) => handleMetadataChange('organizationName', e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Founded Date"
              type="date"
              value={metadata.foundedDate || ''}
              onChange={(e) => handleMetadataChange('foundedDate', e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Industry"
              value={metadata.industry || ''}
              onChange={(e) => handleMetadataChange('industry', e.target.value)}
              className="w-full"
            />
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

        <Input
          value={editedTitle}
          onChange={handleTitleChange}
          className="text-2xl font-bold"
          placeholder="Enter title..."
        />
        <Textarea
          value={editedDescription}
          onChange={handleDescriptionChange}
          className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description..."
        />
        {renderMetadataFields()}
      </div>
      {hasUnsavedChanges && (
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default NodeEditor;