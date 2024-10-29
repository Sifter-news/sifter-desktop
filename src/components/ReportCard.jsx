import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const ReportCard = ({ report }) => {
  return (
    <Card 
      className="w-full h-[200px] bg-white hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            Report Title
          </h3>
        </div>
        <p className="text-xs text-gray-600 flex-grow overflow-hidden line-clamp-4">
          This is a sample report content. It contains information about the investigation and its findings.
        </p>
        <div className="mt-2 text-xs text-gray-400">
          March 26, 2024
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;