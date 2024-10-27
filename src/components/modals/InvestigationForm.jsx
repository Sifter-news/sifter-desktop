import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const InvestigationForm = ({ formData, setFormData, isLoading }) => {
  const { title, description, type } = formData;

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
      <div className="grid gap-2">
        <label htmlFor="type">Investigation Type</label>
        <Select value={type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))} disabled={isLoading}>
          <SelectTrigger className="p-0">
            <SelectValue placeholder="Select investigation type" />
          </SelectTrigger>
          <SelectContent>
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
              <SelectItem value="generic">Generic Investigation</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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