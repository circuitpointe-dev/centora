import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDonors } from '@/hooks/useDonors';
import { MONTH_NAMES } from '@/utils/monthConversion';

interface FundingCycleFormData {
  donor_id: string;
  name: string;
  status: 'ongoing' | 'upcoming' | 'closed';
  start_month: number;
  end_month: number;
  year: number;
  description: string;
  color: string;
}

interface FundingCycleFormProps {
  onSubmit: (data: FundingCycleFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const statusColors = {
  ongoing: '#10B981',
  upcoming: '#F59E0B',
  closed: '#6B7280'
};

export const FundingCycleForm: React.FC<FundingCycleFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const { data: donors = [] } = useDonors();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FundingCycleFormData>({
    defaultValues: {
      year: new Date().getFullYear(),
      start_month: 1,
      end_month: 12,
      status: 'upcoming',
      color: statusColors.upcoming
    }
  });

  const selectedStatus = watch('status');

  React.useEffect(() => {
    setValue('color', statusColors[selectedStatus]);
  }, [selectedStatus, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="donor_id">Donor *</Label>
        <Select onValueChange={(value) => setValue('donor_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a donor" />
          </SelectTrigger>
          <SelectContent>
            {donors.map((donor) => (
              <SelectItem key={donor.id} value={donor.id}>
                {donor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.donor_id && (
          <p className="text-sm text-red-500">Donor is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Funding Cycle Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="e.g., Q1 2025 Education Grant"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status *</Label>
        <Select onValueChange={(value: 'ongoing' | 'upcoming' | 'closed') => setValue('status', value)} defaultValue="upcoming">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_month">Start Month *</Label>
          <Select onValueChange={(value) => setValue('start_month', parseInt(value))} defaultValue="1">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((month, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_month">End Month *</Label>
          <Select onValueChange={(value) => setValue('end_month', parseInt(value))} defaultValue="12">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTH_NAMES.map((month, index) => (
                <SelectItem key={index + 1} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Year *</Label>
        <Input
          id="year"
          type="number"
          {...register('year', { 
            required: 'Year is required',
            min: { value: 2000, message: 'Year must be 2000 or later' },
            max: { value: 2100, message: 'Year must be 2100 or earlier' }
          })}
          placeholder="2025"
        />
        {errors.year && (
          <p className="text-sm text-red-500">{errors.year.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe the funding cycle..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Funding Cycle'}
        </Button>
      </div>
    </form>
  );
};
