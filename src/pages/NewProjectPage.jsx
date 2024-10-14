import React from 'react';
import UserProfile from '../components/UserProfile';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusIcon } from 'lucide-react';

const NewProjectPage = () => {
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
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
      <main className="flex-grow bg-[#594BFF] relative">
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
        <div className="container mx-auto px-4 py-8 h-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-2 max-w-xl w-full">
            <Input 
              type="text" 
              placeholder="Ask anything" 
              className="flex-grow text-lg"
            />
            <Button size="icon" className="rounded-full">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
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