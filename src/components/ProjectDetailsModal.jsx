import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const ProjectDetailsModal = ({ isOpen, onClose, projectName, investigationType, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('generic');

  useEffect(() => {
    if (isOpen) {
      setTitle(projectName || '');
      setType(investigationType || 'generic');
    }
  }, [isOpen, projectName, investigationType]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await onUpdate({
        title: title.trim(),
        description: description.trim(),
        investigation_type: type
      });
      toast.success("Project updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Investigation Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Investigation title"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description">Description</label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Investigation description"
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="type">Investigation Type</label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;