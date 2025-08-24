import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown, Check, X, Search, Info } from "lucide-react";
import { modules as allModules } from "./mock/roles-permission-data";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (payload: {
    full_name: string;
    email: string;
    requested_role_name: string;
    requested_modules: string[];
    message: string;
  }) => void;
  currentUser?: { full_name?: string; email?: string };
  cooldownMs?: number; // default 30s
  lastSubmittedAt?: number | null;
};

export const CreateRoleRequestDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onSuccess,
  currentUser,
  cooldownMs = 30_000,
  lastSubmittedAt = null,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [requestedRole, setRequestedRole] = React.useState("");
  const [message, setMessage] = React.useState("");

  // modules dropdown state
  const [modulesOpen, setModulesOpen] = React.useState(false);
  const [moduleQuery, setModuleQuery] = React.useState("");
  const [selectedModuleIds, setSelectedModuleIds] = React.useState<string[]>([]);

  // live validation state
  const [touched, setTouched] = React.useState<{ [k: string]: boolean }>({});

  // prefill from "current user" when dialog opens
  React.useEffect(() => {
    if (open) {
      if (!fullName && currentUser?.full_name) setFullName(currentUser.full_name);
      if (!email && currentUser?.email) setEmail(currentUser.email);
    } else {
      // Dialog closed: reset "touched" state for clean UX next open
      setTouched({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const filteredModules = React.useMemo(() => {
    const q = moduleQuery.trim().toLowerCase();
    if (!q) return allModules;
    return allModules.filter((m) => m.name.toLowerCase().includes(q));
  }, [moduleQuery]);

  const toggleModule = (id: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearModule = (id: string) => {
    setSelectedModuleIds((prev) => prev.filter((x) => x !== id));
  };

  const reset = () => {
    setFullName("");
    setEmail("");
    setRequestedRole("");
    setMessage("");
    setSelectedModuleIds([]);
    setModuleQuery("");
  };

  const emailValid = /\S+@\S+\.\S+/.test(email.trim());
  const nameValid = fullName.trim().length > 1;
  const roleValid = requestedRole.trim().length > 1;
  const cooldownRemaining =
    lastSubmittedAt ? Math.max(0, cooldownMs - (Date.now() - lastSubmittedAt)) : 0;

  const canSubmit =
    !submitting && cooldownRemaining === 0 && nameValid && emailValid && roleValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      requested_role_name: requestedRole.trim(),
      requested_modules: selectedModuleIds,
      message: message.trim(),
    };

    onSuccess(payload);

    setSubmitting(false);
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Request a New Role</DialogTitle>
            <DialogDescription className="text-gray-600">
              Please fill out the form below to request assistance with setting up or managing your integration. Our team will respond within 48-72 business hours
            </DialogDescription>
          </DialogHeader>

          {/* Cooldown / spam guard notice */}
          {cooldownRemaining > 0 && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <Info className="h-4 w-4 mt-0.5" />
              <div className="text-sm">
                Please wait a moment before submitting another request. You can submit again in{" "}
                <span className="font-medium">
                  {Math.ceil(cooldownRemaining / 1000)}s
                </span>
                .
              </div>
            </div>
          )}

          {/* Two-column layout: form + live preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: form fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    aria-invalid={touched.fullName && !nameValid}
                    placeholder="Jane Doe"
                  />
                  {touched.fullName && !nameValid && (
                    <p className="text-xs text-rose-600" aria-live="polite">
                      Please enter your full name.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    aria-invalid={touched.email && !emailValid}
                    placeholder="you@organization.org"
                  />
                  {touched.email && !emailValid && (
                    <p className="text-xs text-rose-600" aria-live="polite">
                      Enter a valid email address.
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="roleName">Requested role name</Label>
                  <Input
                    id="roleName"
                    value={requestedRole}
                    onChange={(e) => setRequestedRole(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, requestedRole: true }))}
                    aria-invalid={touched.requestedRole && !roleValid}
                    placeholder="e.g. Field Auditor, Regional Finance Reviewer"
                  />
                  {touched.requestedRole && !roleValid && (
                    <p className="text-xs text-rose-600" aria-live="polite">
                      Please provide a role name.
                    </p>
                  )}
                </div>
              </div>

              {/* Modules selector (compact dropdown) */}
              <div className="space-y-2">
                <Label>Modules this role should apply to (optional)</Label>

                <Popover open={modulesOpen} onOpenChange={setModulesOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between hover:bg-brand-purple/5 hover:border-brand-purple"
                    >
                      <span className="truncate">
                        {selectedModuleIds.length > 0
                          ? `${selectedModuleIds.length} selected`
                          : "Select module(s)"}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-60" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                          value={moduleQuery}
                          onChange={(e) => setModuleQuery(e.target.value)}
                          placeholder="Search modules"
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <div className="max-h-60 overflow-auto py-1">
                      {filteredModules.map((m) => {
                        const active = selectedModuleIds.includes(m.id);
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => toggleModule(m.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm
                              hover:bg-brand-purple/5
                              ${active ? "bg-brand-purple/5" : ""}
                            `}
                          >
                            <span className="text-gray-900">{m.name}</span>
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-sm border
                                ${active ? "border-brand-purple bg-brand-purple text-brand-purple-foreground" : "border-gray-300 text-transparent"}
                              `}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedModuleIds.length > 0 && (
                      <div className="p-2 border-t">
                        <div className="flex flex-wrap gap-1.5">
                          {selectedModuleIds.map((id) => {
                            const name = allModules.find((m) => m.id === id)?.name ?? id;
                            return (
                              <Badge
                                key={id}
                                variant="outline"
                                className="text-xs border-brand-purple/30 bg-brand-purple/5"
                              >
                                {name}
                                <X
                                  className="ml-1 h-3 w-3 cursor-pointer"
                                  onClick={() => clearModule(id)}
                                />
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Explanatory message */}
              <div className="space-y-2">
                <Label htmlFor="message">Explanatory message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please briefly describe the business need for this role and the permissions it
                  should have. The Centora team will review your request."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            {/* Right: live preview */}
            <div className="space-y-3">
              <div className="rounded-lg border bg-white">
                <div className="border-b px-4 py-2 font-medium">Request preview</div>
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <div className="text-gray-500">Requested role</div>
                    <div className="font-medium">
                      {requestedRole || <span className="text-gray-400">Role name…</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Contact</div>
                    <div className="font-medium">
                      {fullName || <span className="text-gray-400">Full name…</span>}{" "}
                      <span className="text-gray-500">·</span>{" "}
                      {email || <span className="text-gray-400">email…</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Modules</div>
                    {selectedModuleIds.length === 0 ? (
                      <div className="text-gray-400">None selected</div>
                    ) : (
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {selectedModuleIds.map((id) => {
                          const name = allModules.find((m) => m.id === id)?.name ?? id;
                          return (
                            <span
                              key={id}
                              className="px-2 py-0.5 rounded-md text-[11px] border border-brand-purple/30 bg-brand-purple/5"
                            >
                              {name}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-500">Message</div>
                    <p className="mt-1 whitespace-pre-wrap">
                      {message || <span className="text-gray-400">Your explanation…</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Submitting will send this request to Centora for review. No changes are made to your
                account until it’s approved.
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="hover:bg-brand-purple hover:text-brand-purple-foreground hover:border-brand-purple"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"
            >
              {submitting ? "Submitting…" : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
