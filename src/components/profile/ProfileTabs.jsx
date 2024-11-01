import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTabContent from './ProfileTabContent';
import SecurityTabContent from './SecurityTabContent';
import PreferencesTabContent from './PreferencesTabContent';

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
  onSignOut
}) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
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

      <TabsContent value="preferences">
        <PreferencesTabContent onSignOut={onSignOut} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;