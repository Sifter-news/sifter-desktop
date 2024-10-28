import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ReportCard = ({ report, onUpdate }) => {
  return (
    <Card className="w-full h-full bg-white shadow-lg overflow-hidden">
      <div className="h-[96px] bg-gray-100 relative overflow-hidden">
        <img 
          src={report.image || '/default-image.png'} 
          alt={report.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-image.png';
          }}
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/default-image.png" />
            <AvatarFallback>
              <FileText className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg font-semibold">
            {report.title || 'Untitled Report'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <CardDescription className="text-sm text-gray-600 line-clamp-3">
          {report.content || 'No content available'}
        </CardDescription>
        <div className="text-xs text-gray-400 mt-2">
          {new Date(report.created_at || Date.now()).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;