import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ReportList = ({ reports, onAddReport, onEditReport }) => {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col items-end space-y-2 z-10">
      {reports.slice(0, 4).reverse().map((report, index) => (
        <TooltipProvider key={report.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar 
                className={`w-12 h-12 cursor-pointer ${index > 0 ? '-mb-6' : ''}`}
                onClick={() => onEditReport(report)}
              >
                <AvatarImage src={report.image || '/placeholder.svg'} alt={report.title} />
                <AvatarFallback>{report.title.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{report.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <Button
        size="icon"
        className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        onClick={() => onAddReport({ type: 'report', title: 'New Report', content: '' })}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default ReportList;