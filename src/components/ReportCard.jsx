import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleModal from './ArticleModal';
import { Input } from "@/components/ui/input";

const ReportCard = ({ report, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(report.image || '/default-image.png');

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateArticle = (updatedArticle) => {
    onUpdate({ ...updatedArticle, image });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        onUpdate({ ...report, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <div className="w-full h-[96px] bg-gray-200 relative overflow-hidden">
          <img 
            src="/default-image.png"
            alt={report.title} 
            className="w-full h-full object-cover"
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