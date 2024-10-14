import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ArticleModal from './ArticleModal';

const ReportCard = ({ report, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateArticle = (updatedArticle) => {
    onUpdate(updatedArticle);
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <div className="w-full h-[96px] bg-gray-200 relative overflow-hidden">
          <img 
            src={report.image || '/placeholder.svg'} 
            alt={report.title} 
            className="w-full h-full object-cover"
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