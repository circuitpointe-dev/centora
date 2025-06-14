
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, X } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

type Props = {
  teamMembers: TeamMember[];
  onAddMember: () => void;
  onRemoveMember: (memberId: string) => void;
};

const TeamTabContent: React.FC<Props> = ({ teamMembers, onAddMember, onRemoveMember }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Team Members</h3>
        <Button onClick={onAddMember} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>
      
      {teamMembers.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No team members added yet.</p>
      ) : (
        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveMember(member.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamTabContent;
