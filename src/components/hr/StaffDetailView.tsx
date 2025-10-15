import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Edit,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Briefcase,
  Clock,
  Building,
  Award,
  BookOpen,
  CalendarDays,
  FileCheck,
  Activity
} from 'lucide-react';

const StaffDetailView = () => {
  const navigate = useNavigate();
  const [personalInfoOpen, setPersonalInfoOpen] = useState(true);
  const [employmentDetailOpen, setEmploymentDetailOpen] = useState(true);
  const [skillsDevelopmentOpen, setSkillsDevelopmentOpen] = useState(true);
  const [leaveAttendanceOpen, setLeaveAttendanceOpen] = useState(true);
  const [documentsComplianceOpen, setDocumentsComplianceOpen] = useState(true);
  const [activityLogOpen, setActivityLogOpen] = useState(true);

  // Mock leave requests data
  const leaveRequests = [
    {
      id: '102',
      type: 'Annual leave',
      dateCreated: 'Jul 2, 2025',
      leaveRange: 'Jul 5, 2025 - July 7, 2025',
      duration: '3 days',
      approver: 'John Bobby',
      status: 'Approved'
    },
    {
      id: '103',
      type: 'Sick leave',
      dateCreated: 'Oct 12, 2025',
      leaveRange: 'Oct 15, 2025 - Oct 17, 2025',
      duration: '3 days',
      approver: 'Lisa Smith',
      status: 'Pending'
    },
    {
      id: '104',
      type: 'Unpaid leave',
      dateCreated: 'Sep 30, 2025',
      leaveRange: 'Oct 3, 2025 - Oct 5, 2025',
      duration: '3 days',
      approver: 'Michael Lee',
      status: 'Rejected'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/dashboard/hr/people-management')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span> Staff directory</span>
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Staff detail view</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>View logs</span>
          </Button>
          <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      {/* Staff Detail Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/dummy-image.png" 
                alt="Alice Smith" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Full name:</span>
                <span className="text-lg font-semibold text-gray-900">Alice Smith</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <Collapsible open={personalInfoOpen} onOpenChange={setPersonalInfoOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal information</span>
                </CardTitle>
                {personalInfoOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm text-gray-900">alicesmith@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Phone number:</span>
                <span className="text-sm text-gray-900">+1 88 8334 8344</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Location:</span>
                <span className="text-sm text-gray-900">Texas, USA</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Employment Detail */}
      <Card>
        <Collapsible open={employmentDetailOpen} onOpenChange={setEmploymentDetailOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Employment detail</span>
                </CardTitle>
                {employmentDetailOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Employee ID:</span>
                <span className="text-sm text-gray-900">000257</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Start date:</span>
                <span className="text-sm text-gray-900">July 2, 2025</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Role:</span>
                <span className="text-sm text-gray-900">Software engineer</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Employment type:</span>
                <span className="text-sm text-gray-900">Full time</span>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Level:</span>
                <span className="text-sm text-gray-900">Level 5</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Department:</span>
                <span className="text-sm text-gray-900">Engineering</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Skills & Development */}
      <Card>
        <Collapsible open={skillsDevelopmentOpen} onOpenChange={setSkillsDevelopmentOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Skills & development</span>
                </CardTitle>
                {skillsDevelopmentOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Skills:</span>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Vue', 'Angular', 'HTML', 'Python'].map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Training:</span>
                <span className="text-sm text-gray-900">3/5 completed</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Leave & Attendance */}
      <Card>
        <Collapsible open={leaveAttendanceOpen} onOpenChange={setLeaveAttendanceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Leave & attendance</span>
                </CardTitle>
                {leaveAttendanceOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Leave Balance */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Leave balance</h4>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Used 6 days</span>
                  <span>Available 20 days</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-violet-600 h-2 rounded-full" 
                    style={{ width: '76.9%' }} // 20/26 = 76.9%
                  ></div>
                </div>
              </div>

              {/* Leave Requests Table */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">My leave requests</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">ID</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Type</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Date created</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Leave range</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Duration</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Approver</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((request) => (
                        <tr key={request.id} className="border-b border-gray-100">
                          <td className="py-2 px-3 text-xs text-gray-900">{request.id}</td>
                          <td className="py-2 px-3 text-xs text-gray-600">{request.type}</td>
                          <td className="py-2 px-3 text-xs text-gray-600">{request.dateCreated}</td>
                          <td className="py-2 px-3 text-xs text-gray-600">{request.leaveRange}</td>
                          <td className="py-2 px-3 text-xs text-gray-600">{request.duration}</td>
                          <td className="py-2 px-3 text-xs text-gray-600">{request.approver}</td>
                          <td className="py-2 px-3 text-xs">
                            {getStatusBadge(request.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Documents & Compliance */}
      <Card>
        <Collapsible open={documentsComplianceOpen} onOpenChange={setDocumentsComplianceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>Documents & compliance</span>
                </CardTitle>
                {documentsComplianceOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <FileCheck className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Policy acknowledgement:</span>
                <span className="text-sm text-gray-900">8/10</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Expiring document:</span>
                <span className="text-sm text-gray-900">Work permit - </span>
                <span className="text-sm text-red-600 font-medium">(30 days)</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Activity Log */}
      <Card>
        <Collapsible open={activityLogOpen} onOpenChange={setActivityLogOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activity log</span>
                </CardTitle>
                {activityLogOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Login at 03:00 pm, Jul 20, 2025</span>
                <span className="text-xs text-gray-500">5 mins ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Leave approved at May 12, 2025</span>
                <span className="text-xs text-gray-500">10 mins ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Training "Emotional intelligence" at Jul 21, 2025</span>
                <span className="text-xs text-gray-500">03:00 pm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Login at Jul 22, 2025</span>
                <span className="text-xs text-gray-500">05:30 pm</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default StaffDetailView;
