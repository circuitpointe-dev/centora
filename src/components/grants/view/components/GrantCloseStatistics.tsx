
import React from 'react';
import { Shield, Banknote, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface GrantCloseStatisticsProps {
  complianceRate: number;
  disbursementRate: number;
  burnRate: number;
}

export const GrantCloseStatistics: React.FC<GrantCloseStatisticsProps> = ({
  complianceRate,
  disbursementRate,
  burnRate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-sm">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Compliance</p>
              <p className="text-xl font-medium text-gray-900">{complianceRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-sm">
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Disbursement Rate</p>
              <p className="text-xl font-medium text-gray-900">{disbursementRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-sm">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Burn Rate</p>
              <p className="text-xl font-medium text-gray-900">{burnRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
