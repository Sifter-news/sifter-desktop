import React from 'react';
import AccountSettings from '@/components/profile/AccountSettings';
import Header from '@/components/Header';

const AccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AccountSettings />
    </div>
  );
};

export default AccountPage;