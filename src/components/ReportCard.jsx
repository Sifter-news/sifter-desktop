import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReportCard = ({ report }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="w-full h-[30%] bg-gray-200 relative overflow-hidden">
        <img 
          src={report.image || '/placeholder.svg'} 
          alt={report.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg">{report.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-4">{report.content}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ReportCard;