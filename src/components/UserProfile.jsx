import React from 'react';
import ProfileDialog from './ProfileDialog';

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <ProfileDialog user={user}>
        <span className="text-sm font-normal cursor-pointer hover:text-gray-600 transition-colors">{user.name}</span>
      </ProfileDialog>
    </div>
  );
};

export default UserProfile;