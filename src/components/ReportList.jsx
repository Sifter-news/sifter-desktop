import React from 'react';
import { Button } from "@/components/ui/button";
import NodeNavigator from './text-view/NodeNavigator';

const ReportList = ({ reports, onAddReport, onEditReport, onAIConversation }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg w-80">
      <NodeNavigator
        nodes={reports}
        onUpdateNode={onEditReport}
        onAddNode={onAddReport}
        onAIConversation={onAIConversation}
      />
    </div>
  );
};

export default ReportList;