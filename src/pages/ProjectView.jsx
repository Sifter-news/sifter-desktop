import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectEditModal from '../components/ProjectEditModal';
import ArticleModal from '../components/ArticleModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
  const [newArticle, setNewArticle] = useState(null);

  const handleProjectClick = () => {
    setIsEditModalOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    setIsEditModalOpen(false);
  };

  const handleNewArticle = () => {
    setIsNewArticleModalOpen(true);
  };

  const handleSaveArticle = (article) => {
    // Simulating saving to database
    const updatedReports = [...project.reports, { ...article, id: Date.now() }];
    setProject({ ...project, reports: updatedReports });
    setNewArticle(article);
    setIsNewArticleModalOpen(false);
  };

  const handleDeleteArticle = (articleId) => {
    const updatedReports = project.reports.filter(report => report.id !== articleId);
    setProject({ ...project, reports: updatedReports });
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
      <ArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        article={{ title: '', content: '' }}
        onUpdate={handleSaveArticle}
      />
      <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2">
        {[newArticle, ...project.reports].slice(0, 4).reverse().map((report, index) => (
          report && (
            <TooltipProvider key={report.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Avatar className={`w-12 h-12 cursor-pointer ${index > 0 ? '-mb-6' : ''}`}>
                        <AvatarImage src={report.image || '/placeholder.svg'} alt={report.title} />
                        <AvatarFallback>{report.title.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Article</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this article? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteArticle(report.id)}>
                          <Trash2Icon className="mr-2 h-4 w-4" />
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold">{report.title}</p>
                  <p>{report.content.substring(0, 100)}...</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
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