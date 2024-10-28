import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ContentModal from './ContentModal';
import { toast } from "sonner";

const ReportList = ({ reports = [], onAddReport, onEditReport }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  };

  return (
    <div className="fixed bottom-12 right-12" style={{ zIndex: 10 }}>
      <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
        <div className="flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full w-12 h-12 bg-black hover:bg-gray-800 text-white shadow-lg"
                  onClick={() => setIsModalOpen(true)}
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
        onClose={() => setIsModalOpen(false)}
        content={null}
        onSave={handleSaveReport}
        type="report"
      />
    </div>
  );
};

export default ReportList;