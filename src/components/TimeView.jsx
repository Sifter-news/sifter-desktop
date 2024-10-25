import React from 'react';
import { format } from 'date-fns';
import ReportList from './ReportList';

const TimeView = ({ project, nodes, reports, onAddReport, onUpdateReport }) => {
  const sortedNodes = [...nodes].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  return (
    <div className="min-h-[calc(100vh-120px)] p-8 relative">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="relative">
          <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-1 bg-blue-200"></div>
          <div className="flex justify-between">
            {sortedNodes.map((node, index) => (
              <div key={node.id} className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="mt-2 text-center">
                  <div className="font-semibold">{node.title}</div>
                  <div className="text-sm text-gray-500">
                    {node.timestamp 
                      ? format(new Date(node.timestamp), 'yyyy-MM-dd HH:mm')
                      : 'No timestamp'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-12 right-12 z-50">
        <ReportList
          reports={reports}
          onAddReport={onAddReport}
          onEditReport={onUpdateReport}
        />
      </div>
    </div>
  );
};

export default TimeView;