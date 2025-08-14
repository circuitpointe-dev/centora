
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getFocusAreaColor } from "@/data/focusAreaData";

interface ContactPerson {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_primary: boolean;
}

interface ProfileInformationSectionProps {
  isEditing: boolean;
  formData: {
    organization: string;
    affiliation: string;
    companyUrl: string;
    fundingStartDate: string;
    fundingEndDate: string;
  };
  onInputChange: (field: string, value: string) => void;
  interestTags: string[];
  contacts: ContactPerson[];
}

export const ProfileInformationSection: React.FC<ProfileInformationSectionProps> = ({
  isEditing,
  formData,
  onInputChange,
  interestTags,
  contacts
}) => {
  return (
    <div className="flex flex-col items-start gap-4 h-full">
      <h2 className="font-medium text-black text-base">Profile Information</h2>

      <Card className="w-full flex-1">
        <CardContent className="p-4">
          <div className="flex flex-col items-start gap-4 w-full">
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

            {/* Contact Persons */}
            <div className="flex flex-col items-start gap-2 w-full">
              <Label className="text-sm text-muted-foreground">Contact Persons</Label>
              <div className="w-full space-y-3">
                {contacts && contacts.length > 0 ? (
                  contacts.map((contact) => (
                    <div key={contact.id} className="p-3 border border-border rounded-md bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{contact.full_name}</span>
                            {contact.is_primary && (
                              <Badge variant="outline" className="text-xs">Primary</Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {contact.email} • {contact.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground py-2">
                    No contact persons added
                  </div>
                )}
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
                  value={isEditing ? formData.fundingStartDate : 
                    formData.fundingStartDate ? new Date(formData.fundingStartDate).toLocaleDateString() : "Not specified"}
                  onChange={(e) => onInputChange('fundingStartDate', e.target.value)}
                  disabled={!isEditing}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col flex-1 items-start gap-2">
                <Label className="text-sm text-muted-foreground">Funding End Date</Label>
                <Input
                  type={isEditing ? "date" : "text"}
                  value={isEditing ? formData.fundingEndDate : 
                    formData.fundingEndDate ? new Date(formData.fundingEndDate).toLocaleDateString() : "Not specified"}
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
                    className={`text-xs rounded-sm ${getFocusAreaColor(tag)} pointer-events-none`}
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
