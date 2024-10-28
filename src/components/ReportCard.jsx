import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from 'lucide-react';
import ContentModal from './ContentModal';

const ReportCard = ({ report, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(report.image || '/placeholder.svg');
  const [avatar, setAvatar] = useState(report.avatar || '/default-image.png');

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handleSave = (updatedReport) => {
    onUpdate({
      ...report,
      ...updatedReport,
      image,
      avatar
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Card 
        className="w-full h-[200px] cursor-pointer hover:shadow-lg transition-shadow"
        onClick={handleClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt={report.title} />
              <AvatarFallback>
                <FileText className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {report.title}
              </p>
              <p className="text-sm text-gray-500 line-clamp-3">
                {report.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={report}
        onSave={handleSave}
        type="report"
      />
    </>
  );
};

export default ReportCard;