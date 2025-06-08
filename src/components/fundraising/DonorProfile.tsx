
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Download } from "lucide-react";
import { EngagementHistorySection } from "./sections/EngagementHistorySection";
import { GivingHistorySection } from "./sections/GivingHistorySection";
import { Donor } from "@/types/donor";
import { getFocusAreaColor } from "@/data/focusAreaData";

interface DonorProfileProps {
  donor: Donor;
  onEdit: () => void;
}

export const DonorProfile: React.FC<DonorProfileProps> = ({ donor, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    organization: donor.name,
    contactPerson: donor.name,
    email: donor.contactInfo.email,
    secondaryEmail: "contact@fehd.org",
    affiliation: "Lorem ipsum non aliquet fusce",
    companyUrl: "https://FEHDfoundation.com",
    fundingStartDate: "2024-01-01",
    fundingEndDate: "2024-12-31",
  });

  const [files, setFiles] = useState([
    { id: 1, name: "donor_agreement.pdf", size: "2.3 MB", type: "PDF" },
    { id: 2, name: "tax_documents_2024.xlsx", size: "1.8 MB", type: "Excel" },
    { id: 3, name: "profile_photo.jpg", size: "456 KB", type: "Image" }
  ]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach(file => {
        const newFile = {
          id: files.length + Math.random(),
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          type: file.type.split('/')[1].toUpperCase()
        };
        setFiles(prev => [...prev, newFile]);
      });
    }
  };

  const removeFile = (fileId: number) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const downloadFile = (fileName: string) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = fileName;
    link.click();
  };

  // Message data for mapping
  const messages = [
    {
      id: 1,
      author: "John Dhoe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
    {
      id: 2,
      author: "John Dhoe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
    {
      id: 3,
      author: "John Dhoe",
      timestamp: "April 10th, 2:13 AM",
      content:
        "Lorem ipsum dolor sit amet consectetur. Nibh sit enim sagittis in duis non dolor sagittis eu.",
      avatar: "https://c.animaapp.com/LmQp0a9i/img/profile-picture-2-5@2x.png",
    },
  ];

  return (
    <div className="bg-[#f4f6f9] flex flex-row justify-center w-full">
      <div className="bg-[#f4f6f9] w-[900px] relative">
        <Separator className="w-full" />

        <div className="w-full py-6">
          <div className="flex items-center justify-between px-6 mb-4">
            <h1 className="font-medium text-[22px] text-[#383839]">
              {isEditing ? 'Edit' : ''} Donor Profile - <span className="font-light">{donor.name}</span>
            </h1>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    className="text-gray-600 border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    className="bg-violet-600 hover:bg-violet-700 text-white border-violet-600"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit} className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Donor Profile
                </Button>
              )}
            </div>
          </div>

          <Separator className="w-full" />
        </div>

        <div className="flex flex-col gap-6">
          <EngagementHistorySection />
          
          {/* Profile Information and Communications & Files */}
          <div className="flex flex-row gap-6 px-6">
            {/* Profile Information */}
            <div className="flex flex-col w-1/2 items-start gap-4">
              <h2 className="font-medium text-black text-base">Profile Information</h2>

              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="flex flex-col items-start gap-6 w-full">
                    {/* Organization Name */}
                    <div className="flex flex-col items-start gap-2 w-full">
                      <Label className="text-sm text-muted-foreground">Name of Organization</Label>
                      <Input
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </div>

                    {/* Contact Person */}
                    <div className="flex flex-col items-start gap-2 w-full">
                      <Label className="text-sm text-muted-foreground">Name of Contact Person</Label>
                      <Input
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
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
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>

                      <div className="flex flex-col flex-1 items-start gap-2">
                        <Label className="text-sm text-muted-foreground">Secondary Email</Label>
                        <Input
                          value={formData.secondaryEmail}
                          onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
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
                        onChange={(e) => handleInputChange('affiliation', e.target.value)}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </div>

                    {/* Company URL */}
                    <div className="flex flex-col items-start gap-2 w-full">
                      <Label className="text-sm text-muted-foreground">Company URL</Label>
                      <Input
                        value={formData.companyUrl}
                        onChange={(e) => handleInputChange('companyUrl', e.target.value)}
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
                          onChange={(e) => handleInputChange('fundingStartDate', e.target.value)}
                          disabled={!isEditing}
                          className="w-full max-w-[180px]"
                        />
                      </div>

                      <div className="flex flex-col flex-1 items-start gap-2">
                        <Label className="text-sm text-muted-foreground">Funding End Date</Label>
                        <Input
                          type={isEditing ? "date" : "text"}
                          value={isEditing ? formData.fundingEndDate : "December 31, 2024"}
                          onChange={(e) => handleInputChange('fundingEndDate', e.target.value)}
                          disabled={!isEditing}
                          className="w-full max-w-[180px]"
                        />
                      </div>
                    </div>

                    {/* Interest Tags */}
                    <div className="flex flex-col items-start gap-2 w-full">
                      <Label className="text-sm text-muted-foreground">Interest Tags</Label>
                      <div className="flex flex-wrap gap-2 w-full">
                        {donor.interestTags.map((tag, index) => (
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

            {/* Communications & Notes and Files */}
            <div className="flex flex-col w-1/2 gap-6">
              {/* Communications & Notes */}
              <section className="flex flex-col items-start gap-4">
                <h2 className="font-medium text-black text-base [font-family:'Inter',Helvetica]">
                  Communications &amp; Notes
                </h2>

                <div className="flex flex-col items-start gap-6 self-stretch w-full">
                  <Card className="w-full h-[273px] rounded-[10px] bg-white">
                    <ScrollArea className="h-[272px] w-full rounded-[10px]">
                      <CardContent className="p-6 space-y-6">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className="flex items-center gap-3 w-full"
                          >
                            <Avatar className="w-11 h-11">
                              <AvatarImage
                                src={message.avatar}
                                alt="Profile picture"
                                className="object-cover"
                              />
                            </Avatar>

                            <div className="flex flex-col w-full items-start gap-2">
                              <div className="inline-flex items-center gap-4">
                                <div className="font-bold text-[#00000099] text-base text-center whitespace-nowrap [font-family:'Inter',Helvetica]">
                                  {message.author}
                                </div>

                                <div className="font-normal text-[#0000004c] text-sm text-center [font-family:'Inter',Helvetica]">
                                  {message.timestamp}
                                </div>
                              </div>

                              <div className="w-full [font-family:'Inter',Helvetica] font-normal text-[#00000099] text-sm leading-[18px]">
                                {message.content}
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      <ScrollBar
                        orientation="vertical"
                        className="bg-[#eeeeee] rounded-r-[10px] w-[9px]"
                      >
                        <div className="relative w-[9px] h-[30px] top-2.5 bg-violet-600 rounded-[10px]" />
                      </ScrollBar>
                    </ScrollArea>
                  </Card>

                  <Button
                    variant="outline"
                    className="h-auto px-4 py-3 rounded-[5px] border border-solid border-violet-600 text-violet-600 font-medium text-sm [font-family:'Inter',Helvetica]"
                  >
                    Add Notes
                  </Button>
                </div>
              </section>

              {/* Files */}
              <div className="flex flex-col items-start gap-4">
                <h3 className="font-medium text-black text-base">Files</h3>

                <Card className="w-full">
                  <CardContent className="p-4">
                    {files.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => downloadFile(file.name)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(file.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="border-2 border-dashed border-[#d2d2d2] bg-transparent rounded-md p-8">
                      <div className="text-center text-[#707070] text-base">
                        <span className="font-medium">Drag and drop files here or </span>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          variant="link"
                          className="font-bold p-0 h-auto text-base text-[#707070]"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Browse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <GivingHistorySection />
        </div>
        
        <Separator className="w-full" />
      </div>
    </div>
  );
};

export default DonorProfile;
