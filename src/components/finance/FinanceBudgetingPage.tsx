import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  Plus, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const FinanceBudgetingPage = () => {
  const { data: budgets, isLoading } = useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'active':
        return <TrendingUp className="h-4 w-4" />;
      case 'closed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const calculateUtilization = (spent: number, allocated: number) => {
    return allocated > 0 ? (spent / allocated) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Budgeting
          </h1>
          <p className="text-muted-foreground">
            Plan and track budget allocations and spending
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Budget Analysis
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Budget
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {budgets?.slice(0, 3).map((budget, index) => {
            const utilization = calculateUtilization(budget.spent_amount, budget.allocated_budget);
            const remaining = budget.allocated_budget - budget.spent_amount;
            
            return (
              <Card key={budget.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{budget.budget_name}</CardTitle>
                    <Badge className={getStatusColor(budget.status)}>
                      {budget.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    FY {budget.fiscal_year} • {budget.start_date} to {budget.end_date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Budget Utilization</span>
                        <span>{utilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={utilization} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Budget</p>
                        <p className="font-semibold">{formatCurrency(budget.total_budget)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Allocated</p>
                        <p className="font-semibold">{formatCurrency(budget.allocated_budget)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spent</p>
                        <p className="font-semibold text-red-600">{formatCurrency(budget.spent_amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Remaining</p>
                        <p className={`font-semibold ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(remaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            All Budgets
          </CardTitle>
          <CardDescription>
            Complete list of budget plans and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4 border-b">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-4 py-3 px-2 text-sm font-medium text-gray-500 border-b">
                <div className="col-span-3">Budget Name</div>
                <div className="col-span-2">Fiscal Year</div>
                <div className="col-span-2">Total Budget</div>
                <div className="col-span-2">Spent</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              {budgets?.map((budget) => {
                const utilization = calculateUtilization(budget.spent_amount, budget.allocated_budget);
                
                return (
                  <div key={budget.id} className="grid grid-cols-12 gap-4 py-4 px-2 hover:bg-gray-50 rounded-lg">
                    <div className="col-span-3">
                      <div className="font-medium">{budget.budget_name}</div>
                      <p className="text-xs text-gray-500">
                        {budget.start_date} - {budget.end_date}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-mono">{budget.fiscal_year}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-semibold">{formatCurrency(budget.total_budget)}</span>
                    </div>
                    <div className="col-span-2">
                      <div>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(budget.spent_amount)}
                        </span>
                        <p className="text-xs text-gray-500">
                          {utilization.toFixed(1)}% utilized
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Badge className={getStatusColor(budget.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(budget.status)}
                          <span className="ml-1">{budget.status}</span>
                        </span>
                      </Badge>
                    </div>
                    <div className="col-span-1">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceBudgetingPage;