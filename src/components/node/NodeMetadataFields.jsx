import React from 'react';
import NodePersonFields from './NodePersonFields';

const NodeMetadataFields = ({ nodeType, metadata, onMetadataChange }) => {
  switch (nodeType) {
    case 'node_person':
      return <NodePersonFields metadata={metadata} onMetadataChange={onMetadataChange} />;
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
