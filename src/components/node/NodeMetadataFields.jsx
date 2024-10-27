import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NodeMetadataFields = ({ nodeType, metadata, onMetadataChange }) => {
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
    case 'node_organization':
      return (
        <div className="space-y-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="org_name">Organization Name</Label>
            <Input
              id="org_name"
              value={metadata.organizationName || ''}
              onChange={(e) => onMetadataChange('organizationName', e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="founding_date">Founding Date</Label>
            <Input
              id="founding_date"
              type="date"
              value={metadata.foundedDate || ''}
              onChange={(e) => onMetadataChange('foundedDate', e.target.value)}
            />
          </div>
        </div>
      );
    case 'node_event':
      return (
        <div className="space-y-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="event_date">Event Date</Label>
            <Input
              id="event_date"
              type="datetime-local"
              value={metadata.eventDate || ''}
              onChange={(e) => onMetadataChange('eventDate', e.target.value)}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={metadata.location || ''}
              onChange={(e) => onMetadataChange('location', e.target.value)}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default NodeMetadataFields;