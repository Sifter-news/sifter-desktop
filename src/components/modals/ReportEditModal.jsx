import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import BaseModal from './BaseModal';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ReportEditModal = ({ isOpen, onClose, report, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title || '',
        content: report.content || ''
      });
    }
  }, [report]);

  const handleSave = async () => {
    if (!report?.id) {
      toast.error("Invalid report ID");
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({
          title: formData.title.trim(),
          content: formData.content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', report.id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Report updated successfully");
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error("Failed to update report");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!report?.id) {
      toast.error("Invalid report ID");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', report.id);

      if (error) throw error;

      toast.success("Report deleted successfully");
      onDelete(report.id);
      onClose();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast.error("Failed to delete report");
    } finally {
      setIsSaving(false);
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
      isLoading={isSaving}
    >
      <div className="grid gap-4 py-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            disabled={isSaving}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            rows={5}
            disabled={isSaving}
          />
        </div>
      </div>
    </BaseModal>
  );
};

export default ReportEditModal;