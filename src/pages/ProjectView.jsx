import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectEditModal from '../components/ProjectEditModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';

const ProjectView = () => {
  const { id } = useParams();
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  const [project, setProject] = useState({
    id,
    title: `Project ${id}`,
    description: 'This is a sample project description.',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProjectClick = () => {
    setIsEditModalOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    setIsEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} projectName={project.title} onProjectClick={handleProjectClick} />
      <main className="flex-grow bg-[#594BFF] relative flex items-center justify-center">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        ></div>
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
          <Button size="icon" className="rounded-full flex-shrink-0">
            <PlusIcon className="h-6 w-6" />
          </Button>
          <Input 
            type="text" 
            placeholder="Ask anything about this project" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
          />
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
            Ask
          </Button>
        </div>
      </main>
      <footer className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-center space-x-4">
            {/* Add toolbar buttons here */}
            <Button variant="ghost">Tool 1</Button>
            <Button variant="ghost">Tool 2</Button>
            <Button variant="ghost">Tool 3</Button>
          </div>
        </div>
      </footer>
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdate={handleProjectUpdate}
      />
    </div>
  );
};

export default ProjectView;
