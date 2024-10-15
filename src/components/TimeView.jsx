import React from 'react';

const TimeView = ({ project }) => {
  const timelineNodes = [
    { id: 1, title: 'Start', date: '2023-01-01' },
    { id: 2, title: 'Milestone 1', date: '2023-03-15' },
    { id: 3, title: 'Milestone 2', date: '2023-06-30' },
    { id: 4, title: 'Milestone 3', date: '2023-09-15' },
    { id: 5, title: 'End', date: '2023-12-31' },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] p-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">{project.title} Timeline</h2>
        <div className="relative">
          <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-1 bg-blue-200"></div>
          <div className="flex justify-between">
            {timelineNodes.map((node) => (
              <div key={node.id} className="relative flex flex-col items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center z-10">
                  <span className="text-white font-bold">{node.id}</span>
                </div>
                <div className="mt-2 text-center">
                  <div className="font-semibold">{node.title}</div>
                  <div className="text-sm text-gray-500">{node.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeView;