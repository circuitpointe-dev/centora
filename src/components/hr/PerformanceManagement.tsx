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
import { Switch } from '@/components/ui/switch';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import GoalDetailView from './GoalDetailView';
import AppraisalDetailView from './AppraisalDetailView';
import SuccessionRoleDetailView from './SuccessionRoleDetailView';
import SuccessorDevelopmentPlanDetailView from './SuccessorDevelopmentPlanDetailView';

const PerformanceManagement = () => {
  const [activeTab, setActiveTab] = useState('kpi-objectives');
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showAppraisalDetailView, setShowAppraisalDetailView] = useState(false);
  const [showCalibrationView, setShowCalibrationView] = useState(false);
  const [calibrationSubtab, setCalibrationSubtab] = useState<'distribution' | 'ninebox'>('distribution');
  const [showSuccessionDetail, setShowSuccessionDetail] = useState(false);
  const [successionSubtab, setSuccessionSubtab] = useState<'critical' | 'development'>('critical');
  const [showPlanDetail, setShowPlanDetail] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    role: string;
    targetRole: string;
  } | null>(null);
  const [isGiveFeedbackOpen, setIsGiveFeedbackOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'Kudos',
    to: '',
    message: '',
    visibility: 'Public (Visible to organization)',
    linkToGoal: '',
    anonymous: false,
  });
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
    { range: '1.0-1.9', count: 2, percentage: 3, color: 'bg-red-500', fill: '#EF4444' },
    { range: '2.0-2.9', count: 8, percentage: 13, color: 'bg-orange-500', fill: '#F59E0B' },
    { range: '3.0-3.9', count: 35, percentage: 58, color: 'bg-purple-500', fill: '#8B5CF6' },
    { range: '4.0-4.9', count: 13, percentage: 22, color: 'bg-green-500', fill: '#22C55E' },
    { range: '5.0', count: 2, percentage: 3, color: 'bg-teal-500', fill: '#14B8A6' }
  ];

  // Mock data for distribution guidelines
  const distributionGuidelines = [
    { category: 'Outstanding (4.5-5.0)', target: '5%', actual: '3%', isDeviation: false },
    { category: 'Exceeds (4.0-4.4)', target: '20%', actual: '22%', isDeviation: false },
    { category: 'Meets (3.0-3.9)', target: '60%', actual: '58%', isDeviation: false },
    { category: 'Needs Improvement (1.0-2.9)', target: '15%', actual: '16%', isDeviation: true }
  ];

  // Mock data for feedback history feed
  const feedbackFeed = [
    {
      id: 1,
      type: 'Kudos',
      typeColor: 'bg-rose-100 text-rose-700',
      authorInitials: 'AB',
      author: 'Alex Bello',
      to: 'Jane Doe',
      visibility: 'Public',
      timestamp: 'Apr 20, 03:30 PM',
      text:
        'Great facilitation during the quarterly planning session. Your preparation and ability to keep everyone focused was excellent.',
      linked: 'Leadership Development'
    },
    {
      id: 2,
      type: 'Coaching',
      typeColor: 'bg-blue-100 text-blue-700',
      authorInitials: 'JS',
      author: 'John Smith',
      to: 'Jane Doe',
      visibility: 'Manager+Employee',
      timestamp: 'Apr 18, 11:15 AM',
      text:
        'Focus on discovery calls before jumping into presentations. Taking time to understand client needs first will improve close rates.',
      linked: 'Sales Skills'
    },
    {
      id: 3,
      type: '1:1 Note',
      typeColor: 'bg-green-100 text-green-700',
      authorInitials: 'JS',
      author: 'John Smith',
      to: 'Ryan Cole',
      visibility: 'Manager Only',
      timestamp: 'Apr 17, 05:00 PM',
      text:
        'Discussed career progression goals. Ryan interested in technical leadership track. Need to identify stretch project opportunities.',
      linked: ''
    },
    {
      id: 4,
      type: 'Recognition',
      typeColor: 'bg-violet-100 text-violet-700',
      authorInitials: '?',
      author: 'Anonymous',
      to: 'Sarah Kim',
      visibility: 'Public',
      timestamp: 'Apr 16, 10:45 AM',
      text:
        'Always willing to help teammates debug complex issues. Great collaborative spirit!',
      linked: ''
    }
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

  const handleViewPlan = (plan: { name: string; role: string; targetRole: string }) => {
    setSelectedPlan(plan);
    setShowPlanDetail(true);
  };

  const handleBackToDevelopmentPlans = () => {
    setShowPlanDetail(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-6">
      {showDetailView ? (
        <GoalDetailView onBack={handleBackToList} />
      ) : showAppraisalDetailView ? (
        <AppraisalDetailView onBack={handleBackToAppraisalList} />
      ) : showSuccessionDetail ? (
        <SuccessionRoleDetailView onBack={() => setShowSuccessionDetail(false)} />
      ) : showPlanDetail && selectedPlan ? (
        <SuccessorDevelopmentPlanDetailView 
          onBack={handleBackToDevelopmentPlans}
          employeeName={selectedPlan.name}
          employeeRole={selectedPlan.role}
          targetRole={selectedPlan.targetRole}
        />
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
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
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
                    <button
                      onClick={() => setCalibrationSubtab('distribution')}
                      className={`pb-2 font-medium ${calibrationSubtab === 'distribution' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Distribution
                    </button>
                    <button
                      onClick={() => setCalibrationSubtab('ninebox')}
                      className={`pb-2 font-medium ${calibrationSubtab === 'ninebox' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Nine Box
                    </button>
                  </div>

                  {/* Content */}
                  {calibrationSubtab === 'distribution' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Rating Distribution Chart */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Rating Distribution</h4>
                      <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReBarChart data={distributionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="range" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                            <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(value: any, name: any, props: any) => [`${value} employees (${props.payload.percentage}%)`, '']} />
                              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {distributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                          </ReBarChart>
                        </ResponsiveContainer>
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

                    {/* Right Column - Distribution Guidelines and Moderation Notes */}
                    <div className="space-y-6">
                      {/* Distribution Guidelines (Card + Bars) */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Distribution Guidelines</h4>
                        <div className="border rounded-lg p-3 bg-gray-50 border-gray-200 flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <span className="text-sm text-gray-700">
                            Target distribution: 5% Outstanding, 20% Exceeds, 60% Meets, 15% Needs Improvement.
                          </span>
                        </div>

                        {/* Small compact bar chart for target vs actual */}
                        <div className="w-full h-44">
                          <ResponsiveContainer width="100%" height="100%">
                            <ReBarChart data={distributionGuidelines.map((d) => ({
                              label: d.category.split(' ')[0],
                              target: parseInt(d.target.replace('%','')),
                              actual: parseInt(d.actual.replace('%','')),
                              isDeviation: d.isDeviation
                            }))} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="label" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                              <YAxis allowDecimals={false} tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={(value: any, name: any) => [`${value}%`, name === 'target' ? 'Target' : 'Actual']} />
                              <Bar dataKey="target" stackId="a" fill="#E5E7EB" radius={[4,4,0,0]} />
                              <Bar dataKey="actual" stackId="a" radius={[4,4,0,0]}>
                                {distributionGuidelines.map((d, idx) => (
                                  <Cell key={`c-${idx}`} fill={d.isDeviation ? '#F87171' : '#111827'} />
                                ))}
                              </Bar>
                            </ReBarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Rows with target vs actual chips */}
                        <div className="space-y-2">
                          {distributionGuidelines.map((item, index) => (
                            <div key={index} className="flex items-center justify-between py-2">
                              <span className="text-sm text-gray-700">{item.category}</span>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">Target: {item.target}</span>
                                <span className={`text-sm font-medium px-2 py-1 rounded border ${
                                  item.isDeviation ? 'bg-red-100 text-red-800 border-red-200' : 'bg-gray-100 text-gray-900 border-gray-200'
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
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Nine Box Grid */}
                      <div className="lg:col-span-2">
                        <div className="mb-4 text-sm font-medium text-gray-900">Nine Box Grid</div>
                        <div className="grid grid-cols-3 gap-4">
                          {/* Row 1 - High Performance */}
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 mb-1">High Potential</div>
                            <div className="rounded-lg border border-green-200 bg-green-50 p-3 min-h-[88px]">
                              <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">Sarah Chen</div>
                              <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700 ml-2">Lisa Rodriguez</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 mb-1">Medium Potential</div>
                            <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 min-h-[88px]">
                              <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">Ryan Cole</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 mb-1">Low Potential</div>
                            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 min-h-[88px]"></div>
                          </div>

                          {/* Row headers at left */}
                          <div className="col-span-3 grid grid-cols-3 gap-4">
                            <div>
                              <div className="text-sm text-gray-600 mb-1">High Performance</div>
                            </div>
                            <div></div>
                            <div></div>
                          </div>

                          {/* Row 2 - Medium Performance */}
                          <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 min-h-[88px]">
                            <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">Marcus Thompson</div>
                          </div>
                          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 min-h-[88px]">
                            <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">Jane Doe</div>
                            <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700 ml-2">Mike Wilson</div>
                          </div>
                          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 min-h-[88px]">
                            <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">Tom Brown</div>
                          </div>

                          {/* Row 3 - Low Performance */}
                          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 min-h-[88px]"></div>
                          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 min-h-[88px]">
                            <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">Anna Davis</div>
                          </div>
                          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 min-h-[88px]">
                            <div className="inline-flex items-center rounded-full border px-2 py-1 text-xs bg-white text-gray-700">John Smith</div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-start space-x-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <span>Drag employees between boxes to adjust their performance/potential ratings. Changes will be reflected in their review scores.</span>
                        </div>
                      </div>

                      {/* Right Rail */}
                      <div className="space-y-6">
                        {/* Rating Legend */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-semibold">Rating Legend</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <div>
                                <div>High Performance +</div>
                                <div className="text-gray-600">High Potential</div>
                              </div>
                              <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-medium">4.8</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div>High Performance +</div>
                                <div className="text-gray-600">Med Potential</div>
                              </div>
                              <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-medium">4.5</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div>Med Performance +</div>
                                <div className="text-gray-600">High Potential</div>
                              </div>
                              <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-medium">3.8</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div>Med Performance +</div>
                                <div className="text-gray-600">Med Potential</div>
                              </div>
                              <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-medium">3.1</div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>Low Performance:</div>
                              <div className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-medium">2.2-2.8</div>
                            </div>
            </CardContent>
          </Card>

                        {/* Recent Changes */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-semibold">Recent Changes</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4 text-sm">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">Anna Davis</div>
                                <div className="text-gray-600">From: Low Performance / High Potential</div>
                                <div className="text-gray-600">To: Low Performance / Medium Potential</div>
                                <div className="text-gray-500">9/29/2025, 7:09:47 PM</div>
                              </div>
                              <div className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-medium">-0.3</div>
                            </div>
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">Anna Davis</div>
                                <div className="text-gray-600">From: Low Performance / Medium Potential</div>
                                <div className="text-gray-600">To: Low Performance / High Potential</div>
                                <div className="text-gray-500">9/29/2025, 7:09:44 PM</div>
                              </div>
                              <div className="px-2 py-1 rounded bg-gray-100 text-gray-900 text-xs font-medium">0.0</div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Box Distribution */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm font-semibold">Box Distribution</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-2 text-sm">
                            {[
                              ['HH', 2], ['HM', 1], ['HL', 0],
                              ['MH', 1], ['MM', 2], ['ML', 2],
                              ['LH', 0], ['LM', 1], ['LL', 1]
                            ].map(([label, val], idx) => (
                              <div key={idx as number} className="flex items-center justify-between">
                                <span className="text-gray-700">{label as string}</span>
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-900 text-xs">{val as number}</span>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
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
          {/* Header row with title, search and actions */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Feedback history</div>
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
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setIsGiveFeedbackOpen(true)}>
                + Give feedback
              </Button>
            </div>
          </div>

          {/* Feedback Feed */}
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-900 mb-4">Feedback Feed</div>
              <div className="space-y-4">
                {feedbackFeed.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700">
                          {item.authorInitials}
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded ${item.typeColor}`}>{item.type}</div>
                        <div className="text-sm text-gray-900">
                          {item.author} → {item.to}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span>{item.visibility}</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700 text-sm">{item.text}</p>
                    {item.linked && (
                      <div className="mt-3">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 border border-gray-200">
                          Linked: {item.linked}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="succession-planning" className="space-y-6 mt-6">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-900">Succession planning</div>
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
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center space-x-6 text-sm">
            <button onClick={()=>setSuccessionSubtab('critical')} className={`pb-2 font-medium ${successionSubtab==='critical'?'border-b-2 border-purple-600 text-purple-600':'text-gray-600 hover:text-gray-900'}`}>Critical plan mapping</button>
            <button onClick={()=>setSuccessionSubtab('development')} className={`pb-2 font-medium ${successionSubtab==='development'?'border-b-2 border-purple-600 text-purple-600':'text-gray-600 hover:text-gray-900'}`}>Successor development plans</button>
          </div>

          {/* Critical Roles Overview */}
          {successionSubtab==='critical' ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-900 mb-4">Critical Roles Overview</div>
              <div className="space-y-3">
                {[
                  { role: 'Head of Operations', tags: ['High Risk','Critical','Diversity Slate Met'], incumbent: 'L. Mensah', dept: 'Operations', loc: 'New York', succ: '0 / 1 / 2', now: 'Now/12m/24m', coverage: 67 },
                  { role: 'Engineering Manager', tags: ['Medium Risk','High','Ready Now','Diversity Slate Met'], incumbent: 'J. Doe', dept: 'Engineering', loc: 'San Francisco', succ: '2 / 1 / 2', now: 'Now/12m/24m', coverage: 100 },
                  { role: 'VP of Sales', tags: ['High Risk','Critical'], incumbent: 'M. Johnson', dept: 'Sales', loc: 'Chicago', succ: '0 / 1 / 1', now: 'Now/12m/24m', coverage: 67 },
                  { role: 'Product Director', tags: ['Low Risk','High','Ready Now','Diversity Slate Met'], incumbent: 'K. Patel', dept: 'Product', loc: 'Austin', succ: '1 / 2 / 1', now: 'Now/12m/24m', coverage: 100 },
                  { role: 'CFO', tags: ['High Risk','Critical'], incumbent: 'R. Williams', dept: 'Finance', loc: 'New York', succ: '0 / 0 / 1', now: 'Now/12m/24m', coverage: 33 },
                  { role: 'Senior Engineering Lead', tags: ['Medium Risk','Medium','Ready Now','Diversity Slate Met'], incumbent: 'T. Anderson', dept: 'Engineering', loc: 'Seattle', succ: '1 / 1 / 0', now: 'Now/12m/24m', coverage: 100 },
                ].map((r, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="font-semibold text-gray-900">{r.role}</div>
                        <div className="flex flex-wrap gap-2">
                          {r.tags.map((t, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded ${
                              t.includes('High Risk') ? 'bg-rose-100 text-rose-800' :
                              t.includes('Medium Risk') ? 'bg-amber-100 text-amber-800' :
                              t.includes('Low Risk') ? 'bg-emerald-100 text-emerald-800' :
                              t.includes('Critical') ? 'bg-gray-100 text-gray-800' :
                              t.includes('Ready Now') ? 'bg-emerald-100 text-emerald-800' :
                              t.includes('High') ? 'bg-emerald-100 text-emerald-800' :
                              t.includes('Medium') ? 'bg-amber-100 text-amber-800' :
                              'bg-violet-100 text-violet-800'
                            }`}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <span>Incumbent: {r.incumbent}</span>
                        <span>{r.dept}</span>
                        <span>{r.loc}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-8">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium text-gray-900">Successors</div>
                        <div className="text-right">{r.succ}</div>
                        <div className="text-right text-gray-500">{r.now}</div>
                      </div>
                      <div className="text-sm text-gray-600 w-40">
                        <div className="font-medium text-gray-900 flex items-center justify-between">
                          <span>Coverage</span>
                          <span>{r.coverage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${r.coverage}%` }} />
                        </div>
                      </div>
                      <Button variant="ghost" className="text-gray-700" onClick={() => setShowSuccessionDetail(true)}>Open ▸</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-900 mb-4">Development Plans Overview (5)</div>
              <div className="space-y-3">
                {[
                  { n: 'Alex Bello', role: 'Operations Manager', targetRole: 'Head of Operations', readiness: '≤12 months', progress: 60, overdue: 1, nextReview: '2025-07-15' },
                  { n: 'Sarah Kim', role: 'Senior Engineer', targetRole: 'Engineering Manager', readiness: 'Ready Now', progress: 95, overdue: 0, nextReview: '2025-05-30' },
                  { n: 'Ryan Cole', role: 'Sales Director', targetRole: 'VP of Sales', readiness: '≤6 months', progress: 75, overdue: 0, nextReview: '2025-06-01' },
                  { n: 'Maria Rodriguez', role: 'Supply Chain Manager', targetRole: 'Head of Operations', readiness: '≤24 months', progress: 35, overdue: 2, nextReview: '2025-08-10' },
                  { n: 'David Chen', role: 'Regional Sales Manager', targetRole: 'VP of Sales', readiness: '≤12 months', progress: 45, overdue: 1, nextReview: '2025-06-20' },
                ].map((d, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-700">{d.n.split(' ').map(p=>p[0]).join('').slice(0,2)}</div>
                      <div>
                        <div className="font-medium text-gray-900">{d.n}</div>
                        <div className="text-xs text-gray-600">{d.role} → {d.targetRole}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 text-sm">
                      <span className={`text-xs px-2 py-1 rounded ${d.readiness.includes('Ready') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{d.readiness}</span>
                      <div className="w-48">
                        <div className="text-gray-500">Plan Progress</div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${d.progress}%` }} />
                          </div>
                          <span className="text-gray-700 text-xs" style={{minWidth:28}}>{d.progress}%</span>
                        </div>
                      </div>
                      <div className="w-24">
                        <div className="text-gray-500">Overdue</div>
                        <div className={`text-sm ${d.overdue>0?'text-rose-600':'text-gray-900'}`}>{d.overdue}</div>
                      </div>
                      <div className="w-40">
                        <div className="text-gray-500">Next Review</div>
                        <div className="text-sm text-gray-900">{d.nextReview}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="text-gray-700"
                        onClick={() => handleViewPlan({ name: d.n, role: d.role, targetRole: d.targetRole })}
                      >
                        View Plan
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          )}
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

      {/* Give Feedback Modal */}
      {isGiveFeedbackOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsGiveFeedbackOpen(false)
          }}
        >
          {/* Blurred Background Overlay */}
          <div className="fixed inset-0 backdrop-blur-md bg-white/30" />

          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 h-[560px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <div className="text-lg font-semibold text-gray-900">Give feedback</div>
                <p className="text-sm text-gray-600 mt-1">Provide feedback to colleagues including kudos, coaching, or 1:1 notes with appropriate visibility settings.</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600" onClick={() => setIsGiveFeedbackOpen(false)}>
                ✕
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsGiveFeedbackOpen(false);
                }}
                className="p-6 space-y-6"
              >
                {/* Type / To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Type</Label>
                    <div className="relative">
                      <select
                        value={feedbackForm.type}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option>Kudos</option>
                        <option>Coaching</option>
                        <option>1:1 Note</option>
                        <option>Recognition</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">To</Label>
                    <input
                      type="text"
                      value={feedbackForm.to}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, to: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Search name"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Message</Label>
                  <Textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="Write your message..."
                    className="min-h-[120px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                  />
                </div>

                {/* Visibility & Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Visibility</Label>
                    <div className="relative">
                      <select
                        value={feedbackForm.visibility}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, visibility: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option>Public (Visible to organization)</option>
                        <option>Manager+Employee</option>
                        <option>Manager Only</option>
                        <option>Private</option>
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Link to goal (Optional)</Label>
                    <input
                      type="text"
                      value={feedbackForm.linkToGoal}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, linkToGoal: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Paste goal link or search"
                    />
                  </div>
                </div>

                {/* Anonymous toggle */}
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={feedbackForm.anonymous}
                    onCheckedChange={(c) => setFeedbackForm({ ...feedbackForm, anonymous: !!c })}
                  />
                  <span className="text-sm text-gray-700">Give feedback anonymously</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <Button type="button" variant="outline" onClick={() => setIsGiveFeedbackOpen(false)} className="text-gray-600 hover:text-gray-900">Cancel</Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">Send feedback</Button>
                </div>
              </form>
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
