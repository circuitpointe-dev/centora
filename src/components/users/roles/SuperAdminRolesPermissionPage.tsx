// src/components/users/roles/SuperAdminRolesPermissionPage.tsx

import * as React from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Plus, Shield, Building2, Settings, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { CLIENT_ROLES_SEED, SYSTEM_ROLES_SEED, RoleMeta, RoleType } from "./types";
import { RoleMembersDialog } from "./RoleMembersDialog";
import { RolePermissionsDialog } from "./RolePermissionsDialog";
import { CreateOrEditRoleDialog } from "./CreateOrEditRoleDialog";

interface RoleCardProps {
  role: RoleMeta;
  onOpenMembers: (role: RoleMeta) => void;
  onOpenPermissions: (role: RoleMeta) => void;
  onRename: (role: RoleMeta) => void;
  onDelete?: (role: RoleMeta) => void; // optional (mock)
}

const RoleCard: React.FC<RoleCardProps> = ({ role, onOpenMembers, onOpenPermissions, onRename, onDelete }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-base">{role.name}</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onOpenPermissions(role)} aria-label="Open permissions">
            <Settings className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Role actions">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRename(role)}>Rename</DropdownMenuItem>
              {onDelete && <DropdownMenuItem onClick={() => onDelete(role)}>Delete (Mock)</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{role.members} Members</Badge>
        <Button variant="outline" size="sm" onClick={() => onOpenMembers(role)}>
          Edit
        </Button>
      </div>
    </CardContent>
  </Card>
);

export const SuperAdminRolesPermissionPage: React.FC = () => {
  // Local, editable mock state seeded from constants
  const [systemRoles, setSystemRoles] = useState<RoleMeta[]>(() => [...SYSTEM_ROLES_SEED]);
  const [clientRoles, setClientRoles] = useState<RoleMeta[]>(() => [...CLIENT_ROLES_SEED]);

  const [activeTab, setActiveTab] = useState<"system-roles" | "client-roles">("system-roles");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [membersOpen, setMembersOpen] = useState(false);
  const [permOpen, setPermOpen] = useState(false);
  const [upsertOpen, setUpsertOpen] = useState(false); // create or rename

  const [currentRole, setCurrentRole] = useState<RoleMeta | null>(null);
  const [editingRole, setEditingRole] = useState<RoleMeta | null>(null);

  const openMembers = (role: RoleMeta) => { setCurrentRole(role); setMembersOpen(true); };
  const openPermissions = (role: RoleMeta) => { setCurrentRole(role); setPermOpen(true); };

  const existingNamesByType = useMemo(() => ({
    system: systemRoles.map(r => r.name),
    client: clientRoles.map(r => r.name),
  }), [systemRoles, clientRoles]);

  const filteredSystemRoles = systemRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClientRoles = clientRoles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClick = () => {
    setEditingRole(null);
    setUpsertOpen(true);
  };

  const handleCreate = (role: RoleMeta) => {
    if (role.type === 'system') {
      setSystemRoles(prev => [role, ...prev]);
      setActiveTab('system-roles');
    } else {
      setClientRoles(prev => [role, ...prev]);
      setActiveTab('client-roles');
    }
  };

  const handleRename = (role: RoleMeta) => {
    setEditingRole(role);
    setUpsertOpen(true);
  };

  const handleUpdate = (role: RoleMeta) => {
    if (role.type === 'system') {
      setSystemRoles(prev => prev.map(r => (r.id === role.id ? role : r)));
    } else {
      setClientRoles(prev => prev.map(r => (r.id === role.id ? role : r)));
    }
  };

  const handleDeleteMock = (role: RoleMeta) => {
    if (role.type === 'system') {
      setSystemRoles(prev => prev.filter(r => r.id !== role.id));
    } else {
      setClientRoles(prev => prev.filter(r => r.id !== role.id));
    }
    toast.message(`Deleted "${role.name}" (mock).`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">System Roles & Permissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage System-Wide Roles, Client Organization Roles, And Permissions Across The Platform.
          </p>
        </div>
        <Button onClick={handleCreateClick} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Search */}
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
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
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

        {/* System Roles */}
        <TabsContent value="system-roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSystemRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onOpenMembers={openMembers}
                onOpenPermissions={openPermissions}
                onRename={handleRename}
                onDelete={handleDeleteMock}
              />
            ))}
          </div>
          {filteredSystemRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No system roles found matching your search.
            </div>
          )}
        </TabsContent>

        {/* Client Roles */}
        <TabsContent value="client-roles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClientRoles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onOpenMembers={openMembers}
                onOpenPermissions={openPermissions}
                onRename={handleRename}
                onDelete={handleDeleteMock}
              />
            ))}
          </div>
          {filteredClientRoles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No client roles found matching your search.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Members & Permissions */}
      <RoleMembersDialog
        open={membersOpen}
        onOpenChange={setMembersOpen}
        roleId={currentRole?.id ?? null}
        roleName={currentRole?.name ?? null}
      />
      <RolePermissionsDialog
        open={permOpen}
        onOpenChange={setPermOpen}
        roleId={currentRole?.id ?? null}
        roleName={currentRole?.name ?? null}
      />

      {/* Create / Rename */}
      <CreateOrEditRoleDialog
        open={upsertOpen}
        onOpenChange={setUpsertOpen}
        editingRole={editingRole}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        existingNamesByType={existingNamesByType as Record<RoleType, string[]>}
      />
    </div>
  );
};
