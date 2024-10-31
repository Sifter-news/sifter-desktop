import React from 'react';
import Navigator from '../Navigator';
import LeftPanel from '../LeftPanel';

const InvestigationWrapper = ({ children }) => {
  return (
    <div className="flex h-screen">
      <LeftPanel />
      <div className="flex-1 flex flex-col">
        <Navigator />
        <main className="flex-1 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default InvestigationWrapper;