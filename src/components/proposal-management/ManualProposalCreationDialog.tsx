
import React, { useState } from "react";
import {
  LargeSideDialog,
  LargeSideDialogContent,
  LargeSideDialogHeader,
  LargeSideDialogTitle,
} from "@/components/ui/large-side-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Save, Send, MessageSquare, History, Plus, X, Upload, Download } from "lucide-react";
import AddFieldDialog from "./AddFieldDialog";
import AddTeamMemberDialog from "./AddTeamMemberDialog";

type CustomField = {
  id: string;
  name: string;
  value: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalTitle?: string;
  opportunityName?: string;
};

const ManualProposalCreationDialog: React.FC<Props> = ({ 
  open, 
  onOpenChange, 
  proposalTitle = "New Proposal",
  opportunityName = "Selected Opportunity"
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");
  
  // Overview tab states
  const [overviewFields, setOverviewFields] = useState<CustomField[]>([]);
  const [showOverviewFieldDialog, setShowOverviewFieldDialog] = useState(false);
  
  // Narrative tab states
  const [narrativeFields, setNarrativeFields] = useState<CustomField[]>([]);
  const [showNarrativeFieldDialog, setShowNarrativeFieldDialog] = useState(false);
  
  // Budget tab states
  const [budgetCurrency, setBudgetCurrency] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  
  // Logframe tab states
  const [logframeFields, setLogframeFields] = useState<CustomField[]>([]);
  const [showLogframeFieldDialog, setShowLogframeFieldDialog] = useState(false);
  
  // Team tab states
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamMemberDialog, setShowTeamMemberDialog] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "narrative", label: "Narrative" },
    { id: "budget", label: "Budget" },
    { id: "logframe", label: "Logframe" },
    { id: "attachments", label: "Attachments" },
    { id: "team", label: "Team" },
  ];

  const comments = [
    {
      id: 1,
      author: "Jane Doe",
      time: "2 hours ago",
      text: "Lorem ipsum dolor sit amet consectetur. Blandit dui in placerat morbi venenatis."
    },
    {
      id: 2,
      author: "Jane Doe", 
      time: "2 hours ago",
      text: "Lorem ipsum dolor sit amet consectetur. Blandit dui in placerat morbi venenatis."
    }
  ];

  const versionHistory = [
    { version: "V1.3", author: "Jane Doe", time: "2 hours ago" },
    { version: "V1.2", author: "Jane Doe", time: "2 hours ago" },
    { version: "V1.1", author: "Jane Doe", time: "2 hours ago" },
  ];

  const dummyFiles = [
    { id: "1", name: "Project Overview.pdf", size: "2.3 MB" },
    { id: "2", name: "Budget Template.xlsx", size: "1.8 MB" },
    { id: "3", name: "Research Methodology.docx", size: "4.2 MB" },
  ];

  const currencyOptions = [
    { value: "NGN", label: "Nigerian Naira (₦)" },
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
  ];

  const handleAddOverviewField = (fieldName: string) => {
    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      value: ""
    };
    setOverviewFields([...overviewFields, newField]);
  };

  const handleAddNarrativeField = (fieldName: string) => {
    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      value: ""
    };
    setNarrativeFields([...narrativeFields, newField]);
  };

  const handleAddLogframeField = (fieldName: string) => {
    const newField = {
      id: Date.now().toString(),
      name: fieldName,
      value: ""
    };
    setLogframeFields([...logframeFields, newField]);
  };

  const handleAddTeamMember = (member: TeamMember) => {
    setTeamMembers([...teamMembers, member]);
  };

  const handleRemoveField = (fieldId: string, fieldType: 'overview' | 'narrative' | 'logframe') => {
    if (fieldType === 'overview') {
      setOverviewFields(overviewFields.filter(field => field.id !== fieldId));
    } else if (fieldType === 'narrative') {
      setNarrativeFields(narrativeFields.filter(field => field.id !== fieldId));
    } else if (fieldType === 'logframe') {
      setLogframeFields(logframeFields.filter(field => field.id !== fieldId));
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  const handleFieldValueChange = (fieldId: string, value: string, fieldType: 'overview' | 'narrative' | 'logframe') => {
    if (fieldType === 'overview') {
      setOverviewFields(overviewFields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    } else if (fieldType === 'narrative') {
      setNarrativeFields(narrativeFields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    } else if (fieldType === 'logframe') {
      setLogframeFields(logframeFields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ));
    }
  };

  return (
    <LargeSideDialog open={open} onOpenChange={onOpenChange}>
      <LargeSideDialogContent className="bg-white">
        <LargeSideDialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <LargeSideDialogTitle className="text-lg font-semibold text-gray-900">
              {proposalTitle} - {opportunityName}
            </LargeSideDialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Submission Tracker
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button size="sm" className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700">
                <Send className="w-4 h-4" />
                Submit
              </Button>
            </div>
          </div>
        </LargeSideDialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Column */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-6 bg-gray-50 rounded-none border-b">
                {tabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-violet-600 rounded-none"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1 overflow-auto p-6">
                <TabsContent value="overview" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea
                        id="summary"
                        placeholder="Enter project summary..."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="objectives">Objectives</Label>
                      <Textarea
                        id="objectives"
                        placeholder="Enter project objectives..."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                    
                    {/* Custom Fields */}
                    {overviewFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={field.id}>{field.name}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveField(field.id, 'overview')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          id={field.id}
                          value={field.value}
                          onChange={(e) => handleFieldValueChange(field.id, e.target.value, 'overview')}
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                          className="min-h-[120px]"
                        />
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setShowOverviewFieldDialog(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Field
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="narrative" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label>Project Narrative</Label>
                      <Textarea
                        placeholder="Enter detailed project narrative..."
                        className="mt-2 min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label>Work Plan</Label>
                      <Textarea
                        placeholder="Enter detailed work plan..."
                        className="mt-2 min-h-[200px]"
                      />
                    </div>
                    
                    {/* Custom Fields */}
                    {narrativeFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={field.id}>{field.name}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveField(field.id, 'narrative')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          id={field.id}
                          value={field.value}
                          onChange={(e) => handleFieldValueChange(field.id, e.target.value, 'narrative')}
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                          className="min-h-[120px]"
                        />
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setShowNarrativeFieldDialog(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Field
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="budget-currency">Budget Currency</Label>
                      <Select value={budgetCurrency} onValueChange={setBudgetCurrency}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map((currency) => (
                            <SelectItem key={currency.value} value={currency.value}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget-amount">Budget Amount</Label>
                      <Input
                        id="budget-amount"
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        placeholder="Enter budget amount"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="logframe" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="outcome">Outcome</Label>
                      <Textarea
                        id="outcome"
                        placeholder="Enter project outcome..."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="indicator">Indicator</Label>
                      <Textarea
                        id="indicator"
                        placeholder="Enter project indicator..."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="assumption">Assumption</Label>
                      <Textarea
                        id="assumption"
                        placeholder="Enter project assumption..."
                        className="mt-2 min-h-[120px]"
                      />
                    </div>
                    
                    {/* Custom Fields */}
                    {logframeFields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={field.id}>{field.name}</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveField(field.id, 'logframe')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <Textarea
                          id={field.id}
                          value={field.value}
                          onChange={(e) => handleFieldValueChange(field.id, e.target.value, 'logframe')}
                          placeholder={`Enter ${field.name.toLowerCase()}...`}
                          className="min-h-[120px]"
                        />
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
                      onClick={() => setShowLogframeFieldDialog(true)}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Field
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Upload Files</h3>
                    
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>
                    
                    {/* Dummy Files */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Sample Files (Demo)</h4>
                      {dummyFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <Upload className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-6 mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Team Members</h3>
                      <Button 
                        onClick={() => setShowTeamMemberDialog(true)}
                        className="flex items-center gap-2"
                      >
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
                              onClick={() => handleRemoveTeamMember(member.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 space-y-4 overflow-auto">
              {/* Comments Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comments
                    </CardTitle>
                    <Button variant="link" size="sm" className="text-violet-600 p-0 h-auto">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.time}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  ))}
                  <Separator />
                  <div>
                    <Textarea
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Version History Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Version History
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {versionHistory.map((version, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{version.version}</div>
                        <div className="text-xs text-gray-500">
                          {version.author} • {version.time}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <History className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Dialogs */}
        <AddFieldDialog
          open={showOverviewFieldDialog}
          onOpenChange={setShowOverviewFieldDialog}
          onAddField={handleAddOverviewField}
        />
        
        <AddFieldDialog
          open={showNarrativeFieldDialog}
          onOpenChange={setShowNarrativeFieldDialog}
          onAddField={handleAddNarrativeField}
        />
        
        <AddFieldDialog
          open={showLogframeFieldDialog}
          onOpenChange={setShowLogframeFieldDialog}
          onAddField={handleAddLogframeField}
        />
        
        <AddTeamMemberDialog
          open={showTeamMemberDialog}
          onOpenChange={setShowTeamMemberDialog}
          onAddMember={handleAddTeamMember}
        />
      </LargeSideDialogContent>
    </LargeSideDialog>
  );
};

export default ManualProposalCreationDialog;
