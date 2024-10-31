import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NodeMetadataFields = ({ nodeType, metadata, onMetadataChange }) => {
  const getFieldsByType = () => {
    switch (nodeType) {
      case 'node_person':
        return [
          { key: 'age', label: 'Age', type: 'number' },
          { key: 'occupation', label: 'Occupation', type: 'text' }
        ];
      case 'node_organization':
        return [
          { key: 'industry', label: 'Industry', type: 'text' },
          { key: 'size', label: 'Size', type: 'text' }
        ];
      case 'node_location':
        return [
          { key: 'address', label: 'Address', type: 'text' },
          { key: 'coordinates', label: 'Coordinates', type: 'text' }
        ];
      default:
        return [];
    }
  };

  const fields = getFieldsByType();

  if (fields.length === 0) return null;

  return (
    <div className="grid gap-4">
      {fields.map(({ key, label, type }) => (
        <div key={key} className="grid w-full items-center gap-1.5">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type={type}
            value={metadata[key] || ''}
            onChange={(e) => onMetadataChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default NodeMetadataFields;