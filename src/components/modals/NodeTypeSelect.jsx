import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, User, Building2, Package, Brain, MapPin, Calendar } from 'lucide-react';

const NodeTypeSelect = ({ value, onChange }) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor="type">Type</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="note">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Note
            </div>
          </SelectItem>
          <SelectItem value="node_person">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Person
            </div>
          </SelectItem>
          <SelectItem value="node_organization">
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              Organization
            </div>
          </SelectItem>
          <SelectItem value="node_object">
            <div className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Object
            </div>
          </SelectItem>
          <SelectItem value="node_concept">
            <div className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              Concept
            </div>
          </SelectItem>
          <SelectItem value="node_location">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </div>
          </SelectItem>
          <SelectItem value="node_event">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Event
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default NodeTypeSelect;