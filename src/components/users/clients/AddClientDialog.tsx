// src/components/users/clients/AddClientDialog.tsx

import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModuleSelectGrid } from './ModuleSelectGrid';
import { PlanSelect } from './PlanSelect';
import type { Client, OrganizationType, PricingTier } from './types';
import { TIER_OPTIONS } from './mock/clients';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (client: Client) => void;
}

export const AddClientDialog: React.FC<Props> = ({ open, onOpenChange, onCreate }) => {
  const [step, setStep] = useState(1);

  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<OrganizationType>('NGO');
  const [currency, setCurrency] = useState('USD');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [password, setPassword] = useState(''); // mock only

  const [modules, setModules] = useState<string[]>(['User Management']);
  const [pricingTier, setPricingTier] = useState<PricingTier>('Tier 1');

  const canNext1 = useMemo(
    () => orgName && currency && contactName && contactEmail && contactPhone && password,
    [orgName, currency, contactName, contactEmail, contactPhone, password],
  );

  const reset = () => {
    setStep(1);
    setOrgName('');
    setOrgType('NGO');
    setCurrency('USD');
    setAddress('');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setPassword('');
    setModules(['User Management']);
    setPricingTier('Tier 1');
  };

  const handleCreate = () => {
    const newClient: Client = {
      id: `c_${Math.random().toString(36).slice(2, 7)}`,
      name: orgName,
      organizationType: orgType,
      primaryCurrency: currency,
      address,
      contactName,
      contactEmail,
      contactPhone,
      modules,
      requiredModules: ['User Management'],
      pricingTier,
      lastActiveAt: new Date().toISOString(),
      status: 'onboarding',
      usage: { storageGB: 0, users: 1 },
      customSettings: { assignedAdmins: [contactEmail] },
    };
    onCreate(newClient);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">Add New Client</DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-medium">Organization Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Organization Name</Label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div>
                <Label>Organization Type</Label>
                <Select value={orgType} onValueChange={(v) => setOrgType(v as OrganizationType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="Donor">Donor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Primary Currency</Label>
                <Input value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
              </div>
              <div>
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div>
                <Label>Contact Person's Name</Label>
                <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div>
                <Label>Contact Person's Email</Label>
                <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div>
                <Label>Contact Person's Phone</Label>
                <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
              </div>
              <div>
                <Label>Admin Password (Email/Password Login)</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-medium">Select Modules</h3>
            <ModuleSelectGrid value={modules} onChange={setModules} required={['User Management']} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-medium">Select Pricing Plan</h3>
            <PlanSelect value={pricingTier} onChange={(v) => setPricingTier(v)} />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 3 ? (
            <Button className="bg-purple-600 hover:bg-purple-700" disabled={step === 1 && !canNext1} onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleCreate}>
              Create Client
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
