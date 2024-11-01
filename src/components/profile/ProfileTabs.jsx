import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTabContent from './ProfileTabContent';
import SecurityTabContent from './SecurityTabContent';
import PreferencesTabContent from './PreferencesTabContent';
import SubscriptionTabContent from './SubscriptionTabContent';

const ProfileTabs = ({ 
  username,
  name,
  avatar,
  email,
  currentPassword,
  newPassword,
  confirmPassword,
  onImageUpload,
  onUsernameChange,
  onNameChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onPasswordReset,
  onDeleteAccount,
  onSaveProfile,
  onSignOut,
  user
}) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="subscription">Subscription</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <ProfileTabContent
          avatar={avatar}
          username={username}
          name={name}
          email={email}
          onImageUpload={onImageUpload}
          onUsernameChange={onUsernameChange}
          onNameChange={onNameChange}
          onSave={onSaveProfile}
        />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTabContent
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          onCurrentPasswordChange={onCurrentPasswordChange}
          onNewPasswordChange={onNewPasswordChange}
          onConfirmPasswordChange={onConfirmPasswordChange}
          onPasswordReset={onPasswordReset}
          onDeleteAccount={onDeleteAccount}
        />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionTabContent userId={user?.id} />
      </TabsContent>

      <TabsContent value="preferences">
        <PreferencesTabContent onSignOut={onSignOut} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;