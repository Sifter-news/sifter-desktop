import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{project.description}</p>
        <div className="flex justify-between">
          <Button onClick={() => onEdit(project)}>Edit</Button>
          <Button variant="destructive" onClick={() => onDelete(project.id)}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;