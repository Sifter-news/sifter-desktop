import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const EditableTitle = ({ title, description, onSave, style }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSave = () => {
    if (!editedTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    onSave(editedTitle, editedDescription);
    setIsEditing(false);
    toast.success("Changes saved successfully");
  };

  if (!isEditing) {
    return (
      <div className="group relative" onClick={() => setIsEditing(true)}>
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-sm">{description}</p>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 flex items-center justify-center">
          <span className="text-sm text-gray-700">Click to edit</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Input
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Enter title"
        className="font-medium"
        autoFocus
      />
      <Textarea
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
        placeholder="Enter description"
        className="text-sm resize-none"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setEditedTitle(title);
            setEditedDescription(description);
            setIsEditing(false);
          }}
        >
          Cancel
        </Button>
        <Button 
          size="sm"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default EditableTitle;