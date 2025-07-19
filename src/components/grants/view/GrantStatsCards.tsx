import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GrantStatsCardsProps {
  disbursementRate: number;
  complianceRate: number;
  burnRate: number;
  disbursedFunds: string;
  spentFunds: string;
}

export const GrantStatsCards: React.FC<GrantStatsCardsProps> = ({
  disbursementRate,
  complianceRate,
  burnRate,
  disbursedFunds,
  spentFunds
}) => {
  const CircularProgress: React.FC<{ value: number; size?: number }> = ({ value, size = 80 }) => (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          stroke="rgb(229, 231, 235)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 8) / 2}
          stroke="rgb(139, 92, 246)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${2 * Math.PI * ((size - 8) / 2)}`}
          strokeDashoffset={`${2 * Math.PI * ((size - 8) / 2) * (1 - value / 100)}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-violet-600">{value}%</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card className="rounded-sm">
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <h3 className="text-sm font-medium text-gray-600">Disbursement Rate (%)</h3>
          <CircularProgress value={disbursementRate} />
          <div className="text-xs text-gray-500 text-center">
            <div>Disbursed Funds - {disbursedFunds}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-sm">
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <h3 className="text-sm font-medium text-gray-600">Compliance (%)</h3>
          <CircularProgress value={complianceRate} />
        </CardContent>
      </Card>

      <Card className="rounded-sm">
        <CardContent className="p-6 flex flex-col items-center space-y-4">
          <h3 className="text-sm font-medium text-gray-600">Burn rate</h3>
          <CircularProgress value={burnRate} />
          <div className="text-xs text-gray-500 text-center">
            <div>Spent Funds - {spentFunds}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};