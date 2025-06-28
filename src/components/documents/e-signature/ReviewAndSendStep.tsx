
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, User, FileText, Calendar, Mail, Edit } from "lucide-react";

interface Field {
  id: string;
  name: string;
  type: "signer" | "signature" | "name" | "date" | "email";
  icon: React.ReactNode;
}

interface ReviewAndSendStepProps {
  onBack: () => void;
  onSend: () => void;
}

export const ReviewAndSendStep = ({ onBack, onSend }: ReviewAndSendStepProps) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeTab, setActiveTab] = useState("fields");

  const fieldTypes: Field[] = [
    {
      id: "signer",
      name: "Signer",
      type: "signer",
      icon: <User className="w-4 h-4" />
    },
    {
      id: "signature",
      name: "Signature",
      type: "signature",
      icon: <Edit className="w-4 h-4" />
    },
    {
      id: "name",
      name: "Full Name",
      type: "name",
      icon: <User className="w-4 h-4" />
    },
    {
      id: "date",
      name: "Date Signed",
      type: "date",
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: "email",
      name: "Email",
      type: "email",
      icon: <Mail className="w-4 h-4" />
    }
  ];

  return (
    <div className="max-w-full mx-auto space-y-6">
      {/* Three Column Layout */}
      <div className="grid grid-cols-12 gap-4 h-[600px]">
        {/* Selection Column */}
        <div className="col-span-3">
          <Card className="h-full rounded-[5px] shadow-sm border">
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="fields" className="text-sm">Fields</TabsTrigger>
                  <TabsTrigger value="documents" className="text-sm">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="fields" className="space-y-4 mt-0">
                  {/* Signer Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Signer</h4>
                    <div 
                      className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedField(fieldTypes[0])}
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Chioma Ike</span>
                    </div>
                  </div>

                  {/* Signature Field Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Signature field</h4>
                    <div 
                      className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedField(fieldTypes[1])}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Signature</span>
                    </div>
                  </div>

                  {/* Auto-fill Fields Section */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Auto-fill Fields</h4>
                    <div className="space-y-1">
                      {fieldTypes.slice(2).map((field) => (
                        <div 
                          key={field.id}
                          className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedField(field)}
                        >
                          {field.icon}
                          <span className="text-sm text-gray-700">{field.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <div className="text-center text-gray-500 text-sm py-8">
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
              <div className="h-12 border-b flex items-center justify-between px-4 bg-gray-50">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Button>
                  <span className="text-sm text-gray-600">Zoom: 50%</span>
                  <Button variant="ghost" size="sm" className="text-sm">
                    Preview
                  </Button>
                </div>
              </div>
              
              <div className="p-6 h-full bg-gray-100 overflow-auto">
                <div className="bg-white rounded-md shadow-sm p-8 max-w-2xl mx-auto min-h-[500px]">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Company Policy Acknowledgement
                      </h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Company Policy Statement</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          We maintain clear expectations for behavior, confidentiality, and professionalism within our organization.
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-700 mb-2">All employees are required to:</p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
                          <li>Follow all company policies and procedures as stated in the employee handbook.</li>
                          <li>Maintain confidentiality of internal information.</li>
                          <li>Conduct themselves with professionalism, respect, and integrity in all work-related activities.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-700">
                          By signing this document, you confirm that you have read, understood, and agree to comply with the stated policies.
                        </p>
                      </div>
                      
                      <div className="space-y-6 mt-12">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-4">Acknowledgement</h4>
                          <p className="text-sm text-gray-700 mb-6">
                            I acknowledge that I have reviewed the Company Policy and agree to abide by its guidelines.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-900">Signature:</span>
                            <div className="border-b border-gray-300 mt-2 h-8"></div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Name:</span>
                            <div className="border-b border-gray-300 mt-2 h-8"></div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">Date:</span>
                            <div className="border-b border-gray-300 mt-2 h-8"></div>
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
            <CardContent className="p-4">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-sm font-medium text-gray-600 mb-2">Nothing Selected</h4>
                <p className="text-xs text-gray-500">Select a field to make changes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-center gap-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2 px-4 py-2 h-auto border border-gray-300 rounded-[5px] text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>

        <Button
          onClick={onSend}
          className="gap-2 px-6 py-2 h-auto rounded-[5px] text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"
        >
          Send For Signature
        </Button>
      </div>
    </div>
  );
};
