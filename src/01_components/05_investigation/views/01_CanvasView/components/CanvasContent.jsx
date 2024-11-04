import React from 'react';
import ConnectionLines from './ConnectionLines';

const CanvasContent = React.memo(({ 
  contentRef,
  transformStyle,
  connections,
  activeConnection,
  selectedConnection,
  selectConnection,
  renderNodes,
  onWheel 
}) => {
  return (
    <div 
      ref={contentRef}
      className="absolute inset-0 will-change-transform scrollbar-hide" 
      style={transformStyle}
      onWheel={onWheel}
    >
      <ConnectionLines 
        connections={connections}
        activeConnection={activeConnection}
        selectedConnectionId={selectedConnection?.id}
        onSelectConnection={selectConnection}
      />
      {renderNodes()}
    </div>
  );
});

CanvasContent.displayName = 'CanvasContent';

export default CanvasContent;