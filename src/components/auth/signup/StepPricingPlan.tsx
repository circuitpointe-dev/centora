import React from 'react';
import { Check } from 'lucide-react';

const StepPricingPlan = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const plans = [
    {
      id: 'basic',
      title: 'Tier 1 – Small Teams',
      subtitle: 'Up to 100 employees',
      price: '$X/module/month',
      cta: 'Choose Plan',
      features: ['2–10 Modules', 'Admin Panel included', 'Standard Support'],
      highlight: false,
    },
    {
      id: 'standard',
      title: 'Tier 2 – Growing Teams',
      subtitle: '101 to 999 employees',
      price: '$Y/module/month',
      cta: 'Choose Plan',
      features: ['2–10 Modules', 'Admin Panel included', 'Premium Support', 'Onboarding Assistance'],
      highlight: true,
    },
    {
      id: 'enterprise',
      title: 'Tier 3 – Enterprise & Branding',
      subtitle: '1000+ employees or custom branding',
      price: 'Custom Pricing',
      cta: 'Contact Sales',
      features: ['All 10 Modules + Admin', 'Full White Label', '24/7 Dedicated Support', 'Custom Integrations'],
      highlight: false,
    },
  ];

  const selected = formData.pricingPlan;

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">Choose your preferred pricing plan:</p>
      <div role="radiogroup" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isSelected = selected === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange('pricingPlan', plan.id)}
              className={
                `group text-left p-4 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-violet-500 ` +
                `${isSelected ? 'border-violet-500 shadow-md bg-violet-50/40' : 'border-gray-200 hover:border-violet-300 hover:shadow-sm'}`
              }
            >
              {plan.highlight && (
                <span className="inline-block mb-2 text-[10px] font-medium uppercase tracking-wider text-violet-700 bg-violet-100 px-2 py-0.5 rounded">
                  Recommended
                </span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{plan.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">{plan.subtitle}</p>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-violet-600" />
                )}
              </div>
              <div className="mt-3 text-gray-900 text-base font-semibold">{plan.price}</div>
              <ul className="mt-3 space-y-1 text-xs text-gray-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 mt-0.5 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-xs font-medium text-violet-700 group-hover:underline">
                {plan.cta}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepPricingPlan;
