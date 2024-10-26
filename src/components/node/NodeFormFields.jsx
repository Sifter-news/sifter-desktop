import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const NodeFormFields = ({ formData, setFormData, nodeType }) => {
  const renderAdditionalFields = () => {
    switch (nodeType) {
      case 'node_person':
        return (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              />
            </div>
          </>
        );
      case 'node_organization':
        return (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="org_name">Organization Name</Label>
              <Input
                id="org_name"
                value={formData.organization_name}
                onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="founding_date">Founding Date</Label>
              <Input
                id="founding_date"
                type="date"
                value={formData.founding_date}
                onChange={(e) => setFormData(prev => ({ ...prev, founding_date: e.target.value }))}
              />
            </div>
          </>
        );
      case 'node_object':
        return (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="object_type">Object Type</Label>
              <Input
                id="object_type"
                value={formData.object_type}
                onChange={(e) => setFormData(prev => ({ ...prev, object_type: e.target.value }))}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="manufacture_date">Manufacture Date</Label>
              <Input
                id="manufacture_date"
                type="date"
                value={formData.manufacture_date}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacture_date: e.target.value }))}
              />
            </div>
          </>
        );
      case 'node_concept':
        return (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="concept_category">Category</Label>
              <Input
                id="concept_category"
                value={formData.concept_category}
                onChange={(e) => setFormData(prev => ({ ...prev, concept_category: e.target.value }))}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="definition">Definition</Label>
              <Textarea
                id="definition"
                value={formData.definition}
                onChange={(e) => setFormData(prev => ({ ...prev, definition: e.target.value }))}
              />
            </div>
          </>
        );
      case 'node_event':
        return (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="event_date">Event Date</Label>
              <Input
                id="event_date"
                type="datetime-local"
                value={formData.event_date}
                onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      {renderAdditionalFields()}
    </div>
  );
};

export default NodeFormFields;
