import React from 'react';
import ProfileDialog from './ProfileDialog';

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <ProfileDialog user={user} />
    </div>
  );
};

export default UserProfile;