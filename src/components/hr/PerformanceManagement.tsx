import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  RefreshCw,
  CheckCircle,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Lock
} from 'lucide-react';
import GoalDetailView from './GoalDetailView';
import AppraisalDetailView from './AppraisalDetailView';

const PerformanceManagement = () => {
  const [activeTab, setActiveTab] = useState('kpi-objectives');
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showAppraisalDetailView, setShowAppraisalDetailView] = useState(false);
  const [showCalibrationView, setShowCalibrationView] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'OKR',
    description: '',
    weight: '',
    cycle: 'Q2 2025',
    nextCheckIn: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock data for KPI summary cards
  const kpiSummary = [
    { icon: Target, number: '4', label: 'Total goals', color: 'text-purple-600' },
    { icon: Target, number: '2', label: 'On track', color: 'text-green-600' },
    { icon: AlertTriangle, number: '1', label: 'At risk', color: 'text-red-600' },
    { icon: AlertTriangle, number: '1', label: 'Off risk', color: 'text-orange-600' },
    { icon: BarChart3, number: '66%', label: 'Avg progress', color: 'text-blue-600' }
  ];

  // Mock data for goals
  const goals = [
    {
      id: 1,
      title: 'Improve NPS Score',
      type: 'OKR',
      description: 'Increase customer Net Promoter Score from 7.2 to 8.5',
      companyOkr: 'Customer satisfaction',
      owner: 'Jane Doe',
      weight: '30%',
      nextCheckIn: 'Jul 2, 2025',
      progress: 65,
      status: 'On track',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      title: 'Launch New Product Line',
      type: 'Product',
      description: 'Successfully launch the new eco-friendly product line by Q3',
      companyOkr: 'Product development',
      owner: 'John Smith',
      weight: '40%',
      nextCheckIn: 'Aug 15, 2025',
      progress: 30,
      status: 'At risk',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: 3,
      title: 'Enhance Customer Support',
      type: 'OKR',
      description: 'Reduce average response time from 24 hours to 1 hour',
      companyOkr: 'Customer support',
      owner: 'Emily Davis',
      weight: '25%',
      nextCheckIn: 'Sep 30, 2025',
      progress: 45,
      status: 'Off risk',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 4,
      title: 'Improve Customer Satisfaction',
      type: 'KPI',
      description: 'Achieve a customer satisfaction score of 9.0 by EOY',
      companyOkr: 'Customer Success',
      owner: 'Alice Johnson',
      weight: '35%',
      nextCheckIn: 'Sep 15, 2025',
      progress: 80,
      status: 'On track',
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  // Mock data for appraisal summary cards
  const appraisalSummary = [
    { icon: RefreshCw, number: '18', label: 'Total reviews', color: 'text-purple-600' },
    { icon: CheckCircle, number: '8', label: 'Completed', color: 'text-green-600' },
    { icon: Clock, number: '3', label: 'Pending', color: 'text-yellow-600' },
    { icon: Users, number: '3.6', label: 'Avg rating', color: 'text-blue-600' }
  ];

  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      employee: { name: 'Sarah Chen', role: 'Engineering | Senior' },
      manager: 'John Bobby',
      dueDate: 'Oct 1, 2025',
      progress: { completed: 0, total: 4 },
      rating: '--',
      status: 'Manager review',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 2,
      employee: { name: 'Michael Smith', role: 'Engineering | Staff' },
      manager: 'Alice Johnson',
      dueDate: 'Oct 3, 2025',
      progress: { completed: 2, total: 4 },
      rating: '3.6',
      status: 'Calibration',
      statusColor: 'bg-purple-100 text-purple-800'
    },
    {
      id: 3,
      employee: { name: 'Emily Davis', role: 'Product | Senior' },
      manager: 'Robert Brown',
      dueDate: 'Sep 28, 2025',
      progress: { completed: 4, total: 4 },
      rating: '4.2',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 4,
      employee: { name: 'David Wilson', role: 'Engineering | Senior' },
      manager: 'Nancy Green',
      dueDate: 'Oct 7, 2025',
      progress: { completed: 1, total: 4 },
      rating: '--',
      status: 'Self review',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 5,
      employee: { name: 'Jessica Taylor', role: 'Design | Senior' },
      manager: 'Liam White',
      dueDate: 'Sep 28, 2025',
      progress: { completed: 4, total: 4 },
      rating: '4.2',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 6,
      employee: { name: 'Daniel Anderson', role: 'Engineering | Staff' },
      manager: 'Sophia King',
      dueDate: 'Oct 11, 2025',
      progress: { completed: 2, total: 4 },
      rating: '--',
      status: 'Manager review',
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 7,
      employee: { name: 'Olivia Martinez', role: 'Sales | Staff' },
      manager: 'James Lee',
      dueDate: 'Sep 28, 2025',
      progress: { completed: 4, total: 4 },
      rating: '5.0',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 8,
      employee: { name: 'James Taylor', role: 'Engineering | Senior' },
      manager: 'Amelia Clark',
      dueDate: 'Oct 15, 2025',
      progress: { completed: 1, total: 4 },
      rating: '--',
      status: 'Self review',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  // Mock data for calibration summary cards
  const calibrationSummary = [
    { icon: Users, number: '8', label: 'Team size', color: 'text-blue-600' },
    { icon: BarChart3, number: '3.6', label: 'Avg rating', color: 'text-purple-600' },
    { icon: TrendingUp, number: '25%', label: 'High performers', color: 'text-green-600' }
  ];

  // Mock data for distribution chart
  const distributionData = [
    { range: '1.0-1.9', count: 2, percentage: 3, color: 'bg-red-500' },
    { range: '2.0-2.9', count: 8, percentage: 13, color: 'bg-orange-500' },
    { range: '3.0-3.9', count: 35, percentage: 58, color: 'bg-purple-500' },
    { range: '4.0-4.9', count: 13, percentage: 22, color: 'bg-green-500' },
    { range: '5.0', count: 2, percentage: 3, color: 'bg-teal-500' }
  ];

  // Mock data for distribution guidelines
  const distributionGuidelines = [
    { category: 'Outstanding (4.5-5.0)', target: '5%', actual: '3%', isDeviation: false },
    { category: 'Exceeds (4.0-4.4)', target: '20%', actual: '22%', isDeviation: false },
    { category: 'Meets (3.0-3.9)', target: '60%', actual: '58%', isDeviation: false },
    { category: 'Needs Improvement (1.0-2.9)', target: '15%', actual: '16%', isDeviation: true }
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Goal title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.weight || formData.weight === '') {
      errors.weight = 'Weight is required';
    } else {
      const weightNum = parseInt(formData.weight);
      if (isNaN(weightNum) || weightNum < 0 || weightNum > 100) {
        errors.weight = 'Weight must be between 0 and 100';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCreateGoal = () => {
    if (!validateForm()) {
      return;
    }
    
    // Handle form submission here
    console.log('Creating goal:', formData);
    setIsCreateGoalModalOpen(false);
    // Reset form
    setFormData({
      title: '',
      type: 'OKR',
      description: '',
      weight: '',
      cycle: 'Q2 2025',
      nextCheckIn: ''
    });
    setFormErrors({});
  };

  const handleCancel = () => {
    setIsCreateGoalModalOpen(false);
    // Reset form
    setFormData({
      title: '',
      type: 'OKR',
      description: '',
      weight: '',
      cycle: 'Q2 2025',
      nextCheckIn: ''
    });
    setFormErrors({});
  };

  const handleViewGoal = () => {
    console.log('handleViewGoal called - setting showDetailView to true');
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
  };

  const handleViewAppraisal = () => {
    setShowAppraisalDetailView(true);
  };

  const handleBackToAppraisalList = () => {
    setShowAppraisalDetailView(false);
  };

  const handleToggleCalibrationView = () => {
    setShowCalibrationView(!showCalibrationView);
  };

  return (
    <div className="space-y-6">
      {showDetailView ? (
        <GoalDetailView onBack={handleBackToList} />
      ) : showAppraisalDetailView ? (
        <AppraisalDetailView onBack={handleBackToAppraisalList} />
      ) : (
        <>
      {/* Header */}
          <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Performance management</h1>
            <Button 
              onClick={() => {
                console.log('Test button clicked');
                setShowDetailView(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Test Detail View
            </Button>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="kpi-objectives">KPI & Objectives</TabsTrigger>
          <TabsTrigger value="appraisal-reviews">Appraisal & Reviews</TabsTrigger>
          <TabsTrigger value="feedback-history">Feedback History</TabsTrigger>
          <TabsTrigger value="succession-planning">Succession Planning</TabsTrigger>
        </TabsList>

        {/* KPI & Objectives Tab */}
        <TabsContent value="kpi-objectives" className="space-y-6 mt-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {kpiSummary.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-4">
                    <div className={`w-8 h-8 mx-auto mb-2 ${item.color}`}>
                      <IconComponent className="w-full h-full" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{item.number}</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* KPIs & Objectives Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">KPIs & Objectives</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setIsCreateGoalModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Goal
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => (
                  <Card key={goal.id} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Goal Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                            <Badge variant="outline" className="mt-1">
                              {goal.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm">{goal.description}</p>

                        {/* Goal Details */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Company OKR:</span>
                            <span className="text-gray-900">{goal.companyOkr}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Owner:</span>
                            <span className="text-gray-900">{goal.owner}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Weight:</span>
                            <span className="text-gray-900">{goal.weight}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Next check-in:</span>
                            <span className="text-gray-900">{goal.nextCheckIn}</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-gray-900">{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex justify-between items-center">
                          <Badge className={goal.statusColor}>{goal.status}</Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              console.log('View button clicked');
                              handleViewGoal();
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appraisal & Reviews Tab */}
        <TabsContent value="appraisal-reviews" className="space-y-6 mt-6">
          {showCalibrationView ? (
            <>

              {/* Calibration Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {calibrationSummary.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <div className={`w-8 h-8 mx-auto mb-2 ${item.color}`}>
                          <IconComponent className="w-full h-full" />
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${item.color}`}>{item.number}</div>
                        <div className="text-sm text-gray-600">{item.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Calibration Management Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Calibration management</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={handleToggleCalibrationView}
                      >
                        Reviews overview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Lock className="h-4 w-4 mr-2" />
                        Lock result
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Sub-tabs */}
                  <div className="flex space-x-6 border-b border-gray-200 mb-6">
                    <button className="pb-2 border-b-2 border-purple-600 text-purple-600 font-medium">
                      Distribution
                    </button>
                    <button className="pb-2 text-gray-600 hover:text-gray-900">
                      Nine Box
                    </button>
                  </div>

                  {/* Distribution Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Rating Distribution Chart */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Rating Distribution</h4>
                      <div className="space-y-4">
                        {/* Chart Bars */}
                        <div className="space-y-2">
                          {distributionData.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="w-16 text-sm text-gray-600">{item.range}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                                <div
                                  className={`${item.color} h-6 rounded-full flex items-center justify-end pr-2`}
                                  style={{ width: `${(item.count / 60) * 100}%` }}
                                >
                                  <span className="text-white text-xs font-medium">{item.count}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Legend */}
                        <div className="space-y-1">
                          {distributionData.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <div className={`w-3 h-3 rounded ${item.color}`}></div>
                              <span className="text-gray-600">{item.range}: {item.count} employees ({item.percentage}%)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Distribution Guidelines and Moderation Notes */}
                    <div className="space-y-6">
                      {/* Distribution Guidelines */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          <span className="text-sm text-gray-700">
                            Target distribution: 5% Outstanding, 20% Exceeds, 60% Meets, 15% Needs Improvement.
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {distributionGuidelines.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-700">{item.category}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Target: {item.target}</span>
                                <span className={`text-sm font-medium px-2 py-1 rounded ${
                                  item.isDeviation ? 'bg-red-100 text-red-800' : 'text-gray-900'
                                }`}>
                                  Actual: {item.actual}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Moderation Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">Moderation Notes</Label>
                        <Textarea
                          placeholder="Add notes about distribution decisions..."
                          className="min-h-[120px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>

              {/* Appraisal Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {appraisalSummary.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="text-center">
                      <CardContent className="p-4">
                        <div className={`w-8 h-8 mx-auto mb-2 ${item.color}`}>
                          <IconComponent className="w-full h-full" />
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${item.color}`}>{item.number}</div>
                        <div className="text-sm text-gray-600">{item.label}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

          {/* Review Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Review overview</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleToggleCalibrationView}
                  >
                    Calibration view
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Employee</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Manager</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Due date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-semibold text-gray-900">{review.employee.name}</div>
                            <div className="text-sm text-gray-500">{review.employee.role}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-900">{review.manager}</td>
                        <td className="py-4 px-4 text-gray-900">{review.dueDate}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${(review.progress.completed / review.progress.total) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.progress.completed}/{review.progress.total}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-900">{review.rating}</td>
                        <td className="py-4 px-4">
                          <Badge className={review.statusColor}>{review.status}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400"
                            onClick={() => {
                              console.log('Appraisal view button clicked');
                              handleViewAppraisal();
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing 1 to 8 of 10 review overview
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="feedback-history" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Feedback History content will be implemented here
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="succession-planning" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Succession Planning content will be implemented here
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Goal Modal */}
      {isCreateGoalModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCancel();
            }
          }}
        >
          {/* Blurred Background Overlay */}
          <div className="fixed inset-0 backdrop-blur-md bg-white/30" />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 h-[540px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900">Create new goal</h2>
              <p className="text-gray-600 mt-1">
                  Create a new goal with objectives, success criteria, and tracking details.
                </p>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateGoal(); }} className="p-6 space-y-6">
              {/* Goal Title */}
              <div className="space-y-2">
                <Label htmlFor="goal-title" className="text-sm font-semibold text-gray-900">
                  Goal title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="goal-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter goal title"
                  className={`focus:ring-purple-500 focus:border-purple-500 ${
                    formErrors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {formErrors.title && (
                  <p className="text-sm text-red-500">{formErrors.title}</p>
                )}
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="goal-type" className="text-sm font-semibold text-gray-900">
                  Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger className="focus:ring-purple-500 focus:border-purple-500">
                    <SelectValue placeholder="Select goal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OKR">OKR</SelectItem>
                    <SelectItem value="KPI">KPI</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="goal-description" className="text-sm font-semibold text-gray-900">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="goal-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter goal description"
                  className={`min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none ${
                    formErrors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  }`}
                  required
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500">{formErrors.description}</p>
                )}
              </div>

              {/* Weight and Cycle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="goal-weight" className="text-sm font-semibold text-gray-900">
                    Weight (%) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="goal-weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                    className={`focus:ring-purple-500 focus:border-purple-500 ${
                      formErrors.weight ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    }`}
                    required
                  />
                  {formErrors.weight && (
                    <p className="text-sm text-red-500">{formErrors.weight}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-cycle" className="text-sm font-semibold text-gray-900">
                    Cycle
                  </Label>
                  <Select value={formData.cycle} onValueChange={(value) => handleInputChange('cycle', value)}>
                    <SelectTrigger className="focus:ring-purple-500 focus:border-purple-500">
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                      <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                      <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                      <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Next Check-in */}
              <div className="space-y-2">
                <Label htmlFor="goal-checkin" className="text-sm font-semibold text-gray-900">
                  Next check-in
                </Label>
                <div className="relative">
                  <Input
                    id="goal-checkin"
                    type="date"
                    value={formData.nextCheckIn}
                    onChange={(e) => handleInputChange('nextCheckIn', e.target.value)}
                    className="focus:ring-purple-500 focus:border-purple-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleCreateGoal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6"
              >
                Create goal
              </Button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default PerformanceManagement;
