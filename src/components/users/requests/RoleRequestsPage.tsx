// src/components/users/requests/RoleRequestsPage.tsx

import * as React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChevronsLeft, 
  ChevronsRight, 
  Filter, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import { useRoleRequests, useCreateRoleRequest, useApproveRoleRequest, useDeclineRoleRequest } from "@/hooks/useRoleRequests";
import { useAuth } from "@/contexts/AuthContext";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

const statusBadgeClass = (status: string) =>
  status === "accepted"
    ? "bg-emerald-100 text-emerald-900"
    : status === "rejected"
    ? "bg-rose-100 text-rose-900"
    : "bg-amber-100 text-amber-900";

const statusIcon = (status: string) => {
  if (status === "accepted") return <CheckCircle className="h-4 w-4" />;
  if (status === "rejected") return <XCircle className="h-4 w-4" />;
  return <Clock className="h-4 w-4" />;
};

export const RoleRequestPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const { user } = useAuth();
  
  // Get role requests from backend
  const { 
    data: requests = [], 
    isLoading,
    error 
  } = useRoleRequests({ 
    search, 
    status: status === "all" ? undefined : status, 
    page, 
    pageSize 
  });
  
  const createRoleRequest = useCreateRoleRequest();
  const approveRequest = useApproveRoleRequest();
  const declineRequest = useDeclineRoleRequest();

  // Handle quick role request for current user
  const handleQuickRequest = () => {
    if (!user) return;
    
    createRoleRequest.mutate({
      requested_role: "Additional Access",
      modules: [],
      message: "Requesting additional access permissions for my role."
    });
  };

  const handleApprove = (requestId: string) => {
    approveRequest.mutate({ 
      requestId, 
      roleIds: [] // Add specific role IDs as needed
    });
  };

  const handleDecline = (requestId: string) => {
    declineRequest.mutate({ 
      requestId, 
      reason: "Request declined by administrator"
    });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => 
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    );
  }, [requests, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const startIndex = (pageSafe - 1) * pageSize;
  const rows = filtered.slice(startIndex, startIndex + pageSize);

  if (isLoading) {
    return (
      <div className="p-6 space-y-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-red-600">Error loading role requests: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Role Requests</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage role access requests from team members.
          </p>
        </div>
        <Button
          onClick={handleQuickRequest}
          disabled={createRoleRequest.isPending}
          className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Request Access
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search requests..."
              className="pl-9 w-80"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StatusFilter)}
              className="h-9 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Role Access Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {search ? "No requests match your search." : "No role requests found."}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {rows.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {request.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Role Request
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Submitted: {new Date(request.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={statusBadgeClass(request.status)}>
                        <span className="flex items-center gap-1">
                          {statusIcon(request.status)}
                          {request.status}
                        </span>
                      </Badge>
                      
                      {request.status === "pending" && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(request.id)}
                            disabled={approveRequest.isPending}
                            className="text-emerald-600 hover:bg-emerald-50"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(request.id)}
                            disabled={declineRequest.isPending}
                            className="text-red-600 hover:bg-red-50"
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filtered.length)} of{" "}
                    {filtered.length} requests
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="px-3 py-1 text-sm">
                      {page} of {totalPages}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};