
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Trash2 } from "lucide-react";

const TeamTab: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      role: "Project Manager",
      email: "john.smith@ngo.org",
      bio: "Experienced project manager with 10+ years in development projects.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Technical Lead",
      email: "sarah.johnson@ngo.org",
      bio: "Technical expert with extensive field experience.",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl gap-8">
      <div className="flex items-center justify-between">
        <Label className="font-medium text-sm text-[#383839]">
          Team Members
        </Label>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="space-y-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`name-${member.id}`} className="text-xs text-gray-600">
                      Name
                    </Label>
                    <Input
                      id={`name-${member.id}`}
                      defaultValue={member.name}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`role-${member.id}`} className="text-xs text-gray-600">
                      Role
                    </Label>
                    <Input
                      id={`role-${member.id}`}
                      defaultValue={member.role}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`email-${member.id}`} className="text-xs text-gray-600">
                    Email
                  </Label>
                  <Input
                    id={`email-${member.id}`}
                    type="email"
                    defaultValue={member.email}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`bio-${member.id}`} className="text-xs text-gray-600">
                    Biography
                  </Label>
                  <Textarea
                    id={`bio-${member.id}`}
                    defaultValue={member.bio}
                    className="h-20 resize-none text-sm"
                  />
                </div>
              </div>
              
              <Button variant="ghost" size="sm">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamTab;
