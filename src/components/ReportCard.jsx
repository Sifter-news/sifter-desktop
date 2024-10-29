import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const ReportCard = ({ report }) => {
  return (
    <Card 
      className="w-full h-full bg-white hover:bg-gray-50 transition-colors cursor-pointer rounded-[16px]"
    >
      <div className="w-full h-[100px] bg-gray-200 relative overflow-hidden rounded-t-[16px]">
        <img 
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
          alt="Report Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/default-image.png';
          }}
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
            Report Title
          </h3>
        </div>
        <p className="text-xs text-gray-600 flex-grow overflow-hidden line-clamp-4">
          This is a sample report content. It contains information about the investigation and its findings.
        </p>
        <div className="mt-2 text-xs text-gray-400">
          March 26, 2024
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;