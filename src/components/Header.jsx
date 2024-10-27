import React from 'react';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, projectName, onProjectUpdate }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="font-semibold"
            onClick={() => navigate('/')}
          >
            Investigation Hub
          </Button>
          {projectName && (
            <Button
              variant="ghost"
              className="font-medium text-gray-600"
              onClick={() => setIsEditModalOpen(true)}
            >
              {projectName}
            </Button>
          )}
        </div>
        <UserProfile user={user} />
      </div>
      {projectName && (
        <ProjectEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={{ title: projectName }}
          onUpdate={onProjectUpdate}
        />
      )}
    </header>
  );
};

export default Header;