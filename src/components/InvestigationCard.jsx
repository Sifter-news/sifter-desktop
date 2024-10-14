import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const InvestigationCard = ({ investigation }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{investigation.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{investigation.description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default InvestigationCard;