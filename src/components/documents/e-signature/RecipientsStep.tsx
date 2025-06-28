import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, User, Mail, Grid, ArrowLeft, ArrowRight, X } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  email: string;
  order: number;
}

interface RecipientsStepProps {
  onBack: () => void;
  onProceed: () => void;
}

export const RecipientsStep = ({ onBack, onProceed }: RecipientsStepProps) => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "1", name: "", email: "", order: 1 },
  ]);
  const [sequentialSigning, setSequentialSigning] = useState(true);

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

  const canProceed = recipients.every((r) => r.name.trim() && r.email.trim());

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[600px] mx-auto">
      <Card className="w-full shadow-[0px_4px_16px_#eae2fd] rounded-[5px]">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-8">
            <div className="flex flex-col items-start gap-1 w-full">
              {/* Header Section */}
              <div className="flex flex-col items-start gap-3 w-full">
                <div className="flex flex-col items-start gap-2 w-full max-w-[447px]">
                  <h2 className="text-md font-medium text-gray-900 leading-tight">
                    Assign Recipients & Define Signing Order
                  </h2>
                  <p className="text-sm font-normal text-gray-600 leading-relaxed">
                    Add signers and set the order in which they'll receive the
                    document
                  </p>
                </div>

                <div className="flex items-end justify-between w-full mt-1">
                  <div className="text-sm font-normal leading-relaxed">
                    <span className="text-gray-900">Recipients </span>
                    <span className="text-red-600">(Required)</span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={addRecipient}
                    className="gap-2 px-4 py-2 h-auto border border-gray-300 rounded-[5px] text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Recipients
                  </Button>
                </div>
              </div>

              {/* Recipients Forms */}
              <div className="flex flex-col gap-1 w-full">
                {recipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center gap-3 px-0 py-4 w-full"
                  >
                    <div className="flex w-8 items-center gap-1">
                      <Grid className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-base text-gray-600">
                        {recipient.order}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 flex-1">
                      <div className="flex items-center w-[230px] h-10 relative">
                        <User className="absolute left-3 w-4 h-4 text-gray-500" />
                        <Input
                          value={recipient.name}
                          onChange={(e) =>
                            updateRecipient(
                              recipient.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="h-10 pl-9 text-sm text-gray-700 border-gray-300 rounded-md"
                          placeholder="Recipient Name"
                        />
                      </div>

                      <div className="flex items-center w-[230px] h-10 relative">
                        <Mail className="absolute left-3 w-4 h-4 text-gray-500" />
                        <Input
                          value={recipient.email}
                          onChange={(e) =>
                            updateRecipient(
                              recipient.id,
                              "email",
                              e.target.value
                            )
                          }
                          className="h-10 pl-9 text-sm text-gray-700 border-gray-300 rounded-md"
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
                        className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Signing Order Section */}
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="flex items-center justify-between w-full">
                <h3 className="font-medium text-md text-gray-900 leading-tight">
                  Signing Order
                </h3>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={sequentialSigning}
                    onCheckedChange={setSequentialSigning}
                    className="bg-violet-600 data-[state=checked]:bg-violet-600"
                  />
                  <span className="font-normal text-sm text-gray-600 leading-relaxed">
                    Sequential Signing
                  </span>
                </div>
              </div>

              <p className="font-normal text-sm text-gray-600 leading-relaxed">
                {sequentialSigning
                  ? "Recipients will sign in the order specified above"
                  : "Recipients can sign in any order"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="gap-2 px-4 py-2 h-auto border border-gray-300 rounded-[5px] text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>

        <Button
          onClick={onProceed}
          disabled={!canProceed}
          className={`gap-2 px-6 py-2 h-auto rounded-[5px] text-sm font-medium ${
            canProceed
              ? "bg-violet-600 hover:bg-violet-700 text-white"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
        >
          Proceed to Review
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
