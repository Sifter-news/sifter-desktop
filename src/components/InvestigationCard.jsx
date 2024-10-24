import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const InvestigationCard = ({ investigation, onUpdateInvestigation }) => {
  return (
    <Link to={`/project/${investigation.id}`} className="block w-full">
      <Card className="w-full h-full bg-[#594BFF] shadow-lg relative overflow-hidden rounded-[24px]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative z-10 p-6">
          <div className="bg-white rounded-[16px] overflow-hidden">
            <div className="h-[128px] w-full overflow-hidden relative">
              <img 
                src="/default-image.png"
                alt={investigation.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Investigation</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{investigation.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{investigation.description}</p>
            </CardContent>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default InvestigationCard;