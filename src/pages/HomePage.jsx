import React from 'react';
import UserProfile from '../components/UserProfile';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';

const HomePage = () => {
  const user = {
    name: 'John Doe',
    avatar: '/placeholder.svg',
  };

  const investigations = [
    { 
      id: 1, 
      title: 'Vitamins', 
      description: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries, including all of the great powers, and resulted in the deaths of millions of people.',
      reports: [
        { id: 1, title: 'Article-1', content: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
        { id: 2, title: 'Article-2', content: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
      ]
    },
    { 
      id: 2, 
      title: 'Project-1', 
      description: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...',
      reports: [
        { id: 3, title: 'Article-3', content: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
      ]
    },
    { 
      id: 3, 
      title: 'Climate Change', 
      description: 'Climate change is a long-term shift in global or regional climate patterns. Often climate change refers specifically to the rise in global temperatures from the mid-20th century to present.',
      reports: [
        { id: 4, title: 'Global Warming Trends', content: 'Recent studies show an alarming increase in global temperatures over the past century, with significant acceleration in the last few decades...' },
        { id: 5, title: 'Impact on Ecosystems', content: 'Climate change is having far-reaching effects on plant and animal species worldwide, disrupting delicate ecological balances...' },
      ]
    },
    { 
      id: 4, 
      title: 'Artificial Intelligence', 
      description: 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction.',
      reports: [
        { id: 6, title: 'Machine Learning Breakthroughs', content: 'Recent advancements in machine learning algorithms have led to significant improvements in natural language processing and computer vision...' },
        { id: 7, title: 'AI Ethics and Governance', content: 'As AI systems become more prevalent in society, questions of ethics, privacy, and governance are becoming increasingly important...' },
        { id: 8, title: 'AI in Healthcare', content: 'AI is revolutionizing healthcare through improved diagnostic tools, personalized treatment plans, and drug discovery processes...' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <UserProfile user={user} />
        </div>
        <div className="text-center mb-12">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        </div>
        <div className="bg-gray-100 rounded-t-4xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Investigations</h2>
            <Button className="rounded-full w-14 h-14 p-0 flex items-center justify-center">
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-8">
            {investigations.map(investigation => (
              <div key={investigation.id} className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="w-full lg:w-[548px] flex-shrink-0">
                  <InvestigationCard investigation={investigation} />
                </div>
                <div className="w-full lg:w-[548px] flex-shrink-0">
                  <div className="bg-white bg-opacity-30 rounded-lg p-4 h-[323px]">
                    <div className="overflow-x-auto h-full">
                      <div className="flex space-x-4 h-full">
                        {investigation.reports.map(report => (
                          <div key={report.id} className="w-64 flex-shrink-0">
                            <ReportCard report={report} />
                          </div>
                        ))}
                      </div>
                    </div>
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