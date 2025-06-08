
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountCurrencyData {
  amount: number;
  currency: string;
}

interface AmountCurrencySectionProps {
  formData: AmountCurrencyData;
  onInputChange: (field: string, value: string | number) => void;
}

export const AmountCurrencySection: React.FC<AmountCurrencySectionProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => onInputChange('amount', Number(e.target.value))}
          placeholder="0"
          min="0"
          required
        />
      </div>
      <div>
        <Label htmlFor="currency">Currency</Label>
        <select
          id="currency"
          value={formData.currency}
          onChange={(e) => onInputChange('currency', e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
        </select>
      </div>
    </div>
  );
};
