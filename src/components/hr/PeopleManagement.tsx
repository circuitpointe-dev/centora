import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Search,
  Filter,
  Upload,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  User,
  Diamond,
  Users,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';

const PeopleManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('staff-directory');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'person'>('list');
  const [expandedCommittees, setExpandedCommittees] = useState<Set<string>>(new Set(['audit']));

  // Mock data for staff directory
  const staffData = [
    {
      id: 1,
      name: 'John doe',
      jobTitle: 'Software engineer',
      department: 'Engineering',
      location: 'Texas',
      manager: 'Trey lexis',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Alice Smith',
      jobTitle: 'Product Manager',
      department: 'Product',
      location: 'New York',
      manager: 'Beta Co.',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      jobTitle: 'UX Designer',
      department: 'Design',
      location: 'San Francisco',
      manager: 'Creative Minds',
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Emily Davis',
      jobTitle: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Chicago',
      manager: 'Marketing Pro',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Michael Brown',
      jobTitle: 'Data Analyst',
      department: 'Analytics',
      location: 'Seattle',
      manager: 'Data Insights',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Sarah Wilson',
      jobTitle: 'HR Coordinator',
      department: 'Human Resources',
      location: 'Boston',
      manager: 'HR Team',
      status: 'Inactive'
    },
    {
      id: 7,
      name: 'David Thompson',
      jobTitle: 'Sales Manager',
      department: 'Sales',
      location: 'Miami',
      manager: 'Sales Director',
      status: 'Active'
    },
    {
      id: 8,
      name: 'Sophia Martinez',
      jobTitle: 'Operations Manager',
      department: 'Operations',
      location: 'Denver',
      manager: 'Ops Lead',
      status: 'Active'
    }
  ];

  // Mock data for volunteer management
  const volunteerData = [
    {
      id: 1,
      name: 'John doe',
      skills: ['Leadership', 'First aid'],
      availability: ['Weekends', 'Evening'],
      assignments: 3,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      skills: ['Management', 'CPR Training'],
      availability: ['Weekdays', 'Morning'],
      assignments: 5,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Alice Brown',
      skills: ['Operations', 'Health Guidelines'],
      availability: ['Afternoon', 'Late Night'],
      assignments: 4,
      status: 'Inactive'
    },
    {
      id: 4,
      name: 'Bob Wilson',
      skills: ['Training', 'Fire Safety'],
      availability: ['Weekends', 'Morning'],
      assignments: 2,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Carol Davis',
      skills: ['Strategy', 'Crisis Management'],
      availability: ['Weekdays', 'Evening'],
      assignments: 6,
      status: 'Active'
    },
    {
      id: 6,
      name: 'David Miller',
      skills: ['Quality Assurance', 'Risk Assessment'],
      availability: ['Afternoon', 'Weekends'],
      assignments: 7,
      status: 'Inactive'
    },
    {
      id: 7,
      name: 'Eva Garcia',
      skills: ['Leadership', 'Training'],
      availability: ['Morning', 'Weekdays'],
      assignments: 1,
      status: 'Active'
    },
    {
      id: 8,
      name: 'Frank Johnson',
      skills: ['Management', 'Operations'],
      availability: ['Evening', 'Late Night'],
      assignments: 8,
      status: 'Active'
    }
  ];

  // Mock data for board management
  const boardData = [
    {
      id: 1,
      name: 'John doe',
      email: 'johndoe@company.com',
      role: 'Chairperson',
      independence: 'Independent',
      tenure: '6 years',
      attendance: '95%',
      compliance: 'Action required',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'janesmith@company.com',
      role: 'CEO',
      independence: 'Executive',
      tenure: '4 years',
      attendance: '89%',
      compliance: 'Overdue',
      status: 'Former'
    },
    {
      id: 3,
      name: 'Emily Johnson',
      email: 'emilyj@company.com',
      role: 'CTO',
      independence: 'Independent',
      tenure: '3 years',
      attendance: '92%',
      compliance: 'Completed',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Michael Brown',
      email: 'michaelb@company.com',
      role: 'CFO',
      independence: 'Independent',
      tenure: '5 years',
      attendance: '94%',
      compliance: 'Completed',
      status: 'Incoming'
    },
    {
      id: 5,
      name: 'Sarah Davis',
      email: 'sarahd@company.com',
      role: 'COO',
      independence: 'Executive',
      tenure: '2 years',
      attendance: '87%',
      compliance: 'Action required',
      status: 'Active'
    },
    {
      id: 6,
      name: 'David Wilson',
      email: 'davidw@company.com',
      role: 'CMO',
      independence: 'Executive',
      tenure: '7 years',
      attendance: '91%',
      compliance: 'Overdue',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Laura Martinez',
      email: 'lauram@company.com',
      role: 'VP of Sales',
      independence: 'Independent',
      tenure: '8 years',
      attendance: '90%',
      compliance: 'Action required',
      status: 'Active'
    },
    {
      id: 8,
      name: 'Robert Garcia',
      email: 'robertg@company.com',
      role: 'Head of HR',
      independence: 'Independent',
      tenure: '1 year',
      attendance: '85%',
      compliance: 'Action required',
      status: 'Former'
    }
  ];

  // Mock data for committees
  const committeeData = [
    {
      id: 'audit',
      name: 'Audit Committee',
      memberCount: 3,
      members: [
        {
          id: 1,
          name: 'John Doe',
          initials: 'JD',
          role: 'Chairperson',
          independence: 'Independent',
          alsoServesOn: 'Nomination',
          tenure: '6y',
          attendance: '95%',
          status: 'Active'
        },
        {
          id: 2,
          name: 'Alice Smith',
          initials: 'AS',
          role: 'Vice Chair',
          independence: 'Independent',
          alsoServesOn: 'Finance',
          tenure: '4y',
          attendance: '90%',
          status: 'Active'
        },
        {
          id: 3,
          name: 'Bob Martin',
          initials: 'BM',
          role: 'Secretary',
          independence: 'Independent',
          alsoServesOn: 'Audit',
          tenure: '3y',
          attendance: '88%',
          status: 'Active'
        }
      ]
    },
    {
      id: 'compensation',
      name: 'Compensation Committee',
      memberCount: 5,
      members: []
    },
    {
      id: 'executive',
      name: 'Executive Committee',
      memberCount: 8,
      members: []
    },
    {
      id: 'nomination',
      name: 'Nomination Committee',
      memberCount: 3,
      members: []
    },
    {
      id: 'risk',
      name: 'Risk Committee',
      memberCount: 3,
      members: []
    },
    {
      id: 'unassigned',
      name: 'Unassigned Members',
      memberCount: 1,
      members: []
    }
  ];

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const currentData = activeTab === 'staff-directory' ? staffData : 
                         activeTab === 'volunteer-management' ? volunteerData : boardData;
      setSelectedRows(currentData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Active') {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    }
  };

  const getBoardStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'Former':
        return <Badge className="bg-purple-100 text-purple-800">Former</Badge>;
      case 'Incoming':
        return <Badge className="bg-blue-100 text-blue-800">Incoming</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getComplianceBadge = (compliance: string) => {
    switch (compliance) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'Action required':
        return <Badge className="bg-red-100 text-red-800">Action required</Badge>;
      case 'Overdue':
        return <Badge className="bg-yellow-100 text-yellow-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{compliance}</Badge>;
    }
  };

  const getIndependenceIcon = (independence: string) => {
    if (independence === 'Independent') {
      return <Diamond className="h-4 w-4 text-gray-600" />;
    } else {
      return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAttendancePercentage = (attendance: string) => {
    return parseInt(attendance.replace('%', ''));
  };

  const toggleCommittee = (committeeId: string) => {
    setExpandedCommittees(prev => {
      const newSet = new Set(prev);
      if (newSet.has(committeeId)) {
        newSet.delete(committeeId);
      } else {
        newSet.add(committeeId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">People management</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger 
            value="staff-directory" 
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Staff directory
          </TabsTrigger>
          <TabsTrigger 
            value="volunteer-management"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Volunteer management
          </TabsTrigger>
          <TabsTrigger 
            value="board-management"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Board management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="staff-directory" className="space-y-6">
          {/* Staff Directory Lists Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Staff directory lists</CardTitle>
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
                    <span>Bulk upload</span>
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add new staff</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Job title</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Manager</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffData.map((staff) => (
                      <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedRows.includes(staff.id)}
                            onCheckedChange={(checked) => handleSelectRow(staff.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{staff.name}</td>
                        <td className="py-3 px-4 text-gray-600">{staff.jobTitle}</td>
                        <td className="py-3 px-4 text-gray-600">{staff.department}</td>
                        <td className="py-3 px-4 text-gray-600">{staff.location}</td>
                        <td className="py-3 px-4 text-gray-600">{staff.manager}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(staff.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => navigate('/dashboard/hr/staff-detail')}
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing 1 to 8 of 120 staff directory lists
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteer-management">
          {/* Volunteer Management Lists Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Volunteer management lists</CardTitle>
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
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Bulk upload</span>
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add volunteer</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Volunteer Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Skills</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Availability</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Assignments</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteerData.map((volunteer) => (
                      <tr key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedRows.includes(volunteer.id)}
                            onCheckedChange={(checked) => handleSelectRow(volunteer.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{volunteer.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {volunteer.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {volunteer.availability.map((availability, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                {availability}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{volunteer.assignments}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(volunteer.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => navigate('/dashboard/hr/volunteer-profile')}
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

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing 1 to 8 of 120 volunteer management lists
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board-management">
          {/* Board Management Lists Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Board management lists</CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search...."
                      className="w-64 px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={viewMode === 'list' ? 'default' : 'ghost'} 
                      size="sm" 
                      className={`p-2 ${viewMode === 'list' ? 'bg-violet-600 text-white' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                      size="sm" 
                      className={`p-2 ${viewMode === 'grid' ? 'bg-violet-600 text-white' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === 'person' ? 'default' : 'ghost'} 
                      size="sm" 
                      className={`p-2 ${viewMode === 'person' ? 'bg-violet-600 text-white' : ''}`}
                      onClick={() => setViewMode('person')}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Board Data - List View */}
              {viewMode === 'list' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Member</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Independence</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Tenure</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Attendance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Compliance</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardData.map((member) => (
                        <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={selectedRows.includes(member.id)}
                              onCheckedChange={(checked) => handleSelectRow(member.id, checked as boolean)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{member.role}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getIndependenceIcon(member.independence)}
                              <span className="text-sm text-gray-600">{member.independence}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{member.tenure}</td>
                          <td className="py-3 px-4 text-gray-600">{member.attendance}</td>
                          <td className="py-3 px-4">
                            {getComplianceBadge(member.compliance)}
                          </td>
                          <td className="py-3 px-4">
                            {getBoardStatusBadge(member.status)}
                          </td>
                          <td className="py-3 px-4">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center space-x-1"
                              onClick={() => navigate('/dashboard/hr/board-member-detail')}
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
              )}

              {/* Board Data - Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boardData.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        {/* Name */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Name</span>
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                        </div>

                        {/* Email */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Email</span>
                          <span className="text-sm text-gray-600">{member.email}</span>
                        </div>

                        {/* Independence */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Independence</span>
                          <div className="flex items-center space-x-2">
                            {getIndependenceIcon(member.independence)}
                            <span className="text-sm text-gray-600">{member.independence}</span>
                          </div>
                        </div>

                        {/* Tenure */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Tenure</span>
                          <span className="text-sm text-gray-600">{member.tenure}</span>
                        </div>

                        {/* Attendance */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Attendance</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-violet-600 h-2 rounded-full" 
                                style={{ width: `${getAttendancePercentage(member.attendance)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{member.attendance}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Status</span>
                          {getBoardStatusBadge(member.status)}
                        </div>

                        {/* Compliance */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Compliance</span>
                          {getComplianceBadge(member.compliance)}
                        </div>

                        {/* Action */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">Action</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => navigate('/dashboard/hr/board-member-detail')}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Board Data - Person View */}
              {viewMode === 'person' && (
                <div className="space-y-4">
                  {committeeData.map((committee) => (
                    <Card key={committee.id} className="overflow-hidden">
                      <Collapsible 
                        open={expandedCommittees.has(committee.id)} 
                        onOpenChange={() => toggleCommittee(committee.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <CardTitle className="text-lg font-semibold">
                                  {committee.name}
                                </CardTitle>
                                <span className="text-sm text-gray-500">
                                  {committee.memberCount} members
                                </span>
                              </div>
                              {expandedCommittees.has(committee.id) ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            {committee.members.length > 0 ? (
                              <div className="space-y-4">
                                {committee.members.map((member) => (
                                  <div key={member.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    {/* Member Avatar */}
                                    <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                      {member.initials}
                                    </div>
                                    
                                    {/* Member Details */}
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center space-x-4">
                                        <span className="font-medium text-gray-900">{member.name}</span>
                                        <span className="text-sm text-gray-600">{member.role}</span>
                                        <div className="flex items-center space-x-1">
                                          {getIndependenceIcon(member.independence)}
                                          <span className="text-sm text-gray-600">{member.independence}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>Also serves on: {member.alsoServesOn}</span>
                                        <span>Tenure: {member.tenure}</span>
                                        <span>Attendance: {member.attendance}</span>
                                      </div>
                                    </div>
                                    
                                    {/* Status and Action */}
                                    <div className="flex items-center space-x-3">
                                      {getBoardStatusBadge(member.status)}
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="flex items-center space-x-1"
                                        onClick={() => navigate('/dashboard/hr/board-member-detail')}
                                      >
                                        <Eye className="h-4 w-4" />
                                        <span>View</span>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                No members assigned to this committee
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing 1 to 8 of 120 board management lists
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeopleManagement;
