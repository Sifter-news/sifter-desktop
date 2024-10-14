import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import InvestigationCard from './InvestigationCard';
import ReportCard from './ReportCard';

const MindMapView = ({ investigations }) => {
  return (
    <div className="bg-gray-100 rounded-[64px] pt-8 px-8 pb-6 overflow-hidden shadow-inner">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <FileSearchIcon className="h-4 w-4 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold">Investigations</h2>
        </div>
        <Link to="/new-project">
          <Button className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
            <PlusIcon className="h-6 w-6" />
          </Button>
        </Link>
      </div>
      <div className="flex flex-col space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-4 scrollbar-hide">
        {investigations.map(investigation => (
          <div key={investigation.id} className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[548px] flex-shrink-0">
              <InvestigationCard investigation={investigation} />
            </div>
            <div className="w-full lg:w-[548px] flex-shrink-0">
              <div className="bg-white bg-opacity-30 rounded-r-lg p-4 h-[323px] relative overflow-hidden">
                <div className="overflow-x-auto h-full scrollbar-hide">
                  <div className="flex space-x-4 h-full pb-4">
                    {investigation.reports.map(report => (
                      <div key={report.id} className="w-64 flex-shrink-0">
                        <ReportCard report={report} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindMapView;