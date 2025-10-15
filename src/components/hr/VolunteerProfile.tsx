import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageCircle,
  LogOut,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  User,
  Award,
  Heart,
  CalendarDays,
  FileCheck,
  Shield,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  CheckCircle,
  Smile,
  XCircle,
  Upload,
  Plus,
  X,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Sigma,
  Send,
  CalendarDays as CalendarDaysIcon,
  UserX
} from 'lucide-react';

const VolunteerProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [personalInfoOpen, setPersonalInfoOpen] = useState(true);
  const [upcomingShiftsOpen, setUpcomingShiftsOpen] = useState(true);
  const [complianceOpen, setComplianceOpen] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [isHoursTrackerModalOpen, setIsHoursTrackerModalOpen] = useState(false);
  const [selectedHoursEntry, setSelectedHoursEntry] = useState<any>(null);
  const [isAddHoursModalOpen, setIsAddHoursModalOpen] = useState(false);
  const [questionnaireResponses, setQuestionnaireResponses] = useState({
    volunteeringExperience: '',
    trainingDevelopment: '',
    teamCollaboration: '',
    leadershipManagement: '',
    workLifeBalance: ''
  });
  const [additionalThoughts, setAdditionalThoughts] = useState('');

  // Mock data for upcoming shifts
  const upcomingShifts = [
    {
      id: 1,
      date: 'Apr 26',
      event: 'Health fair',
      time: '07:30 AM - 11:30 AM'
    },
    {
      id: 2,
      date: 'Apr 27',
      event: 'Community event',
      time: '07:30 AM - 11:30 AM'
    }
  ];

  // Mock data for assignment logs
  const assignmentLogs = [
    {
      id: 1,
      date: 'Jul 2, 2025',
      program: 'Community health',
      event: 'Health fair',
      role: 'Greeters',
      shift: '07:30 AM - 11:30 AM',
      status: 'Assigned'
    },
    {
      id: 2,
      date: 'Jul 4, 2025',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Volunteer',
      shift: '10:00 AM - 01:00 PM',
      status: 'Confirmed'
    },
    {
      id: 3,
      date: 'Jul 3, 2025',
      program: 'Mental health',
      event: 'Awareness workshop',
      role: 'Volunteer',
      shift: '09:00 AM - 12:00 PM',
      status: 'Overlapping'
    },
    {
      id: 4,
      date: 'Jul 4, 2025',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Greeters',
      shift: '10:00 AM - 01:00 PM',
      status: 'Completed'
    },
    {
      id: 5,
      date: 'Jul 4, 2025',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Greeters',
      shift: '10:00 AM - 01:00 PM',
      status: 'No-show'
    }
  ];

  // Mock data for hours tracker
  const hoursTrackerData = [
    {
      id: 1,
      name: 'Alice smith',
      program: 'Community health',
      event: 'Health fair',
      role: 'Greeters',
      shift: '07:30 AM - 11:30 AM',
      hours: '4 h',
      status: 'Approved'
    },
    {
      id: 2,
      name: 'Alice smith',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Volunteer',
      shift: '10:00 AM - 01:00 PM',
      hours: '3 h',
      status: 'Pending'
    },
    {
      id: 3,
      name: 'Alice smith',
      program: 'Mental health',
      event: 'Awareness workshop',
      role: 'Volunteer',
      shift: '09:00 AM - 12:00 PM',
      hours: '3 h',
      status: 'Approved'
    },
    {
      id: 4,
      name: 'Alice smith',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Cookers',
      shift: '10:00 AM - 01:00 PM',
      hours: '3 h',
      status: 'Rejected'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Assigned':
        return <Badge className="bg-purple-100 text-purple-800">Assigned</Badge>;
      case 'Confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'Overlapping':
        return <Badge className="bg-red-100 text-red-800">Overlapping</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'No-show':
        return <Badge className="bg-yellow-100 text-yellow-800">No-show</Badge>;
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

  const handleViewAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleViewHoursEntry = (entry: any) => {
    setSelectedHoursEntry(entry);
    setIsHoursTrackerModalOpen(true);
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
            <span>Volunteer management</span>
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Volunteer profile</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Assign shift</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Log hours</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Start exit</span>
          </Button>
        </div>
      </div>

      {/* Volunteer Profile Card */}
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
                <span className="text-lg font-semibold text-gray-900">Alice smith</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger 
            value="overview" 
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="assignment-logs"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Assignment logs
          </TabsTrigger>
          <TabsTrigger 
            value="hours-tracker"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Hours tracker
          </TabsTrigger>
          <TabsTrigger 
            value="exit-feedback"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Exit feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Joined:</span>
                    <span className="text-sm text-gray-900">July 2, 2025</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Skills:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Leadership', 'First aid'].map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Interest:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Community', 'Outreach'].map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Availability:</span>
                    <div className="flex flex-wrap gap-2">
                      {['Weekends', 'Evening'].map((availability) => (
                        <Badge key={availability} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {availability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Upcoming Shifts */}
          <Card>
            <Collapsible open={upcomingShiftsOpen} onOpenChange={setUpcomingShiftsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>Upcoming shifts</span>
                    </CardTitle>
                    {upcomingShiftsOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {upcomingShifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          {shift.date} • {shift.event}
                        </div>
                        <div className="text-sm text-gray-600">{shift.time}</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Reassign
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Compliance */}
          <Card>
            <Collapsible open={complianceOpen} onOpenChange={setComplianceOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Compliance</span>
                    </CardTitle>
                    {complianceOpen ? (
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
                    <span className="text-sm text-gray-500">Background check:</span>
                    <span className="text-sm text-gray-900">Valid until 2026</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">ID card:</span>
                    <span className="text-sm text-gray-900">Expires in </span>
                    <span className="text-sm text-red-600 font-medium">45 d</span>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>

        <TabsContent value="assignment-logs">
          {/* Assignment Logs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Assignment logs</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search...."
                      className="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Assignment Logs Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Shift (start - end)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignmentLogs.map((assignment) => (
                      <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{assignment.date}</td>
                        <td className="py-3 px-4 text-gray-600">{assignment.program}</td>
                        <td className="py-3 px-4 text-gray-600">{assignment.event}</td>
                        <td className="py-3 px-4 text-gray-600">{assignment.role}</td>
                        <td className="py-3 px-4 text-gray-600">{assignment.shift}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(assignment.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleViewAssignment(assignment)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours-tracker">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Approved Hours Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-violet-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">42 h</div>
                <div className="text-sm text-gray-600">Approved hours (range)</div>
              </CardContent>
            </Card>

            {/* Pending Rows Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Smile className="h-4 w-4 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">1</div>
                <div className="text-sm text-gray-600">Pending rows</div>
              </CardContent>
            </Card>

            {/* Rejection Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">2</div>
                <div className="text-sm text-gray-600">Rejection</div>
              </CardContent>
            </Card>
          </div>

          {/* Hours Tracker List Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Hours tracker list</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                      <Button 
                        className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2"
                        onClick={() => setIsAddHoursModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add hours</span>
                      </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Hours Tracker Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Program</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Event</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Start - End</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Hours</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hoursTrackerData.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{entry.name}</td>
                        <td className="py-3 px-4 text-gray-600">{entry.program}</td>
                        <td className="py-3 px-4 text-gray-600">{entry.event}</td>
                        <td className="py-3 px-4 text-gray-600">{entry.role}</td>
                        <td className="py-3 px-4 text-gray-600">{entry.shift}</td>
                        <td className="py-3 px-4 text-gray-600">{entry.hours}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(entry.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleViewHoursEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exit-feedback" className="space-y-6">
          {/* Exit Details */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Effective date:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Nov 12, 2025</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserX className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Exit type:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Voluntary</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Reason:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Relocation</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questionnaire */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Questionnaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Satisfaction Questions */}
              <div className="space-y-4">
                {/* Volunteering Experience */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Satisfaction with volunteering experience
                  </Label>
                  <RadioGroup
                    value={questionnaireResponses.volunteeringExperience}
                    onValueChange={(value) => setQuestionnaireResponses(prev => ({
                      ...prev,
                      volunteeringExperience: value
                    }))}
                    className="flex space-x-6"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`volunteering-${value}`} />
                        <Label htmlFor={`volunteering-${value}`} className="text-sm text-gray-700">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Training and Development */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Satisfaction with training and development opportunities
                  </Label>
                  <RadioGroup
                    value={questionnaireResponses.trainingDevelopment}
                    onValueChange={(value) => setQuestionnaireResponses(prev => ({
                      ...prev,
                      trainingDevelopment: value
                    }))}
                    className="flex space-x-6"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`training-${value}`} />
                        <Label htmlFor={`training-${value}`} className="text-sm text-gray-700">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Team Collaboration */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Satisfaction with team collaboration and support
                  </Label>
                  <RadioGroup
                    value={questionnaireResponses.teamCollaboration}
                    onValueChange={(value) => setQuestionnaireResponses(prev => ({
                      ...prev,
                      teamCollaboration: value
                    }))}
                    className="flex space-x-6"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`team-${value}`} />
                        <Label htmlFor={`team-${value}`} className="text-sm text-gray-700">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Leadership and Management */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Satisfaction with leadership and management effectiveness
                  </Label>
                  <RadioGroup
                    value={questionnaireResponses.leadershipManagement}
                    onValueChange={(value) => setQuestionnaireResponses(prev => ({
                      ...prev,
                      leadershipManagement: value
                    }))}
                    className="flex space-x-6"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`leadership-${value}`} />
                        <Label htmlFor={`leadership-${value}`} className="text-sm text-gray-700">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Work-Life Balance */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-900">
                    Satisfaction with work-life balance initiatives
                  </Label>
                  <RadioGroup
                    value={questionnaireResponses.workLifeBalance}
                    onValueChange={(value) => setQuestionnaireResponses(prev => ({
                      ...prev,
                      workLifeBalance: value
                    }))}
                    className="flex space-x-6"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={value.toString()} id={`worklife-${value}`} />
                        <Label htmlFor={`worklife-${value}`} className="text-sm text-gray-700">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Additional Thoughts */}
              <div className="space-y-3">
                <Label htmlFor="additional-thoughts" className="text-sm font-medium text-gray-900">
                  Any additional thoughts?
                </Label>
                <div className="flex space-x-3">
                  <Textarea
                    id="additional-thoughts"
                    placeholder="Share any additional feedback..."
                    value={additionalThoughts}
                    onChange={(e) => setAdditionalThoughts(e.target.value)}
                    className="flex-1 min-h-[100px]"
                  />
                  <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockers and Action Buttons */}
          <div className="space-y-6">
            {/* Blockers */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Blockers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>2 unapproved hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>1 open assignment</span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" className="flex items-center space-x-2">
                <CalendarDaysIcon className="h-4 w-4" />
                <span>Schedule interview</span>
              </Button>
              <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2">
                <UserX className="h-4 w-4" />
                <span>Finalize exit</span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Assignment Details Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={() => setIsAssignmentModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Assignment details</h2>
              </div>
              
              {selectedAssignment && (
                <>
                  {/* Assignment Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm text-gray-900">{selectedAssignment.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Program:</span>
                      <span className="text-sm text-gray-900">{selectedAssignment.program}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Event:</span>
                      <span className="text-sm text-gray-900">{selectedAssignment.event}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Role:</span>
                      <span className="text-sm text-gray-900">{selectedAssignment.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start - End:</span>
                      <span className="text-sm text-gray-900">{selectedAssignment.shift}</span>
                    </div>
                  </div>

                  {/* Conflicts Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-900">Conflicts</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-700">Overlap with another assignment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-gray-700">Clearance not valid</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAssignmentModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsAssignmentModalOpen(false)}
                    >
                      Reassign
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsAssignmentModalOpen(false)}
                    >
                      Mark no-show
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hours Tracker Detail Modal */}
      {isHoursTrackerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={() => setIsHoursTrackerModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Hours tracker detail</h2>
                <button
                  onClick={() => setIsHoursTrackerModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {selectedHoursEntry && (
                <>
                  {/* Hours Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm text-gray-900">{selectedHoursEntry.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Date:</span>
                      <span className="text-sm text-gray-900">July 2, 2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Start - End:</span>
                      <span className="text-sm text-gray-900">{selectedHoursEntry.shift}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Hours:</span>
                      <span className="text-sm text-gray-900">{selectedHoursEntry.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Verified by:</span>
                      <span className="text-sm text-gray-900">John david</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsHoursTrackerModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="bg-violet-600 hover:bg-violet-700"
                      onClick={() => setIsHoursTrackerModalOpen(false)}
                    >
                      Approve
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsHoursTrackerModalOpen(false)}
                    >
                      Reject
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Hours Modal */}
      {isAddHoursModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur Overlay */}
          <div 
            className="absolute inset-0 backdrop-blur-sm bg-white/20"
            onClick={() => setIsAddHoursModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Add hours</h2>
                <button
                  onClick={() => setIsAddHoursModalOpen(false)}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              {/* Form Fields */}
              <div className="space-y-4">
                {/* Row 1: Volunteer and Program */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volunteer" className="text-sm font-medium">Volunteer</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select volunteer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alice">Alice Smith</SelectItem>
                        <SelectItem value="john">John Doe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program" className="text-sm font-medium">Program</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health">Community health</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="mental">Mental health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Event and Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event" className="text-sm font-medium">Event</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="health-fair">Health fair</SelectItem>
                        <SelectItem value="cooking">Cooking demonstration</SelectItem>
                        <SelectItem value="workshop">Awareness workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <div className="relative">
                      <Input 
                        id="date" 
                        type="text" 
                        placeholder="Select date"
                        className="pr-10"
                      />
                      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Time fields */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="text-sm font-medium">Start time</Label>
                    <div className="relative">
                      <Input 
                        id="start-time" 
                        type="text" 
                        placeholder="07:30 AM"
                        className="pr-10"
                      />
                      <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="text-sm font-medium">End time</Label>
                    <div className="relative">
                      <Input 
                        id="end-time" 
                        type="text" 
                        placeholder="11:30 AM"
                        className="pr-10"
                      />
                      <ClockIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break" className="text-sm font-medium">Break</Label>
                    <Select defaultValue="45">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 MIN</SelectItem>
                        <SelectItem value="45">45 MIN</SelectItem>
                        <SelectItem value="60">60 MIN</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completed-hours" className="text-sm font-medium">Completed hours</Label>
                    <div className="relative">
                      <Input 
                        id="completed-hours" 
                        type="text" 
                        value="3 HRS"
                        className="pr-10"
                        readOnly
                      />
                      <Sigma className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Warning Messages */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800">
                      Overlap with | 11:30 AM - 12:30 PM (Health far - day 1)
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800">
                      Clearance expired (BG check)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAddHoursModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsAddHoursModalOpen(false)}
                >
                  Approve now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddHoursModalOpen(false)}
                >
                  Save as pending
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerProfile;
