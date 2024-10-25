import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { useProfile, useUpdateProfile } from '@/integrations/supabase/index';

const ProfileDialog = ({ user }) => {
  const navigate = useNavigate();
  const { data: profile, isLoading, error } = useProfile(user?.id);
  const { mutate: updateProfile } = useUpdateProfile();
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('/placeholder.svg');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setAvatar(profile.avatar_url || '/placeholder.svg');
    }
  }, [profile]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out: ' + error.message);
    }
  };

  const handleSaveChanges = async () => {
    if (!user?.id) {
      toast.error('No user found');
      return;
    }

    try {
      await updateProfile({
        id: user.id,
        username,
        avatar_url: avatar
      });
      toast.success('Profile updated successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
    }
  };

  const handleImageUpload = async (event) => {
    if (!user?.id) {
      toast.error('No user found');
      return;
    }

    try {
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-avatar.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatar(publicUrl);
      await updateProfile({
        id: user.id,
        avatar_url: publicUrl
      });

      toast.success('Avatar updated successfully');
    } catch (error) {
      toast.error('Error uploading avatar: ' + error.message);
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
        <Button variant="ghost" className="text-sm">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
          </Avatar>
          {username || 'Profile'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback><UserIcon className="h-12 w-12" /></AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-center">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full max-w-xs"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              value={user?.email || ''} 
              disabled 
              className="col-span-3" 
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleSignOut}>
            <LogOutIcon className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <Button type="submit" onClick={handleSaveChanges}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;