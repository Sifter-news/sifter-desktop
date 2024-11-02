import React from 'react';
import NodeTitle from './NodeTitle';
import NodeDescription from './NodeDescription';
import NodeAvatar from './NodeAvatar';

const NodeContent = ({ 
  style = 'default',
  node,
  isEditing = false,
  localTitle,
  localDescription,
  handleBlur,
  setLocalTitle,
  setLocalDescription,
  isFocused = false
}) => {
  const getStyleClasses = () => {
    switch (style) {
      case 'compact':
        return 'p-2 bg-white rounded-lg shadow-sm min-w-[120px]';
      case 'postit':
        return 'p-4 bg-yellow-100 rounded-lg shadow-md transform rotate-1 min-w-[150px]';
      default:
        return 'p-4 bg-white rounded-lg shadow-md min-w-[200px]';
    }
  };

  return (
    <div className={`${getStyleClasses()} ${isFocused ? 'ring-2 ring-blue-500' : ''}`}>
      <div className="flex items-start gap-3">
        {style !== 'compact' && (
          <NodeAvatar src={node.avatar} alt={node.title} />
        )}
        <div className="flex-1 min-w-0">
          <NodeTitle
            title={isEditing ? localTitle : node.title}
            isEditing={isEditing}
            onChange={(e) => setLocalTitle?.(e.target.value)}
            onBlur={handleBlur}
          />
          {style !== 'compact' && (
            <NodeDescription
              description={isEditing ? localDescription : node.description}
              isEditing={isEditing}
              onChange={(e) => setLocalDescription?.(e.target.value)}
              onBlur={handleBlur}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeContent;