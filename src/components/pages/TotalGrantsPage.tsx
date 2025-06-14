
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Award, DollarSign, Calendar, User } from 'lucide-react';

const TotalGrantsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const mockGrants = [
    {
      id: 1,
      title: 'Education Initiative Grant',
      grantee: 'ABC Foundation',
      amount: 150000,
      status: 'Active',
      startDate: '2024-01-15',
      endDate: '2025-01-14',
      category: 'Education'
    },
    {
      id: 2,
      title: 'Healthcare Access Program',
      grantee: 'Health Forward NGO',
      amount: 250000,
      status: 'Pending',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      category: 'Health'
    },
    {
      id: 3,
      title: 'Environmental Conservation Project',
      grantee: 'Green Earth Organization',
      amount: 75000,
      status: 'Closed',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      category: 'Environment'
    },
    {
      id: 4,
      title: 'Community Development Fund',
      grantee: 'Local Community Center',
      amount: 100000,
      status: 'Active',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      category: 'Community'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredGrants = selectedFilter === 'all' 
    ? mockGrants 
    : mockGrants.filter(grant => grant.status.toLowerCase() === selectedFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Total Grants
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and overview all grants in the system
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700">
            <Plus className="h-4 w-4" />
            <span>Add New Grant</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedFilter('all')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">All Grants</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGrants.length}</div>
            <p className="text-xs text-muted-foreground">Total in system</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedFilter('active')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Grants</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGrants.filter(g => g.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedFilter('pending')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grants</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGrants.filter(g => g.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedFilter('closed')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Grants</CardTitle>
            <Award className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGrants.filter(g => g.status === 'Closed').length}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Grants List */}
      <Card>
        <CardHeader>
          <CardTitle>Grants Overview</CardTitle>
          <CardDescription>
            {selectedFilter === 'all' ? 'All grants' : `${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} grants`} in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGrants.map((grant) => (
              <div key={grant.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{grant.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{grant.grantee}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>${grant.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{grant.startDate} - {grant.endDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(grant.status)}`}>
                    {grant.status}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TotalGrantsPage;
