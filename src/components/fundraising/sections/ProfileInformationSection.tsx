
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getFocusAreaColor } from "@/data/focusAreaData";

interface ProfileInformationSectionProps {
  isEditing: boolean;
  formData: {
    organization: string;
    contactPerson: string;
    email: string;
    secondaryEmail: string;
    affiliation: string;
    companyUrl: string;
    fundingStartDate: string;
    fundingEndDate: string;
  };
  onInputChange: (field: string, value: string) => void;
  interestTags: string[];
}

export const ProfileInformationSection: React.FC<ProfileInformationSectionProps> = ({
  isEditing,
  formData,
  onInputChange,
  interestTags
}) => {
  return (
    <div className="flex flex-col items-start gap-4">
      <h2 className="font-medium text-black text-base">Profile Information</h2>

      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 w-full">
            {/* Organization Name */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="text-sm text-muted-foreground">Name of Organization</Label>
              <Input
                value={formData.organization}
                onChange={(e) => onInputChange('organization', e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            {/* Contact Person */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="text-sm text-muted-foreground">Name of Contact Person</Label>
              <Input
                value={formData.contactPerson}
                onChange={(e) => onInputChange('contactPerson', e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            {/* Email Fields */}
            <div className="flex items-center gap-4 w-full">
              <div className="flex flex-col flex-1 items-start gap-2">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col flex-1 items-start gap-2">
                <Label className="text-sm text-muted-foreground">Secondary Email</Label>
                <Input
                  value={formData.secondaryEmail}
                  onChange={(e) => onInputChange('secondaryEmail', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>

            {/* Affiliation */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="text-sm text-muted-foreground">Affiliation</Label>
              <Input
                value={formData.affiliation}
                onChange={(e) => onInputChange('affiliation', e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            {/* Company URL */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="text-sm text-muted-foreground">Company URL</Label>
              <Input
                value={formData.companyUrl}
                onChange={(e) => onInputChange('companyUrl', e.target.value)}
                disabled={!isEditing}
                className="w-full"
              />
            </div>

            {/* Funding Dates */}
            <div className="flex items-center gap-4 w-full">
              <div className="flex flex-col flex-1 items-start gap-2">
                <Label className="text-sm text-muted-foreground">Funding Start Date</Label>
                <Input
                  type={isEditing ? "date" : "text"}
                  value={isEditing ? formData.fundingStartDate : "January 1, 2024"}
                  onChange={(e) => onInputChange('fundingStartDate', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col flex-1 items-start gap-2">
                <Label className="text-sm text-muted-foreground">Funding End Date</Label>
                <Input
                  type={isEditing ? "date" : "text"}
                  value={isEditing ? formData.fundingEndDate : "December 31, 2024"}
                  onChange={(e) => onInputChange('fundingEndDate', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>
            </div>

            {/* Interest Tags */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="text-sm text-muted-foreground">Interest Tags</Label>
              <div className="flex flex-wrap gap-2 w-full">
                {interestTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className={`text-xs rounded-sm ${getFocusAreaColor(tag)}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {isEditing && (
              <Button variant="outline" className="text-violet-600 border-violet-600">
                Add Tag
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
