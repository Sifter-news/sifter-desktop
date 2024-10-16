import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  });

  const [investigations, setInvestigations] = useState([]);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    // Load investigations from localStorage
    const savedInvestigations = localStorage.getItem('investigations');
    if (savedInvestigations) {
      setInvestigations(JSON.parse(savedInvestigations));
    }
  }, []);

  useEffect(() => {
    // Save investigations to localStorage whenever they change
    localStorage.setItem('investigations', JSON.stringify(investigations));
  }, [investigations]);

  const handleProjectClick = (project) => {
    const username = 'user'; // Replace this with actual username logic
    navigate(`/${username}/project/${encodeURIComponent(project.title)}`);
  };

  const handleUpdateInvestigation = (updatedInvestigation) => {
    setInvestigations(prevInvestigations =>
      prevInvestigations.map(inv =>
        inv.id === updatedInvestigation.id ? updatedInvestigation : inv
      )
    );
  };

  const handleDeleteInvestigation = (projectId) => {
    setInvestigations(prevInvestigations =>
      prevInvestigations.filter(inv => inv.id !== projectId)
    );
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleAddNewProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: 'New Project',
      description: '',
      reports: []
    };
    setInvestigations(prevInvestigations => [...prevInvestigations, newProject]);
    navigate(`/project/${newProject.id}`, { state: { project: newProject } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} onUpdateUser={handleUpdateUser} />
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
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            <div className="flex flex-col space-y-6">
              {investigations.map((investigation) => (
                <div key={investigation.id} className="flex flex-col lg:flex-row w-full">
                  <div className="w-full lg:w-1/2 flex-shrink-0" onClick={() => handleProjectClick(investigation)}>
                    <InvestigationCard 
                      investigation={investigation} 
                      onUpdateInvestigation={handleUpdateInvestigation}
                    />
                  </div>
                  <div className="w-full lg:w-1/2 flex-shrink-0">
                    <div className="bg-white bg-opacity-30 rounded-r-lg p-4 h-full relative overflow-hidden">
                      <div className="overflow-x-auto h-full scrollbar-hide">
                        <div className="flex space-x-4 h-full pb-4">
                          {investigation.reports.map(report => (
                            <div key={report.id} className="w-64 flex-shrink-0">
                              <ReportCard 
                                report={report} 
                                onUpdate={(updatedReport) => {
                                  const updatedReports = investigation.reports.map(r =>
                                    r.id === updatedReport.id ? updatedReport : r
                                  );
                                  handleUpdateInvestigation({
                                    ...investigation,
                                    reports: updatedReports
                                  });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          onDelete={handleDeleteInvestigation}
        />
      )}
    </div>
  );
};

export default HomePage;
