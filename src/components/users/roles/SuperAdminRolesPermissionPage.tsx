import * as React from "react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Shield, Users, Building2, Settings } from "lucide-react";
import { modules as mockModules } from "@/components/users/roles/mock/roles-permission-data";
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
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({});
  
  const modulesWithFeatures = mockModules;
  const isLoading = false;
  const setUserAccess = async (_profileId: string, _accessMap: Record<string, any>) => {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  };

  // Transform modules and features into permissions structure
  const permissions = useMemo(() => {
    if (!modulesWithFeatures) return [];

    const ACTIONS = ["view", "create", "edit", "delete"] as const;
    const perms: Array<{ id: string; name: string; category: string }> = [];
    for (const module of modulesWithFeatures as Array<{ id: string; name: string; features: Array<{ id: string; name: string }> }>) {
      for (const feature of module.features) {
        for (const action of ACTIONS) {
          perms.push({
            id: `${module.id}.${feature.id}.${action}`,
            name: `${action} - ${feature.name}`,
            category: module.name,
          });
        }
      }
    }
    return perms;
  }, [modulesWithFeatures]);

  // Group permissions by category
  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    }, {} as Record<string, Array<{ id: string; name: string; category: string }>>);
  }, [permissions]);

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

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [permissionId]: checked
    }));
  };

  const handleUpdatePermissions = async () => {
    if (!selectedRole) return;
    
    try {
      await setUserAccess(selectedRole, rolePermissions);
      toast.success("Permissions updated successfully");
    } catch (error) {
      toast.error("Failed to update permissions");
      console.error(error);
    }
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system-roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            System Roles
          </TabsTrigger>
          <TabsTrigger value="client-roles" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Client Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Permissions
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

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading permissions...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Permissions List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {permissions.length > 0 ? (
                      Object.entries(groupedPermissions).map(([category, perms]) => (
                        <div key={category}>
                          <h4 className="font-medium text-sm text-muted-foreground mb-2">
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {perms.map((perm) => (
                              <div key={perm.id} className="flex items-center justify-between p-2 border rounded">
                                <span className="text-sm">{perm.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {perm.id}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No permissions available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Role Permission Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle>Role Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Select Role</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a role to configure" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="">Select Role</SelectItem>
                          {SYSTEM_ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                          {CLIENT_ROLES.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedRole && (
                      <div className="border rounded p-4">
                        <h4 className="font-medium mb-3">
                          Permissions for {
                            [...SYSTEM_ROLES, ...CLIENT_ROLES].find(r => r.id === selectedRole)?.name
                          }
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {permissions.map((perm) => (
                            <label key={perm.id} className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="rounded" 
                                checked={rolePermissions[perm.id] || false}
                                onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                              />
                              <span className="text-sm">{perm.name}</span>
                            </label>
                          ))}
                        </div>
                        <Button 
                          className="mt-4 bg-purple-600 hover:bg-purple-700" 
                          size="sm"
                          onClick={handleUpdatePermissions}
                        >
                          Update Permissions
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};