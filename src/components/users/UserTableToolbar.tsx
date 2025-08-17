import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';

interface UserTableToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddUser: () => void;
}

export const UserTableToolbar: React.FC<UserTableToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onAddUser,
}) => {
  const handleFilterClick = () => {
    // Placeholder for filter functionality
    console.log('Open filter panel');
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-900">User Directory</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users, departments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-80 rounded-full border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={handleFilterClick}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button onClick={onAddUser} className="bg-brand-purple hover:bg-brand-purple/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>
    </div>
  );
};