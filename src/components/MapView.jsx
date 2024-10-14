import React from 'react';

const MapView = ({ investigations }) => {
  return (
    <div className="bg-gray-100 rounded-[64px] pt-8 px-8 pb-6 overflow-hidden shadow-inner">
      <h2 className="text-2xl font-bold mb-6">Map View</h2>
      <div className="bg-white h-[500px] rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Map placeholder - Investigations would be plotted here</p>
      </div>
    </div>
  );
};

export default MapView;