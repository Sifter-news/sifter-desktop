import React from 'react';
import UserProfile from '../components/UserProfile';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';

const HomePage = () => {
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
  };

  const investigations = [
    { 
      id: 1, 
      title: 'Human Survival Needs', 
      description: 'An investigation into the essential elements required for human survival, including physiological needs, safety, and psychological well-being.',
      reports: [
        { id: 1, title: 'Basic Physiological Needs', content: 'Humans require air, water, food, shelter, and sleep to survive. This article explores the minimum requirements for each of these essential needs...' },
        { id: 2, title: 'Safety and Security', content: 'Beyond basic physiological needs, humans require safety and security for long-term survival. This includes physical safety, financial security, and health...' },
        { id: 3, title: 'Psychological Well-being', content: 'Mental health is crucial for human survival. This report examines the importance of social connections, purpose, and self-actualization in maintaining psychological well-being...' },
      ]
    },
    { 
      id: 2, 
      title: 'Startup Investment Due Diligence', 
      description: 'A comprehensive investigation into the key aspects of evaluating a potential startup investment, covering financial, legal, and market analysis.',
      reports: [
        { id: 4, title: 'Financial Analysis', content: 'This report delves into the startup\'s financial health, including revenue models, burn rate, and projections. It also examines the company\'s funding history and capitalization table...' },
        { id: 5, title: 'Market Opportunity', content: 'An in-depth look at the target market size, growth potential, and competitive landscape. This analysis also covers the startup\'s unique value proposition and go-to-market strategy...' },
        { id: 6, title: 'Team Assessment', content: 'Evaluating the founding team\'s experience, skills, and track record. This report also examines the company culture and ability to attract and retain top talent...' },
        { id: 7, title: 'Legal and Regulatory Review', content: 'A comprehensive review of the startup\'s legal structure, intellectual property rights, and any potential regulatory challenges or compliance issues...' },
      ]
    },
    { 
      id: 3, 
      title: 'Climate Change', 
      description: 'Climate change is a long-term shift in global or regional climate patterns. Often climate change refers specifically to the rise in global temperatures from the mid-20th century to present.',
      reports: [
        { id: 8, title: 'Global Warming Trends', content: 'Recent studies show an alarming increase in global temperatures over the past century, with significant acceleration in the last few decades...' },
        { id: 9, title: 'Impact on Ecosystems', content: 'Climate change is having far-reaching effects on plant and animal species worldwide, disrupting delicate ecological balances...' },
      ]
    },
    { 
      id: 4, 
      title: 'Artificial Intelligence', 
      description: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.',
      reports: [
        { id: 10, title: 'Machine Learning Breakthroughs', content: 'Recent advancements in machine learning algorithms have led to significant improvements in natural language processing and computer vision...' },
        { id: 11, title: 'AI Ethics and Governance', content: 'As AI systems become more prevalent in society, questions of ethics, privacy, and governance are becoming increasingly important...' },
        { id: 12, title: 'AI in Healthcare', content: 'AI is revolutionizing healthcare through improved diagnostic tools, personalized treatment plans, and drug discovery processes...' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold">Sifter Beta.v2</span>
            <span className="text-lg text-purple-600">Dashboard Name</span>
          </div>
          <UserProfile user={user} />
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 rounded-[64px] p-8 overflow-hidden shadow-inner">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Investigations</h2>
            <Button className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto pr-4 scrollbar-hide">
            {investigations.map(investigation => (
              <div key={investigation.id} className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-[548px] flex-shrink-0">
                  <InvestigationCard investigation={investigation} />
                </div>
                <div className="w-full lg:w-[548px] flex-shrink-0">
                  <div className="bg-white bg-opacity-30 rounded-r-lg p-4 h-[323px] relative overflow-hidden">
                    <div className="overflow-x-auto h-full scrollbar-hide">
                      <div className="flex space-x-4 h-full pb-4">
                        {investigation.reports.map(report => (
                          <div key={report.id} className="w-64 flex-shrink-0">
                            <ReportCard report={report} />
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
  );
};

export default HomePage;