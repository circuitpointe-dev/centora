import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react';

interface SalarySimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}

const SalarySimulationModal: React.FC<SalarySimulationModalProps> = ({
  isOpen,
  onClose,
  onApprove
}) => {
  const [currentSalary, setCurrentSalary] = useState(7425000);
  const [proposedSalary, setProposedSalary] = useState(8250000);

  const handleSalaryChange = (type: 'current' | 'proposed', value: number) => {
    if (type === 'current') {
      setCurrentSalary(value);
    } else {
      setProposedSalary(value);
    }
  };

  const calculateCompaRatio = (salary: number) => {
    const bandMid = 8250000; // Mid-point of 7.0m - 9.5m band
    return (salary / bandMid).toFixed(2);
  };

  const calculateMarketPercentile = (salary: number) => {
    // Simplified calculation - in real app this would be based on market data
    const min = 7000000;
    const max = 9500000;
    const percentile = Math.round(((salary - min) / (max - min)) * 100);
    return `~${percentile}th`;
  };

  const calculateIncrease = () => {
    const increase = proposedSalary - currentSalary;
    const percentage = ((increase / currentSalary) * 100).toFixed(1);
    return { amount: increase, percentage };
  };

  const getPositionInBand = (salary: number) => {
    const min = 7000000;
    const max = 9500000;
    const position = ((salary - min) / (max - min)) * 100;
    return Math.round(position);
  };

  const getCompetitivePositioning = (salary: number) => {
    const marketMedian = 8500000;
    if (salary < marketMedian) return 'Below market median';
    if (salary > marketMedian) return 'Above market median';
    return 'At market median';
  };

  const increase = calculateIncrease();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-white/30" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Salary Simulation</h2>
            <p className="text-sm text-gray-600 mt-1">
              Compare current and proposed compensation against market and internal bands
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Employee Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Employee</label>
              <Input value="John Doe" readOnly className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role & Level</label>
              <Input value="SE II (L5)" readOnly className="bg-gray-50" />
            </div>
          </div>

          {/* Current Compensation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Current compensation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current salary</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={currentSalary.toLocaleString()}
                    onChange={(e) => handleSalaryChange('current', parseInt(e.target.value.replace(/,/g, '')) || 0)}
                    className="pr-8"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                    <button
                      onClick={() => handleSalaryChange('current', currentSalary + 100000)}
                      className="h-3 w-3 flex items-center justify-center hover:bg-gray-200 rounded"
                    >
                      <ChevronUp className="h-2 w-2" />
                    </button>
                    <button
                      onClick={() => handleSalaryChange('current', Math.max(0, currentSalary - 100000))}
                      className="h-3 w-3 flex items-center justify-center hover:bg-gray-200 rounded"
                    >
                      <ChevronDown className="h-2 w-2" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Compa-Ratio</label>
                <Input value={calculateCompaRatio(currentSalary)} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Market percentile</label>
                <Input value={calculateMarketPercentile(currentSalary)} readOnly className="bg-gray-50" />
              </div>
            </div>

            {/* Current Position Bar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Current Position</label>
              <div className="relative">
                <div className="h-4 bg-gradient-to-r from-orange-200 via-green-200 to-blue-200 rounded-full">
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-black rounded-full"
                    style={{
                      left: `${getPositionInBand(currentSalary)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>7.0m</span>
                  <span>9.5m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposed Compensation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Proposed compensation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Proposed salary</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={proposedSalary.toLocaleString()}
                    onChange={(e) => handleSalaryChange('proposed', parseInt(e.target.value.replace(/,/g, '')) || 0)}
                    className="pr-8"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                    <button
                      onClick={() => handleSalaryChange('proposed', proposedSalary + 100000)}
                      className="h-3 w-3 flex items-center justify-center hover:bg-gray-200 rounded"
                    >
                      <ChevronUp className="h-2 w-2" />
                    </button>
                    <button
                      onClick={() => handleSalaryChange('proposed', Math.max(0, proposedSalary - 100000))}
                      className="h-3 w-3 flex items-center justify-center hover:bg-gray-200 rounded"
                    >
                      <ChevronDown className="h-2 w-2" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Compa-Ratio</label>
                <Input value={calculateCompaRatio(proposedSalary)} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Market percentile</label>
                <Input value={calculateMarketPercentile(proposedSalary)} readOnly className="bg-gray-50" />
              </div>
            </div>

            {/* Proposed Position Bar */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Proposed Position</label>
              <div className="relative">
                <div className="h-4 bg-gradient-to-r from-orange-200 via-green-200 to-blue-200 rounded-full">
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-black rounded-full"
                    style={{
                      left: `${getPositionInBand(proposedSalary)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>7.0m</span>
                  <span>9.5m</span>
                </div>
                <div className="flex justify-center mt-2">
                  <Badge className="bg-gray-900 text-white text-xs">
                    At Band
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Analysis */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Impact Analysis</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">
                    <strong>Increase:</strong> {increase.amount.toLocaleString()} NGN ({increase.percentage}%)
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">
                    <strong>Position in band:</strong> {getPositionInBand(proposedSalary)}%
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mr-3"></span>
                  <span className="text-gray-700">
                    <strong>Competitive positioning:</strong> {getCompetitivePositioning(proposedSalary)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onApprove}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Approve & apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalarySimulationModal;
