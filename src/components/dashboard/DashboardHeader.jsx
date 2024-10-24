import React from 'react';
import { FileSearchIcon, PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <FileSearchIcon className="h-4 w-4 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold">Investigations</h2>
      </div>
      <Button 
        className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
        onClick={() => navigate('/project/new')}
      >
        <PlusIcon className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default DashboardHeader;