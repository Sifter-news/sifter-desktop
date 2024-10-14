import React from 'react';
import UserProfile from '../components/UserProfile';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';

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
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <UserProfile user={user} />
        </div>
        <div className="text-center mb-12">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
        </div>
        <div className="space-y-12">
          {investigations.map(investigation => (
            <div key={investigation.id} className="flex flex-col space-y-4">
              <div className="w-full">
                <InvestigationCard investigation={investigation} />
              </div>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4">
                  {investigation.reports.map(report => (
                    <div key={report.id} className="w-64 flex-shrink-0">
                      <ReportCard report={report} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;