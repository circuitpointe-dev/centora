import React, { useState } from 'react';

interface WorkspaceFiltersPanelProps {
  onFiltersChange?: (filters: {
    sortBy: string;
  }) => void;
}

const WorkspaceFiltersPanel: React.FC<WorkspaceFiltersPanelProps> = ({ onFiltersChange }) => {
  const [selectedSort, setSelectedSort] = useState('recently-added');

  const sortOptions = [
    { value: 'recently-added', label: 'Recently added' },
    { value: 'a-z', label: 'A-Z' },
    { value: 'z-a', label: 'Z-A' },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-6">
      <h3 className="text-lg font-semibold text-card-foreground mb-6">Filters</h3>

      {/* Sort By Filter */}
      <div>
        <h4 className="font-medium text-card-foreground mb-3">Sort by</h4>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={selectedSort === option.value}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  onFiltersChange?.({
                    sortBy: e.target.value,
                  });
                }}
                className="h-4 w-4 text-primary focus:ring-primary border-border"
              />
              <span className="ml-3 text-sm text-card-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceFiltersPanel;
