import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface SalaryBenchmarkDetailProps {
  onBack?: () => void;
  onRunSimulation?: () => void;
}

const SalaryBenchmarkDetail: React.FC<SalaryBenchmarkDetailProps> = ({
  onBack,
  onRunSimulation
}) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
        <span>Salary benchmarking</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">Benchmark details</span>
      </div>

      {/* Main Content Cards */}
      <div className="space-y-6">
        {/* Market Data Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Market Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">25th Percentile</span>
                <span className="text-sm font-semibold text-gray-900">7.2m NGN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">50th Percentile (Median)</span>
                <span className="text-sm font-semibold text-gray-900">8.5m NGN</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">75th Percentile</span>
                <span className="text-sm font-semibold text-gray-900">9.8m NGN</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Internal Salary Band Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Internal Salary Band</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Band Range Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Band range</span>
                  <span className="text-sm text-gray-600">7.0m - 9.5m</span>
                </div>
                <div className="h-4 bg-gradient-to-r from-orange-200 via-green-200 to-blue-200 rounded-full"></div>
              </div>

              {/* Band Values */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Minimum</span>
                  <span className="text-sm font-semibold text-gray-900">7.0m NGN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Midpoint</span>
                  <span className="text-sm font-semibold text-gray-900">8.3m NGN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maximum</span>
                  <span className="text-sm font-semibold text-gray-900">9.5m NGN</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Band vs Market P50 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Band vs Market P50</span>
                  <Badge className="bg-green-600 text-white text-xs">
                    Within 3%
                  </Badge>
                </div>
                <div className="h-4 bg-gray-800 rounded-full"></div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600">
                Internal band aligns well with market median
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={onRunSimulation}
          className="bg-gray-900 hover:bg-gray-800"
        >
          Run stimulation
        </Button>
      </div>
    </div>
  );
};

export default SalaryBenchmarkDetail;
