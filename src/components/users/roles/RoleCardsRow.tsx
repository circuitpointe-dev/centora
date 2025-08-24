// src/components/roles/RoleCardsRow.tsx

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Shield } from 'lucide-react';
import type { RoleSummary } from '@/types/roles-permission';

interface RoleCardsRowProps {
  roles: RoleSummary[];
  selectedRoleId: string;
  onSelect: (roleId: string) => void;
}

const AvatarPreview: React.FC<{ avatars: string[]; totalMembers: number }> = ({ 
  avatars, 
  totalMembers 
}) => {
  const displayAvatars = avatars.slice(0, 3);
  const remaining = totalMembers - displayAvatars.length;

  return (
    <div className="flex items-center -space-x-2">
      {displayAvatars.map((initials, index) => (
        <div
          key={index}
          className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
        >
          {initials}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export const RoleCardsRow: React.FC<RoleCardsRowProps> = ({
  roles,
  selectedRoleId,
  onSelect
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {roles.map((role) => {
        const isSelected = selectedRoleId === role.id;
        
        return (
          <Card
            key={role.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected 
                ? 'ring-2 ring-brand-purple border-brand-purple bg-brand-purple/5' 
                : 'border hover:bg-brand-purple/5'
            }`}
            onClick={() => onSelect(role.id)}
          >
            <CardContent className="p-5">
              <div className="space-y-4">
                {/* Header with icon and title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </div>

                {/* Member avatars */}
                <div className="flex items-center justify-between">
                  <AvatarPreview 
                    avatars={role.avatarPreview || []} 
                    totalMembers={role.totalMembers || 0} 
                  />
                  <Badge variant="outline" className="text-xs">
                    {role.totalMembers} member{role.totalMembers !== 1 ? 's' : ''}
                  </Badge>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('edit-role', role.id);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('view-permission', role.id);
                    }}
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Permissions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};