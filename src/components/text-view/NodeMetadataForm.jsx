import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NodeMetadataForm = ({ nodeType, metadata, onMetadataChange }) => {
  switch (nodeType) {
    case 'node_person':
      return (
        <div className="space-y-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={metadata.fullName || ''}
              onChange={(e) => onMetadataChange('fullName', e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={metadata.age || ''}
              onChange={(e) => onMetadataChange('age', e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={metadata.occupation || ''}
              onChange={(e) => onMetadataChange('occupation', e.target.value)}
            />
          </div>
        </div>
      );
    // ... Add other node type forms as needed
    default:
      return null;
  }
};

export default NodeMetadataForm;