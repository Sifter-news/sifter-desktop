import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';

const NodeBasicFields = ({ title, description, onFieldChange, onAIConversation }) => {
  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="title">Title</Label>
          {onAIConversation && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-700 bg-purple-600"
              onClick={onAIConversation}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              AI
            </Button>
          )}
        </div>
        <Input
          id="title"
          value={title}
          onChange={(e) => onFieldChange('title', e.target.value)}
        />
      </div>
      
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onFieldChange('description', e.target.value)}
        />
      </div>
    </>
  );
};

export default NodeBasicFields;