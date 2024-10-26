import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Upload } from 'lucide-react';

const NodeEditModal = ({ isOpen, onClose, node, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    avatar: '',
    // Additional fields based on node type
    name: '',
    age: '',
    organization_name: '',
    founding_date: '',
    object_type: '',
    manufacture_date: '',
    concept_category: '',
    definition: '',
    event_date: '',
    location: '',
  });

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        avatar: node.avatar || '/default-image.png',
        ...node
      });
    }
  }, [node]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload to your storage service
      // For now, we'll just use a placeholder
      setFormData(prev => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      await onUpdate(node.id, formData);
      toast.success("Node updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update node");
    }
  };

  const renderAdditionalFields = () => {
    switch (node?.nodeType) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar} alt="Avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
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
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditModal;