import React from 'react';

const SelectionOverlay = ({ selectionStart, selectionEnd }) => {
  if (!selectionStart || !selectionEnd) return null;

  return (
    <div
      className="absolute border-2 border-blue-500 bg-blue-500/20"
      style={{
        left: Math.min(selectionStart.x, selectionEnd.x),
        top: Math.min(selectionStart.y, selectionEnd.y),
        width: Math.abs(selectionEnd.x - selectionStart.x),
        height: Math.abs(selectionEnd.y - selectionStart.y),
      }}
    />
  );
};

export default SelectionOverlay;