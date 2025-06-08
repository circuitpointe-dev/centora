
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const teamMembers = [
  { id: "1", name: "John Doe", role: "Project Lead" },
  { id: "2", name: "Sarah Johnson", role: "Research Coordinator" },
  { id: "3", name: "Michael Chen", role: "Budget Analyst" },
  { id: "4", name: "Emily Rodriguez", role: "Communications Manager" },
];

const ProposalTeamCard: React.FC = () => {
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>("1");

  const selectedMember = teamMembers.find(
    (member) => member.id === selectedTeamMember
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4 backdrop-blur-sm bg-opacity-80">
      <h2 className="text-lg font-semibold text-gray-900">Team</h2>
      <div className="space-y-3">
        <h3 className="font-medium text-gray-900">Team Member</h3>
        <Select
          value={selectedTeamMember}
          onValueChange={setSelectedTeamMember}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a team member" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-3 p-3 border border-gray-100 rounded-lg bg-gray-50">
          <p className="font-medium text-gray-900">
            {selectedMember?.name}
          </p>
          <p className="text-gray-600 text-sm">{selectedMember?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProposalTeamCard;
