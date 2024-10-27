import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";

const InvestigationCard = ({ investigation, onUpdateInvestigation }) => {
  const [image, setImage] = useState(investigation.image || '/placeholder.svg');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setImage(base64String);
          onUpdateInvestigation({ 
            ...investigation, 
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
    <Link to={`/project/${investigation.id}`} className="block w-full h-[537.5px]">
      <Card className="w-full h-full p-8 bg-[#594BFF] shadow-lg relative overflow-hidden rounded-l-[60px] rounded-r-none lg:rounded-r-none">
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
        <div className="absolute left-8 top-8 bottom-8 w-80 bg-white rounded-[30px] overflow-hidden">
          <div className="absolute top-5 right-5 w-10 h-10 bg-white rounded-full shadow-md"></div>
          <div className="h-[225px] w-full overflow-hidden relative">
            <img 
              src={image}
              alt={investigation.title || 'Investigation'}
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
          <CardContent className="p-8 h-[calc(100%-225px)] flex flex-col relative z-10">
            <div className="text-sm uppercase text-purple-600 font-semibold tracking-wide mb-3">Investigation</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
              {investigation.title || 'Untitled Investigation'}
            </h3>
            <p className="text-base text-gray-600 flex-grow overflow-hidden line-clamp-3">
              {investigation.description || 'No description available'}
            </p>
            <div className="mt-6 text-sm text-gray-400">
              {new Date(investigation.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default InvestigationCard;