
import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProfileInformationSection = (): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState([
    { id: 1, name: "donor_agreement.pdf", size: "2.3 MB", type: "PDF" },
    { id: 2, name: "tax_documents_2024.xlsx", size: "1.8 MB", type: "Excel" },
    { id: 3, name: "profile_photo.jpg", size: "456 KB", type: "Image" }
  ]);

  // Form data
  const [formData, setFormData] = useState({
    organization: "FEHD Foundation",
    contactPerson: "FEHD Foundation",
    email: "Millicenterp@gmail.com",
    secondaryEmail: "contact@fehd.org",
    affiliation: "Lorem ipsum non aliquet fusce",
    companyUrl: "https://FEHDfoundation.com",
    fundingStartTime: "Jan 2024",
    fundingEndTime: "Jan 2024",
  });

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

  return (
    <div className="flex flex-row gap-4">
      {/* Communications & Notes */}
      <section className="flex flex-col w-1/2 items-start gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="font-medium text-black text-base [font-family:'Inter',Helvetica]">
            Communications &amp; Notes
          </h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="text-violet-600 border-violet-600"
            >
              Edit
            </Button>
          )}
        </div>

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

          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-gray-600 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="text-violet-600 border-violet-600"
              >
                Save
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="h-auto px-4 py-3 rounded-[5px] border border-solid border-violet-600 text-violet-600 font-medium text-sm [font-family:'Inter',Helvetica]"
            >
              Add Notes
            </Button>
          )}
        </div>
      </section>

      {/* Files */}
      <div className="flex flex-col w-1/2 items-start gap-4">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
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
  );
};
