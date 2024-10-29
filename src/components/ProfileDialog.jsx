import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setName(profile.full_name || '');
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
        full_name: name
      });
      toast.success('Profile updated successfully');
      setIsOpen(false);
    } catch (error) {
      toast.error('Error updating profile: ' + error.message);
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
        <Button variant="ghost" className="text-sm pr-0">
          {name || username || user?.email?.split('@')[0] || 'Guest'}
          <UserIcon className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <input 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Full Name
            </Label>
            <input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <input 
              id="email" 
              value={user?.email || ''} 
              disabled 
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
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