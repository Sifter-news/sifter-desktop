import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const ProjectEditModal = ({ isOpen, onClose, project, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({ title: '', description: '' });

  // Reset form data when modal opens or project changes
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        title: project.title || '',
        description: project.description || ''
      });
      setErrors({ title: '', description: '' });
    }
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: ''
    };
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const updatedProject = {
        ...project,
        title: formData.title.trim(),
        description: formData.description.trim()
      };
      
      await onUpdate(updatedProject);
      toast.success("Project updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!project?.id) {
      toast.error("Invalid project data");
      onClose();
      return;
    }
    
    try {
      await onDelete(project.id);
      toast.success("Project deleted successfully");
      onClose();
      navigate('/');
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="col-span-3">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Enter project title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="col-span-3">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={errors.description ? "border-red-500" : ""}
                placeholder="Add a project description..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  project and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectEditModal;