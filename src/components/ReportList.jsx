import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ContentModal from './ContentModal';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';

const ReportList = ({ reports = [], onAddReport, onEditReport, projectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveReport = async (report) => {
    if (!projectId) {
      toast.error("No project ID provided");
      return;
    }

    setIsSaving(true);
    try {
      const reportData = {
        title: report.title,
        content: report.content,
        investigation_id: projectId,
      };

      if (selectedReport?.id) {
        // Update existing report
        const { data, error } = await supabase
          .from('reports')
          .update(reportData)
          .eq('id', selectedReport.id)
          .select()
          .single();

        if (error) throw error;
        if (onEditReport) onEditReport(data);
        toast.success("Report updated successfully");
      } else {
        // Create new report
        const { data, error } = await supabase
          .from('reports')
          .insert([reportData])
          .select()
          .single();

        if (error) throw error;
        if (onAddReport) onAddReport(data);
        toast.success("Report created successfully");
      }

      setIsModalOpen(false);
      setSelectedReport(null);
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error("Failed to save report");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  return (
    <div className="fixed bottom-12 right-12" style={{ zIndex: 10 }}>
      <div className="bg-white rounded-[50px] p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {reports.map((report) => (
            <TooltipProvider key={report.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="focus:outline-none transform transition-transform hover:scale-110"
                    onClick={() => handleAvatarClick(report)}
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-lg hover:border-blue-500">
                      <AvatarImage src={report.avatar || '/default-image.png'} alt={report.title} />
                      <AvatarFallback>
                        <FileText className="h-6 w-6 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{report.title || 'Untitled Report'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full w-12 h-12 bg-black hover:bg-gray-800 text-white shadow-lg mt-4"
                  onClick={() => {
                    setSelectedReport(null);
                    setIsModalOpen(true);
                  }}
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ContentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReport(null);
        }}
        content={selectedReport}
        onSave={handleSaveReport}
        type="report"
        isSaving={isSaving}
      />
    </div>
  );
};

export default ReportList;