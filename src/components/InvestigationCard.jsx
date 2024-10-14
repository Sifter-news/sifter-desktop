import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const InvestigationCard = ({ investigation }) => {
  return (
    <Card className="w-[548px] h-[323px] p-6 bg-white shadow-lg">
      <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md"></div>
        <CardContent className="p-6 h-full flex flex-col">
          <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Investigation</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{investigation.title}</h3>
          <p className="text-sm text-gray-600 flex-grow overflow-hidden">{investigation.description}</p>
        </CardContent>
      </div>
    </Card>
  );
};

export default InvestigationCard;