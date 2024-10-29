import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const ReportCard = ({ report, onUpdate, onDelete }) => {
  return (
    <Card 
      className="w-full h-[200px] bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-colors cursor-pointer relative overflow-hidden group"
      onClick={() => onUpdate(report)}
    >
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      <CardContent className="p-4 h-full flex flex-col relative">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            {report.title || 'Untitled Report'}
          </h3>
        </div>
        <p className="text-xs text-gray-600 flex-grow overflow-hidden line-clamp-4">
          {report.content || 'No content available'}
        </p>
        <div className="mt-2 text-xs text-gray-400">
          {new Date(report.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;