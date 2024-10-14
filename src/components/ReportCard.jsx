import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReportCard = ({ report }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="w-full h-[96px] bg-gray-200 relative overflow-hidden">
        <img 
          src={report.image || '/placeholder.svg'} 
          alt={report.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="flex-grow py-3">
        <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-1">Report</div>
        <CardTitle className="text-lg mb-1">{report.title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <CardDescription className="line-clamp-4">{report.content}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ReportCard;