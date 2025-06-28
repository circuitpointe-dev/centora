
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, User, Mail, Grid, ArrowLeft, ArrowRight, X } from 'lucide-react';

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
    { id: '1', name: '', email: '', order: 1 }
  ]);
  const [sequentialSigning, setSequentialSigning] = useState(true);

  const addRecipient = () => {
    const newRecipient: Recipient = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      email: '',
      order: recipients.length + 1
    };
    setRecipients([...recipients, newRecipient]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      const updatedRecipients = recipients
        .filter(r => r.id !== id)
        .map((r, index) => ({ ...r, order: index + 1 }));
      setRecipients(updatedRecipients);
    }
  };

  const updateRecipient = (id: string, field: 'name' | 'email', value: string) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const canProceed = recipients.every(r => r.name.trim() && r.email.trim());

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-[946px] mx-auto">
      <Card className="w-full shadow-[0px_4px_16px_#eae2fd] rounded-[5px]">
        <CardContent className="p-6 pt-6 pb-12">
          <div className="flex flex-col items-start gap-14">
            <div className="flex flex-col items-start gap-8 w-full">
              {/* Header Section */}
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="flex flex-col items-start gap-2 w-full max-w-[447px]">
                  <h2 className="text-lg font-medium text-[#383838] leading-[22.5px] [font-family:'Inter-Medium',Helvetica]">
                    Assign Recipients & Define Signing Order
                  </h2>
                  <p className="text-sm font-normal text-[#38383880] leading-[17.5px] [font-family:'Inter-Regular',Helvetica]">
                    Add signers and set the order in which they'll receive the document
                  </p>
                </div>

                <div className="flex items-end justify-between w-full mt-2">
                  <div className="text-sm font-normal leading-[17.5px] [font-family:'Inter-Regular',Helvetica]">
                    <span className="text-[#383838]">Recipients </span>
                    <span className="text-[#f42929]">(Required)</span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={addRecipient}
                    className="gap-2 px-4 py-3 h-auto border border-solid border-[#d9d9d9] rounded-[5px]"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium text-sm text-[#38383899] [font-family:'Inter-Medium',Helvetica]">
                      Add Recipients
                    </span>
                  </Button>
                </div>
              </div>

              {/* Recipients Forms */}
              <div className="flex flex-col gap-4 w-full">
                {recipients.map((recipient) => (
                  <div key={recipient.id} className="flex items-center gap-6 px-4 py-6 w-full bg-gray-50 rounded-[5px]">
                    <div className="flex w-[42px] items-center gap-2">
                      <Grid className="w-4 h-4" />
                      <span className="font-medium text-lg text-[#38383899] [font-family:'Inter-Medium',Helvetica]">
                        {recipient.order}
                      </span>
                    </div>

                    <div className="flex items-center gap-[34px] flex-1">
                      <div className="flex items-center w-[300px] h-[46px] relative">
                        <User className="absolute left-4 w-5 h-5 text-[#38383899]" />
                        <Input
                          value={recipient.name}
                          onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                          className="h-[46px] pl-10 [font-family:'Inter-Regular',Helvetica] text-sm text-[#38383899] border-[#d9d9d9]"
                          placeholder="Recipient Name"
                        />
                      </div>

                      <div className="flex items-center w-[300px] h-[46px] relative">
                        <Mail className="absolute left-4 w-5 h-5 text-[#38383899]" />
                        <Input
                          value={recipient.email}
                          onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                          className="h-[46px] pl-10 [font-family:'Inter-Regular',Helvetica] text-sm text-[#38383899] border-[#d9d9d9]"
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
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Signing Order Section */}
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="flex items-center justify-between w-full">
                <h3 className="font-medium text-lg text-[#383838] leading-[22.5px] [font-family:'Inter-Medium',Helvetica]">
                  Signing Order
                </h3>

                <div className="flex items-center gap-4">
                  <Switch
                    checked={sequentialSigning}
                    onCheckedChange={setSequentialSigning}
                    className="bg-violet-600 data-[state=checked]:bg-violet-600"
                  />
                  <span className="font-normal text-sm text-[#38383899] leading-[17.5px] [font-family:'Inter-Regular',Helvetica]">
                    Sequential Signing
                  </span>
                </div>
              </div>

              <p className="font-normal text-sm text-[#38383899] leading-[17.5px] [font-family:'Inter-Regular',Helvetica]">
                {sequentialSigning 
                  ? "Recipients will sign in the order specified above"
                  : "Recipients can sign in any order"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-[30px]">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-[114px] gap-1 pl-3 pr-6 py-3 h-auto border border-solid border-[#d9d9d9] rounded-[5px]"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="font-medium text-sm text-[#38383899] leading-[21px] [font-family:'Inter-Medium',Helvetica]">
            Back
          </span>
        </Button>

        <Button 
          onClick={onProceed}
          disabled={!canProceed}
          className={`gap-2.5 px-6 py-3 h-auto rounded-[5px] ${
            canProceed 
              ? 'bg-violet-600 hover:bg-violet-700' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <span className="font-medium text-sm text-white leading-[21px] [font-family:'Inter-Medium',Helvetica]">
            Proceed to Review
          </span>
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};
