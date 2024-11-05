import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';

const NodePersonFields = ({ metadata, onMetadataChange }) => {
  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return '';
    const end = deathDate ? new Date(deathDate) : new Date();
    const birth = new Date(birthDate);
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} yrs`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Known As</Label>
        <Input
          value={metadata.knownAs || ''}
          onChange={(e) => onMetadataChange('knownAs', e.target.value)}
          placeholder="Known As"
        />
      </div>

      <div className="space-y-2">
        <Label>Legal Name</Label>
        <div className="grid grid-cols-4 gap-2">
          <Input
            value={metadata.title || ''}
            onChange={(e) => onMetadataChange('title', e.target.value)}
            placeholder="Title"
          />
          <Input
            value={metadata.firstName || ''}
            onChange={(e) => onMetadataChange('firstName', e.target.value)}
            placeholder="First Name"
          />
          <Input
            value={metadata.middleName || ''}
            onChange={(e) => onMetadataChange('middleName', e.target.value)}
            placeholder="Middle Name"
          />
          <Input
            value={metadata.lastName || ''}
            onChange={(e) => onMetadataChange('lastName', e.target.value)}
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Age</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="date"
            value={metadata.dateOfBirth || ''}
            onChange={(e) => onMetadataChange('dateOfBirth', e.target.value)}
            placeholder="Birth Date"
          />
          <Input
            type="date"
            value={metadata.dateOfDeath || ''}
            onChange={(e) => onMetadataChange('dateOfDeath', e.target.value)}
            placeholder="Death"
          />
          <Input
            value={calculateAge(metadata.dateOfBirth, metadata.dateOfDeath)}
            readOnly
            placeholder="Age"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Gender</Label>
        <RadioGroup
          value={metadata.gender || ''}
          onValueChange={(value) => onMetadataChange('gender', value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Background</Label>
        <Textarea
          value={metadata.background || ''}
          onChange={(e) => onMetadataChange('background', e.target.value)}
          placeholder="Enter background information..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
};

export default NodePersonFields;