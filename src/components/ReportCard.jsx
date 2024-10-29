import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { format } from 'date-fns';

const ReportCard = ({ report, onUpdate }) => {
  const handleCardClick = () => {
    onUpdate();
  };

  return (
    <Card 
      className="w-full h-full bg-white hover:bg-gray-50 transition-colors cursor-pointer rounded-[16px]"
      onClick={handleCardClick}
    >
      <div className="w-full h-[100px] bg-gray-200 relative overflow-hidden rounded-t-[16px]">
        <img 
          src="/default-image.png"
          alt="Report Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-image.png';
          }}
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {report.title || "Untitled Report"}
          </h3>
        </div>
        <p className="text-xs text-gray-600 flex-grow overflow-hidden line-clamp-4">
          {report.content || "No content available"}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          {report.created_at ? format(new Date(report.created_at), 'MMMM dd, yyyy') : 'Date not available'}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;