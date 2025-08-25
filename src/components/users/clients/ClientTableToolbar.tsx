// src/components/users/clients/ClientTableToolbar.tsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Plus } from 'lucide-react';

interface Props {
  search: string;
  setSearch: (v: string) => void;
  onOpenAdd: () => void;
  onOpenFilter: () => void;
}

export const ClientTableToolbar: React.FC<Props> = ({ search, setSearch, onOpenAdd, onOpenFilter }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 w-full md:max-w-md">
        <h1 className="text-lg font-semibold tracking-tight shrink-0">Client Directory</h1>
        <Input
          placeholder="Search Clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onOpenFilter} className="border-purple-600 text-purple-600 hover:bg-purple-50">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button onClick={onOpenAdd} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>
    </div>
  );
};
