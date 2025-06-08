
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

interface PrefilledData {
  source?: string;
  template?: any;
  proposal?: any;
  creationContext?: any;
}

interface ProposalTeamTabProps {
  prefilledData?: PrefilledData;
}

const roles = [
  "Project Manager",
  "Technical Lead",
  "Financial Manager",
  "Research Coordinator",
  "Field Coordinator",
  "Data Analyst",
  "Communications Specialist",
  "Consultant",
];

const ProposalTeamTab: React.FC<ProposalTeamTabProps> = ({ prefilledData }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      role: "",
      email: ""
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, ...updates } : member
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Team Members</Label>
          <Button
            variant="outline"
            onClick={addTeamMember}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </Button>
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">No team members added yet.</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Team Member" to get started.</p>
          </div>
        )}

        {teamMembers.map((member) => (
          <div key={member.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Team Member</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTeamMember(member.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`name-${member.id}`} className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id={`name-${member.id}`}
                  value={member.name}
                  onChange={(e) => updateTeamMember(member.id, { name: e.target.value })}
                  placeholder="Enter full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`role-${member.id}`} className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  value={member.role}
                  onValueChange={(value) => updateTeamMember(member.id, { role: value })}
                >
                  <SelectTrigger id={`role-${member.id}`} className="mt-1">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor={`email-${member.id}`} className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id={`email-${member.id}`}
                type="email"
                value={member.email}
                onChange={(e) => updateTeamMember(member.id, { email: e.target.value })}
                placeholder="Enter email address"
                className="mt-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProposalTeamTab;
