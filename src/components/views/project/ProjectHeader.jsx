import React from 'react';
import { Button } from "@/components/ui/button";

const ProjectHeader = ({ onCreateProject }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">My Projects</h1>
      <Button onClick={onCreateProject}>Create New Project</Button>
    </div>
  );
};

export default ProjectHeader;