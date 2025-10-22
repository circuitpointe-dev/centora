import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  X
} from 'lucide-react';

interface ScheduleExitInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleExitInterviewModal = ({ isOpen, onClose }: ScheduleExitInterviewModalProps) => {
  const [formData, setFormData] = useState({
    exitCase: '',
    date: '',
    time: '',
    interviewers: '',
    location: ''
  });

  const handleSubmit = () => {
    console.log('Scheduling interview:', formData);
    // Here you would typically handle the interview scheduling logic
    onClose();
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      exitCase: '',
      date: '',
      time: '',
      interviewers: '',
      location: ''
    });
    onClose();
  };

  // Mock data for exit cases
  const exitCases = [
    { value: 'EX-1042', label: 'EX-1042 - Jane Doe (Software Engineer II)' },
    { value: 'EX-1038', label: 'EX-1038 - Sarah Williams (Marketing Lead)' },
    { value: 'EX-1040', label: 'EX-1040 - Sarah Williams (Volunteer Coordinator)' },
    { value: 'EX-1039', label: 'EX-1039 - Sarah Williams (Product Designer)' }
  ];

  // Mock data for locations
  const locations = [
    { value: 'conference-room-a', label: 'Conference Room A' },
    { value: 'conference-room-b', label: 'Conference Room B' },
    { value: 'meeting-room-1', label: 'Meeting Room 1' },
    { value: 'virtual-meeting', label: 'Virtual Meeting' },
    { value: 'office-hr', label: 'HR Office' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div 
        className="fixed inset-0 backdrop-blur-md bg-background/30"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-card rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Schedule Exit Interview</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Plan an exit interview for a departing employee or volunteer
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Exit Case Field */}
          <div className="space-y-2">
            <Label htmlFor="exit-case" className="text-sm font-medium text-muted-foreground">
              Exit case
            </Label>
            <Select
              value={formData.exitCase}
              onValueChange={(value) => setFormData({ ...formData, exitCase: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select exit case" />
              </SelectTrigger>
              <SelectContent>
                {exitCases.map((exitCase) => (
                  <SelectItem key={exitCase.value} value={exitCase.value}>
                    {exitCase.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium text-muted-foreground">
              Date
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>

          {/* Time Field */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-medium text-muted-foreground">
              Time
            </Label>
            <div className="relative">
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="pr-10"
              />
              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
          </div>

          {/* Interviewers Field */}
          <div className="space-y-2">
            <Label htmlFor="interviewers" className="text-sm font-medium text-muted-foreground">
              Interviewers
            </Label>
            <Input
              id="interviewers"
              placeholder="Enter interviewer names"
              value={formData.interviewers}
              onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
            />
          </div>

          {/* Location Field */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-muted-foreground">
              Location
            </Label>
            <Select
              value={formData.location}
              onValueChange={(value) => setFormData({ ...formData, location: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-muted">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-foreground hover:bg-muted-foreground"
          >
            Schedule interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleExitInterviewModal;
