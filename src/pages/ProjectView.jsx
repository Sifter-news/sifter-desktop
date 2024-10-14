import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectEditModal from '../components/ProjectEditModal';
import ArticleModal from '../components/ArticleModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindMapView from '../components/MindMapView';
import TextView from '../components/TextView';
import TimeView from '../components/TimeView';
import MapView from '../components/MapView';

const ProjectView = () => {
  const { id } = useParams();
  const location = useLocation();
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  const [project, setProject] = useState(location.state?.project || {
    id,
    title: `Project ${id}`,
    description: 'This is a sample project description.',
    reports: []
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const handleProjectClick = () => {
    setIsEditModalOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    setIsEditModalOpen(false);
  };

  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsNewArticleModalOpen(true);
  };

  const handleSaveArticle = (article) => {
    if (editingArticle) {
      const updatedReports = project.reports.map(report =>
        report.id === editingArticle.id ? { ...article, id: report.id } : report
      );
      setProject({ ...project, reports: updatedReports });
    } else {
      const updatedReports = [...project.reports, { ...article, id: Date.now() }];
      setProject({ ...project, reports: updatedReports });
    }
    setIsNewArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setIsNewArticleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} projectName={project.title} onProjectClick={handleProjectClick} />
      <Tabs defaultValue="mind" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="mind">Mind</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="mind">
          <MindMapView project={project} />
        </TabsContent>
        <TabsContent value="text">
          <TextView project={project} />
        </TabsContent>
        <TabsContent value="time">
          <TimeView project={project} />
        </TabsContent>
        <TabsContent value="map">
          <MapView project={project} />
        </TabsContent>
      </Tabs>
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdate={handleProjectUpdate}
      />
      <ArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        article={editingArticle || { title: '', content: '' }}
        onUpdate={handleSaveArticle}
      />
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
        {project.reports.slice(0, 4).reverse().map((report, index) => (
          <TooltipProvider key={report.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar 
                  className={`w-12 h-12 cursor-pointer ${index > 0 ? '-mb-6' : ''}`}
                  onClick={() => handleEditArticle(report)}
                >
                  <AvatarImage src={report.image || '/placeholder.svg'} alt={report.title} />
                  <AvatarFallback>{report.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{report.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
          onClick={handleNewArticle}
        >
          <PlusIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ProjectView;
