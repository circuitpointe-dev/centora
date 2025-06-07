
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Plus, User, Upload } from "lucide-react";
import { SideDialog, SideDialogContent, SideDialogHeader, SideDialogTitle, SideDialogTrigger } from "@/components/ui/side-dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Donor } from "@/types/donor";

interface DonorProfileProps {
  donor: Donor;
  onEdit: () => void;
}

const DonorProfile: React.FC<DonorProfileProps> = ({ donor, onEdit }) => {
  const [selectedYear, setSelectedYear] = useState(2024);
  
  // Mock engagement history
  const engagementHistory = [
    { date: "April 12th, 2024", details: "Initial partnership discussion regarding educational initiatives in rural areas." },
    { date: "March 28th, 2024", details: "Proposal submission for health infrastructure development project." },
    { date: "March 15th, 2024", details: "Follow-up meeting on funding requirements and project timeline." },
    { date: "February 20th, 2024", details: "Grant application review and feedback session." }
  ];

  // Mock giving history data
  const givingData = [
    { month: "Jan", amount: 25000 },
    { month: "Feb", amount: 30000 },
    { month: "Mar", amount: 45000 },
    { month: "Apr", amount: 20000 },
    { month: "May", amount: 35000 },
    { month: "Jun", amount: 40000 },
    { month: "Jul", amount: 15000 },
    { month: "Aug", amount: 50000 },
    { month: "Sep", amount: 30000 },
    { month: "Oct", amount: 25000 },
    { month: "Nov", amount: 35000 },
    { month: "Dec", amount: 40000 }
  ];

  // Mock communications
  const communications = [
    { user: "John Doe", date: "April 10th, 2:13 AM", note: "Discussed upcoming project milestones and budget allocation requirements." },
    { user: "Sarah Smith", date: "April 8th, 10:45 AM", note: "Shared updated project documentation and timeline adjustments." },
    { user: "Mike Johnson", date: "April 5th, 3:30 PM", note: "Follow-up on partnership agreement terms and conditions." }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const chartConfig = {
    amount: {
      label: "Donation Amount",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Edit button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{donor.name}</h2>
          <p className="text-gray-600">Donor Profile</p>
        </div>
        <Button onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Donor Profile
        </Button>
      </div>

      {/* Profile Info and Engagement History Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Organization Name</label>
              <p className="text-sm text-gray-900">{donor.name}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm text-gray-900">{donor.contactInfo.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <p className="text-sm text-gray-900">{donor.contactInfo.phone}</p>
              </div>
            </div>

            {donor.contactInfo.address && (
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="text-sm text-gray-900">{donor.contactInfo.address}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Funding Start Time</label>
                <p className="text-sm text-gray-900">Jan 2024</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Funding End Time</label>
                <p className="text-sm text-gray-900">Dec 2024</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Interest Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {donor.interestTags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engagement History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Engagement History</CardTitle>
            <SideDialog>
              <SideDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Engagement Entry
                </Button>
              </SideDialogTrigger>
              <SideDialogContent>
                <SideDialogHeader>
                  <SideDialogTitle>Add Engagement Entry</SideDialogTitle>
                </SideDialogHeader>
                <div className="p-6">
                  <p className="text-gray-600">Engagement entry form will be implemented here.</p>
                </div>
              </SideDialogContent>
            </SideDialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {engagementHistory.map((entry, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                  <p className="text-sm font-medium text-gray-900">{entry.date}</p>
                  <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Giving History Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Giving History</CardTitle>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={givingData}>
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value/1000}k`}
                  className="text-xs"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [formatCurrency(value as number), "Amount"]}
                />
                <Bar 
                  dataKey="amount" 
                  fill="var(--color-amount)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Communications & Notes and Files Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Communications & Notes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Communications & Notes</CardTitle>
            <Button variant="outline" size="sm">
              Add Note
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {communications.map((comm, index) => (
                <div key={index} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comm.user}</span>
                      <span className="text-xs text-gray-500">{comm.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{comm.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                Drag and drop files here or{" "}
                <Button variant="link" className="p-0 text-blue-600">
                  Browse
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorProfile;
