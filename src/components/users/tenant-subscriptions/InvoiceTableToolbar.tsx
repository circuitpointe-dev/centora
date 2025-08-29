// src/components/users/tenants-subscriptions/InvoiceTableToolbar.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { InvoiceStatus } from "./types";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  status: InvoiceStatus | "";
  onStatus: (v: InvoiceStatus | "") => void;
}

export const InvoiceTableToolbar: React.FC<Props> = ({
  search,
  onSearch,
  status,
  onStatus,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search by invoice ID or tenant…"
        className="h-9 w-[260px]"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onStatus("")}>All</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatus("Paid")}>Paid</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatus("Pending")}>Pending</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatus("Failed")}>Failed</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onStatus("Overdue")}>Overdue</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              onStatus("");
              onSearch("");
            }}
          >
            Clear Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
