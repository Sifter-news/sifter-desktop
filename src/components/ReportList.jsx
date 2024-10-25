import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ArticleModal from './ArticleModal';

const ReportList = ({ reports = [], onAddReport, onEditReport }) => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const handleSaveArticle = (article) => {
    const newArticle = {
      ...article,
      id: Date.now(),
      image: '/default-image.png'
    };
    onAddReport(newArticle);
    setIsArticleModalOpen(false);
  };

  return (
    <div className="fixed bottom-12 right-12 z-10">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
        <div className="flex items-center space-x-2">
          {reports.map((report) => (
            <TooltipProvider key={report.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar 
                    className="w-12 h-12 cursor-pointer"
                    onClick={() => onEditReport(report)}
                  >
                    <AvatarImage src={report.image || '/placeholder.svg'} alt={report.title} />
                    <AvatarFallback>{report.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{report.title}</p>
                  <p>Click to Edit Report</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="rounded-full w-12 h-12 bg-black hover:bg-gray-800 text-white shadow-lg"
                  onClick={() => setIsArticleModalOpen(true)}
                >
                  <PlusIcon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add New Report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={null}
        onSave={handleSaveArticle}
      />
    </div>
  );
};

export default ReportList;