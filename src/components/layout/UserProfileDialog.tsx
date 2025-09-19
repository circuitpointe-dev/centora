
import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Camera, Upload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
}

const UserProfileDialog = ({ isOpen, onClose, user }: UserProfileDialogProps) => {
  const { profile, updateProfile, uploadAvatar, loading } = useProfile();
  const [formData, setFormData] = useState({
    name: profile?.full_name || user.name,
    email: profile?.email || user.email,
    phone: profile?.phone || user.phone || '',
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when profile changes
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.full_name || user.name,
        email: profile.email || user.email,
        phone: profile.phone || user.phone || '',
      });
    }
  }, [profile, user.name, user.email, user.phone]);

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
      });
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setUploading(true);
      await uploadAvatar(file);
      toast({
        title: 'Success',
        description: 'Avatar updated successfully!',
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Clear the input to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and avatar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={profile?.avatar_url ? `${profile.avatar_url}?t=${Date.now()}` : user.avatar} 
                  alt={formData.name}
                  className="object-cover" 
                />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={triggerFileInput}
                disabled={uploading}
              >
                {uploading ? (
                  <Upload className="h-4 w-4 animate-pulse" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              Click the camera icon to upload a new avatar
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed here. Contact support if needed.
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={uploading}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
