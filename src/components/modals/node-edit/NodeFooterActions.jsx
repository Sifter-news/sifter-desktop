import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

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
          Delete
        </Button>
        {showAIButton && onAIConversation && (
          <Button
            variant="ghost"
            className="text-white hover:bg-purple-700 bg-purple-600"
            onClick={onAIConversation}
            disabled={isLoading}
          >
            AI
          </Button>
        )}
      </div>
      <div className="space-x-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={onSave} disabled={isLoading}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default NodeFooterActions;