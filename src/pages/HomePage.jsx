import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  });

  const [investigations, setInvestigations] = useState([
    { 
      id: 1, 
      title: 'Human Survival Needs', 
      description: 'An investigation into the essential elements required for human survival, including physiological needs, safety, and psychological well-being.',
      reports: [
        { id: 1, title: 'Basic Physiological Needs', content: 'Humans require air, water, food, shelter, and sleep to survive. This article explores the minimum requirements for each of these essential needs...', image: '/default-image.png' },
        { id: 2, title: 'Safety and Security', content: 'Beyond basic physiological needs, humans require safety and security for long-term survival. This includes physical safety, financial security, and health...', image: '/default-image.png' },
        { id: 3, title: 'Psychological Well-being', content: 'Mental health is crucial for human survival. This report examines the importance of social connections, purpose, and self-actualization in maintaining psychological well-being...', image: '/default-image.png' },
        { id: 4, title: 'Environmental Adaptations', content: 'How humans adapt to various environments, from extreme cold to tropical heat, and the impact on survival strategies...', image: '/default-image.png' },
        { id: 5, title: 'Long-term Sustainability', content: 'Exploring sustainable practices for long-term human survival, including resource management and environmental conservation...', image: '/default-image.png' },
      ]
    },
    { 
      id: 2, 
      title: 'Startup Investment Due Diligence', 
      description: 'A comprehensive investigation into the key aspects of evaluating a potential startup investment, covering financial, legal, and market analysis.',
      reports: [
        { id: 6, title: 'Financial Analysis', content: 'This report delves into the startup\'s financial health, including revenue models, burn rate, and projections. It also examines the company\'s funding history and capitalization table...', image: '/default-image.png' },
        { id: 7, title: 'Market Opportunity', content: 'An in-depth look at the target market size, growth potential, and competitive landscape. This analysis also covers the startup\'s unique value proposition and go-to-market strategy...', image: '/default-image.png' },
        { id: 8, title: 'Team Assessment', content: 'Evaluating the founding team\'s experience, skills, and track record. This report also examines the company culture and ability to attract and retain top talent...', image: '/default-image.png' },
        { id: 9, title: 'Legal and Regulatory Review', content: 'A comprehensive review of the startup\'s legal structure, intellectual property rights, and any potential regulatory challenges or compliance issues...', image: '/default-image.png' },
        { id: 10, title: 'Technology and Product Evaluation', content: 'Assessing the startup\'s technology stack, product roadmap, and scalability potential. This report also covers any proprietary technologies or patents...', image: '/default-image.png' },
      ]
    },
    { 
      id: 3, 
      title: 'Climate Change', 
      description: 'Climate change is a long-term shift in global or regional climate patterns. Often climate change refers specifically to the rise in global temperatures from the mid-20th century to present.',
      reports: [
        { id: 11, title: 'Global Warming Trends', content: 'Recent studies show an alarming increase in global temperatures over the past century, with significant acceleration in the last few decades...', image: '/default-image.png' },
        { id: 12, title: 'Impact on Ecosystems', content: 'Climate change is having far-reaching effects on plant and animal species worldwide, disrupting delicate ecological balances...', image: '/default-image.png' },
        { id: 13, title: 'Sea Level Rise', content: 'Exploring the causes and consequences of rising sea levels, including the threat to coastal communities and island nations...', image: '/default-image.png' },
        { id: 14, title: 'Extreme Weather Events', content: 'Analyzing the increasing frequency and intensity of extreme weather events such as hurricanes, droughts, and heatwaves...', image: '/default-image.png' },
        { id: 15, title: 'Mitigation Strategies', content: 'Examining various approaches to mitigate climate change, including renewable energy adoption, carbon capture technologies, and policy interventions...', image: '/default-image.png' },
      ]
    },
    { 
      id: 4, 
      title: 'Artificial Intelligence', 
      description: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.',
      reports: [
        { id: 16, title: 'Machine Learning Breakthroughs', content: 'Recent advancements in machine learning algorithms have led to significant improvements in natural language processing and computer vision...', image: '/default-image.png' },
        { id: 17, title: 'AI Ethics and Governance', content: 'As AI systems become more prevalent in society, questions of ethics, privacy, and governance are becoming increasingly important...', image: '/default-image.png' },
        { id: 18, title: 'AI in Healthcare', content: 'AI is revolutionizing healthcare through improved diagnostic tools, personalized treatment plans, and drug discovery processes...', image: '/default-image.png' },
        { id: 19, title: 'The Future of Work', content: 'Exploring how AI is reshaping the job market, automating tasks, and creating new opportunities across various industries...', image: '/default-image.png' },
        { id: 20, title: 'AI and Creativity', content: 'Investigating the role of AI in creative fields such as art, music, and literature, and its potential to augment human creativity...', image: '/default-image.png' },
      ]
    },
  ]);

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`, { state: { project } });
  };

  const handleUpdateInvestigation = (updatedInvestigation) => {
    setInvestigations(prevInvestigations =>
      prevInvestigations.map(inv =>
        inv.id === updatedInvestigation.id ? updatedInvestigation : inv
      )
    );
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} onUpdateUser={handleUpdateUser} />
      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="bg-gray-100 rounded-[64px] pt-8 px-8 overflow-hidden shadow-inner flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FileSearchIcon className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold">Investigations</h2>
            </div>
            <Link to="/new-project">
              <Button className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
                <PlusIcon className="h-6 w-6" />
              </Button>
            </Link>
          </div>
          <div className="flex-grow overflow-y-auto pr-4 scrollbar-hide">
            <div className="flex flex-col space-y-8">
              {investigations.map(investigation => (
                <div key={investigation.id} className="flex flex-col lg:flex-row h-[400px]">
                  <div className="w-full lg:w-[548px] flex-shrink-0" onClick={() => handleProjectClick(investigation)}>
                    <InvestigationCard 
                      investigation={investigation} 
                      onUpdateInvestigation={handleUpdateInvestigation}
                    />
                  </div>
                  <div className="w-full lg:w-[548px] flex-shrink-0">
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
    </div>
  );
};

export default HomePage;