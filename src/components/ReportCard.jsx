import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText } from 'lucide-react';

const ReportCard = ({ report, onUpdate }) => {
  const [image, setImage] = useState(report.image || '/placeholder.svg');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setImage(base64String);
          onUpdate({ 
            ...report, 
            image: base64String 
          });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <Card className="w-full h-full p-4 bg-[#594BFF] shadow-lg relative overflow-hidden rounded-l-[24px] rounded-r-none">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      ></div>
      <div className="absolute left-4 top-4 bottom-4 right-4 bg-white rounded-[16px] overflow-hidden">
        <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow-md"></div>
        <div className="h-[100px] w-full overflow-hidden relative">
          <img 
            src={image}
            alt={report.title || 'Report'}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/placeholder.svg';
            }}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
        <CardContent className="p-4 h-[calc(100%-100px)] flex flex-col relative z-10">
          <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-2">Report</div>
          <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2">
            {report.title || 'Untitled Report'}
          </h3>
          <p className="text-sm text-gray-600 flex-grow overflow-hidden line-clamp-3">
            {report.content || 'No content available'}
          </p>
          <div className="mt-4 text-xs text-gray-400">
            {new Date(report.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ReportCard;