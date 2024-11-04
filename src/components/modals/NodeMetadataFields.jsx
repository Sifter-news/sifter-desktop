import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NodeMetadataFields = ({ nodeType, metadata, onMetadataChange }) => {
  const getFieldsByType = () => {
    switch (nodeType) {
      case 'node_person':
        return [
          { key: 'knownAs', label: 'Known As', type: 'text' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'firstName', label: 'First Name', type: 'text' },
          { key: 'middleName', label: 'Middle Name', type: 'text' },
          { key: 'lastName', label: 'Last Name', type: 'text' },
          { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
          { key: 'dateOfDeath', label: 'Date of Death', type: 'date' },
          { key: 'gender', label: 'Gender', type: 'text' },
          { key: 'background', label: 'Background', type: 'textarea' }
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
          {type === 'textarea' ? (
            <textarea
              id={key}
              value={metadata[key] || ''}
              onChange={(e) => onMetadataChange(key, e.target.value)}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          ) : (
            <Input
              id={key}
              type={type}
              value={metadata[key] || ''}
              onChange={(e) => onMetadataChange(key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default NodeMetadataFields;