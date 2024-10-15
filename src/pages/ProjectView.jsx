import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectEditModal from '../components/ProjectEditModal';
import ArticleModal from '../components/ArticleModal';
import { Button } from "@/components/ui/button";
import { PlusIcon, Brain, FileText, Clock, Map } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MindMapView from '../components/MindMapView';
import TextView from '../components/TextView';
import TimeView from '../components/TimeView';
import MapView from '../components/MapView';
import { loadProjectState, saveProjectState } from '../utils/projectUtils';

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
  });

  const [nodes, setNodes] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  useEffect(() => {
    const savedNodes = loadProjectState(project.id);
    if (savedNodes.length > 0) {
      setNodes(savedNodes);
    }
  }, [project.id]);

  useEffect(() => {
    saveProjectState(project.id, nodes);
  }, [project.id, nodes]);

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
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === editingArticle.id ? { ...node, ...article } : node
      ));
    } else {
      const newNode = {
        id: Date.now().toString(),
        type: 'node',
        title: article.title,
        description: article.content,
        timestamp: Date.now(),
      };
      setNodes([...nodes, newNode]);
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
      <Tabs defaultValue="mind" className="w-full flex flex-col flex-grow">
        <TabsList className="max-w-[280px] mx-auto justify-center fixed top-16 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md z-10 inline-flex">
          <TabsTrigger value="mind" className="flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Mind
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Time
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <Map className="w-4 h-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>
        <div className="flex-grow mt-12">
          <TabsContent value="mind" className="h-full">
            <MindMapView project={project} nodes={nodes} setNodes={setNodes} />
          </TabsContent>
          <TabsContent value="text" className="h-full">
            <TextView project={project} nodes={nodes} setNodes={setNodes} />
          </TabsContent>
          <TabsContent value="time" className="h-full">
            <TimeView nodes={nodes} />
          </TabsContent>
          <TabsContent value="map" className="h-full">
            <MapView nodes={nodes} />
          </TabsContent>
        </div>
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
        {nodes.slice(0, 4).reverse().map((node, index) => (
          <TooltipProvider key={node.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar 
                  className={`w-12 h-12 cursor-pointer ${index > 0 ? '-mb-6' : ''}`}
                  onClick={() => handleEditArticle(node)}
                >
                  <AvatarImage src={node.image || '/placeholder.svg'} alt={node.title} />
                  <AvatarFallback>{node.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-bold">{node.title}</p>
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