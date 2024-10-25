import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { PlusIcon, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ArticleModal from './ArticleModal';
import { toast } from "sonner";

const ReportList = ({ reports = [], onAddReport, onEditReport }) => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const handleSaveArticle = (article) => {
    // Create a serializable article object
    const serializableArticle = {
      id: String(Date.now()),
      title: article.title || '',
      content: article.content || '',
      image: article.image || '/default-image.png'
    };
    
    if (typeof onAddReport === 'function') {
      onAddReport(serializableArticle);
    } else {
      console.warn('onAddReport prop is not a function');
      toast.error("Unable to add report at this time");
    }
    setIsArticleModalOpen(false);
  };

  const handleEditReport = (report) => {
    if (!report) return;
    
    // Create a serializable report object
    const serializableReport = {
      id: String(report.id),
      title: report.title || '',
      content: report.content || '',
      image: report.image || '/default-image.png'
    };
    
    if (typeof onEditReport === 'function') {
      onEditReport(serializableReport);
    } else {
      console.warn('onEditReport prop is not a function');
      toast.error("Unable to edit report at this time");
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-10">
      <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-full">
        <div className="flex flex-col items-center">
          {reports && reports.length > 0 && (
            <div className="w-[30%] mb-4 flex flex-wrap justify-center gap-2">
              {reports.map((report) => (
                <TooltipProvider key={String(report.id)}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center text-white cursor-pointer"
                        onClick={() => handleEditReport(report)}
                      >
                        <Circle className="w-6 h-6" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-bold">{report.title || 'Untitled'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
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