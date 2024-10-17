import React from 'react';

const NodeText = ({ node, onUpdate }) => {
  return (
    <div className="bg-blue-100 p-4 rounded shadow">
      <p>{node.content}</p>
    </div>
  );
};

export default NodeText;