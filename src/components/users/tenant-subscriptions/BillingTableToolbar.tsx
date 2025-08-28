// src/components/users/tenants-subscriptions/BillingTableToolbar.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { BillingStatus, OrgType, PlanTier } from "./types";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  status: BillingStatus | "";
  onStatus: (v: BillingStatus | "") => void;
  plan: PlanTier | "";
  onPlan: (v: PlanTier | "") => void;
  type: OrgType | "";
  onType: (v: OrgType | "") => void;
}

export const BillingTableToolbar: React.FC<Props> = ({
  search,
  onSearch,
  status,
  onStatus,
  plan,
  onPlan,
  type,
  onType,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search…"
        className="h-9 w-[220px]"
      />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="h-9 border-purple-600 text-purple-600 hover:bg-purple-50 active:bg-purple-100"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-[380px]">
          <SheetHeader>
            <SheetTitle>Filter Tenants</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onStatus((e.target.value || "") as BillingStatus | "")
                }
              >
                <option value="">All</option>
                <option value="Active">Active</option>
                <option value="Pending Upgrade">Pending Upgrade</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plan</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={plan}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onPlan((e.target.value || "") as PlanTier | "")
                }
              >
                <option value="">All</option>
                <option value="Tier 1">Tier 1</option>
                <option value="Tier 2">Tier 2</option>
                <option value="Tier 3">Tier 3</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full rounded-md border px-3 py-2 text-sm"
                value={type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  onType((e.target.value || "") as OrgType | "")
                }
              >
                <option value="">All</option>
                <option value="NGO">NGO</option>
                <option value="Donor">Donor</option>
              </select>
            </div>

            <div className="pt-2">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
                onClick={() => {
                  onStatus("");
                  onPlan("");
                  onType("");
                  onSearch("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
