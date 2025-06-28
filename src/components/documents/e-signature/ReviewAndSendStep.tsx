import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, FileText, Calendar, Mail, Edit, Trash2, Type, ChevronDown } from "lucide-react";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email" | "text";
  icon: React.ReactNode;
}

interface ReviewAndSendStepProps {
  onBack: () => void;
  onSend: () => void;
}

export const ReviewAndSendStep = ({
  onBack,
  onSend,
}: ReviewAndSendStepProps) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeTab, setActiveTab] = useState("fields");

  const fieldTypes: Field[] = [
    {
      id: "signer",
      name: "Signer",
      type: "signer",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "signature",
      name: "Signature",
      type: "signature",
      icon: <Edit className="w-4 h-4" />,
    },
    {
      id: "name",
      name: "Full Name",
      type: "name",
      icon: <User className="w-4 h-4" />,
    },
    {
      id: "date",
      name: "Date Signed",
      type: "date",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "email",
      name: "Email",
      type: "email",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: "text",
      name: "Text",
      type: "text",
      icon: <Type className="w-4 h-4" />,
    },
  ];

  const renderPropertyCard = () => {
    if (!selectedField) {
      return (
        <div className="text-center py-8">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <h4 className="text-xs font-medium text-gray-600 mb-1">
            Nothing Selected
          </h4>
          <p className="text-xs text-gray-500">
            Select a field to make changes
          </p>
        </div>
      );
    }

    if (selectedField.type === "signature") {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Signature</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-blue-600">
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-600">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-900 block mb-1">
                Assigned to
              </label>
              <Select defaultValue="chioma">
                <SelectTrigger className="h-8 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-blue-600" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chioma">Chioma Ike (Me)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-900 block mb-1">
                Required
              </label>
              <Select defaultValue="yes">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                  <ChevronDown className="w-3 h-3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-900 block mb-1">
                Field Name <span className="text-gray-500">(Optional)</span>
              </label>
              <Select>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                  <ChevronDown className="w-3 h-3" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signature">Signature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    }

    // For text-based fields (name, date, email, text)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedField.icon}
            <span className="text-sm font-medium text-gray-900">{selectedField.name}</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-red-600">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Assigned to
            </label>
            <Select defaultValue="chioma">
              <SelectTrigger className="h-8 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-blue-600" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chioma">Chioma Ike (Me)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Required
            </label>
            <Select defaultValue="yes">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
                <ChevronDown className="w-3 h-3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Formatting
            </label>
            <Select>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
                <ChevronDown className="w-3 h-3" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="uppercase">Uppercase</SelectItem>
                <SelectItem value="lowercase">Lowercase</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-900 block mb-1">
              Field Name
            </label>
            <Input 
              className="h-8 text-xs" 
              defaultValue={selectedField.name}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto space-y-4">
      <Card className="rounded-[5px] shadow-none border-none">
        <CardContent className="p-4">
          {/* Three Column Layout */}
          <div className="grid grid-cols-12 gap-3 h-[500px] mb-4">
            {/* Selection Column */}
            <div className="col-span-3">
              <Card className="h-full rounded-[5px] shadow-sm border">
                <CardContent className="p-3">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-3 h-8 bg-transparent border border-gray-300 rounded-[5px] p-0">
                      <TabsTrigger 
                        value="fields" 
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:rounded-[4px] data-[state=active]:mx-[1px] data-[state=active]:my-[1px] text-gray-600"
                      >
                        Fields
                      </TabsTrigger>
                      <TabsTrigger 
                        value="documents" 
                        className="text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-none data-[state=active]:border data-[state=active]:border-gray-300 data-[state=active]:rounded-[4px] data-[state=active]:mx-[1px] data-[state=active]:my-[1px] text-gray-600"
                      >
                        Documents
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="fields" className="space-y-3 mt-0">
                      {/* Signer Section */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-gray-900">
                          Signer
                        </h4>
                        <div className="flex items-center gap-2 p-2 rounded-[5px] cursor-pointer hover:bg-gray-50">
                          <User className="w-3 h-3 text-blue-600" />
                          <span className="text-xs text-gray-700">
                            Chioma Ike
                          </span>
                          <ChevronDown className="w-3 h-3 text-gray-400 ml-auto" />
                        </div>
                      </div>

                      {/* Signature Field Section */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-gray-900">
                          Signature field
                        </h4>
                        <div
                          className={`flex items-center gap-2 p-2 rounded-[5px] cursor-pointer hover:bg-gray-50 ${
                            selectedField?.type === "signature" ? "bg-violet-100 border border-violet-300" : ""
                          }`}
                          onClick={() => setSelectedField(fieldTypes[1])}
                        >
                          <Edit className="w-3 h-3 text-violet-600" />
                          <span className="text-xs text-gray-700">
                            Signature
                          </span>
                        </div>
                      </div>

                      {/* Auto-fill Fields Section */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-gray-900">
                          Auto-fill fields
                        </h4>
                        <div className="space-y-1">
                          {fieldTypes.slice(2).map((field) => (
                            <div
                              key={field.id}
                              className={`flex items-center gap-2 p-2 rounded-[5px] cursor-pointer hover:bg-gray-50 ${
                                selectedField?.id === field.id ? "bg-violet-100 border border-violet-300" : ""
                              }`}
                              onClick={() => setSelectedField(field)}
                            >
                              {field.icon}
                              <span className="text-xs text-gray-700">
                                {field.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="documents" className="mt-0">
                      <div className="text-center text-gray-500 text-xs py-8">
                        Document preview will appear here
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Signing Column (Canvas) */}
            <div className="col-span-6">
              <Card className="h-full rounded-[5px] shadow-sm border">
                <CardContent className="p-0 h-full">
                  <div className="h-10 border-b flex items-center justify-between px-3 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ArrowLeft className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <ArrowLeft className="w-3 h-3 rotate-180" />
                      </Button>
                      <span className="text-xs text-gray-600">Zoom: 50%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 h-full bg-gray-100 overflow-auto">
                    <div className="bg-white rounded-[5px] shadow-sm p-6 max-w-2xl mx-auto min-h-[400px]">
                      <div className="space-y-4">
                        <div className="text-center">
                          <h2 className="text-sm font-semibold text-gray-900 mb-2">
                            Company Policy Acknowledgement
                          </h2>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h3 className="font-medium text-xs text-gray-900 mb-1">
                              Company Policy Statement
                            </h3>
                            <p className="text-xs text-gray-700 leading-relaxed">
                              We maintain clear expectations for behavior,
                              confidentiality, and professionalism within our
                              organization.
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-700 mb-1">
                              All employees are required to:
                            </p>
                            <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 ml-3">
                              <li>
                                Follow all company policies and procedures as
                                stated in the employee handbook.
                              </li>
                              <li>
                                Maintain confidentiality of internal
                                information.
                              </li>
                              <li>
                                Conduct themselves with professionalism,
                                respect, and integrity in all work-related
                                activities.
                              </li>
                            </ul>
                          </div>

                          <div>
                            <p className="text-xs text-gray-700">
                              By signing this document, you confirm that you
                              have read, understood, and agree to comply with
                              the stated policies.
                            </p>
                          </div>

                          <div className="space-y-4 mt-8">
                            <div>
                              <h4 className="font-medium text-xs text-gray-900 mb-3">
                                Acknowledgement
                              </h4>
                              <p className="text-xs text-gray-700 mb-4">
                                I acknowledge that I have reviewed the Company
                                Policy and agree to abide by its guidelines.
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <span className="text-xs font-medium text-gray-900">
                                  Signature:
                                </span>
                                <div className="border-b border-gray-300 mt-1 h-6"></div>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-900">
                                  Name:
                                </span>
                                <div className="border-b border-gray-300 mt-1 h-6"></div>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-gray-900">
                                  Date:
                                </span>
                                <div className="border-b border-gray-300 mt-1 h-6"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties Column */}
            <div className="col-span-3">
              <Card className="h-full rounded-[5px] shadow-sm border">
                <CardContent className="p-3">
                  {renderPropertyCard()}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons - Moved outside the cards */}
      <div className="flex items-center justify-center gap-4 pt-2 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2 px-4 py-2 h-auto border border-gray-300 rounded-[5px] text-xs font-medium text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>

        <Button
          onClick={onSend}
          className="gap-2 px-6 py-2 h-auto rounded-[5px] text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"
        >
          Send For Signature
        </Button>
      </div>
    </div>
  );
};
