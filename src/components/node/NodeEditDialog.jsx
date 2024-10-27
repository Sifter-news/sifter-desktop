import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import NodeMetadataFields from './NodeMetadataFields';
import { FileText, User, Building2, Package, Brain, MapPin, Calendar, Layout, Square, Maximize2, StickyNote } from 'lucide-react';

const NodeEditDialog = ({ isOpen, onClose, node, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    nodeType: '',
    visualStyle: '',
    metadata: {}
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        nodeType: node.nodeType || 'generic',
        visualStyle: node.visualStyle || 'default',
        metadata: node.metadata || {}
      });
    }
  }, [node]);

  const handleMetadataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
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

  const handleDelete = async () => {
    try {
      await onDelete(node.id);
      toast.success("Node deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete node");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="type">Node Type</Label>
            <Select 
              value={formData.nodeType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, nodeType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select node type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generic">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Generic Note
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
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="style">Visual Style</Label>
            <Select 
              value={formData.visualStyle} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, visualStyle: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select visual style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-2" />
                    Default
                  </div>
                </SelectItem>
                <SelectItem value="compact">
                  <div className="flex items-center">
                    <Layout className="h-4 w-4 mr-2" />
                    Compact
                  </div>
                </SelectItem>
                <SelectItem value="expanded">
                  <div className="flex items-center">
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Expanded
                  </div>
                </SelectItem>
                <SelectItem value="postit">
                  <div className="flex items-center">
                    <StickyNote className="h-4 w-4 mr-2" />
                    Post-it
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <NodeMetadataFields
            nodeType={formData.nodeType}
            metadata={formData.metadata}
            onMetadataChange={handleMetadataChange}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this node
                  and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditDialog;