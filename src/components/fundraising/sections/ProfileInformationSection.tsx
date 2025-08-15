import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDonorFundingPeriods } from "@/hooks/useDonorFundingPeriods";
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
  const { data: fundingPeriods, isLoading: fundingPeriodsLoading } = useDonorFundingPeriods(donor.id);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {donor.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          <p className="text-sm text-gray-500">Organization details and key information</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            Organization
          </Label>
          {isEditing ? (
            <Input
              value={formData.organization}
              onChange={(e) => handleInputChange('organization', e.target.value)}
              className="focus:ring-violet-500 focus:border-violet-500"
            />
          ) : (
            <p className="text-gray-900 font-medium">{donor.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Status
          </Label>
          <div>
            <Badge 
              variant={donor.status === 'active' ? 'default' : 'outline'}
              className={`text-xs rounded-full px-3 py-1 ${
                donor.status === 'active' 
                  ? 'bg-green-100 text-green-800 border-green-200' 
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              }`}
            >
              {donor.status === 'active' ? 'Active' : 'Potential'}
            </Badge>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Preferred Currency
          </Label>
          {isEditing ? (
            <Select 
              value={formData.currency} 
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <SelectTrigger className="focus:ring-violet-500 focus:border-violet-500">
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
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                {donor.currency || 'USD'}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Total Donations
          </Label>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-emerald-800 font-semibold text-lg">
              {formatCurrency(donor.total_donations || 0, donor.currency)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Affiliation
          </Label>
          {isEditing ? (
            <Input
              value={formData.affiliation}
              onChange={(e) => handleInputChange('affiliation', e.target.value)}
              className="focus:ring-violet-500 focus:border-violet-500"
            />
          ) : (
            <p className="text-gray-900">{donor.affiliation || 'Not provided'}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            Organization URL
          </Label>
          {isEditing ? (
            <Input
              value={formData.companyUrl}
              onChange={(e) => handleInputChange('companyUrl', e.target.value)}
              className="focus:ring-violet-500 focus:border-violet-500"
              placeholder="https://example.com"
            />
          ) : (
            <div>
              {donor.organization_url ? (
                <a 
                  href={donor.organization_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  <span>Visit Website</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <span className="text-gray-500 italic">Not provided</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Funding Periods Section */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Funding Periods
        </Label>
        {fundingPeriodsLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="text-sm">Loading funding periods...</span>
          </div>
        ) : fundingPeriods && fundingPeriods.length > 0 ? (
          <div className="grid gap-3">
            {fundingPeriods.map((period) => (
              <div key={period.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    {period.name && (
                      <p className="font-medium text-purple-900">{period.name}</p>
                    )}
                    <p className="text-sm text-purple-700 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(period.start_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} - {new Date(period.end_date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No funding periods defined yet</p>
          </div>
        )}
      </div>
    </div>
  );
};