/**
 * @file EditProfileForm.jsx
 * @description Form component for updating user profile details
 * 
 * Potential improvements:
 * - Add field validation
 * - Add unsaved changes warning
 * - Add profile preview
 * - Add social media links
 * - Add professional details
 * - Add profile visibility settings
 * - Add profile completion guide
 */

import React from 'react';
import { useAuth } from '@/components/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';

const EditProfileForm = ({ user, onUpdate }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await onUpdate({
        fullName: formData.get('fullName'),
        bio: formData.get('bio'),
        location: formData.get('location'),
        website: formData.get('website'),
        company: formData.get('company'),
        position: formData.get('position')
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input 
          id="fullName"
          name="fullName"
          defaultValue={user.fullName}
          placeholder="Your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={user.bio}
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location"
            name="location"
            defaultValue={user.location}
            placeholder="Your location"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website"
            name="website"
            defaultValue={user.website}
            placeholder="Your website"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company"
            name="company"
            defaultValue={user.company}
            placeholder="Your company"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input 
            id="position"
            name="position"
            defaultValue={user.position}
            placeholder="Your position"
          />
        </div>
      </div>

      <Button type="submit">
        Save Changes
      </Button>
    </form>
  );
};

export default EditProfileForm;