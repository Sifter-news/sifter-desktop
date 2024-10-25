import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const NewArticlePreview = ({ onClose }) => {
  return (
    <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2">
      <Card className="w-64 bg-white shadow-lg">
        <CardHeader className="relative pb-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-sm">New Article</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
            <img
              src="/placeholder.svg"
              alt="New Article"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewArticlePreview;