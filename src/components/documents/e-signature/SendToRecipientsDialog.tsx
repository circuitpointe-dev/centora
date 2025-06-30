
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, User, Mail, Grid, X } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  email: string;
  order: number;
}

interface SendToRecipientsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (recipients: Recipient[], message: string) => void;
}

export const SendToRecipientsDialog = ({
  open,
  onOpenChange,
  onSend,
}: SendToRecipientsDialogProps) => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "1", name: "", email: "", order: 1 },
  ]);
  const [sequentialSigning, setSequentialSigning] = useState(true);
  const [showMessageSection, setShowMessageSection] = useState(false);
  const [message, setMessage] = useState("");

  const addRecipient = () => {
    const newRecipient: Recipient = {
      id: Math.random().toString(36).substr(2, 9),
      name: "",
      email: "",
      order: recipients.length + 1,
    };
    setRecipients([...recipients, newRecipient]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      const updatedRecipients = recipients
        .filter((r) => r.id !== id)
        .map((r, index) => ({ ...r, order: index + 1 }));
      setRecipients(updatedRecipients);
    }
  };

  const updateRecipient = (
    id: string,
    field: "name" | "email",
    value: string
  ) => {
    setRecipients(
      recipients.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const canSend = recipients.every((r) => r.name.trim() && r.email.trim());

  const handleSend = () => {
    if (canSend) {
      onSend(recipients, message);
      onOpenChange(false);
    }
  };

  const handleMessageCheckboxChange = (checked: boolean | "indeterminate") => {
    setShowMessageSection(checked === true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[5px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Send for Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Recipients Section */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Recipients <span className="text-red-600">(Required)</span>
                </h3>
                <p className="text-xs text-gray-600">
                  Add signers and set the order in which they'll receive the document
                </p>
              </div>
              <Button
                variant="outline"
                onClick={addRecipient}
                className="gap-1 px-3 py-1 h-auto border border-gray-300 rounded-[5px] text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
                Add Recipients
              </Button>
            </div>

            <div className="space-y-2">
              {recipients.map((recipient) => (
                <div
                  key={recipient.id}
                  className="flex items-center gap-2 py-2"
                >
                  <div className="flex w-6 items-center gap-1">
                    <Grid className="w-3 h-3 text-gray-500" />
                    <span className="font-medium text-sm text-gray-600">
                      {recipient.order}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center w-[200px] h-8 relative">
                      <User className="absolute left-2 w-3 h-3 text-gray-500" />
                      <Input
                        value={recipient.name}
                        onChange={(e) =>
                          updateRecipient(recipient.id, "name", e.target.value)
                        }
                        className="h-8 pl-7 text-xs text-gray-700 border-gray-300 rounded-[5px]"
                        placeholder="Recipient Name"
                      />
                    </div>

                    <div className="flex items-center w-[200px] h-8 relative">
                      <Mail className="absolute left-2 w-3 h-3 text-gray-500" />
                      <Input
                        value={recipient.email}
                        onChange={(e) =>
                          updateRecipient(recipient.id, "email", e.target.value)
                        }
                        className="h-8 pl-7 text-xs text-gray-700 border-gray-300 rounded-[5px]"
                        placeholder="Email Address"
                        type="email"
                      />
                    </div>
                  </div>

                  {recipients.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecipient(recipient.id)}
                      className="h-6 w-6 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Signing Order Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-gray-900">
                Signing Order
              </h3>
              <div className="flex items-center gap-2">
                <Switch
                  checked={sequentialSigning}
                  onCheckedChange={setSequentialSigning}
                  className="bg-violet-600 data-[state=checked]:bg-violet-600"
                />
                <span className="font-normal text-xs text-gray-600">
                  Sequential Signing
                </span>
              </div>
            </div>
            <p className="font-normal text-xs text-gray-600">
              {sequentialSigning
                ? "Recipients will sign in the order specified above"
                : "Recipients can sign in any order"}
            </p>
          </div>

          {/* Message Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="send-message"
                checked={showMessageSection}
                onCheckedChange={handleMessageCheckboxChange}
                className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
              />
              <label
                htmlFor="send-message"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Send message to recipients
              </label>
            </div>
            
            {showMessageSection && (
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px] bg-white rounded-[5px] shadow-sm border resize-none"
                placeholder="Add a message for your recipients..."
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 h-auto border border-gray-300 rounded-[5px] text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!canSend}
              className={`px-6 py-2 h-auto rounded-[5px] text-sm font-medium ${
                canSend
                  ? "bg-violet-600 hover:bg-violet-700 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              Send for Signature
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
