import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDonorFundingCycles } from "@/hooks/useDonorFundingCycles";
import { formatCurrency } from "@/utils/donorFormatters";

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
];

interface ProfileInformationSectionProps {
  donor: any;
  isEditing: boolean;
  formData: any;
  setFormData: (data: any) => void;
}

export const ProfileInformationSection: React.FC<ProfileInformationSectionProps> = ({
  donor,
  isEditing,
  formData,
  setFormData,
}) => {
  const { data: fundingPeriods, isLoading: fundingPeriodsLoading } = useDonorFundingCycles(donor.id);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-gray-600">Organization</Label>
          {isEditing ? (
            <Input
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{donor.name}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Status</Label>
          <div className="mt-1">
            <Badge 
              variant={donor.status === 'active' ? 'default' : 'outline'}
              className="text-xs rounded-sm"
            >
              {donor.status === 'active' ? 'Active' : 'Potential'}
            </Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Preferred Currency</Label>
          {isEditing ? (
            <Select 
              value={formData.currency} 
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="mt-1 text-sm text-gray-900">{donor.currency || 'USD'}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Total Donations</Label>
          <p className="mt-1 text-sm text-gray-900">
            {formatCurrency(donor.total_donations || 0, donor.currency)}
          </p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Affiliation</Label>
          {isEditing ? (
            <Input
              value={formData.affiliation}
              onChange={(e) => handleInputChange('affiliation', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{donor.affiliation || 'Not provided'}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-600">Organization URL</Label>
          {isEditing ? (
            <Input
              value={formData.companyUrl}
              onChange={(e) => handleInputChange('companyUrl', e.target.value)}
              className="mt-1"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">
              {donor.organization_url ? (
                <a 
                  href={donor.organization_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  {donor.organization_url}
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          )}
        </div>
      </div>

      {/* Funding Periods Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-600">Funding Periods</Label>
        {fundingPeriodsLoading ? (
          <p className="text-sm text-gray-500">Loading funding periods...</p>
        ) : fundingPeriods && fundingPeriods.length > 0 ? (
          <div className="space-y-2">
            {fundingPeriods.map((period) => (
              <div key={period.id} className="p-3 bg-gray-50 rounded-md border">
                <div className="flex justify-between items-start">
                  <div>
                    {period.name && (
                      <p className="text-sm font-medium text-gray-900">{period.name}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {period.start_month}/{period.year} - {period.end_month}/{period.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No funding periods defined</p>
        )}
      </div>
    </div>
  );
};