import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Filter,
  Upload,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PeopleManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('staff-directory');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      const currentData = activeTab === 'staff-directory' ? staffData : volunteerData;
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
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Board Management</h3>
            <p className="text-gray-500">This section is coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeopleManagement;
