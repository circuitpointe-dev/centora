import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Loader2 } from 'lucide-react';
import { useOverdueEmployees } from '@/hooks/hr/useOverdueEmployees';

interface EscalateAcknowledgementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEscalation: () => void;
  onScheduleForLater: () => void;
  policy?: {
    policy: string;
    org: string;
    overdue: number;
    policy_id?: string;
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

  // Real data for people with overdue acknowledgements
  const { data: overdueEmployees = [], isLoading } = useOverdueEmployees(policy?.policy_id);

  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-card/30" />

      {/* Modal Content */}
      <div className="relative bg-card rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Escalate Acknowledgements</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {policy.policy} • {policy.org}
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* People with Overdue Acknowledgements */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              People with Overdue Acknowledgements ({isLoading ? '—' : overdueEmployees.length})
            </h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : overdueEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No overdue employees found for this policy.
              </div>
            ) : (
              <div className="space-y-3">
                {overdueEmployees.map((emp) => {
                  const fullName = `${emp.employee.first_name} ${emp.employee.last_name}`;
                  const email = emp.employee.email || '—';
                  return (
                    <div key={emp.employee_id} className="bg-card border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{fullName}</h4>
                          <p className="text-sm text-muted-foreground">{email}</p>
                        </div>
                        <Badge variant="destructive" className="bg-red-600 text-white">
                          {emp.daysOverdue}d
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Escalation Note */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Escalation Note</h3>
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
            <label htmlFor="cc-manager" className="text-sm font-medium text-muted-foreground">
              CC Manager (Sarah Johnson)
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t bg-muted/50 space-x-3">
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
            className="bg-foreground hover:bg-muted-foreground"
          >
            Send escalation
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EscalateAcknowledgementsModal;
