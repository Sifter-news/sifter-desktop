import React from 'react';
import EditableTitle from './EditableTitle';

const NodeContent = ({ style, node, onNodeUpdate }) => {
  const handleSave = (newTitle, newDescription) => {
    onNodeUpdate(node.id, {
      title: newTitle,
      description: newDescription
    });
  };

  const renderContent = () => {
    switch (style) {
      case 'compact':
        return (
          <div className="w-10 h-10 p-1 bg-white rounded-full">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full" />
          </div>
        );
      case 'expanded':
        return (
          <div className="flex items-center p-2 bg-white rounded-lg">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <EditableTitle
              title={node.title}
              description={node.description}
              onSave={handleSave}
              style={style}
            />
          </div>
        );
      case 'postit':
        return (
          <div className="w-[240px] h-[200px] p-4 bg-yellow-100 rounded-sm shadow-md">
            <EditableTitle
              title={node.title}
              description={node.description}
              onSave={handleSave}
              style={style}
            />
          </div>
        );
      default:
        return (
          <div className="flex items-center p-2 bg-white rounded-lg">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <EditableTitle
              title={node.title}
              description={node.description}
              onSave={handleSave}
              style={style}
            />
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      {renderContent()}
    </div>
  );
};

export default NodeContent;