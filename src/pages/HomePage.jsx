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
    { id: 1, title: 'Vitamins', description: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
    { id: 2, title: 'Project-1', description: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
  ];

  const reports = [
    { id: 1, title: 'Article-1', content: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
    { id: 2, title: 'Article-2', content: 'World War II was a global conflict that lasted from 1939 to 1945. It was a complex and multifaceted war that involved nearly all of the world\'s countries...' },
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Investigations</h2>
            {investigations.map(investigation => (
              <InvestigationCard key={investigation.id} investigation={investigation} />
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reports</h2>
            {reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;