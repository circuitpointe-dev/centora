
import React, { useState } from "react";
import {
  SideDialog,
  SideDialogContent,
  SideDialogHeader,
  SideDialogTitle,
} from "@/components/ui/side-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Save, Send, MessageSquare, History, Plus } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposalTitle?: string;
  opportunityName?: string;
};

const ManualProposalCreationDialog: React.FC<Props> = ({ 
  open, 
  onOpenChange, 
  proposalTitle = "Proposal Title",
  opportunityName = "Opportunity Name"
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [comment, setComment] = useState("");

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

  return (
    <SideDialog open={open} onOpenChange={onOpenChange}>
      <SideDialogContent className="max-w-[90vw] w-full bg-white">
        <SideDialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <SideDialogTitle className="text-lg font-semibold text-gray-900">
              {proposalTitle} - {opportunityName}
            </SideDialogTitle>
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
        </SideDialogHeader>

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
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add New Field
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="narrative" className="mt-0">
                  <div className="space-y-4">
                    <Label>Project Narrative</Label>
                    <Textarea
                      placeholder="Enter detailed project narrative..."
                      className="min-h-[400px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="mt-0">
                  <div className="space-y-4">
                    <Label>Budget Details</Label>
                    <p className="text-gray-600">Budget management interface will be implemented here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="logframe" className="mt-0">
                  <div className="space-y-4">
                    <Label>Logical Framework</Label>
                    <p className="text-gray-600">Logframe matrix will be implemented here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="attachments" className="mt-0">
                  <div className="space-y-4">
                    <Label>File Attachments</Label>
                    <p className="text-gray-600">File upload and management interface will be implemented here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="mt-0">
                  <div className="space-y-4">
                    <Label>Team Members</Label>
                    <p className="text-gray-600">Team management interface will be implemented here.</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
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
      </SideDialogContent>
    </SideDialog>
  );
};

export default ManualProposalCreationDialog;
