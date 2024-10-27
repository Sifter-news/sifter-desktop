import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';

const NodeEditor = ({ selectedNode, onUpdateNode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedNode?.title || '');
  const [editedDescription, setEditedDescription] = useState(selectedNode?.description || '');

  React.useEffect(() => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title || '');
      setEditedDescription(selectedNode.description || '');
    }
  }, [selectedNode]);

  const handleSave = async () => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        title: editedTitle,
        description: editedDescription
      };

      try {
        const { error } = await supabase
          .from('node')
          .update({
            title: editedTitle,
            description: editedDescription
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

  if (!selectedNode) {
    return (
      <div className="h-screen flex items-center justify-center text-center text-gray-500">
        <div>
          <h2 className="text-lg font-semibold mb-4">Node Editor</h2>
          Select a node from the navigator to view its content.
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white bg-opacity-80 shadow-lg rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Node Editor</h2>
      <div className="flex-grow flex flex-col">
        {isEditing ? (
          <>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-2xl font-bold mb-4"
              placeholder="Enter title..."
            />
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description..."
            />
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