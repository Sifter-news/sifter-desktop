import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';
import { useProfile, useUpdateProfile } from '@/integrations/supabase/index';
import ProfileTabs from './profile/ProfileTabs';

const ProfileDialog = ({ user }) => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProfile(user?.id);
  const { mutate: updateProfile } = useUpdateProfile();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('/default-image.png');
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || user?.email?.split('@')[0] || '');
      setName(profile.full_name || '');
      setAvatar(profile.avatar_url || '/default-image.png');
    }
  }, [profile, user]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out: ' + error.message);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setAvatar(publicUrl);
      await updateProfile({
        id: user.id,
        avatar_url: publicUrl
      });

      toast.success('Profile image updated successfully');
    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Error updating password: ' + error.message);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      toast.error('No user found');
      return;
    }

    try {
      await updateProfile({
        id: user.id,
        username,
        full_name: name,
        avatar_url: avatar
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmation) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', user.id);

        if (error) throw error;

        await supabase.auth.signOut();
        navigate('/login');
        toast.success('Account deleted successfully');
      } catch (error) {
        toast.error('Error deleting account: ' + error.message);
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-sm">
          <div className="flex flex-col items-end mr-2">
            <span className="font-medium">{username}</span>
            <span className="text-xs text-gray-500">{user?.email}</span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <ProfileTabs
          username={username}
          name={name}
          avatar={avatar}
          email={user?.email}
          currentPassword={currentPassword}
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          onImageUpload={handleImageUpload}
          onUsernameChange={(e) => setUsername(e.target.value)}
          onNameChange={(e) => setName(e.target.value)}
          onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)}
          onNewPasswordChange={(e) => setNewPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onPasswordReset={handlePasswordReset}
          onDeleteAccount={handleDeleteAccount}
          onSaveProfile={handleSaveProfile}
          onSignOut={handleSignOut}
          user={user}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;