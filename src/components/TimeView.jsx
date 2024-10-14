import React from 'react';

const TimeView = ({ investigations }) => {
  return (
    <div className="bg-gray-100 rounded-[64px] pt-8 px-8 pb-6 overflow-hidden shadow-inner">
      <h2 className="text-2xl font-bold mb-6">Time View</h2>
      <div className="space-y-4">
        {investigations.map(investigation => (
          <div key={investigation.id} className="flex items-center">
            <div className="w-32 text-right pr-4">{new Date().toLocaleDateString()}</div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold">{investigation.title}</h3>
              <p>{investigation.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeView;