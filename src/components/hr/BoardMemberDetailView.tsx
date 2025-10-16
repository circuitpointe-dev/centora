import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Edit,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Diamond,
  CheckCircle,
  Clock,
  Calendar,
  X,
  AlertTriangle,
  Eye,
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
  Check,
  Minus,
  X as XIcon,
  RotateCcw,
  FileText,
  CheckCircle2,
  MessageSquare,
  ChevronDown as ChevronDownIcon,
  Upload,
  Award,
  BookOpen,
  Shield,
  TrendingUp
} from 'lucide-react';

const BoardMemberDetailView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [contactInfoOpen, setContactInfoOpen] = useState(true);
  const [biographyOpen, setBiographyOpen] = useState(true);
  const [currentAppointmentOpen, setCurrentAppointmentOpen] = useState(true);
  const [roleHistoryOpen, setRoleHistoryOpen] = useState(true);
  const [complianceOpen, setComplianceOpen] = useState(true);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Yearly');
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPeriodDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data for board member
  const memberData = {
    name: 'Alice smith',
    email: 'alicesmith@gmail.com',
    phone: '+1 88 8334 8344',
    location: 'Texas, USA',
    status: 'Active',
    independence: 'Independent',
    role: 'Chair person',
    biography: 'A highly accomplished board chair with over two decades of experience in corporate governance, strategic leadership, and risk management. Known for driving organizational success and fostering a culture of innovation and collaboration.',
    termStart: 'Jan 15, 2018',
    termEnd: 'Jan 14, 2027',
    tenure: '6 years',
    attendance: '95%',
    committees: ['Audit', 'Nomination'],
    roleHistory: [
      {
        role: 'Chair person',
        status: 'Current',
        period: 'Jan 16, 2021 - Present'
      },
      {
        role: 'Independent Director',
        status: 'Previous',
        period: 'Jan 15, 2018 - Jan 15, 2021'
      }
    ],
    compliance: [
      {
        item: 'Directors & Officers Insurance',
        status: 'Complete',
        dueDate: 'Dec 31, 2024',
        completedDate: 'Jan 15, 2024'
      },
      {
        item: 'Conflict of Interest',
        status: 'Complete',
        dueDate: 'Dec 31, 2024',
        completedDate: 'Jan 20, 2024'
      },
      {
        item: 'Code of Conduct',
        status: 'Pending',
        dueDate: 'Oct 31, 2024',
        completedDate: null
      }
    ]
  };

  // Mock data for term tracker assignments
  const termTrackerData = [
    {
      id: 1,
      date: 'Jul 2, 2025',
      program: 'Community health',
      event: 'Health fair',
      role: 'Greeters',
      shift: '07:30 AM - 11:30 AM',
      status: 'Assigned',
      conflicts: [
        'Overlap with another assignment',
        'Clearance not valid'
      ]
    },
    {
      id: 2,
      date: 'Jul 4, 2025',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Volunteer',
      shift: '10:00 AM - 01:00 PM',
      status: 'Confirmed',
      conflicts: []
    },
    {
      id: 3,
      date: 'Jul 3, 2025',
      program: 'Mental health',
      event: 'Awareness workshop',
      role: 'Volunteer',
      shift: '09:00 AM - 12:00 PM',
      status: 'Overlapping',
      conflicts: [
        'Overlap with another assignment'
      ]
    },
    {
      id: 4,
      date: 'Jul 5, 2025',
      program: 'Nutrition',
      event: 'Cooking demonstration',
      role: 'Cookers',
      shift: '10:00 AM - 01:00 PM',
      status: 'Completed',
      conflicts: []
    }
  ];

  // Mock data for meeting attendance
  const attendanceMetrics = {
    overallAttendance: '92%',
    meetingsAttended: 4,
    excusedAbsences: 2,
    absent: 1,
    quorumMet: 2
  };

  const monthlyAttendance = [
    { month: 'Jan', status: 'Present' },
    { month: 'Feb', status: 'Present' },
    { month: 'Mar', status: 'Excused' },
    { month: 'Apr', status: 'Excused' },
    { month: 'May', status: 'Present' },
    { month: 'Jun', status: 'Present' },
    { month: 'Jul', status: 'Absent' },
    { month: 'Aug', status: 'Present' },
    { month: 'Sep', status: 'Present' },
    { month: 'Oct', status: 'Excused' },
    { month: 'Nov', status: 'Present' },
    { month: 'Dec', status: 'Present' }
  ];

  const meetingData = [
    {
      id: 1,
      date: '2024-06-20',
      title: 'Board Q2 review',
      status: 'Quorum met',
      quorumCount: '6/4',
      time: '14:00 - 15:00',
      location: 'Boardroom A',
      attendees: '6 effective attendees'
    },
    {
      id: 2,
      date: '2024-06-21',
      title: 'Budget Planning Session',
      status: 'At risk',
      quorumCount: '4/4',
      time: '10:00 - 12:00',
      location: 'Virtual meeting',
      attendees: '4 Attending'
    },
    {
      id: 3,
      date: '2024-06-22',
      title: 'Project Kickoff',
      status: 'Not met',
      quorumCount: '1/4',
      time: '13:00 - 14:30',
      location: 'Meeting Room C',
      attendees: '1 Attending'
    },
    {
      id: 4,
      date: '2024-06-23',
      title: 'Design Review',
      status: 'Quorum met',
      quorumCount: '4/4',
      time: '10:00 - 11:30',
      location: 'Conference Room B',
      attendees: '4 Attending'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Complete':
        return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getComplianceIcon = (status: string) => {
    if (status === 'Complete') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getAssignmentStatusBadge = (status: string) => {
    switch (status) {
      case 'Assigned':
        return <Badge className="bg-purple-100 text-purple-800">Assigned</Badge>;
      case 'Confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>;
      case 'Overlapping':
        return <Badge className="bg-red-100 text-red-800">Overlapping</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handleViewAssignment = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'Present':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'Excused':
        return <Minus className="h-4 w-4 text-yellow-600" />;
      case 'Absent':
        return <XIcon className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case 'Quorum met':
        return <Badge className="bg-green-100 text-green-800">✓ Quorum met</Badge>;
      case 'At risk':
        return <Badge className="bg-yellow-100 text-yellow-800">⚠ At risk</Badge>;
      case 'Not met':
        return <Badge className="bg-red-100 text-red-800">ⓧ Not met</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            onClick={() => navigate('/dashboard/hr/people-management')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Board management</span>
          </Button>
        </div>
        
        {/* Period Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            className="flex items-center space-x-2 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)}
          >
            <span>{selectedPeriod}</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
          
          {isPeriodDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedPeriod('Yearly');
                    setIsPeriodDropdownOpen(false);
                  }}
                >
                  Yearly
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedPeriod('Monthly');
                    setIsPeriodDropdownOpen(false);
                  }}
                >
                  Monthly
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setSelectedPeriod('Quarterly');
                    setIsPeriodDropdownOpen(false);
                  }}
                >
                  Quarterly
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">Member detail view</h1>
        <Badge className="bg-red-100 text-red-800">Action required</Badge>
      </div>

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
            value="term-tracker"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Term tracker
          </TabsTrigger>
          <TabsTrigger
            value="meeting-attendance"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Meeting attendance
          </TabsTrigger>
          <TabsTrigger
            value="governance-scorecards"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Governance scorecards
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>Send message</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Request declaration</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </div>
          </div>

          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/dummy-image.png"
                    alt={memberData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Full name:</span>
                    <span className="text-lg font-semibold text-gray-900">{memberData.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    {getStatusBadge(memberData.status)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Independence:</span>
                    <div className="flex items-center space-x-1">
                      <Diamond className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-900">{memberData.independence}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Role:</span>
                    <span className="text-sm text-gray-900">{memberData.role}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <Collapsible open={contactInfoOpen} onOpenChange={setContactInfoOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Contact information</CardTitle>
                    {contactInfoOpen ? (
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
                    <span className="text-sm text-gray-900">{memberData.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Phone number:</span>
                    <span className="text-sm text-gray-900">{memberData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="text-sm text-gray-900">{memberData.location}</span>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Biography */}
          <Card>
            <Collapsible open={biographyOpen} onOpenChange={setBiographyOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Biography</CardTitle>
                    {biographyOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {memberData.biography}
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Current Appointment */}
          <Card>
            <Collapsible open={currentAppointmentOpen} onOpenChange={setCurrentAppointmentOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Current appointment</CardTitle>
                    {currentAppointmentOpen ? (
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
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Term start:</span>
                    <span className="text-sm text-gray-900">{memberData.termStart}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Term end:</span>
                    <span className="text-sm text-gray-900">{memberData.termEnd}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Tenure:</span>
                    <span className="text-sm text-gray-900">{memberData.tenure}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">Attendance:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-violet-600 h-2 rounded-full" 
                          style={{ width: `${parseInt(memberData.attendance.replace('%', ''))}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{memberData.attendance}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">Committee memberships:</span>
                    <div className="flex flex-wrap gap-2">
                      {memberData.committees.map((committee) => (
                        <Badge key={committee} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                          {committee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Role History */}
          <Card>
            <Collapsible open={roleHistoryOpen} onOpenChange={setRoleHistoryOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Role history</CardTitle>
                    {roleHistoryOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {memberData.roleHistory.map((role, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{role.role}</div>
                        <div className="text-sm text-gray-600">{role.period}</div>
                      </div>
                      <Badge className={role.status === 'Current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {role.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Compliance & Declarations */}
          <Card>
            <Collapsible open={complianceOpen} onOpenChange={setComplianceOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Compliance & declarations</CardTitle>
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
                  {memberData.compliance.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getComplianceIcon(item.status)}
                        <div>
                          <div className="font-medium text-gray-900">{item.item}</div>
                          <div className="text-sm text-gray-600">
                            Due: {item.dueDate}
                            {item.completedDate && ` • Completed: ${item.completedDate}`}
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>

        <TabsContent value="term-tracker" className="space-y-8">
          {/* My Term History Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">My term history</h2>
                <p className="text-sm text-gray-600">View your current term status and renewal timeline</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Propose renewal</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Record vote</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Mark vacancy</span>
                </Button>
              </div>
            </div>

            {/* Term Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Current Term */}
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CalendarIcon className="h-6 w-6 text-purple-600 mr-1" />
                    <ArrowLeft className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">1/2</div>
                  <div className="text-sm text-gray-600">Current</div>
                </CardContent>
              </Card>

              {/* Days to Renewal */}
              <Card className="border-purple-200">
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">365</div>
                  <div className="text-sm text-gray-600">Days to renewal</div>
                </CardContent>
              </Card>

              {/* Renewal Eligibility */}
              <Card className="border-green-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="h-6 w-6 text-green-600 mr-1" />
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">Yes</div>
                  <div className="text-sm text-gray-600">Renewal eligible</div>
                </CardContent>
              </Card>

              {/* Total Terms */}
              <Card className="border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="h-6 w-6 text-blue-600 mr-1" />
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-600">Total terms</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* My Term Timeline Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">My term timeline</h2>
            
            {/* Timeline */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Year Labels */}
                  <div className="flex justify-between px-2">
                    <span className="text-sm text-gray-500">2023</span>
                    <span className="text-sm text-gray-500">2024</span>
                    <span className="text-sm text-gray-500">2025</span>
                    <span className="text-sm text-gray-500">2026</span>
                  </div>

                  {/* Member Row */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium text-gray-900">{memberData.name}</div>
                    <div className="flex-1 relative h-6">
                      {/* Member timeline bar */}
                      <div className="absolute inset-0 bg-gray-100 border border-gray-300 rounded-full">
                        {/* Active term (2024-2025) - starts at beginning of 2024, ends at middle of 2025 */}
                        <div className="absolute left-1/4 w-1/2 h-full bg-purple-600 rounded-full flex items-center justify-center" style={{width: '37.5%'}}>
                          <span className="text-white text-sm font-medium">2024 - 2025</span>
                        </div>
                        {/* Future/inactive period (mid-2025 to 2026) */}
                        <div className="absolute h-full bg-gray-200 border border-gray-300 rounded-r-full" style={{left: '62.5%', width: '37.5%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meeting-attendance" className="space-y-8">
          {/* My Meeting Attendance Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My meeting attendance</h2>
              <p className="text-sm text-gray-600">Track your personal attendance record and upcoming meetings</p>
            </div>

            {/* Attendance Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Overall Attendance */}
              <Card className="bg-violet-50 border-violet-200">
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-violet-900">{attendanceMetrics.overallAttendance}</div>
                  <div className="text-sm text-violet-700">Overall attendance</div>
                </CardContent>
              </Card>

              {/* Meetings Attended */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{attendanceMetrics.meetingsAttended}</div>
                  <div className="text-sm text-blue-700">Meetings attended</div>
                </CardContent>
              </Card>

              {/* Excused Absences */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-900">{attendanceMetrics.excusedAbsences}</div>
                  <div className="text-sm text-yellow-700">Excused absences</div>
                </CardContent>
              </Card>

              {/* Absent */}
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-4 text-center">
                  <CalendarIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-900">{attendanceMetrics.absent}</div>
                  <div className="text-sm text-red-700">Absent</div>
                </CardContent>
              </Card>

              {/* Quorum Met */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4 text-center">
                  <UsersIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{attendanceMetrics.quorumMet}</div>
                  <div className="text-sm text-green-700">Quorum met</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Monthly Attendance Record */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">My Attendance Record (12 months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Month Headers */}
                <div className="grid gap-2" style={{gridTemplateColumns: '80px repeat(12, 1fr)'}}>
                  <div className="text-sm font-medium text-gray-600">Month</div>
                  {monthlyAttendance.map((month) => (
                    <div key={month.month} className="text-center">
                      <div className="text-xs font-medium text-gray-600">{month.month}</div>
                    </div>
                  ))}
                </div>

                {/* Separator Line */}
                <div className="border-t border-gray-200"></div>

                {/* My Attendance Row */}
                <div className="grid gap-2" style={{gridTemplateColumns: '80px repeat(12, 1fr)'}}>
                  <div className="text-sm font-medium text-gray-900">My Attendance</div>
                  {monthlyAttendance.map((month) => (
                    <div key={month.month} className="flex justify-center">
                      {getAttendanceIcon(month.status)}
                    </div>
                  ))}
                </div>

                {/* Separator Line */}
                <div className="border-t border-gray-200"></div>

                {/* Legend */}
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-600">Present</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Minus className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-600">Excused</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                      <XIcon className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-600">Absent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Meetings */}
          <div className="space-y-4">
            {meetingData.map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="font-medium text-gray-900">{meeting.date}</div>
                    <span className="text-gray-400">•</span>
                    <div className="font-medium text-gray-900">{meeting.title}</div>
                    <div className="flex items-center space-x-2">
                      {getMeetingStatusBadge(meeting.status)}
                      <span className="text-sm text-gray-600">{meeting.quorumCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{meeting.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UsersIcon className="h-4 w-4" />
                      <span>{meeting.attendees}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-1"
                  onClick={() => navigate('/dashboard/hr/meeting-details')}
                >
                  <Eye className="h-4 w-4" />
                  <span>View detail</span>
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="governance-scorecards" className="space-y-6 py-6">
          {/* My Governance Dashboard Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">My Governance Dashboard</h2>
              <p className="text-sm text-gray-600">Personal compliance status and performance metrics</p>
            </div>
            <Button variant="outline" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>

          {/* Governance Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Committee Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">My committee roles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Board committee</div>
                      <div className="text-sm text-gray-600">Chair</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Finance committee</div>
                      <div className="text-sm text-gray-600">Member</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Audit committee</div>
                      <div className="text-sm text-gray-600">Observer</div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Invited</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Skills & Expertise */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">My skills & expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Board committee</span>
                    <Badge variant="outline" className="text-purple-600 border-purple-200">Expert</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Strategic planning</span>
                    <Badge variant="outline" className="text-purple-600 border-purple-200">Expert</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Finance committee</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">Basic</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Risk management</span>
                    <Badge variant="outline" className="text-green-600 border-green-200">Proficient</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Technology</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">Basic</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900">Legal & compliance</span>
                    <Badge variant="outline" className="text-green-600 border-green-200">Proficient</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Development */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Professional development</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Effective communication strategies</span>
                      <span className="text-sm text-gray-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Board leadership training</span>
                      <span className="text-sm text-gray-600">75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Creative problem-solving session</span>
                      <span className="text-sm text-gray-600">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Conflict resolution techniques</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Compliance tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Directors & Officers Insurance</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Conflict of interest</span>
                      <span className="text-sm text-gray-600">100%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Code of conduct</span>
                      <span className="text-sm text-gray-600">70%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900">Declaration of interest</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoardMemberDetailView;
