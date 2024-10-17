import React from 'react';

const NodeBlank = ({ node, onUpdate }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">{node.title}</h3>
      <p>{node.content}</p>
    </div>
  );
};

export default NodeBlank;