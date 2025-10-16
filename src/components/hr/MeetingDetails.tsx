import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  Video,
  Upload,
  User
} from 'lucide-react';

const MeetingDetails = () => {
  const navigate = useNavigate();
  const [quorumRulesOpen, setQuorumRulesOpen] = useState(true);
  const [attendanceManagementOpen, setAttendanceManagementOpen] = useState(true);

  // Mock data for meeting details
  const meetingData = {
    title: 'Board Q2 review',
    description: 'Q3 performance review, FY2026 budget planning, and strategic initiatives discussion',
    date: 'June 20, 2025',
    time: '14:00 - 15:00 (1 hours)',
    location: 'Boardroom A',
    documents: [
      { name: 'Minutes', icon: FileText },
      { name: 'Resolutions', icon: FileText }
    ]
  };

  const quorumData = {
    status: 'Quorum Achieved',
    present: 6,
    required: 4,
    total: 7,
    isAchieved: true
  };

  const quorumRules = [
    { label: 'Meeting type', value: 'Board' },
    { label: 'Base quorum', value: '4 members' },
    { label: 'Minimum quorum', value: '2 members' },
    { label: 'Chair required', value: 'Yes' },
    { label: 'Virtual attendance', value: 'Accepted' },
    { label: 'Proxy voting', value: 'Not allowed' },
    { label: 'Emergency reduction', value: 'Can reduce by 1' }
  ];

  const attendees = [
    {
      name: 'Alice Smith',
      role: 'Chair',
      department: 'Finance',
      type: 'executive',
      email: 'alicesmith@gmail.com',
      status: 'Present',
      statusIcon: CheckCircle,
      statusColor: 'text-green-600',
      isVirtual: false
    },
    {
      name: 'Bob Johnson',
      role: 'Treasurer',
      department: 'Finance',
      type: 'Audit',
      email: 'bobjohnson@email.com',
      status: 'Joined virtually',
      statusIcon: Video,
      statusColor: 'text-blue-600',
      isVirtual: true
    },
    {
      name: 'Catherine Lee',
      role: 'Member',
      department: 'Product',
      type: 'designer',
      email: 'catherinelee@gmail.com',
      status: 'Present',
      statusIcon: CheckCircle,
      statusColor: 'text-green-600',
      isVirtual: false
    },
    {
      name: 'David Brown',
      role: 'Member',
      department: 'IT',
      type: 'support',
      email: 'davidbrown@company.com',
      status: 'Excused',
      statusIcon: CheckCircle,
      statusColor: 'text-yellow-600',
      isVirtual: false
    },
    {
      name: 'Eva Martinez',
      role: 'Secretary',
      department: 'Executive',
      email: 'evamartinez@workmail.com',
      status: 'Present',
      statusIcon: CheckCircle,
      statusColor: 'text-green-600',
      isVirtual: false
    },
    {
      name: 'Fiona White',
      role: 'Independent director',
      department: 'Audit',
      type: 'risk',
      email: 'fionawhite@business.com',
      status: 'Present',
      statusIcon: CheckCircle,
      statusColor: 'text-green-600',
      isVirtual: false
    },
    {
      name: 'George Black',
      role: 'Non-executive director',
      department: 'Strategy',
      type: 'nominations',
      email: 'georgeblack@office.com',
      status: 'Joined virtually',
      statusIcon: Video,
      statusColor: 'text-blue-600',
      isVirtual: true
    }
  ];

  const getStatusBadge = (attendee: any) => {
    const StatusIcon = attendee.statusIcon;
    return (
      <div className="flex items-center space-x-2">
        <StatusIcon className={`h-4 w-4 ${attendee.statusColor}`} />
        <span className={`text-sm font-medium ${attendee.statusColor}`}>{attendee.status}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          onClick={() => navigate('/dashboard/hr/board-member-detail')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Board management / meeting attendance</span>
        </Button>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meeting Details</h1>
          <p className="text-sm text-gray-600">Advanced quorum management and attendance tracking</p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Export</span>
        </Button>
      </div>

      {/* Meeting Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{meetingData.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{meetingData.description}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{meetingData.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{meetingData.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{meetingData.location}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {meetingData.documents.map((doc, index) => {
                const DocIcon = doc.icon;
                return (
                  <Button key={index} variant="outline" size="sm" className="flex items-center space-x-2">
                    <DocIcon className="h-4 w-4" />
                    <span>{doc.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quorum Achieved Card */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-gray-900">{quorumData.status}</span>
              </div>
              <span className="text-sm text-gray-600">{quorumData.present} of {quorumData.required} required members present</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>0</span>
                <span>Required: {quorumData.required}</span>
                <span>Max: {quorumData.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full" 
                  style={{ width: `${(quorumData.present / quorumData.total) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-end">
                <span className="text-sm text-gray-600">{quorumData.present}/{quorumData.total} total members</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meeting Quorum Rules */}
      <Card>
        <Collapsible open={quorumRulesOpen} onOpenChange={setQuorumRulesOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Meeting Quorum Rules</CardTitle>
                {quorumRulesOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {quorumRules.map((rule, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <span className="text-sm text-gray-600">{rule.label}:</span>
                  <span className="text-sm font-medium text-gray-900">{rule.value}</span>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Detailed Attendance Management */}
      <Card>
        <Collapsible open={attendanceManagementOpen} onOpenChange={setAttendanceManagementOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Detailed attendance management</CardTitle>
                {attendanceManagementOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {attendees.map((attendee, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{attendee.name}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{attendee.role}</span>
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{attendee.department}</span>
                      {attendee.type && (
                        <>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-gray-600">{attendee.type}</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{attendee.email}</div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(attendee)}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default MeetingDetails;
