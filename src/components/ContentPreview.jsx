import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ContentModal from './ContentModal';

const ContentPreview = ({ content, onUpdate, type = 'article', showImage = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(content?.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b');

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setImage(base64String);
          onUpdate({ 
            ...content, 
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
    <>
      <Card className="h-full flex flex-col overflow-hidden cursor-pointer" onClick={handleCardClick}>
        {showImage && (
          <div className="w-full h-[96px] bg-gray-200 relative overflow-hidden">
            <img 
              src={image}
              alt={content?.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/default-image.png';
              }}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        <CardHeader className="flex-grow py-2">
          <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-0.5">{type}</div>
          <CardTitle className="text-lg mb-0.5">{content?.title}</CardTitle>
        </CardHeader>
        <CardContent className="py-1">
          <CardDescription className="line-clamp-4">{content?.content}</CardDescription>
        </CardContent>
      </Card>
      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={content}
        onSave={onUpdate}
        type={type}
      />
    </>
  );
};

export default ContentPreview;