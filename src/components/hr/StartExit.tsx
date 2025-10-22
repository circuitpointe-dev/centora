import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Calendar
} from 'lucide-react';

const StartExit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    personName: '',
    role: '',
    exitType: '',
    effectiveDate: '',
    reasons: [] as string[],
    additionalNotes: ''
  });

  const reasonOptions = [
    'Better offer',
    'Career growth',
    'Relocation',
    'Time conflict',
    'Health reasons',
    'Other',
    'Compensation',
    'Work-life balance',
    'Performance',
    'Program completion',
    'Retirement'
  ];

  const handleReasonChange = (reason: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        reasons: [...prev.reasons, reason]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        reasons: prev.reasons.filter(r => r !== reason)
      }));
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/hr/exits');
  };

  const handleCreateExit = () => {
    console.log('Creating exit case:', formData);
    // Here you would typically handle the exit creation logic
    // For now, we'll just log the data and navigate back
    navigate('/dashboard/hr/exits');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
        <span>Exit feedback / Start exit</span>
      </div>

      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Start exit</h1>
        <p className="text-gray-600">Create a new exit case for an employee or volunteer</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Person & Role Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Person name</label>
            <Select
              value={formData.personName}
              onValueChange={(value) => setFormData({ ...formData, personName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jane-doe">Jane Doe</SelectItem>
                <SelectItem value="john-smith">John Smith</SelectItem>
                <SelectItem value="alice-johnson">Alice Johnson</SelectItem>
                <SelectItem value="michael-brown">Michael Brown</SelectItem>
                <SelectItem value="emily-white">Emily White</SelectItem>
                <SelectItem value="david-green">David Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-engineer">Software Engineer</SelectItem>
                <SelectItem value="product-manager">Product Manager</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                <SelectItem value="hr-generalist">HR Generalist</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exit Type & Effective Date Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Exit type</label>
            <Select
              value={formData.exitType}
              onValueChange={(value) => setFormData({ ...formData, exitType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voluntary">Voluntary</SelectItem>
                <SelectItem value="involuntary">Involuntary</SelectItem>
                <SelectItem value="end-of-contract">End of contract</SelectItem>
                <SelectItem value="retirement">Retirement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Effective date</label>
            <div className="relative">
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700">Reason</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reasonOptions.map((reason) => (
              <div key={reason} className="flex items-center space-x-2">
                <Checkbox
                  id={reason}
                  checked={formData.reasons.includes(reason)}
                  onCheckedChange={(checked) => handleReasonChange(reason, checked as boolean)}
                />
                <label
                  htmlFor={reason}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {reason}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Additional notes</label>
          <Textarea
            placeholder="Add context or additional details..."
            value={formData.additionalNotes}
            onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            className="min-h-[100px] resize-none"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleCreateExit}
          className="bg-gray-900 hover:bg-gray-800"
        >
          Create exit case
        </Button>
      </div>
    </div>
  );
};

export default StartExit;