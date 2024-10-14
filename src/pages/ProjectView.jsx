import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindMapView from '../components/MindMapView';
import TextView from '../components/TextView';
import TimeView from '../components/TimeView';
import MapView from '../components/MapView';

const ProjectView = () => {
  const { id } = useParams();
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  // Fetch the specific investigation based on the id
  const investigation = {
    id: id,
    title: `Investigation ${id}`,
    description: 'This is a sample investigation.',
    reports: [
      { id: 1, title: 'Report 1', content: 'Sample content for Report 1' },
      { id: 2, title: 'Report 2', content: 'Sample content for Report 2' },
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm relative">
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
              <AvatarImage src="/placeholder.svg" alt="Project Icon" />
              <AvatarFallback>PI</AvatarFallback>
            </Avatar>
            <span className="text-lg text-[#4B25F3]">{investigation.title}</span>
          </div>
          <UserProfile user={user} />
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 pb-6">
        <Tabs defaultValue="mind" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mind">Mind</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="time">Time</TabsTrigger>
            <TabsTrigger value="map">Map</TabsTrigger>
          </TabsList>
          <TabsContent value="mind">
            <MindMapView investigations={[investigation]} />
          </TabsContent>
          <TabsContent value="text">
            <TextView investigations={[investigation]} />
          </TabsContent>
          <TabsContent value="time">
            <TimeView investigations={[investigation]} />
          </TabsContent>
          <TabsContent value="map">
            <MapView investigations={[investigation]} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectView;