// src/components/roles/RoleRequestSuccess.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail } from "lucide-react";

type Payload = {
  full_name: string;
  email: string;
  requested_role_name: string;
  requested_modules: string[];
  message: string;
};

type Props = {
  payload: Payload;
  moduleNameById?: (id: string) => string;
  onClose: () => void;
  onCreateAnother: () => void;
};

export const RoleRequestSuccess: React.FC<Props> = ({
  payload,
  moduleNameById,
  onClose,
  onCreateAnother,
}) => {
  const modules =
    payload.requested_modules?.map((id) => moduleNameById?.(id) ?? id) ?? [];

  return (
    <div className="p-6 h-full w-full flex items-center justify-center">
      <Card className="max-w-2xl w-full shadow-xl border-brand-purple/20">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-brand-purple" />
          </div>
          <CardTitle className="text-2xl">Request sent to Centora</CardTitle>
          <p className="text-sm text-gray-600">
            Your message has been sent and will be reviewed by Centora. We’ll get
            back to you shortly at <span className="font-medium">{payload.email}</span>.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg bg-brand-purple/5 border border-brand-purple/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Requested role</div>
                <div className="font-medium">{payload.requested_role_name}</div>
              </div>
              <div>
                <div className="text-gray-500">Contact</div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 opacity-70" />
                  <span className="font-medium">{payload.full_name}</span>
                  <span className="text-gray-500">·</span>
                  <span>{payload.email}</span>
                </div>
              </div>
              {modules.length > 0 && (
                <div className="md:col-span-2">
                  <div className="text-gray-500">Modules (optional)</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {modules.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-md text-xs border border-brand-purple/30 bg-brand-purple/5"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {payload.message && (
                <div className="md:col-span-2">
                  <div className="text-gray-500">Message</div>
                  <p className="mt-1 whitespace-pre-wrap">{payload.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={onCreateAnother}
              className="hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
            >
              Submit another request
            </Button>
            <Button
              onClick={onClose}
              className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
            >
              Back to Roles
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
