import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const ReportCard = ({ report, onUpdate }) => {
  return (
    <Card className="w-64 h-full p-6 bg-white shadow-lg relative overflow-hidden">
      <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md"></div>
      <div className="h-[180px] w-full overflow-hidden relative">
        <img 
          src={report.image || '/default-image.png'}
          alt={report.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-image.png';
          }}
        />
      </div>
      <CardContent className="p-6 h-[calc(100%-180px)] flex flex-col relative z-10">
        <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Report</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {report.title || 'Untitled Report'}
        </h3>
        <p className="text-sm text-gray-600 flex-grow overflow-hidden line-clamp-3">
          {report.content || 'No content available'}
        </p>
        <div className="mt-4 text-xs text-gray-400">
          {new Date(report.created_at || Date.now()).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;