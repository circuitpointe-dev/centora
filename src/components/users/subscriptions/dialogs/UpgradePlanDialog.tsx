import * as React from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import type { Plan } from "./mock/subscriptions-data";

type Props = {
  plan: Plan;
  onClose: () => void;
  onSelect: (next: Plan) => void;
};

const PlanCard: React.FC<{
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  cta: string;
  current?: boolean;
  onClick?: () => void;
}> = ({ title, subtitle, price, features, cta, current, onClick }) => {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-sm p-5 flex flex-col justify-between
        ${current ? "ring-2 ring-brand-purple/60" : ""}
      `}
    >
      <div className="space-y-1.5">
        <div className="text-lg font-medium">{title}</div>
        <div className="text-xs text-gray-500">{subtitle}</div>
        <div className="text-2xl font-semibold mt-2">{price}</div>
        <ul className="mt-3 space-y-2 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" /> {f}
            </li>
          ))}
        </ul>
      </div>
      <Button
        disabled={current}
        onClick={onClick}
        className={`mt-5 ${current ? "bg-gray-100 text-gray-600" : "bg-brand-purple text-brand-purple-foreground hover:bg-brand-purple/90"}`}
      >
        {current ? "Current plan" : cta}
      </Button>
    </div>
  );
};

export const UpgradePlanDialog: React.FC<Props> = ({ plan, onClose, onSelect }) => {
  const [yearly, setYearly] = React.useState(plan.billingCycle === "yearly");

  return (
    <DialogContent className="sm:max-w-4xl">
      <DialogHeader>
        <DialogTitle className="text-center">Upgrade Your ERP Plan</DialogTitle>
        <DialogDescription className="text-center">
          Unlock more features, support and scale. Pick the next tier that fits your growing
          business.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-center gap-3 my-2">
        <span className={`text-sm ${!yearly ? "font-medium" : "text-gray-500"}`}>Monthly</span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span className={`text-sm ${yearly ? "font-medium" : "text-gray-500"}`}>Yearly</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PlanCard
          title="Tier 1 - Small Teams"
          subtitle="Up to 100 employees"
          price={yearly ? "$X/module /year" : "$X/module /month"}
          features={["2-10 modules", "Admin Panel Included", "Standard Support"]}
          cta="Switch to this plan"
          current={plan.tier === 1}
          onClick={() =>
            onSelect({
              ...plan,
              tier: 1,
              tierLabel: "Tier 1 - Small Teams",
              billingCycle: yearly ? "yearly" : "monthly",
            })
          }
        />
        <PlanCard
          title="Tier 2 - Growing Teams"
          subtitle="101 to 999 employees"
          price={yearly ? "$Y/module /year" : "$Y/module /month"}
          features={["2-10 modules", "Admin Panel Included", "Premium Support", "Onboarding Assistance"]}
          cta="Switch to this plan"
          current={plan.tier === 2}
          onClick={() =>
            onSelect({
              ...plan,
              tier: 2,
              tierLabel: "Tier 2 - Growing Teams",
              billingCycle: yearly ? "yearly" : "monthly",
            })
          }
        />
        <PlanCard
          title="Tier 3 - Enterprise & Branding"
          subtitle="1000+ employees or custom branding"
          price="Custom Pricing"
          features={[
            "All 10 Modules + Admin",
            "Full White Label",
            "24/7 Dedicated Support",
            "Custom Integrations",
          ]}
          cta="Talk to sales"
          current={plan.tier === 3}
          onClick={() =>
            onSelect({
              ...plan,
              tier: 3,
              tierLabel: "Tier 3 - Enterprise & Branding",
              billingCycle: yearly ? "yearly" : "monthly",
            })
          }
        />
      </div>
    </DialogContent>
  );
};
