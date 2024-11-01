import React from 'react';
import Left_Navigator from '../../Left_Navigator';
import LeftPanel from '../../LeftPanel';

const InvestigationWrapper = ({ children }) => {
  return (
    <div className="flex h-screen">
      <LeftPanel />
      <div className="flex-1 flex flex-col">
        <Left_Navigator />
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InvestigationWrapper;