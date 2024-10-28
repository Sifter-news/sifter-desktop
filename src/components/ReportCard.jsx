import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const ReportCard = ({ report, onUpdate }) => {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-1">{report.title || 'Untitled Report'}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">
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