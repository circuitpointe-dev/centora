import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NGOGrantDetailsSectionProps {
  grant: {
    id: string;
    grant_name: string;
    donor_name: string;
    status: string;
    amount: number;
    program_area?: string;
    next_report_due?: string;
  };
}

export const NGOGrantDetailsSection = ({ grant }: NGOGrantDetailsSectionProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Grant Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Grant Amount</p>
            <p className="text-base font-semibold text-green-600">${grant.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-base font-semibold">{grant.status}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Program Area</p>
          <p className="text-base">{grant.program_area || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Donor Organization</p>
          <p className="text-base">{grant.donor_name}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Grant Period</p>
          <p className="text-base">Jan 2025 - Dec 2025</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground">Next Report Due</p>
          <p className="text-base text-orange-600 font-medium">
            {grant.next_report_due ? new Date(grant.next_report_due).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};