import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Shield, Building2, Settings } from "lucide-react";
import { toast } from "sonner";

// Mock data for super admin roles
const SYSTEM_ROLES = [
  { id: 'super-admin', name: 'Super Admin', description: 'Full system access', members: 3 },
  { id: 'platform-admin', name: 'Platform Admin', description: 'Platform management', members: 8 },
  { id: 'support-admin', name: 'Support Admin', description: 'Customer support access', members: 12 },
  { id: 'billing-admin', name: 'Billing Admin', description: 'Billing and payments', members: 5 },
];

const CLIENT_ROLES = [
  { id: 'client-admin', name: 'Client Admin', description: 'Full client organization access', members: 45 },
  { id: 'client-user', name: 'Client User', description: 'Standard client user access', members: 234 },
  { id: 'client-viewer', name: 'Client Viewer', description: 'Read-only client access', members: 89 },
];


interface RoleCardProps {
  role: typeof SYSTEM_ROLES[0];
  onEdit: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-base">{role.name}</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{role.members} members</Badge>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const SuperAdminRolesPermissionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("system-roles");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSystemRoles = SYSTEM_ROLES.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClientRoles = CLIENT_ROLES.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = () => {
    toast.info("Create role functionality coming soon");
  };

  const handleEditRole = () => {
    toast.info("Edit role functionality coming soon");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-medium text-gray-900">System Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage system-wide roles, client organization roles, and permissions across the platform.
          </p>
        </div>
        <Button
          onClick={handleCreateRole}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system-roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            System Roles
          </TabsTrigger>
          <TabsTrigger value="client-roles" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Client Roles
          </TabsTrigger>
        </TabsList>

        {/* System Roles Tab */}
        <TabsContent value="system-roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSystemRoles.map((role) => (
              <RoleCard key={role.id} role={role} onEdit={handleEditRole} />
            ))}
          </div>
          {filteredSystemRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No system roles found matching your search.
            </div>
          )}
        </TabsContent>

        {/* Client Roles Tab */}
        <TabsContent value="client-roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientRoles.map((role) => (
              <RoleCard key={role.id} role={role} onEdit={handleEditRole} />
            ))}
          </div>
          {filteredClientRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No client roles found matching your search.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};