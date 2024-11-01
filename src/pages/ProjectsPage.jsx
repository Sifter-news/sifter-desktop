import React from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectsPage = () => {
  const user = {
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Projects</h1>
          <Link to="/new-project">
            <Button className="flex items-center space-x-2">
              <PlusIcon className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </Link>
        </div>
        {/* Project list will be implemented here */}
        <p>Your projects will be listed here.</p>
      </main>
    </div>
  );
};

export default ProjectsPage;