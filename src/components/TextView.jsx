import React from 'react';

const TextView = ({ project }) => {
  return (
    <div className="flex min-h-[calc(100vh-120px)]">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h3 className="font-bold mb-4">Navigator</h3>
        <ul className="space-y-2">
          <li>📁 Folder 1</li>
          <li className="ml-4">📄 Document 1</li>
          <li className="ml-4">📄 Document 2</li>
          <li>📁 Folder 2</li>
          <li className="ml-4">📄 Document 3</li>
          <li>📄 Document 4</li>
          <li>📁 Folder 3</li>
          <li className="ml-4">📄 Document 5</li>
          <li className="ml-4">📄 Document 6</li>
          <li>📄 Document 7</li>
        </ul>
      </div>
      <div className="w-3/4 p-8 flex justify-center items-start">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
          <p className="text-gray-600">{project.description}</p>
          {/* Add more content here as needed */}
        </div>
      </div>
    </div>
  );
};

export default TextView;