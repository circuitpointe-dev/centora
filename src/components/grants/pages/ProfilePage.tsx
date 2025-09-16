import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Building, Globe, Phone, Mail, MapPin, Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  org_id: string;
  full_name: string;
  email: string;
  role: string;
  department_id?: string;
  created_at: string;
  organization?: {
    name: string;
    type: string;
    address_line1?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    primary_currency: string;
  };
  department?: {
    name: string;
  };
}

export const ProfilePage = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileData>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: profileData, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(
            name,
            type,
            address_line1,
            city,
            state,
            country,
            phone,
            primary_currency
          ),
          department:departments(name)
        `)
        .eq('id', user.user.id)
        .single();

      if (error) throw error;

      setProfile(profileData);
      setFormData(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
        })
        .eq('id', profile!.id);

      if (error) throw error;

      setProfile({ ...profile!, ...formData });
      setEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Profile Not Found</h3>
        <p className="text-muted-foreground">Unable to load profile information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal and organization information
          </p>
        </div>
        {!editing ? (
          <Button onClick={() => setEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              {editing ? (
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              ) : (
                <p className="text-sm mt-1">{profile.full_name}</p>
              )}
            </div>

            <div>
              <Label>Email Address</Label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{profile.email}</p>
              </div>
            </div>

            <div>
              <Label>Role</Label>
              <div className="mt-1">
                <Badge variant="secondary">
                  {profile.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Department</Label>
              <p className="text-sm mt-1">{profile.department?.name || 'No department assigned'}</p>
            </div>

            <div>
              <Label>Member Since</Label>
              <p className="text-sm mt-1">{new Date(profile.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Organization Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Organization Name</Label>
              <p className="text-sm mt-1">{profile.organization?.name}</p>
            </div>

            <div>
              <Label>Organization Type</Label>
              <div className="mt-1">
                <Badge variant="outline">
                  {profile.organization?.type}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Primary Currency</Label>
              <p className="text-sm mt-1">{profile.organization?.primary_currency}</p>
            </div>

            {profile.organization?.address_line1 && (
              <div>
                <Label>Address</Label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p>{profile.organization.address_line1}</p>
                    {profile.organization.city && (
                      <p>{profile.organization.city}, {profile.organization.state} {profile.organization.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {profile.organization?.phone && (
              <div>
                <Label>Phone</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{profile.organization.phone}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};