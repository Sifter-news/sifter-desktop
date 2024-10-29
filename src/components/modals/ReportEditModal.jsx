import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import BaseModal from './BaseModal';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ReportEditModal = ({ isOpen, onClose, report, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        content: report.content || ''
      });
    }
  }, [report]);

  const handleSave = async () => {
    try {
      const updatedReport = {
        ...report,
        ...formData
      };
      await onUpdate(updatedReport);
      toast.success("Report updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(report.id);
      toast.success("Report deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete report");
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Report"
      onSave={handleSave}
      onDelete={handleDelete}
      showDelete={true}
    >
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
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={5}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ReportEditModal;