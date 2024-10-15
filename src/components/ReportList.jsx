import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ReportList = ({ reports, onAddReport, onEditReport }) => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col-reverse items-start space-y-reverse space-y-2 z-10">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white shadow-lg mb-2"
              onClick={() => onAddReport({ type: 'report', title: 'New Report', content: '' })}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add New Report</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {reports.slice(0, 4).map((report, index) => (
        <TooltipProvider key={report.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar 
                className="w-12 h-12 cursor-pointer"
                onClick={() => onEditReport(report)}
              >
                <AvatarImage src={report.image || '/placeholder.svg'} alt={report.title} />
                <AvatarFallback>{report.title.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{report.title}</p>
              <p>Click to Edit Report</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default ReportList;