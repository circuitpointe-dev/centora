
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const subMenus = [
  { key: "all", label: "All Documents" },
  { key: "policies", label: "Policies" },
  { key: "finance", label: "Finance" },
  { key: "contracts", label: "Contracts" },
  { key: "me", label: "M & E" },
  { key: "uncategorized", label: "Uncategorized" },
];

interface DocumentsSubMenuProps {
  selected: string;
  onSelect: (key: string) => void;
}

export default function DocumentsSubMenu({
  selected,
  onSelect,
}: DocumentsSubMenuProps) {
  // For animation, use Tailwind transitions and animate class on menu open/close
  return (
    <div className="flex items-center gap-2 mt-2 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-sm border border-gray-300 transition-colors"
            type="button"
          >
            <span className="mr-2 font-medium text-gray-800">
              {
                subMenus.find((item) => item.key === selected)?.label ||
                "All Documents"
              }
            </span>
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="min-w-[180px] p-0 animate-fade-in"
          align="start"
        >
          {subMenus.map((item) => (
            <DropdownMenuItem
              key={item.key}
              className={cn(
                "cursor-pointer px-4 py-2 text-sm rounded-sm",
                selected === item.key
                  ? "bg-blue-50 text-blue-700 pointer-events-none"
                  : "hover:bg-gray-100"
              )}
              onSelect={() => onSelect(item.key)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
