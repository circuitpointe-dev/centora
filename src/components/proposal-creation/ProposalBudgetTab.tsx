
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencies = [
  { value: "usd", label: "USD - United States Dollar" },
  { value: "eur", label: "EUR - Euro" },
  { value: "gbp", label: "GBP - British Pound" },
  { value: "ngn", label: "NGN - Nigerian Naira" },
  { value: "cad", label: "CAD - Canadian Dollar" },
  { value: "aud", label: "AUD - Australian Dollar" },
];

interface PrefilledData {
  source?: string;
  template?: any;
  proposal?: any;
  creationContext?: any;
}

interface ProposalBudgetTabProps {
  prefilledData?: PrefilledData;
}

const ProposalBudgetTab: React.FC<ProposalBudgetTabProps> = ({ prefilledData }) => {
  const [currency, setCurrency] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  // Pre-fill data when component mounts
  useEffect(() => {
    if (prefilledData) {
      const sourceData = prefilledData.template || prefilledData.proposal;
      if (sourceData) {
        setCurrency("usd");
        setBudgetAmount("250,000");
      }
    }
  }, [prefilledData]);

  const formatNumber = (value: string) => {
    const number = value.replace(/,/g, '');
    if (isNaN(Number(number))) return value;
    return Number(number).toLocaleString();
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value);
    setBudgetAmount(formatted);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="currency" className="text-sm font-medium">
            Budget Currency
          </Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="currency" className="mt-1">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  {curr.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="budgetAmount" className="text-sm font-medium">
            Budget Amount
          </Label>
          <Input
            id="budgetAmount"
            type="text"
            placeholder="12,345,678.00"
            value={budgetAmount}
            onChange={handleBudgetChange}
            className="mt-1 text-lg font-mono"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the total project budget amount
          </p>
        </div>

        {currency && budgetAmount && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">Budget Summary</h3>
            <p className="text-blue-700">
              <span className="font-semibold">
                {currencies.find(c => c.value === currency)?.label.split(' - ')[0]} {budgetAmount}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalBudgetTab;
