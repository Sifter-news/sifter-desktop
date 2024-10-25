import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleModal from './ArticleModal';
import { Input } from "@/components/ui/input";

const ReportCard = ({ report, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState('/default-image.png');

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateArticle = (updatedArticle) => {
    const serializedArticle = {
      ...updatedArticle,
      id: updatedArticle.id,
      title: updatedArticle.title,
      content: updatedArticle.content,
      image: image
    };
    onUpdate(serializedArticle);
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
    <>
      <Card className="h-full flex flex-col overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <div className="w-full h-[96px] bg-gray-200 relative overflow-hidden">
          <img 
            src={image}
            alt={report.title} 
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
        <CardHeader className="flex-grow py-2">
          <div className="text-xs uppercase text-purple-600 font-semibold tracking-wide mb-0.5">Report</div>
          <CardTitle className="text-lg mb-0.5">{report.title}</CardTitle>
        </CardHeader>
        <CardContent className="py-1">
          <CardDescription className="line-clamp-4">{report.content}</CardDescription>
        </CardContent>
      </Card>
      <ArticleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        article={report}
        onUpdate={handleUpdateArticle}
      />
    </>
  );
};

export default ReportCard;