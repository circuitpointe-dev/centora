import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Grid, List, Filter, Eye, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { useGrantCompliance } from '@/hooks/grants/useGrantCompliance';
import { useToast } from '@/hooks/use-toast';

export const ComplianceTable = () => {
  const { compliance, loading, sendReminder } = useGrantCompliance();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const itemsPerPage = 8;
  const { toast } = useToast();

  // Group compliance by grant for table display
  const grantCompliance = compliance.reduce((acc, item) => {
    const key = item.grant_id;
    if (!acc[key]) {
      acc[key] = {
        id: key,
        grantName: 'Sample Grant',
        organization: 'Sample Organization', 
        region: 'Sample Region',
        checklistItems: 0,
        met: 0,
        overdue: 0,
        pending: 0,
      };
    }
    acc[key].checklistItems++;
    if (item.status === 'completed') acc[key].met++;
    else if (item.status === 'overdue') acc[key].overdue++;
    else if (item.status === 'in_progress') acc[key].pending++;
    return acc;
  }, {} as Record<string, any>);

  const complianceData = Object.values(grantCompliance);

  const filteredCompliance = complianceData.filter(item => {
    const matchesSearch = 
      item.grantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = regionFilter === 'all' || item.region === regionFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'all-met') {
      matchesStatus = item.met === item.checklistItems;
    } else if (statusFilter === 'has-overdue') {
      matchesStatus = item.overdue > 0;
    } else if (statusFilter === 'has-pending') {
      matchesStatus = item.pending > 0;
    }
    
    return matchesSearch && matchesRegion && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCompliance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompliance = filteredCompliance.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIndicator = (item: any) => {
    if (item.overdue > 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (item.pending > 0) {
      return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
    }
    return <div className="w-2 h-2 bg-green-500 rounded-full" />;
  };

  const handleViewDetails = (itemId: string) => {
    toast({
      title: "View Compliance Details",
      description: "Compliance details would open here.",
    });
  };

  const handleSendReminder = async (itemId: string) => {
    await sendReminder(itemId);
  };

  const getActionButton = (item: any) => {
    if (item.overdue > 0 || item.pending > 0) {
      return (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleSendReminder(item.id)}
          >
            <Send className="h-4 w-4 mr-1" />
            Send Reminder
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleViewDetails(item.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      );
    } else {
      return (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => handleViewDetails(item.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>Loading compliance data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium">Compliance Monitor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search grant, organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-4 z-10 w-64">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Region</label>
                    <Select value={regionFilter} onValueChange={setRegionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        <SelectItem value="Northern Region">Northern Region</SelectItem>
                        <SelectItem value="Central Region">Central Region</SelectItem>
                        <SelectItem value="Eastern Region">Eastern Region</SelectItem>
                        <SelectItem value="Western Region">Western Region</SelectItem>
                        <SelectItem value="Southern Region">Southern Region</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="all-met">All Compliance Met</SelectItem>
                        <SelectItem value="has-overdue">Has Overdue Items</SelectItem>
                        <SelectItem value="has-pending">Has Pending Items</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setRegionFilter('all');
                      setStatusFilter('all');
                      setShowFilterDropdown(false);
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content - List or Grid View */}
      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grant Name</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Checklist Items</TableHead>
                  <TableHead>Met</TableHead>
                  <TableHead>Overdue</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCompliance.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {getStatusIndicator(item)}
                        <span>{item.grantName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.organization}</TableCell>
                    <TableCell>{item.region}</TableCell>
                    <TableCell>{item.checklistItems}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.met}
                      </span>
                    </TableCell>
                    <TableCell>
                      {item.overdue > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {item.overdue}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.pending > 0 ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {item.pending}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getActionButton(item)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCompliance.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Grant Name</span>
                  <div className="flex items-center space-x-2">
                    {getStatusIndicator(item)}
                    <span className="font-medium text-right">{item.grantName}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Organization</span>
                  <span className="font-medium text-right">{item.organization}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Region</span>
                  <span className="font-medium text-right">{item.region}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Checklist Items</span>
                  <span className="font-medium text-right">{item.checklistItems}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Met</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {item.met}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Overdue</span>
                  {item.overdue > 0 ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {item.overdue}
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending</span>
                  {item.pending > 0 ? (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {item.pending}
                    </span>
                  ) : (
                    <span className="text-gray-400">0</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Actions</span>
                  <div className="text-right">
                    {getActionButton(item)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCompliance.length)} of {filteredCompliance.length} grants
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};