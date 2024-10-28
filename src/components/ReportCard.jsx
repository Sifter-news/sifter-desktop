import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const ReportCard = ({ report, onUpdate }) => {
  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-4 w-4 text-gray-500" />
        <h3 className="font-medium text-sm truncate">{report.title || 'Untitled Report'}</h3>
      </div>
      <p className="text-sm text-gray-600 line-clamp-3 flex-grow">
        {report.content || 'No content'}
      </p>
      <div className="text-xs text-gray-400 mt-2">
        {new Date(report.created_at).toLocaleDateString()}
      </div>
    </Card>
  );
};

export default ReportCard;