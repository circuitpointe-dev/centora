import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface EscalateAcknowledgementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEscalation: () => void;
  onScheduleForLater: () => void;
  policy?: {
    policy: string;
    org: string;
    overdue: number;
  };
}

const EscalateAcknowledgementsModal: React.FC<EscalateAcknowledgementsModalProps> = ({
  isOpen,
  onClose,
  onSendEscalation,
  onScheduleForLater,
  policy
}) => {
  const [escalationNote, setEscalationNote] = useState('');
  const [ccManager, setCcManager] = useState(false);

  // Mock data for people with overdue acknowledgements
  const overduePeople = [
    {
      id: 1,
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      daysOverdue: 5
    },
    {
      id: 2,
      name: 'John Smith',
      email: 'john.smith@company.com',
      daysOverdue: 3
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      daysOverdue: 2
    }
  ];

  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-white/30" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Escalate Acknowledgements</h2>
            <p className="text-sm text-gray-600 mt-1">
              {policy.policy} • {policy.org}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* People with Overdue Acknowledgements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              People with Overdue Acknowledgements ({policy.overdue})
            </h3>
            <div className="space-y-3">
              {overduePeople.map((person) => (
                <div key={person.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{person.name}</h4>
                      <p className="text-sm text-gray-600">{person.email}</p>
                    </div>
                    <Badge variant="destructive" className="bg-red-600 text-white">
                      {person.daysOverdue}d
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation Note */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Escalation Note</h3>
            <Textarea
              placeholder="Add context for the escalation..."
              value={escalationNote}
              onChange={(e) => setEscalationNote(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* CC Manager Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cc-manager"
              checked={ccManager}
              onCheckedChange={(checked) => setCcManager(checked as boolean)}
            />
            <label htmlFor="cc-manager" className="text-sm font-medium text-gray-700">
              CC Manager (Sarah Johnson)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t bg-gray-50 space-x-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onScheduleForLater}
            variant="outline"
          >
            Schedule for later
          </Button>
          <Button 
            onClick={onSendEscalation}
            className="bg-gray-900 hover:bg-gray-800"
          >
            Send escalation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EscalateAcknowledgementsModal;
