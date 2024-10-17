import React from 'react';

const NodeDocument = ({ node, onUpdate }) => {
  return (
    <div className="bg-white p-4 rounded shadow border border-gray-300">
      <h3 className="font-bold">{node.title}</h3>
      <p>{node.content}</p>
    </div>
  );
};

export default NodeDocument;