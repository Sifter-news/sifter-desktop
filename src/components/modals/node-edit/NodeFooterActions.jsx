import React from 'react';
import { Button } from "@/components/ui/button";

const NodeFooterActions = ({ 
  onDelete, 
  onAIConversation, 
  onClose, 
  onSave, 
  isLoading, 
  showAIButton = false 
}) => {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2">
        <Button 
          variant="destructive" 
          onClick={onDelete}
          disabled={isLoading}
        >
          Delete Node
        </Button>
        {showAIButton && onAIConversation && (
          <Button
            variant="secondary"
            onClick={onAIConversation}
            disabled={isLoading}
          >
            AI Conversation
          </Button>
        )}
      </div>
      <div className="space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default NodeFooterActions;