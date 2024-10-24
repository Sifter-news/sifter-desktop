import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon } from 'lucide-react';

const NewProjectPage = () => {
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState('');
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  const handleCreateProject = () => {
    if (projectTitle.trim()) {
      const newProject = {
        id: Date.now().toString(),
        title: projectTitle,
        description: '',
        reports: []
      };
      // Here you would typically save the new project to your backend
      // For now, we'll just navigate to the new project view
      navigate(`/project/${newProject.id}`, { state: { project: newProject } });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="Sifter Logo" />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <span className="text-xl font-bold">Sifter</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Dashboard Icon" />
              <AvatarFallback>DI</AvatarFallback>
            </Avatar>
            <span className="text-lg text-[#4B25F3]">New Project</span>
          </div>
          <UserProfile user={user} />
        </div>
      </header>
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
          <Button size="icon" className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]">
            <PlusIcon className="h-6 w-6 text-[#594BFF]" />
          </Button>
          <Input 
            type="text" 
            placeholder="Enter project title" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
          />
          <Button 
            className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
            onClick={handleCreateProject}
          >
            Create
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
    </div>
  );
};

export default NewProjectPage;