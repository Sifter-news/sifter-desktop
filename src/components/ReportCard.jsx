import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReportCard = ({ report, index }) => {
  return (
    <Card className="h-full flex flex-col relative">
      <div className="absolute top-2 left-2 bg-white bg-opacity-30 w-8 h-8 rounded-full flex items-center justify-center">
        <span className="text-sm font-semibold">{index + 1}</span>
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