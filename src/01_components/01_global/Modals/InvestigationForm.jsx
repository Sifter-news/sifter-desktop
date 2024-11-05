// Moving from src/components/modals/InvestigationForm.jsx
import React, { useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const InvestigationForm = ({ formData, setFormData, isLoading }) => {
  const { title, description, type, focus } = formData;

  const getDealTypeLabel = (type) => {
    const typeLabels = {
      'pre-deal': 'Pre-Deal Due Diligence',
      'post-deal': 'Post-Deal Due Diligence',
      'aml': 'Anti-Money Laundering',
      'kyc': 'Know Your Customer',
      'regulatory': 'Regulatory Compliance',
      'fraud': 'Fraud',
      'background': 'Background Check',
      'asset': 'Asset Tracing',
      'generic': 'Generic'
    };
    return typeLabels[type] || type;
  };

  const getFocusLabel = (focus) => {
    const focusLabels = {
      'node_person': 'Person',
      'node_organization': 'Organization',
      'node_object': 'Object',
      'node_concept': 'Concept',
      'node_location': 'Location',
      'node_event': 'Event'
    };
    return focusLabels[focus] || focus;
  };

  useEffect(() => {
    if (!description && title) {
      const dealType = getDealTypeLabel(type);
      const focusType = getFocusLabel(focus);
      const autoDescription = `${title} - A ${dealType} investigation focusing on ${focusType}.`;
      setFormData(prev => ({ ...prev, description: autoDescription }));
    }
  }, [title, type, focus, description, setFormData]);

  return (
    <form className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Investigation title"
          disabled={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label htmlFor="type">Type</label>
          <Select 
            value={type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))} 
            disabled={isLoading}
          >
            <SelectTrigger className="w-full [&>span]:flex [&>span]:flex-1 [&>svg]:hidden">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Generic</SelectLabel>
                <SelectItem value="generic">Generic Investigation</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Due Diligence</SelectLabel>
                <SelectItem value="pre-deal">Pre-Deal Due Diligence Investigation</SelectItem>
                <SelectItem value="post-deal">Post-Deal Due Diligence Investigation</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Compliance</SelectLabel>
                <SelectItem value="aml">Anti-Money Laundering Investigation</SelectItem>
                <SelectItem value="kyc">Know Your Customer Investigation</SelectItem>
                <SelectItem value="regulatory">Regulatory Compliance Investigation</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Corporate</SelectLabel>
                <SelectItem value="fraud">Fraud Investigation</SelectItem>
                <SelectItem value="background">Background Check Investigation</SelectItem>
                <SelectItem value="asset">Asset Tracing Investigation</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="focus">Focus</label>
          <Select value={focus} onValueChange={(value) => setFormData(prev => ({ ...prev, focus: value }))} disabled={isLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Select focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="node_person">Person</SelectItem>
                <SelectItem value="node_organization">Organization</SelectItem>
                <SelectItem value="node_object">Object</SelectItem>
                <SelectItem value="node_concept">Concept</SelectItem>
                <SelectItem value="node_location">Location</SelectItem>
                <SelectItem value="node_event">Event</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="description">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Investigation description"
          className="min-h-[100px]"
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default InvestigationForm;