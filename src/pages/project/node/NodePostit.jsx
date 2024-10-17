import React from 'react';

const NodePostit = ({ node, onUpdate }) => {
  return (
    <div className="bg-yellow-200 p-4 rounded shadow">
      <h3 className="font-bold">{node.title}</h3>
      <p>{node.content}</p>
    </div>
  );
};

export default NodePostit;