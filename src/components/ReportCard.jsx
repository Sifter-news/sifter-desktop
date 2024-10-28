import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText } from 'lucide-react';

const ReportCard = ({ report, onUpdate }) => {
  if (!report) return null;

  return (
    <Card 
      className="w-full h-full bg-white/50 backdrop-blur-sm hover:bg-white/60 transition-all cursor-pointer"
      onClick={() => onUpdate(report)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={report.image || '/default-image.png'} alt={report.title} />
            <AvatarFallback>
              <FileText className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {report.title}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {report.content?.substring(0, 50)}...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;