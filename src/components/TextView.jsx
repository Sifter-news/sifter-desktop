import React from 'react';

const TextView = ({ investigations }) => {
  return (
    <div className="bg-gray-100 rounded-[64px] pt-8 px-8 pb-6 overflow-hidden shadow-inner">
      <h2 className="text-2xl font-bold mb-6">Text View</h2>
      <ul className="space-y-4">
        {investigations.map(investigation => (
          <li key={investigation.id}>
            <h3 className="text-xl font-semibold">{investigation.title}</h3>
            <p>{investigation.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextView;