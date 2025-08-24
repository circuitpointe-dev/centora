// src/components/users/subscriptions/CardDetailsDialog.tsx

import * as React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type CardInfo = {
  cardholder: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  updatedAt: string;
};

type Props = {
  defaultCard: CardInfo;
  onSave: (next: CardInfo) => void;
  onClose: () => void;
};

export const CardDetailsDialog: React.FC<Props> = ({ defaultCard, onSave, onClose }) => {
  const [cardholder, setCardholder] = React.useState(defaultCard.cardholder);
  const [number, setNumber] = React.useState("4242 4242 4242 4242");
  const [exp, setExp] = React.useState(`${defaultCard.expMonth}/${defaultCard.expYear}`);
  const [cvc, setCvc] = React.useState("123");
  const [brand, setBrand] = React.useState(defaultCard.brand);

  const handleSave = () => {
    const [mm, yy] = exp.split("/");
    onSave({
      cardholder,
      brand,
      last4: number.replace(" ", "").slice(-4),
      expMonth: parseInt(mm || "1", 10),
      expYear: parseInt(yy || "2030", 10),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Update card</DialogTitle>
        <DialogDescription>Change the default payment method for your subscription.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label>Cardholder name</Label>
          <Input value={cardholder} onChange={(e) => setCardholder(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Card number</Label>
          <Input value={number} onChange={(e) => setNumber(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Expiry (MM/YYYY)</Label>
            <Input value={exp} onChange={(e) => setExp(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>CVC</Label>
            <Input value={cvc} onChange={(e) => setCvc(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Brand</Label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
