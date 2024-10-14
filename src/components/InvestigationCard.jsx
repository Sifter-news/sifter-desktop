import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InvestigationCard = ({ investigation }) => {
  return (
    <Card className="h-full mb-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-purple-600 rounded-3xl transform -skew-y-6 scale-110 z-0"></div>
      <div className="relative z-10 h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="text-xs uppercase text-purple-300 font-semibold tracking-wide">Investigation</div>
          <h3 className="text-xl font-bold text-white mt-1">{investigation.title}</h3>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="bg-white rounded-2xl p-4 shadow-inner h-full">
            <p className="text-sm text-gray-600">{investigation.description}</p>
          </div>
        </CardContent>
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md"></div>
    </Card>
  );
};

export default InvestigationCard;