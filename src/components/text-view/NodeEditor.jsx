import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';
import NodeTypeSelect from './NodeTypeSelect';
import NodeMetadataForm from './NodeMetadataForm';

const NodeEditor = ({ selectedNode, onUpdateNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [nodeType, setNodeType] = useState('generic');
  const [metadata, setMetadata] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title || '');
      setEditedDescription(selectedNode.description || '');
      setNodeType(selectedNode.type || 'generic');
      setMetadata(selectedNode.metadata || {});
      setHasUnsavedChanges(false);
    }
  }, [selectedNode]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditedTitle(newTitle);
    setHasUnsavedChanges(true);
    
    if (selectedNode) {
      onUpdateNode({
        ...selectedNode,
        title: newTitle
      });
    }
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setEditedDescription(newDescription);
    setHasUnsavedChanges(true);
    
    if (selectedNode) {
      onUpdateNode({
        ...selectedNode,
        description: newDescription
      });
    }
  };

  const handleTypeChange = (newType) => {
    setNodeType(newType);
    setHasUnsavedChanges(true);
    
    if (selectedNode) {
      onUpdateNode({
        ...selectedNode,
        type: newType
      });
    }
  };

  const handleMetadataChange = (field, value) => {
    const newMetadata = {
      ...metadata,
      [field]: value
    };
    setMetadata(newMetadata);
    setHasUnsavedChanges(true);
    
    if (selectedNode) {
      onUpdateNode({
        ...selectedNode,
        metadata: newMetadata
      });
    }
  };

  const handleSave = async () => {
    if (!selectedNode) return;

    try {
      const updates = {
        title: editedTitle,
        description: editedDescription,
        type: nodeType,
        metadata: metadata
      };

      const { error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', selectedNode.id);

      if (error) throw error;

      setHasUnsavedChanges(false);
      toast.success("Node updated successfully");
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error("Failed to update node");
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
        <NodeTypeSelect value={nodeType} onChange={handleTypeChange} />

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

        <NodeMetadataForm
          nodeType={nodeType}
          metadata={metadata}
          onMetadataChange={handleMetadataChange}
        />
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