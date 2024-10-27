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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title || '');
      setEditedDescription(selectedNode.description || '');
      setNodeType(selectedNode.type || 'generic');
      setMetadata(selectedNode.metadata || {});
      setHasUnsavedChanges(false);
    }
  }, [selectedNode]);

  const updateNodeState = (updates) => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        ...updates
      };
      onUpdateNode(updatedNode);
      setHasUnsavedChanges(true);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setEditedTitle(newTitle);
    updateNodeState({ title: newTitle });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setEditedDescription(newDescription);
    updateNodeState({ description: newDescription });
  };

  const handleTypeChange = (newType) => {
    setNodeType(newType);
    updateNodeState({ type: newType });
  };

  const handleMetadataChange = (field, value) => {
    const newMetadata = {
      ...metadata,
      [field]: value
    };
    setMetadata(newMetadata);
    updateNodeState({ metadata: newMetadata });
  };

  const handleSave = async () => {
    if (!selectedNode) return;

    setIsSaving(true);
    try {
      const updates = {
        title: editedTitle,
        description: editedDescription,
        type: nodeType,
        metadata: metadata
      };

      const { data, error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', selectedNode.id)
        .select()
        .single();

      if (error) throw error;

      // Update the node in the navigator and local state
      onUpdateNode({
        ...selectedNode,
        ...data
      });

      setHasUnsavedChanges(false);
      toast.success("Node updated successfully");
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error("Failed to update node");
    } finally {
      setIsSaving(false);
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
          <Button 
            onClick={handleSave} 
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NodeEditor;