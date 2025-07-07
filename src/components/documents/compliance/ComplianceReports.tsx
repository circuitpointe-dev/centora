import React from 'react';
import { User, Check, Clock, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ComplianceReports = () => {
  const statCards = [
    {
      title: 'Total Policies Assigned',
      value: '34',
      icon: User,
      iconBgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Acknowledges',
      value: '180',
      icon: Check,
      iconBgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Acknowledgement Rate',
      value: '45%',
      icon: Clock,
      iconBgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Policies Expired',
      value: '6',
      icon: X,
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="bg-white h-40">
              <CardContent className="p-6 h-full">
                <div className="flex flex-col items-center justify-center text-center h-full space-y-3">
                  <div className={`p-3 rounded-full ${card.iconBgColor}`}>
                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                  <p className="text-sm text-gray-600">{card.title}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State for Custom Reports */}
      <Card className="bg-white">
        <CardContent className="p-12">
          <div className="text-center">
            {/* Document with magnifying glass icon */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                <circle cx="18" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m20.2 20.2 1.8 1.8" />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Custom Report Generated Yet
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Use filters to generate tailored compliance reports by policy, or timeframe. Perfect for audits, performance tracking, and internal reviews.
            </p>
            
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              Generate Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};