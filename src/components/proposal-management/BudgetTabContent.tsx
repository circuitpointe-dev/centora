
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  budgetCurrency: string;
  budgetAmount: string;
  onCurrencyChange: (value: string) => void;
  onAmountChange: (value: string) => void;
};

const currencyOptions = [
  { value: "NGN", label: "Nigerian Naira (₦)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
];

const BudgetTabContent: React.FC<Props> = ({
  budgetCurrency,
  budgetAmount,
  onCurrencyChange,
  onAmountChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="budget-currency">Budget Currency</Label>
        <Select value={budgetCurrency} onValueChange={onCurrencyChange}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="budget-amount">Budget Amount</Label>
        <Input
          id="budget-amount"
          type="number"
          value={budgetAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="Enter budget amount"
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default BudgetTabContent;
