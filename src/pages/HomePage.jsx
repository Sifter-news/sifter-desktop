import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';
import { supabase } from '../integrations/supabase/supabase';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardContent from '../components/dashboard/DashboardContent';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingInvestigation, setEditingInvestigation] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser({
        id: session.user.id,
        name: session.user.email === 'admin@sifter.news' ? 'Sifter Admin' : session.user.email,
        avatar: '/placeholder.svg',
        email: session.user.email,
      });
    };

    checkSession();
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} />
      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="bg-gray-100 rounded-[64px] p-8 overflow-hidden shadow-inner flex-grow flex flex-col">
          <DashboardHeader />
          <DashboardContent user={user} />
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
      
      {editingInvestigation && (
        <ProjectEditModal
          isOpen={!!editingInvestigation}
          onClose={() => setEditingInvestigation(null)}
          project={editingInvestigation}
        />
      )}
    </div>
  );
};

export default HomePage;