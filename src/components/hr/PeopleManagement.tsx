import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useEmployees } from '@/hooks/hr/useEmployees';
import { useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '@/hooks/hr/useEmployeeCRUD';
import { useVolunteers, useCreateVolunteer, useUpdateVolunteer, useDeleteVolunteer, Volunteer } from '@/hooks/hr/useVolunteers';
import { useBoardMembers } from '@/hooks/hr/useBoardMembers';
import { useCommittees, useCommitteeMembers } from '@/hooks/hr/useCommittees';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  FileText,
  X
} from 'lucide-react';

const PeopleManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('staff-directory');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'person'>('list');
  const [expandedCommittees, setExpandedCommittees] = useState<Set<string>>(new Set(['audit']));
  const [staffSearch, setStaffSearch] = useState('');
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isVolunteerFilterOpen, setIsVolunteerFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isVolunteerCreateOpen, setIsVolunteerCreateOpen] = useState(false);
  const [isVolunteerEditOpen, setIsVolunteerEditOpen] = useState(false);
  const [isVolunteerViewOpen, setIsVolunteerViewOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isVolunteerBulkOpen, setIsVolunteerBulkOpen] = useState(false);
  const [filters, setFilters] = useState({ department: '', status: '' });
  const [volunteerFilters, setVolunteerFilters] = useState({ status: '', skills: '' });
  const [newDept, setNewDept] = useState('');
  const [showNewDept, setShowNewDept] = useState(false);
  const [newPosition, setNewPosition] = useState('');
  const [showNewPosition, setShowNewPosition] = useState(false);
  const [createForm, setCreateForm] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    employment_type: 'full-time',
    hire_date: '',
    status: 'active'
  });
  const [volunteerForm, setVolunteerForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    skills: [] as string[],
    availability: [] as string[],
    status: 'active',
    join_date: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  // Live staff directory with search
  const { data: employees, isLoading: employeesLoading } = useEmployees(staffSearch);
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const staffData = useMemo(() => {
    let filtered = employees || [];
    if (filters.department) {
      filtered = filtered.filter(e => e.department === filters.department);
    }
    if (filters.status) {
      filtered = filtered.filter(e => (e.status || 'active').toLowerCase() === filters.status.toLowerCase());
    }
    return filtered.map((e) => ({
      id: e.id as unknown as number,
      name: `${e.first_name} ${e.last_name}`.trim(),
      jobTitle: e.position || '—',
      department: e.department || '—',
      location: '—',
      manager: '—',
      status: (e.status || 'active').replace(/\b\w/g, c => c.toUpperCase()),
      employee: e,
    }));
  }, [employees, filters]);

  // Live data from database
  const { data: volunteers, isLoading: volunteersLoading } = useVolunteers(volunteerSearch);
  const createVolunteer = useCreateVolunteer();
  const updateVolunteer = useUpdateVolunteer();
  const deleteVolunteer = useDeleteVolunteer();

  const volunteerData = useMemo(() => {
    let filtered = volunteers || [];

    // Apply filters
    if (volunteerFilters.status) {
      filtered = filtered.filter(v => v.status === volunteerFilters.status.toLowerCase());
    }
    if (volunteerFilters.skills) {
      filtered = filtered.filter(v =>
        v.skills?.some(skill => skill.toLowerCase().includes(volunteerFilters.skills.toLowerCase()))
      );
    }

    return filtered.map((v) => ({
      id: v.id as unknown as number,
      volunteer: v, // Store full volunteer object for editing
      name: `${v.first_name} ${v.last_name}`.trim(),
      skills: v.skills || [],
      availability: v.availability || [],
      assignments: v.assignments_count || 0,
      status: (v.status || 'active').replace(/\b\w/g, c => c.toUpperCase()),
    }));
  }, [volunteers, volunteerFilters]);

  // Legacy mock data removed - using live data above
  const volunteerData_OLD = [
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

  // Live board members from database
  const { data: boardMembers, isLoading: boardLoading } = useBoardMembers();
  const boardData = useMemo(() => {
    return (boardMembers || []).map((b) => {
      const tenureYears = b.tenure_years || 0;
      return {
        id: b.id as unknown as number,
        name: `${b.first_name} ${b.last_name}`.trim(),
        email: b.email,
        role: b.role,
        independence: b.independence || '—',
        tenure: tenureYears > 0 ? `${tenureYears} ${tenureYears === 1 ? 'year' : 'years'}` : '—',
        attendance: b.attendance_percentage ? `${b.attendance_percentage}%` : '—',
        compliance: (b.compliance_status || 'compliant').replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        status: (b.status || 'active').replace(/\b\w/g, c => c.toUpperCase()),
        boardData: b, // Store full record
      };
    });
  }, [boardMembers]);

  // Legacy mock data removed - using live data above
  const boardData_OLD = [
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

  // Live committees from database
  const { data: committees, isLoading: committeesLoading } = useCommittees();

  // We'll fetch committee members separately if needed, or use a query that joins
  // For now, we'll create a simplified version that shows committees without members detail
  const committeeData = useMemo(() => {
    return (committees || []).map((committee) => ({
      id: committee.id,
      name: committee.name,
      memberCount: 0, // TODO: Fetch actual member count when we have better data structure
      members: [] as any[], // Members will be populated when detail view opens
      committeeData: committee, // Store full record
    }));
  }, [committees]);

  // Legacy mock data removed - using live data above
  const committeeData_OLD = [
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
        return <Badge className="bg-muted text-muted-foreground">{status}</Badge>;
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
        return <Badge className="bg-muted text-muted-foreground">{compliance}</Badge>;
    }
  };

  const getIndependenceIcon = (independence: string) => {
    if (independence === 'Independent') {
      return <Diamond className="h-4 w-4 text-muted-foreground" />;
    } else {
      return <Users className="h-4 w-4 text-muted-foreground" />;
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
        <h1 className="text-2xl font-bold text-foreground">People management</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
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
                      value={staffSearch}
                      onChange={(e) => setStaffSearch(e.target.value)}
                      className="w-64 px-4 py-2 pl-10 pr-4 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2" onClick={() => setIsFilterOpen(true)}>
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2" onClick={() => setIsBulkOpen(true)}>
                    <Upload className="h-4 w-4" />
                    <span>Bulk upload</span>
                  </Button>
                  <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2" onClick={() => {
                    // Auto-generate employee ID
                    const existingIds = (employees || []).map(e => e.employee_id).filter(Boolean);
                    let nextNum = 1;
                    while (existingIds.includes(`EMP-${String(nextNum).padStart(4, '0')}`)) nextNum++;
                    const newId = `EMP-${String(nextNum).padStart(4, '0')}`;
                    setCreateForm({ employee_id: newId, first_name: '', last_name: '', email: '', department: '', position: '', employment_type: 'full-time', hire_date: '', status: 'active' });
                    setIsCreateOpen(true);
                  }}>
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
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Job title</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Department</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Manager</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeesLoading ? (
                      <tr><td className="py-6 px-4 text-muted-foreground" colSpan={8}>Loading…</td></tr>
                    ) : staffData.length === 0 ? (
                      <tr><td className="py-6 px-4 text-muted-foreground" colSpan={8}>No staff found.</td></tr>
                    ) : staffData.map((staff) => (
                      <tr key={staff.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedRows.includes(staff.id)}
                            onCheckedChange={(checked) => handleSelectRow(staff.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">{staff.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{staff.jobTitle}</td>
                        <td className="py-3 px-4 text-muted-foreground">{staff.department}</td>
                        <td className="py-3 px-4 text-muted-foreground">{staff.location}</td>
                        <td className="py-3 px-4 text-muted-foreground">{staff.manager}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(staff.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={() => navigate(`/dashboard/hr/staff-detail?employeeId=${staff.employee.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                    }
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing 1 to {staffData.length} of {staffData.length} staff directory lists
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
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={volunteerSearch}
                      onChange={(e) => setVolunteerSearch(e.target.value)}
                      className="w-64 pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => setIsVolunteerFilterOpen(true)}
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2"
                    onClick={() => setIsVolunteerBulkOpen(true)}
                  >
                    <Upload className="h-4 w-4" />
                    <span>Bulk upload</span>
                  </Button>
                  <Button
                    className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2"
                    onClick={() => {
                      setVolunteerForm({
                        first_name: '',
                        last_name: '',
                        email: '',
                        phone: '',
                        skills: [],
                        availability: [],
                        status: 'active',
                        join_date: ''
                      });
                      setIsVolunteerCreateOpen(true);
                    }}
                  >
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
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Skills</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Availability</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Assignments</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteerData.map((volunteer) => (
                      <tr key={volunteer.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedRows.includes(volunteer.id)}
                            onCheckedChange={(checked) => handleSelectRow(volunteer.id, checked as boolean)}
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-foreground">{volunteer.name}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {volunteer.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {volunteer.availability.map((availability, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-muted text-muted-foreground">
                                {availability}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{volunteer.assignments}</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(volunteer.status)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center space-x-1"
                              onClick={() => {
                                setSelectedVolunteer(volunteer.volunteer);
                                setIsVolunteerViewOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span>View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVolunteer(volunteer.volunteer);
                                setVolunteerForm({
                                  first_name: volunteer.volunteer.first_name || '',
                                  last_name: volunteer.volunteer.last_name || '',
                                  email: volunteer.volunteer.email || '',
                                  phone: volunteer.volunteer.phone || '',
                                  skills: volunteer.volunteer.skills || [],
                                  availability: volunteer.volunteer.availability || [],
                                  status: volunteer.volunteer.status || 'active',
                                  join_date: volunteer.volunteer.join_date || ''
                                });
                                setIsVolunteerEditOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${volunteer.name}?`)) {
                                  deleteVolunteer.mutate(volunteer.volunteer.id);
                                }
                              }}
                              disabled={deleteVolunteer.isPending}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {volunteersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">Loading volunteers...</p>
                </div>
              ) : volunteerData.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">No volunteers found</p>
                </div>
              ) : (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing 1 to {volunteerData.length} of {volunteerData.length} volunteer management lists
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
              )}
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
                      className="w-64 px-4 py-2 pl-10 pr-4 border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Member</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Independence</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Tenure</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Attendance</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Compliance</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardData.map((member) => (
                        <tr key={member.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={selectedRows.includes(member.id)}
                              onCheckedChange={(checked) => handleSelectRow(member.id, checked as boolean)}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-foreground">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{member.role}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              {getIndependenceIcon(member.independence)}
                              <span className="text-sm text-muted-foreground">{member.independence}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{member.tenure}</td>
                          <td className="py-3 px-4 text-muted-foreground">{member.attendance}</td>
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
                    <div key={member.id} className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        {/* Name */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Name</span>
                          <span className="text-sm font-medium text-foreground">{member.name}</span>
                        </div>

                        {/* Email */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Email</span>
                          <span className="text-sm text-muted-foreground">{member.email}</span>
                        </div>

                        {/* Independence */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Independence</span>
                          <div className="flex items-center space-x-2">
                            {getIndependenceIcon(member.independence)}
                            <span className="text-sm text-muted-foreground">{member.independence}</span>
                          </div>
                        </div>

                        {/* Tenure */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Tenure</span>
                          <span className="text-sm text-muted-foreground">{member.tenure}</span>
                        </div>

                        {/* Attendance */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Attendance</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div
                                className="bg-violet-600 h-2 rounded-full"
                                style={{ width: `${getAttendancePercentage(member.attendance)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground">{member.attendance}</span>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Status</span>
                          {getBoardStatusBadge(member.status)}
                        </div>

                        {/* Compliance */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Compliance</span>
                          {getComplianceBadge(member.compliance)}
                        </div>

                        {/* Action */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-muted-foreground">Action</span>
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
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <CardTitle className="text-lg font-semibold">
                                  {committee.name}
                                </CardTitle>
                                <span className="text-sm text-muted-foreground">
                                  {committee.memberCount} members
                                </span>
                              </div>
                              {expandedCommittees.has(committee.id) ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            {committee.members.length > 0 ? (
                              <div className="space-y-4">
                                {committee.members.map((member) => (
                                  <div key={member.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                                    {/* Member Avatar */}
                                    <div className="w-12 h-12 bg-violet-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                      {member.initials}
                                    </div>

                                    {/* Member Details */}
                                    <div className="flex-1 space-y-1">
                                      <div className="flex items-center space-x-4">
                                        <span className="font-medium text-foreground">{member.name}</span>
                                        <span className="text-sm text-muted-foreground">{member.role}</span>
                                        <div className="flex items-center space-x-1">
                                          {getIndependenceIcon(member.independence)}
                                          <span className="text-sm text-muted-foreground">{member.independence}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
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
                              <div className="text-center py-8 text-muted-foreground">
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
                <div className="text-sm text-muted-foreground">
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

      {/* Filter Modal */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Staff</DialogTitle>
            <DialogDescription>Filter staff by department and status</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select value={filters.department || 'all'} onValueChange={(v) => setFilters(prev => ({ ...prev, department: v === 'all' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="All departments" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All departments</SelectItem>
                  {[...new Set((employees || []).map(e => e.department).filter(Boolean))].length > 0 ? (
                    [...new Set((employees || []).map(e => e.department).filter(Boolean))].map(d => (
                      <SelectItem key={d} value={d || 'unknown'}>{d}</SelectItem>
                    ))
                  ) : null}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={filters.status || 'all'} onValueChange={(v) => setFilters(prev => ({ ...prev, status: v === 'all' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setFilters({ department: '', status: '' }); setIsFilterOpen(false); }}>Clear</Button>
            <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Employee Modal */}
      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (!open) {
          setShowNewDept(false);
          setShowNewPosition(false);
          setNewDept('');
          setNewPosition('');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>Create a new employee record in the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee ID *</Label>
                <Input value={createForm.employee_id || ''} onChange={(e) => setCreateForm(prev => ({ ...prev, employee_id: e.target.value }))} placeholder="EMP-0001" />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated, but can be customized</p>
              </div>
              <div>
                <Label>Hire Date</Label>
                <Input type="date" value={createForm.hire_date || ''} onChange={(e) => setCreateForm(prev => ({ ...prev, hire_date: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input value={createForm.first_name || ''} onChange={(e) => setCreateForm(prev => ({ ...prev, first_name: e.target.value }))} />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input value={createForm.last_name || ''} onChange={(e) => setCreateForm(prev => ({ ...prev, last_name: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={createForm.email || ''} onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                {!showNewDept ? (
                  <div className="space-y-2">
                    <Select value={createForm.department || ''} onValueChange={(v) => {
                      if (v === '__add_new__') {
                        setShowNewDept(true);
                      } else {
                        setCreateForm(prev => ({ ...prev, department: v }));
                      }
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select or add department" /></SelectTrigger>
                      <SelectContent>
                        {[...new Set((employees || []).map(e => e.department).filter(Boolean))].length > 0 ? (
                          [...new Set((employees || []).map(e => e.department).filter(Boolean))].map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))
                        ) : null}
                        <SelectItem value="__add_new__" className="font-medium text-violet-600">+ Add New Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input value={newDept} onChange={(e) => setNewDept(e.target.value)} placeholder="Enter new department name" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        if (newDept.trim()) {
                          setCreateForm(prev => ({ ...prev, department: newDept.trim() }));
                          setShowNewDept(false);
                          setNewDept('');
                        }
                      }}>Add</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowNewDept(false); setNewDept(''); }}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>Position</Label>
                {!showNewPosition ? (
                  <div className="space-y-2">
                    <Select value={createForm.position || ''} onValueChange={(v) => {
                      if (v === '__add_new__') {
                        setShowNewPosition(true);
                      } else {
                        setCreateForm(prev => ({ ...prev, position: v }));
                      }
                    }}>
                      <SelectTrigger><SelectValue placeholder="Select or add position" /></SelectTrigger>
                      <SelectContent>
                        {[...new Set((employees || []).map(e => e.position).filter(Boolean))].length > 0 ? (
                          [...new Set((employees || []).map(e => e.position).filter(Boolean))].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))
                        ) : null}
                        <SelectItem value="__add_new__" className="font-medium text-violet-600">+ Add New Position</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input value={newPosition} onChange={(e) => setNewPosition(e.target.value)} placeholder="Enter new position name" />
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        if (newPosition.trim()) {
                          setCreateForm(prev => ({ ...prev, position: newPosition.trim() }));
                          setShowNewPosition(false);
                          setNewPosition('');
                        }
                      }}>Add</Button>
                      <Button size="sm" variant="ghost" onClick={() => { setShowNewPosition(false); setNewPosition(''); }}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employment Type</Label>
                <Select value={createForm.employment_type || 'full-time'} onValueChange={(v) => setCreateForm(prev => ({ ...prev, employment_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={createForm.status || 'active'} onValueChange={(v) => setCreateForm(prev => ({ ...prev, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCreateOpen(false);
              setCreateForm({ employee_id: '', first_name: '', last_name: '', email: '', department: '', position: '', employment_type: 'full-time', hire_date: '', status: 'active' });
              setShowNewDept(false);
              setShowNewPosition(false);
              setNewDept('');
              setNewPosition('');
            }}>Cancel</Button>
            <Button onClick={() => {
              if (!createForm.employee_id || !createForm.first_name || !createForm.last_name) return;
              createEmployee.mutate(createForm as any, {
                onSuccess: () => {
                  setIsCreateOpen(false);
                  setCreateForm({ employee_id: '', first_name: '', last_name: '', email: '', department: '', position: '', employment_type: 'full-time', hire_date: '', status: 'active' });
                  setShowNewDept(false);
                  setShowNewPosition(false);
                  setNewDept('');
                  setNewPosition('');
                }
              });
            }} disabled={createEmployee.isPending || !createForm.employee_id || !createForm.first_name || !createForm.last_name}>
              {createEmployee.isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Modal */}
      <Dialog open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Staff</DialogTitle>
            <DialogDescription>Upload a CSV file to import multiple employees at once</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload a CSV file with columns: employee_id, first_name, last_name, email, department, position, employment_type, hire_date, status</p>
            <div>
              <Label>CSV File</Label>
              <Input type="file" accept=".csv" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const lines = text.split('\n').filter(l => l.trim());
                const headers = lines[0].split(',').map(h => h.trim());
                const rows = lines.slice(1).map(line => {
                  const values = line.split(',').map(v => v.trim());
                  const obj: any = {};
                  headers.forEach((h, i) => { obj[h] = values[i] || ''; });
                  return obj;
                });
                for (const row of rows) {
                  try {
                    await createEmployee.mutateAsync({
                      employee_id: row.employee_id || `EMP-${Date.now()}`,
                      first_name: row.first_name || '',
                      last_name: row.last_name || '',
                      email: row.email || undefined,
                      department: row.department || undefined,
                      position: row.position || undefined,
                      employment_type: row.employment_type || 'full-time',
                      hire_date: row.hire_date || undefined,
                      status: row.status || 'active',
                    } as any);
                  } catch (_) { }
                }
                setIsBulkOpen(false);
              }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Volunteer Filter Modal */}
      <Dialog open={isVolunteerFilterOpen} onOpenChange={setIsVolunteerFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Volunteers</DialogTitle>
            <DialogDescription>Filter volunteers by status and skills</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={volunteerFilters.status || 'all'} onValueChange={(v) => setVolunteerFilters(prev => ({ ...prev, status: v === 'all' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Skills (contains)</Label>
              <Input
                value={volunteerFilters.skills}
                onChange={(e) => setVolunteerFilters(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="Search by skill..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setVolunteerFilters({ status: '', skills: '' }); setIsVolunteerFilterOpen(false); }}>Clear</Button>
            <Button onClick={() => setIsVolunteerFilterOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Volunteer Modal */}
      <Dialog open={isVolunteerCreateOpen} onOpenChange={setIsVolunteerCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Volunteer</DialogTitle>
            <DialogDescription>Create a new volunteer record in the system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={volunteerForm.first_name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={volunteerForm.last_name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            <div>
              <Label>Join Date</Label>
              <Input
                type="date"
                value={volunteerForm.join_date}
                onChange={(e) => setVolunteerForm(prev => ({ ...prev, join_date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Skills</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill and press Add"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        e.preventDefault();
                        setVolunteerForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                        setNewSkill('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newSkill.trim()) {
                        setVolunteerForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                        setNewSkill('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {volunteerForm.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => setVolunteerForm(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Availability</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    placeholder="e.g., Weekends, Morning, Evening"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newAvailability.trim()) {
                        e.preventDefault();
                        setVolunteerForm(prev => ({ ...prev, availability: [...prev.availability, newAvailability.trim()] }));
                        setNewAvailability('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newAvailability.trim()) {
                        setVolunteerForm(prev => ({ ...prev, availability: [...prev.availability, newAvailability.trim()] }));
                        setNewAvailability('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {volunteerForm.availability.map((availability, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {availability}
                      <button
                        type="button"
                        onClick={() => setVolunteerForm(prev => ({ ...prev, availability: prev.availability.filter((_, i) => i !== index) }))}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={volunteerForm.status}
                onValueChange={(v) => setVolunteerForm(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVolunteerCreateOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!volunteerForm.first_name || !volunteerForm.last_name || createVolunteer.isPending) return;
                try {
                  await createVolunteer.mutateAsync({
                    first_name: volunteerForm.first_name,
                    last_name: volunteerForm.last_name,
                    email: volunteerForm.email || undefined,
                    phone: volunteerForm.phone || undefined,
                    skills: volunteerForm.skills.length > 0 ? volunteerForm.skills : undefined,
                    availability: volunteerForm.availability.length > 0 ? volunteerForm.availability : undefined,
                    status: volunteerForm.status,
                    join_date: volunteerForm.join_date || undefined,
                  });
                  setIsVolunteerCreateOpen(false);
                  setVolunteerForm({
                    first_name: '',
                    last_name: '',
                    email: '',
                    phone: '',
                    skills: [],
                    availability: [],
                    status: 'active',
                    join_date: ''
                  });
                } catch (_) { }
              }}
              disabled={createVolunteer.isPending || !volunteerForm.first_name || !volunteerForm.last_name}
            >
              {createVolunteer.isPending ? 'Creating…' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Volunteer Modal */}
      <Dialog open={isVolunteerEditOpen} onOpenChange={setIsVolunteerEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Volunteer</DialogTitle>
            <DialogDescription>Update volunteer information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={volunteerForm.first_name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={volunteerForm.last_name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  type="tel"
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Join Date</Label>
              <Input
                type="date"
                value={volunteerForm.join_date}
                onChange={(e) => setVolunteerForm(prev => ({ ...prev, join_date: e.target.value }))}
              />
            </div>
            <div>
              <Label>Skills</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Enter skill and press Add"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSkill.trim()) {
                        e.preventDefault();
                        setVolunteerForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                        setNewSkill('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newSkill.trim()) {
                        setVolunteerForm(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
                        setNewSkill('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {volunteerForm.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => setVolunteerForm(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }))}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Availability</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newAvailability}
                    onChange={(e) => setNewAvailability(e.target.value)}
                    placeholder="e.g., Weekends, Morning, Evening"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newAvailability.trim()) {
                        e.preventDefault();
                        setVolunteerForm(prev => ({ ...prev, availability: [...prev.availability, newAvailability.trim()] }));
                        setNewAvailability('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newAvailability.trim()) {
                        setVolunteerForm(prev => ({ ...prev, availability: [...prev.availability, newAvailability.trim()] }));
                        setNewAvailability('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {volunteerForm.availability.map((availability, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {availability}
                      <button
                        type="button"
                        onClick={() => setVolunteerForm(prev => ({ ...prev, availability: prev.availability.filter((_, i) => i !== index) }))}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={volunteerForm.status}
                onValueChange={(v) => setVolunteerForm(prev => ({ ...prev, status: v }))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVolunteerEditOpen(false)}>Cancel</Button>
            <Button
              onClick={async () => {
                if (!selectedVolunteer || !volunteerForm.first_name || !volunteerForm.last_name || updateVolunteer.isPending) return;
                try {
                  await updateVolunteer.mutateAsync({
                    id: selectedVolunteer.id,
                    updates: {
                      first_name: volunteerForm.first_name,
                      last_name: volunteerForm.last_name,
                      email: volunteerForm.email || undefined,
                      phone: volunteerForm.phone || undefined,
                      skills: volunteerForm.skills.length > 0 ? volunteerForm.skills : undefined,
                      availability: volunteerForm.availability.length > 0 ? volunteerForm.availability : undefined,
                      status: volunteerForm.status,
                      join_date: volunteerForm.join_date || undefined,
                    }
                  });
                  setIsVolunteerEditOpen(false);
                  setSelectedVolunteer(null);
                } catch (_) { }
              }}
              disabled={updateVolunteer.isPending || !volunteerForm.first_name || !volunteerForm.last_name}
            >
              {updateVolunteer.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Volunteers Modal */}
      <Dialog open={isVolunteerBulkOpen} onOpenChange={setIsVolunteerBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Volunteers</DialogTitle>
            <DialogDescription>Upload a CSV file to import multiple volunteers at once</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload a CSV file with columns: first_name, last_name, email, phone, skills (comma-separated), availability (comma-separated), status, join_date</p>
            <div>
              <Label>CSV File</Label>
              <Input type="file" accept=".csv" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const text = await file.text();
                const lines = text.split('\n').filter(l => l.trim());
                const headers = lines[0].split(',').map(h => h.trim());
                const rows = lines.slice(1).map(line => {
                  const values = line.split(',').map(v => v.trim());
                  const obj: any = {};
                  headers.forEach((h, i) => { obj[h] = values[i] || ''; });
                  return obj;
                });
                for (const row of rows) {
                  try {
                    await createVolunteer.mutateAsync({
                      first_name: row.first_name || '',
                      last_name: row.last_name || '',
                      email: row.email || undefined,
                      phone: row.phone || undefined,
                      skills: row.skills ? row.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
                      availability: row.availability ? row.availability.split(',').map((a: string) => a.trim()).filter(Boolean) : undefined,
                      status: row.status || 'active',
                      join_date: row.join_date || undefined,
                    });
                  } catch (_) { }
                }
                setIsVolunteerBulkOpen(false);
              }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVolunteerBulkOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Volunteer Modal */}
      <Dialog open={isVolunteerViewOpen} onOpenChange={setIsVolunteerViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Volunteer Details</DialogTitle>
            <DialogDescription>
              {selectedVolunteer ? `${selectedVolunteer.first_name} ${selectedVolunteer.last_name}` : ''}
            </DialogDescription>
          </DialogHeader>
          {selectedVolunteer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                  <p className="text-sm text-foreground mt-1">{selectedVolunteer.first_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                  <p className="text-sm text-foreground mt-1">{selectedVolunteer.last_name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm text-foreground mt-1">{selectedVolunteer.email || '—'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-sm text-foreground mt-1">{selectedVolunteer.phone || '—'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedVolunteer.status.replace(/\b\w/g, c => c.toUpperCase()))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                  <p className="text-sm text-foreground mt-1">
                    {selectedVolunteer.join_date ? new Date(selectedVolunteer.join_date).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Assignments</Label>
                  <p className="text-sm text-foreground mt-1">{selectedVolunteer.assignments_count || 0}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVolunteer.skills && selectedVolunteer.skills.length > 0 ? (
                    selectedVolunteer.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills listed</p>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Availability</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVolunteer.availability && selectedVolunteer.availability.length > 0 ? (
                    selectedVolunteer.availability.map((availability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {availability}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No availability listed</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVolunteerViewOpen(false)}>Close</Button>
            {selectedVolunteer && (
              <Button
                onClick={() => {
                  setIsVolunteerViewOpen(false);
                  setVolunteerForm({
                    first_name: selectedVolunteer.first_name || '',
                    last_name: selectedVolunteer.last_name || '',
                    email: selectedVolunteer.email || '',
                    phone: selectedVolunteer.phone || '',
                    skills: selectedVolunteer.skills || [],
                    availability: selectedVolunteer.availability || [],
                    status: selectedVolunteer.status || 'active',
                    join_date: selectedVolunteer.join_date || ''
                  });
                  setIsVolunteerEditOpen(true);
                }}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Edit Volunteer
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeopleManagement;
