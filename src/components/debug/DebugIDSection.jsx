import React from 'react';
import { CircleCheck, CircleX } from 'lucide-react';

const DebugIDSection = ({ id }) => {
  const hasId = !!id;
  
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-white/80">ID Status 🔑</p>
      <div className="pl-2 flex items-center gap-2">
        {hasId ? (
          <>
            <CircleCheck className="h-4 w-4 text-green-400" />
            <p className="text-xs text-green-400">ID: {id}</p>
          </>
        ) : (
          <>
            <CircleX className="h-4 w-4 text-red-400" />
            <p className="text-xs text-red-400">No ID assigned</p>
          </>
        )}
      </div>
    </div>
  );
};

export default DebugIDSection;