import React from 'react';

const StepPricingPlan = ({ formData, onChange }: { 
  formData: any, 
  onChange: (field: string, value: any) => void 
}) => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$29/month',
      features: ['Up to 5 users', 'Core modules', 'Email support']
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '$99/month',
      features: ['Up to 20 users', 'All modules', 'Priority support']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited users', 'Custom integrations', 'Dedicated support']
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Choose your preferred pricing plan:</p>
      <div className="grid gap-2">
        {plans.map(plan => (
          <div
            key={plan.id}
            onClick={() => onChange('pricingPlan', plan.id)}
            className={`p-3 border rounded-md cursor-pointer transition-all ${
              formData.pricingPlan === plan.id
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-violet-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-medium">{plan.name}</h3>
              <span className="text-xs font-semibold text-violet-600">{plan.price}</span>
            </div>
            <ul className="mt-1 text-xs text-gray-600 space-y-0.5">
              {plan.features.map(feature => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepPricingPlan;
