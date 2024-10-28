import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ContentModal from './ContentModal';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';

const REPORT_TYPES = {
  evidence: { color: 'border-red-500', label: 'Evidence' },
  interview: { color: 'border-blue-500', label: 'Interview' },
  analysis: { color: 'border-green-500', label: 'Analysis' },
  document: { color: 'border-yellow-500', label: 'Document' },
  note: { color: 'border-purple-500', label: 'Note' }
};

const ReportList = ({ reports = [], onAddReport, onEditReport, projectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDebugMode, setIsDebugMode] = useState(false);
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

  const getReportTypeStyle = (type) => {
    return REPORT_TYPES[type] || REPORT_TYPES.note;
  };

  return (
    <div className="fixed bottom-12 right-12" style={{ zIndex: 10 }}>
      <div className="bg-white/10 rounded-[50px] p-8 shadow-lg backdrop-blur-sm">
        <ScrollArea className="h-[300px] w-[100px] pr-4">
          <div className="flex flex-col items-center space-y-4">
            {reports.map((report) => {
              const typeStyle = getReportTypeStyle(report.type);
              return (
                <TooltipProvider key={report.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        className="focus:outline-none transform transition-transform hover:scale-110 relative"
                        onClick={() => handleAvatarClick(report)}
                      >
                        <Avatar className={`h-10 w-10 bg-white border-2 ${typeStyle.color} shadow-lg hover:border-opacity-100 border-opacity-70`}>
                          <AvatarImage src={report.avatar || '/default-image.png'} alt={report.title} />
                          <AvatarFallback className="bg-white">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </AvatarFallback>
                        </Avatar>
                        {isDebugMode && (
                          <Badge variant="secondary" className="absolute -top-2 -right-2 text-[10px]">
                            {typeStyle.label}
                          </Badge>
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className={`text-sm font-medium ${typeStyle.color.replace('border', 'text')}`}>
                        {report.title || 'Untitled Report'} ({typeStyle.label})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="flex flex-col gap-2 items-center mt-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full w-10 h-10 bg-black hover:bg-gray-800 text-white shadow-lg"
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

          <Button
            size="icon"
            variant="ghost"
            className="w-6 h-6 text-xs"
            onClick={() => setIsDebugMode(!isDebugMode)}
          >
            {isDebugMode ? "D" : "d"}
          </Button>
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