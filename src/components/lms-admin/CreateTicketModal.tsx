import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  X,
  ChevronDown
} from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ticketData: TicketFormData) => void;
}

interface TicketFormData {
  subject: string;
  ngoName: string;
  priority: string;
}

const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    ngoName: '',
    priority: ''
  });
  const [showNgoDropdown, setShowNgoDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const ngoOptions = [
    'Acme Foundation',
    'Global Health Initiative',
    'Education First',
    'Community Development Corp',
    'Environmental Action Group',
    'Women Empowerment Network',
    'Youth Development Center'
  ];

  const priorityOptions = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ];

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNgoSelect = (ngo: string) => {
    setFormData(prev => ({
      ...prev,
      ngoName: ngo
    }));
    setShowNgoDropdown(false);
  };

  const handlePrioritySelect = (priority: string) => {
    setFormData(prev => ({
      ...prev,
      priority: priority
    }));
    setShowPriorityDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      subject: '',
      ngoName: '',
      priority: ''
    });
    onClose();
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      subject: '',
      ngoName: '',
      priority: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create new ticket</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
              Subject
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Enter ticket subject..."
              className="w-full"
              required
            />
          </div>

          {/* NGO Name Field */}
          <div className="space-y-2">
            <Label htmlFor="ngoName" className="text-sm font-medium text-gray-700">
              NGO name
            </Label>
            <div className="relative">
              <Input
                id="ngoName"
                value={formData.ngoName}
                onChange={(e) => handleInputChange('ngoName', e.target.value)}
                placeholder="Select NGO..."
                className="w-full pr-10"
                onClick={() => setShowNgoDropdown(!showNgoDropdown)}
                required
              />
              <ChevronDown 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                onClick={() => setShowNgoDropdown(!showNgoDropdown)}
              />
              
              {/* NGO Dropdown */}
              {showNgoDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {ngoOptions.map((ngo) => (
                    <div
                      key={ngo}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleNgoSelect(ngo)}
                    >
                      {ngo}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
              Priority
            </Label>
            <div className="relative">
              <Input
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                placeholder="Select priority..."
                className="w-full pr-10"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                required
              />
              <ChevronDown 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              />
              
              {/* Priority Dropdown */}
              {showPriorityDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {priorityOptions.map((priority) => (
                    <div
                      key={priority}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handlePrioritySelect(priority)}
                    >
                      {priority}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="px-6 bg-gray-900 hover:bg-gray-800"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketModal;
