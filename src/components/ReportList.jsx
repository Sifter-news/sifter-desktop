import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ContentModal from './ContentModal';
import { toast } from "sonner";

const ReportList = ({ reports = [], onAddReport, onEditReport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleSaveReport = (report) => {
    try {
      if (typeof onAddReport === 'function') {
        const clonedReport = JSON.parse(JSON.stringify(report));
        onAddReport(clonedReport);
      } else {
        console.warn('onAddReport prop is not a function');
        toast.error("Unable to add report at this time");
      }
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error("Failed to save report");
    }
    setIsModalOpen(false);
    setSelectedReport(null);
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
      />
    </div>
  );
};

export default ReportList;