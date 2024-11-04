import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, User, Building2, Package, Brain, MapPin, Calendar } from 'lucide-react';

const NodeTypeSelect = ({ value, onChange }) => {
  const getCurrentIcon = () => {
    const icons = {
      generic: FileText,
      node_person: User,
      node_organization: Building2,
      node_object: Package,
      node_concept: Brain,
      node_location: MapPin,
      node_event: Calendar
    };
    const Icon = icons[value] || FileText;
    return <Icon className="h-4 w-4 mr-2" />;
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <div className="flex items-center">
          {getCurrentIcon()}
          <SelectValue placeholder="Select node type" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="generic">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Generic Node
            </div>
          </SelectItem>
        </SelectGroup>
        <SelectGroup>
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
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default NodeTypeSelect;