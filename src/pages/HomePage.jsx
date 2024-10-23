import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import InvestigationList from '../components/views/investigations/InvestigationList';
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import { testProjects } from '../data/testProjects';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [investigations, setInvestigations] = useState([]);
  const [user, setUser] = useState({
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  });

  useEffect(() => {
    // Load existing projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    // If there's a new project from navigation state, add it at the beginning
    if (location.state?.newProject) {
      const updatedProjects = [location.state.newProject, ...savedProjects];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      setInvestigations([location.state.newProject, ...testProjects, ...savedProjects]);
    } else {
      // Otherwise, just combine test projects with saved projects
      setInvestigations([...testProjects, ...savedProjects]);
    }
  }, [location.state]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleProjectClick = (project) => {
    const username = 'user';
    navigate(`/${username}/project/${encodeURIComponent(project.title)}`);
  };

  const handleUpdateInvestigation = (updatedInvestigation) => {
    setInvestigations(prevInvestigations =>
      prevInvestigations.map(inv =>
        inv.id === updatedInvestigation.id ? updatedInvestigation : inv
      )
    );
  };

  const handleAddNewProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: 'New Project',
      description: '',
      reports: []
    };
    navigate(`/project/${newProject.id}`, { state: { project: newProject } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} />
      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="bg-gray-100 rounded-[64px] p-8 overflow-hidden shadow-inner flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FileSearchIcon className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold">Investigations</h2>
            </div>
            <Button 
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
              onClick={handleAddNewProject}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          
          <InvestigationList 
            investigations={investigations}
            onUpdateInvestigation={handleUpdateInvestigation}
          />
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSave={(newReport) => {
          if (investigations.length > 0) {
            const updatedInvestigation = {
              ...investigations[0],
              reports: [...investigations[0].reports, newReport]
            };
            handleUpdateInvestigation(updatedInvestigation);
          }
          setIsReportModalOpen(false);
        }}
      />
      
      {editingProject && (
        <ProjectEditModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
          onUpdate={handleUpdateInvestigation}
        />
      )}
    </div>
  );
};

export default HomePage;
