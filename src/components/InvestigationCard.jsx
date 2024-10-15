import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const InvestigationCard = ({ investigation }) => {
  return (
    <Link to={`/project/${investigation.id}`} className="block w-full h-[323px]">
      <Card className="w-full h-full p-6 bg-[#594BFF] shadow-lg relative overflow-hidden rounded-l-[48px] rounded-r-none lg:rounded-r-none">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        ></div>
        <div className="absolute left-6 top-6 bottom-6 w-64 bg-white rounded-[24px] overflow-hidden">
          <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full shadow-md"></div>
          <div className="h-[128px] w-full overflow-hidden">
            <img 
              src={investigation.image || '/placeholder.svg'} 
              alt={investigation.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardContent className="p-6 h-[calc(100%-128px)] flex flex-col relative z-10">
            <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Investigation</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{investigation.title}</h3>
            <p className="text-sm text-gray-600 flex-grow overflow-hidden line-clamp-2">{investigation.description}</p>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default InvestigationCard;