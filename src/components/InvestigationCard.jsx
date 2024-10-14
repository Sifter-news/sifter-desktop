import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

const InvestigationCard = ({ investigation }) => {
  return (
    <Card className="w-[548px] h-[323px] p-6 bg-white shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 bg-[#594BFF] opacity-10"></div>
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #594BFF 1px, transparent 1px),
            linear-gradient(to bottom, #594BFF 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.1
        }}
      ></div>
      <div className="absolute left-6 top-6 bottom-6 w-[360px] bg-gray-100 rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md"></div>
        <CardContent className="p-6 h-full flex flex-col relative z-10">
          <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Investigation</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{investigation.title}</h3>
          <p className="text-sm text-gray-600 flex-grow overflow-hidden">{investigation.description}</p>
        </CardContent>
      </div>
    </Card>
  );
};

export default InvestigationCard;