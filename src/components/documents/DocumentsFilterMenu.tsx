
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export interface DocumentTypeFilter {
  label: string;
  value: string;
}

interface DocumentsFilterMenuProps {
  filters: DocumentTypeFilter[];
  selected: DocumentTypeFilter;
  onSelect: (filter: DocumentTypeFilter) => void;
}

const DocumentsFilterMenu: React.FC<DocumentsFilterMenuProps> = ({
  filters,
  selected,
  onSelect,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center px-4 py-2 border border-gray-200 bg-white rounded-sm shadow-sm gap-2 text-sm text-gray-700 hover:bg-gray-50 transition"
        >
          {selected.label}
          <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white rounded-sm">
        {filters.map((filter) => (
          <DropdownMenuItem
            key={filter.value}
            onSelect={() => onSelect(filter)}
            className="text-gray-700 cursor-pointer text-sm rounded-sm"
          >
            {filter.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DocumentsFilterMenu;
