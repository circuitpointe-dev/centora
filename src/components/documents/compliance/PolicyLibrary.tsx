import React, { useState } from 'react';
import { Search, Grid2X2, List, Filter, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { PolicyCard } from './PolicyCard';
import { PolicyDetailDialog } from './PolicyDetailDialog';
import { usePolicyDocuments, useAcknowledgePolicy } from '@/hooks/usePolicyDocuments';
import { Loader2 } from 'lucide-react';

export const PolicyLibrary = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  
  // Fetch policies from backend
  const { data: policies, isLoading, error, refetch } = usePolicyDocuments({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    department: departmentFilter !== 'all' ? departmentFilter : undefined,
    search: searchQuery,
  });

  const acknowledgeMutation = useAcknowledgePolicy();

  const handleViewPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setIsDialogOpen(true);
  };

  const handleAcknowledgePolicy = async (policyId: string) => {
    try {
      await acknowledgeMutation.mutateAsync(policyId);
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Failed to acknowledge policy:', error);
    }
  };

  // Get unique departments from the policies
  const departments = React.useMemo(() => {
    if (!policies) return [];
    return Array.from(new Set(policies.map(policy => policy.department)));
  }, [policies]);

  const [filterOpen, setFilterOpen] = useState(false);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load policies</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {/* Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search policy library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                viewMode === 'grid' && "bg-muted"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 w-7 p-0",
                viewMode === 'list' && "bg-muted"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Button */}
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Policy Display */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : policies && policies.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={{
                  ...policy,
                  version: '1.0',
                  status: policy.status === 'active' ? 'Pending' : 'Acknowledged',
                  description: policy.description || '',
                  department: policy.department || '',
                  last_updated: policy.updated_at
                }}
                onViewPolicy={handleViewPolicy}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Policy Name</TableHead>
                  <TableHead className="font-semibold">Version</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{policy.title}</div>
                    </TableCell>
                    <TableCell className="text-gray-600">1.0</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(policy.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        policy.status === 'active' && 'bg-green-100 text-green-800 border-green-200',
                        policy.status === 'expired' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        policy.status === 'draft' && 'bg-red-100 text-red-800 border-red-200'
                      )}>
                        {policy.status === 'active' ? 'Active' : policy.status === 'expired' ? 'Expired' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <button 
                        className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 hover:underline font-medium"
                        onClick={() => handleViewPolicy(policy)}
                      >
                        <Eye className="h-4 w-4" />
                        View Policy
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No policies found matching your search.' : 'No policies available.'}
          </p>
        </div>
      )}

      {/* Policy Detail Dialog */}
      <PolicyDetailDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        policy={selectedPolicy}
        onAcknowledge={handleAcknowledgePolicy}
      />
    </div>
  );
};