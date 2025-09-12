// src/components/users/UserTableToolbar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, RotateCcw } from "lucide-react";
import { AddUserDialog } from "@/components/users/users/AddUserDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type UserFilters = {
  status: "all" | "active" | "inactive" | "deactivated";
  department: "all" | string;
};

interface UserTableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddUser: () => void;

  // filters
  filters: UserFilters;
  onFiltersChange: (next: UserFilters) => void;
  departments?: string[];

  // NEW: one-click reset (clears search + filters)
  onResetAll?: () => void;
}

export const UserTableToolbar: React.FC<UserTableToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onAddUser,
  filters,
  onFiltersChange,
  departments = [],
  onResetAll,
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-small text-gray-900">User Directory</h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users, departments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-80 rounded-full border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Reset All */}
        <Button
          type="button"
          variant="outline"
          className="border-violet-300 text-violet-700 hover:bg-violet-50"
          onClick={() => {
            onResetAll?.();
            setOpen(false);
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>

        {/* Filter popover */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(v) => onFiltersChange({ ...filters, status: v as UserFilters["status"] })}
                >
                  <SelectTrigger className="w-full focus-visible:ring-violet-600 focus-visible:ring-offset-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Department</Label>
                <Select
                  value={filters.department}
                  onValueChange={(v) => onFiltersChange({ ...filters, department: v as UserFilters["department"] })}
                >
                  <SelectTrigger className="w-full focus-visible:ring-violet-600 focus-visible:ring-offset-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-violet-300 text-violet-700 hover:bg-violet-50"
                  onClick={() => {
                    onFiltersChange({ status: "all", department: "all" });
                    setOpen(false);
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  className="bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={() => setOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <AddUserDialog />
      </div>
    </div>
  );
};
