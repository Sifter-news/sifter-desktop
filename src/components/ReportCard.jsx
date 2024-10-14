import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ReportCard = ({ report }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{report.content}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default ReportCard;