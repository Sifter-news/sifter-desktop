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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const ProjectDetailsModal = ({ isOpen, onClose, projectName, investigationType, projectId, onUpdate }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('generic');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) return;
      
      try {
        const { data, error } = await supabase
          .from('investigations')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setTitle(data.title || '');
          setDescription(data.description || '');
          setType(investigationType || 'generic');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error("Failed to load project details");
      }
    };

    if (isOpen) {
      fetchProjectDetails();
    }
  }, [isOpen, projectId, investigationType]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!projectId) {
      toast.error("Invalid project ID");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investigations')
        .update({
          title: title.trim(),
          description: description.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) throw error;

      toast.success("Project updated successfully");
      onUpdate({ title: title.trim(), description: description.trim(), type });
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!projectId) {
      toast.error("Invalid project ID");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast.success("Project deleted successfully");
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Investigation Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSave} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title">Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Investigation title"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="type">Investigation Type</label>
            <Select value={type} onValueChange={setType} disabled={isLoading}>
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Investigation description"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </form>
        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  investigation and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;