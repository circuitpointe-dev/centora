import React, { useState, useMemo } from 'react';
import { useLearningCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '@/hooks/hr/useLearningCourses';
import { useTrainingRecords, useCreateTrainingRecord, useUpdateTrainingProgress } from '@/hooks/hr/useTraining';
import { useEmployees } from '@/hooks/hr/useEmployees';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  Filter,
  Plus,
  Eye,
  GraduationCap,
  Calendar,
  Users,
  BookOpen,
  BarChart3,
  FileText,
  X,
  ArrowLeft,
  Clock,
  Star,
  Target,
  ChevronRight,
  ArrowRight,
  Upload,
  FileText as FileTextIcon,
  CheckCircle2,
  Send,
  User,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  ChevronLeft,
  Download,
  ThumbsUp,
  ShoppingBag,
  CheckCircle as CheckCircleIcon,
  CheckCircle
} from 'lucide-react';

const LearningDevelopment = () => {
  const [activeTab, setActiveTab] = useState('training-needs');
  const [ocaActiveTab, setOcaActiveTab] = useState('self-assessment');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isSkillGapModalOpen, setIsSkillGapModalOpen] = useState(false);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showTrainingPlanView, setShowTrainingPlanView] = useState(false);
  const [isEnrollmentDetailsModalOpen, setIsEnrollmentDetailsModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [showAddSessionView, setShowAddSessionView] = useState(false);
  const [showBulkEnrollmentView, setShowBulkEnrollmentView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1)); // October 2025
  const [isSessionDetailsModalOpen, setIsSessionDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [isSurveyDetailsModalOpen, setIsSurveyDetailsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<any>(null);
  const [showDomainDetailsView, setShowDomainDetailsView] = useState(false);
  const [selectedDomainDetails, setSelectedDomainDetails] = useState<any>(null);
  const [showCreateActionPlanView, setShowCreateActionPlanView] = useState(false);
  const [isAssignRecommendationModalOpen, setIsAssignRecommendationModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<any>(null);
  const [isAssignBundleModalOpen, setIsAssignBundleModalOpen] = useState(false);
  const [bundleItems, setBundleItems] = useState<any[]>([]);
  const [bundleRecommendationIds, setBundleRecommendationIds] = useState<Set<number>>(new Set());
  const [assignRecommendationForm, setAssignRecommendationForm] = useState({
    approver: '',
    pushToLMS: false
  });
  const [bundleForm, setBundleForm] = useState({
    planTitle: '',
    description: '',
    targetAudience: '',
    completionDueDate: '',
    requireApprovalFrom: '',
    pushToLMS: true
  });
  const [actionPlanForm, setActionPlanForm] = useState({
    planTitle: '',
    description: '',
    priority: 'Medium',
    targetCompletionDate: '',
    assignedTo: '',
    currency: 'USD',
    estimatedBudget: '',
    keyActions: ''
  });
  const [trainingPlanForm, setTrainingPlanForm] = useState({
    planName: '',
    description: '',
    targetRole: '',
    priority: 'Medium',
    selectedSkills: [] as string[],
    selectedCourses: [] as string[],
    notes: '',
    planOwner: '',
    startDate: '',
    dueDate: ''
  });

  const [addSessionForm, setAddSessionForm] = useState({
    course: 'Leadership Fundamentals',
    sessionName: 'Leadership',
    description: '',
    sessionFormat: 'In-person',
    duration: '',
    location: 'Office - Training Room A',
    startDate: '2025-10-08',
    endDate: '2025-10-10',
    registrationDeadline: '2025-10-06',
    sessionTimes: [{ date: '2025-10-08', startTime: '08:00', endTime: '12:00' }],
    instructor: 'Lisa Anderson - Leadership Coach',
    maxCapacity: 5,
    allowWaitlist: true,
    requireManagerApproval: false,
    markAsMandatory: false,
    sendNotifications: true,
    prerequisites: '',
    internalNotes: ''
  });

  const [bulkEnrollmentForm, setBulkEnrollmentForm] = useState({
    selectedSession: 'Leadership',
    selectedEmployees: ['Sarah Chen', 'Marcus Lee', 'Olivia Brown', 'Sophia Miller', 'William Davis'],
    sendNotifications: true,
    requireManagerApproval: false
  });
  const [createPlanForm, setCreatePlanForm] = useState({
    title: '',
    skill: '',
    level: '',
    employeeId: '',
    dueDate: '',
    description: '',
    resources: ''
  });

  // Mock course data
  const courseData = {
    id: 1,
    title: "Course R-201: Advanced react development",
    description: "Master advanced React concepts including hooks, context, performance optimization, and modern patterns. This comprehensive course will take you from intermediate to advanced React proficiency.",
    tags: ["Technical", "Intermediate", "Target: L3"],
    duration: "8 weeks",
    pace: "Self-paced",
    enrolled: "24/30",
    rating: "4.8 (156 reviews)",
    startDate: "15 May 2025",
    endDate: "10 Jul 2025",
    timeCommitment: "5-7 hours/week",
    availability: "Rolling enrollment",
    enrollmentProgress: 80,
    learningObjectives: [
      "Master React Hooks and custom hook creation",
      "Implement advanced state management patterns",
      "Optimize React application performance",
      "Build scalable component architectures",
      "Apply testing best practices with React Testing Library"
    ],
    prerequisites: [
      "Basic React knowledge (components, props, state)",
      "JavaScript ES6+ proficiency",
      "Understanding of HTML/CSS"
    ],
    competencies: ["React proficiency", "Frontend architecture", "Code quality"],
    curriculum: {
      totalModules: 5,
      totalWeeks: 8,
      modules: [
        {
          id: 1,
          title: "Advanced Hooks",
          duration: "1 week",
          status: "available"
        },
        {
          id: 2,
          title: "Performance Optimization",
          duration: "2 weeks",
          status: "available"
        },
        {
          id: 3,
          title: "State Management",
          duration: "2 weeks",
          status: "available"
        },
        {
          id: 4,
          title: "Component Patterns",
          duration: "2 weeks",
          status: "available"
        },
        {
          id: 5,
          title: "Testing & Best Practices",
          duration: "1 week",
          status: "available"
        }
      ]
    },
    instructor: {
      name: "Sarah Johnson",
      title: "Senior Frontend Architect",
      experience: "15+ years of experience in web development, React core contributor"
    }
  };

  // Mock data for training plan modal
  const availableSkills = [
    { id: 'react-proficiency', name: 'React proficiency', category: 'Technical', selected: true },
    { id: 'root-cause-analysis', name: 'Root-cause analysis', category: 'Operations', selected: false },
    { id: 'data-analytics', name: 'Data analytics', category: 'Analytics', selected: true },
    { id: 'figma-advanced', name: 'Figma advanced features', category: 'Design', selected: false },
    { id: 'leadership-management', name: 'Leadership & management', category: 'Soft Skills', selected: false },
    { id: 'effective-communication', name: 'Effective communication', category: 'Soft Skills', selected: false },
    { id: 'python-programming', name: 'Python programming', category: 'Technical', selected: false },
    { id: 'advanced-sql', name: 'Advanced SQL', category: 'Technical', selected: false }
  ];

  // Live courses from database
  const { data: coursesData, isLoading: coursesLoading } = useLearningCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const availableCourses = useMemo(() => {
    return (coursesData || []).map((course) => ({
      id: course.id,
      name: course.course_name,
      duration: course.duration_hours ? `${course.duration_hours} hours` : (course.course_type || 'Self-paced'),
      format: course.course_type || 'Self-paced',
      status: course.status,
      enrollment_open: course.enrollment_open,
      provider: course.provider || '—',
      courseData: course,
    }));
  }, [coursesData]);

  // Legacy mock data removed - using live data above
  const availableCourses_OLD = [
    { id: 'course-r-201', name: 'Course R-201: Advanced React Development', duration: '8 weeks', format: 'Self-paced', selected: true },
    { id: 'workshop-w-14', name: 'Workshop W-14: Root Cause Analysis', duration: '2 days', format: 'In-person', selected: false },
    { id: 'advanced-analytics', name: 'Advanced Analytics Course', duration: '10 weeks', format: 'Blended', selected: false },
    { id: 'leadership-fundamentals', name: 'Leadership Fundamentals', duration: '6 weeks', format: 'Online', selected: false },
    { id: 'advanced-python', name: 'Advanced Python Programming', duration: '8 weeks', format: 'Self-paced', selected: false }
  ];

  // Mock data for LMS integration
  const lmsConnectorsData = [
    {
      id: 1,
      name: "Moodle Prod",
      lastSync: "Today 10:15 am",
      enrollments: "42 pushed",
      completions: "37 pulled",
      status: "Connected"
    },
    {
      id: 2,
      name: "Canvas Update",
      lastSync: "---",
      enrollments: "0 pushed",
      completions: "0 pulled",
      status: "Disconnected"
    },
    {
      id: 3,
      name: "Blackboard Revamp",
      lastSync: "Yesterday 11:00 am",
      enrollments: "15 pushed",
      completions: "10 pulled",
      status: "Connected"
    }
  ];

  // Mock data for completion records
  const completionRecordsData = [
    {
      id: 1,
      learner: "Mark Robert",
      course: "Employee onboarding",
      hasRedDot: false,
      due: "30 Jun, 2025",
      dueOverdue: false,
      completed: "May 27, 2025",
      score: "84%",
      source: "LMS",
      status: "Completed",
      timeline: {
        enrolled: { date: "18 May, 2025", completed: true },
        started: { date: "20 May, 2025", completed: true },
        completed: { date: "27 May, 2025", completed: true }
      }
    },
    {
      id: 2,
      learner: "Sophia Turner",
      course: "Employee onboarding",
      hasRedDot: false,
      due: "30 Jun 2025",
      dueOverdue: false,
      completed: "27 May 2025",
      score: "84%",
      source: "LMS",
      status: "Completed"
    },
    {
      id: 3,
      learner: "James Lee",
      course: "Data privacy training",
      hasRedDot: true,
      due: "02 Jul 2025",
      dueOverdue: false,
      completed: "--",
      score: "--",
      source: "LMS",
      status: "Enrolled"
    },
    {
      id: 4,
      learner: "Emily Johnson",
      course: "First aid refresher",
      hasRedDot: false,
      due: "05 Aug 2025",
      dueOverdue: false,
      completed: "Jul 31, 2025",
      score: "99%",
      source: "Manual",
      status: "Completed"
    },
    {
      id: 5,
      learner: "Oliver Smith",
      course: "Cybersecurity awareness",
      hasRedDot: true,
      due: "12 Aug 2025",
      dueOverdue: true,
      completed: "--",
      score: "--",
      source: "LMS",
      status: "Overdue"
    }
  ];

  const employeeData = [
    { id: 1, name: 'Sarah Chen', department: 'Engineering', role: 'Software engineer', email: 'sarah.chen@company.com', selected: true },
    { id: 2, name: 'Marcus Lee', department: 'Engineering', role: 'Hardware engineer', email: 'marcus.lee@circuitepointe.com', selected: true },
    { id: 3, name: 'Emma Watson', department: 'Design', role: 'UI/UX designer', email: 'emma.watson@circuitepointe.com', selected: false },
    { id: 4, name: 'James Smith', department: 'Marketing', role: 'SEO specialist', email: 'james.smith@circuitepointe.com', selected: false },
    { id: 5, name: 'Olivia Brown', department: 'Sales', role: 'Sales manager', email: 'olivia.brown@circuitepointe.com', selected: true },
    { id: 6, name: 'Liam Johnson', department: 'Support', role: 'Customer support', email: 'liam.johnson@circuitepointe.com', selected: false },
    { id: 7, name: 'Sophia Miller', department: 'Finance', role: 'Financial analyst', email: 'sophia.miller@circuitepointe.com', selected: true },
    { id: 8, name: 'William Davis', department: 'HR', role: 'HR manager', email: 'william.davis@circuitepointe.com', selected: true }
  ];

  // Mock data for OCA surveys
  const ocaSurveysData = [
    {
      id: 1,
      orgTeam: 'Operation team',
      template: 'OCA v1',
      due: '30 Jun, 2025',
      program: 'Program A',
      responses: { completed: 54, total: 75 },
      progress: 72,
      action: 'View',
      domainScores: [
        { domain: 'Governance', score: 3.2, maxScore: 5 },
        { domain: 'HR', score: 2.8, maxScore: 5 },
        { domain: 'Finance', score: 3.9, maxScore: 5 }
      ],
      missingEvidence: [
        { title: 'HR Policy Documentation', subtitle: 'Required for HR domain' },
        { title: 'Financial Reports', subtitle: 'Required for Finance domain' }
      ]
    },
    {
      id: 2,
      orgTeam: 'Development team',
      template: 'OCA v2',
      due: '15 Jul, 2025',
      program: 'Program B',
      responses: { completed: 68, total: 80 },
      progress: 85,
      action: 'View',
      domainScores: [
        { domain: 'Governance', score: 4.1, maxScore: 5 },
        { domain: 'HR', score: 3.5, maxScore: 5 },
        { domain: 'Finance', score: 4.2, maxScore: 5 }
      ],
      missingEvidence: [
        { title: 'Governance Framework', subtitle: 'Required for Governance domain' }
      ]
    },
    {
      id: 3,
      orgTeam: 'Marketing team',
      template: 'OCA v3',
      due: '01 Aug, 2025',
      program: 'Program C',
      responses: { completed: 72, total: 80 },
      progress: 90,
      action: 'View',
      domainScores: [
        { domain: 'Governance', score: 4.3, maxScore: 5 },
        { domain: 'HR', score: 4.0, maxScore: 5 },
        { domain: 'Finance', score: 4.5, maxScore: 5 }
      ],
      missingEvidence: []
    },
    {
      id: 4,
      orgTeam: 'Sales team',
      template: 'OCA v4',
      due: '10 Sep, 2025',
      program: 'Program D',
      responses: { completed: 60, total: 77 },
      progress: 78,
      action: 'View',
      domainScores: [
        { domain: 'Governance', score: 3.8, maxScore: 5 },
        { domain: 'HR', score: 3.2, maxScore: 5 },
        { domain: 'Finance', score: 4.0, maxScore: 5 }
      ],
      missingEvidence: [
        { title: 'Sales Performance Reports', subtitle: 'Required for Finance domain' },
        { title: 'Team Structure Documentation', subtitle: 'Required for HR domain' }
      ]
    },
    {
      id: 5,
      orgTeam: 'HR team',
      template: 'OCA v5',
      due: '20 Oct, 2025',
      program: 'Program E',
      responses: { completed: 77, total: 77 },
      progress: 100,
      action: 'View',
      domainScores: [
        { domain: 'Governance', score: 4.8, maxScore: 5 },
        { domain: 'HR', score: 4.9, maxScore: 5 },
        { domain: 'Finance', score: 4.7, maxScore: 5 }
      ],
      missingEvidence: []
    }
  ];

  // Mock data for Capacity Scorecards
  const capacityScorecardsData = [
    {
      id: 1,
      organization: 'Org A',
      domains: {
        governance: 3.2,
        hr: 2.8,
        finance: 3.9,
        programs: 3.1,
        me: 2.5,
        it: 2.9
      }
    },
    {
      id: 2,
      organization: 'Org A',
      domains: {
        governance: 4.1,
        hr: 3.6,
        finance: 4.0,
        programs: 3.7,
        me: 3.1,
        it: 3.3
      }
    },
    {
      id: 3,
      organization: 'Org A',
      domains: {
        governance: 2.8,
        hr: 2.4,
        finance: 3.2,
        programs: 2.9,
        me: 2.2,
        it: 2.6
      }
    },
    {
      id: 4,
      organization: 'Org A',
      domains: {
        governance: 3.5,
        hr: 3.2,
        finance: 3.7,
        programs: 3.4,
        me: 2.9,
        it: 3.1
      }
    }
  ];

  // Mock data for Recommendations
  const recommendationsData = [
    {
      id: 1,
      finding: 'Low HR policy compliance (2.1) Org A',
      domain: 'HR',
      suggestion: 'Policy Essentials (course) 6 weeks',
      impact: 'High',
      action: 'Assign'
    },
    {
      id: 2,
      finding: 'Weak budgeting skills (2.4) Org B',
      domain: 'Finance',
      suggestion: 'Costing Workshop (workshop) 2 days',
      impact: 'Medium',
      action: 'Assign'
    },
    {
      id: 3,
      finding: 'M&E data quality issues (2.2) Org C',
      domain: 'M&E',
      suggestion: 'Data Quality Bootcamp (course) 4 weeks',
      impact: 'Low',
      action: 'Assign'
    },
    {
      id: 4,
      finding: 'IT security gaps (2.6) Org D',
      domain: 'IT',
      suggestion: 'Security Fundamentals (course) 3 weeks',
      impact: 'High',
      action: 'Assign'
    }
  ];

  const calendarEvents = [
    {
      id: 1,
      date: 4,
      title: 'Safety 101',
      attendance: '9/12',
      color: 'bg-green-200 text-green-800',
      details: {
        date: 'Tue, Oct 4 • 09:00 AM - 11:00 AM',
        capacity: { enrolled: 9, max: 12 },
        waitlist: 0,
        format: 'In person',
        location: 'Office - Training Room B',
        instructor: 'John Smith',
        course: 'Safety Fundamentals',
        attendees: [
          { name: 'Alex Brown', status: 'accepted' },
          { name: 'Jordan Smith', status: 'accepted' },
          { name: 'Taylor Johnson', status: 'accepted' },
          { name: 'Morgan Lee', status: 'accepted' },
          { name: 'Casey White', status: 'accepted' }
        ]
      }
    },
    {
      id: 2,
      date: 8,
      title: 'Leadership',
      attendance: '30/30',
      color: 'bg-blue-200 text-blue-800',
      icon: FileText,
      details: {
        date: 'Tue, Oct 8 • 08:00 AM - 12:00 PM',
        capacity: { enrolled: 4, max: 5 },
        waitlist: 3,
        format: 'In person',
        location: 'Office - Training Room A',
        instructor: 'Lisa Anderson',
        course: 'Leadership Fundamentals',
        attendees: [
          { name: 'Alex Brown', status: 'accepted' },
          { name: 'Jordan Smith', status: 'no-response' },
          { name: 'Taylor Johnson', status: 'accepted' },
          { name: 'Morgan Lee', status: 'accepted' },
          { name: 'Casey White', status: 'accepted' }
        ]
      }
    },
    {
      id: 3,
      date: 9,
      title: 'Leadership',
      attendance: '30/30',
      color: 'bg-blue-200 text-blue-800',
      icon: FileText,
      details: {
        date: 'Wed, Oct 9 • 08:00 AM - 12:00 PM',
        capacity: { enrolled: 4, max: 5 },
        waitlist: 3,
        format: 'In person',
        location: 'Office - Training Room A',
        instructor: 'Lisa Anderson',
        course: 'Leadership Fundamentals',
        attendees: [
          { name: 'Alex Brown', status: 'accepted' },
          { name: 'Jordan Smith', status: 'no-response' },
          { name: 'Taylor Johnson', status: 'accepted' },
          { name: 'Morgan Lee', status: 'accepted' },
          { name: 'Casey White', status: 'accepted' }
        ]
      }
    },
    {
      id: 4,
      date: 10,
      title: 'Leadership',
      attendance: '30/30',
      color: 'bg-blue-200 text-blue-800',
      icon: FileText,
      details: {
        date: 'Thu, Oct 10 • 08:00 AM - 12:00 PM',
        capacity: { enrolled: 4, max: 5 },
        waitlist: 3,
        format: 'In person',
        location: 'Office - Training Room A',
        instructor: 'Lisa Anderson',
        course: 'Leadership Fundamentals',
        attendees: [
          { name: 'Alex Brown', status: 'accepted' },
          { name: 'Jordan Smith', status: 'no-response' },
          { name: 'Taylor Johnson', status: 'accepted' },
          { name: 'Morgan Lee', status: 'accepted' },
          { name: 'Casey White', status: 'accepted' }
        ]
      }
    },
    {
      id: 5,
      date: 24,
      title: 'React Workshop',
      attendance: '15/15',
      color: 'bg-purple-200 text-purple-800',
      icon: FileText,
      details: {
        date: 'Thu, Oct 24 • 10:00 AM - 04:00 PM',
        capacity: { enrolled: 15, max: 15 },
        waitlist: 0,
        format: 'In person',
        location: 'Office - Conference Room B',
        instructor: 'Sarah Davis',
        course: 'React Development',
        attendees: [
          { name: 'Alex Brown', status: 'accepted' },
          { name: 'Jordan Smith', status: 'accepted' },
          { name: 'Taylor Johnson', status: 'accepted' },
          { name: 'Morgan Lee', status: 'accepted' },
          { name: 'Casey White', status: 'accepted' }
        ]
      }
    }
  ];

  // Live data for Training Needs Matrix
  const { data: trainingRecords = [], isLoading: trainingLoading } = useTrainingRecords();
  const { data: employeeList = [] } = useEmployees();
  const createTraining = useCreateTrainingRecord();

  const trainingNeedsData = useMemo(() => {
    const byEmployee = new Map(employeeList.map((e) => [e.id, e]));
    function levelFromPct(pct: number): 'L1' | 'L2' | 'L3' | 'L4' | 'L5' {
      if (pct >= 90) return 'L5';
      if (pct >= 75) return 'L4';
      if (pct >= 50) return 'L3';
      if (pct >= 25) return 'L2';
      return 'L1';
    }
    function gap(required: 'L1' | 'L2' | 'L3' | 'L4' | 'L5', current: 'L1' | 'L2' | 'L3' | 'L4' | 'L5') {
      const order = ['L1', 'L2', 'L3', 'L4', 'L5'];
      const diff = order.indexOf(required) - order.indexOf(current);
      return diff <= 0 ? 'L0' : (`L${diff}` as const);
    }
    const requiredDefault: 'L1' | 'L2' | 'L3' | 'L4' | 'L5' = 'L3';
    return trainingRecords.map((r) => {
      const emp = byEmployee.get(r.employee_id as unknown as string);
      const owner = emp ? `${emp.first_name} ${emp.last_name}` : '—';
      const role = emp?.position || '—';
      const team = emp?.department || '—';
      const currentLevel = levelFromPct(r.completion_percentage || 0);
      const reqLevel = requiredDefault; // MVP
      const due = r.end_date ? new Date(r.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
      return {
        id: r.id,
        role,
        team,
        skill: r.training_name,
        owner,
        required: reqLevel,
        current: currentLevel,
        due,
        gap: gap(reqLevel, currentLevel),
        plan: r.training_name,
        status: r.completion_status,
      };
    });
  }, [trainingRecords, employeeList]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(trainingNeedsData.map(item => item.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id]);
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id));
      setSelectAll(false);
    }
  };

  const isCreatePlanValid = useMemo(() => {
    return Boolean(createPlanForm.title && createPlanForm.skill && createPlanForm.level && createPlanForm.employeeId && createPlanForm.dueDate);
  }, [createPlanForm]);

  const handleCreatePlan = async () => {
    if (!isCreatePlanValid || createTraining.isPending) return;
    try {
      await createTraining.mutateAsync({
        employee_id: createPlanForm.employeeId,
        training_name: createPlanForm.title,
        training_type: 'plan',
        provider: 'Internal',
        start_date: new Date().toISOString().slice(0, 10),
        end_date: createPlanForm.dueDate,
        completion_status: 'pending',
        completion_percentage: 0,
        certificate_url: null as any,
        org_id: '' as any, // filled in hook
        id: '' as any,
        created_at: '' as any,
        updated_at: '' as any,
      } as any);
      setIsCreatePlanModalOpen(false);
      setCreatePlanForm({ title: '', skill: '', level: '', employeeId: '', dueDate: '', description: '', resources: '' });
    } catch (_) { }
  };

  const handleCancelCreatePlan = () => {
    if (createTraining.isPending) return;
    setIsCreatePlanModalOpen(false);
  };

  const handleCloseSkillGapModal = () => {
    setIsSkillGapModalOpen(false);
  };

  const handleAddToPlan = () => {
    // Here you would typically add the course to the user's learning plan
    console.log('Adding course to plan');
    handleCloseSkillGapModal();
  };

  const handleViewCourseDetails = () => {
    setSelectedCourse(courseData);
    setShowCourseDetail(true);
    setIsSkillGapModalOpen(false);
  };

  const handleEnrollNow = () => {
    setShowTrainingPlanView(true);
  };

  const handleBackToCourseDetail = () => {
    setShowTrainingPlanView(false);
  };

  const handleBackToTrainingNeeds = () => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
    setShowTrainingPlanView(false);
  };

  const handleSkillToggle = (skillId: string) => {
    setTrainingPlanForm(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.includes(skillId)
        ? prev.selectedSkills.filter(id => id !== skillId)
        : [...prev.selectedSkills, skillId]
    }));
  };

  const handleCourseToggle = (courseId: string) => {
    setTrainingPlanForm(prev => ({
      ...prev,
      selectedCourses: prev.selectedCourses.includes(courseId)
        ? prev.selectedCourses.filter(id => id !== courseId)
        : [...prev.selectedCourses, courseId]
    }));
  };

  const handleCreateTrainingPlan = () => {
    console.log('Creating training plan:', trainingPlanForm);
    setShowTrainingPlanView(false);
    setShowCourseDetail(false);
    setSelectedCourse(null);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', trainingPlanForm);
    setShowTrainingPlanView(false);
  };

  const handleViewEnrollmentDetails = (enrollment: any) => {
    setSelectedEnrollment(enrollment);
    setIsEnrollmentDetailsModalOpen(true);
  };

  const handleCloseEnrollmentDetailsModal = () => {
    setIsEnrollmentDetailsModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleMarkAsComplete = () => {
    console.log('Marking enrollment as complete:', selectedEnrollment);
    handleCloseEnrollmentDetailsModal();
  };

  const handleSendReminder = () => {
    console.log('Sending reminder for:', selectedEnrollment);
    handleCloseEnrollmentDetailsModal();
  };

  const handleAddSession = () => {
    setShowAddSessionView(true);
  };

  const handleBackToCompletionRecords = () => {
    setShowAddSessionView(false);
  };

  const handleSaveSessionDraft = () => {
    console.log('Saving session draft:', addSessionForm);
  };

  const handleCreateSession = () => {
    console.log('Creating session:', addSessionForm);
    setShowAddSessionView(false);
  };

  const handleBulkEnrollment = () => {
    setShowBulkEnrollmentView(true);
  };

  const handleBackToCompletionRecordsFromBulk = () => {
    setShowBulkEnrollmentView(false);
  };

  const handleSaveBulkEnrollmentDraft = () => {
    console.log('Saving bulk enrollment draft:', bulkEnrollmentForm);
  };

  const handleCreateBulkEnrollment = () => {
    console.log('Creating bulk enrollment:', bulkEnrollmentForm);
    setShowBulkEnrollmentView(false);
  };

  const handleEmployeeSelection = (employeeId: number, selected: boolean) => {
    const employee = employeeData.find(emp => emp.id === employeeId);
    if (employee) {
      if (selected) {
        setBulkEnrollmentForm(prev => ({
          ...prev,
          selectedEmployees: [...prev.selectedEmployees, employee.name]
        }));
      } else {
        setBulkEnrollmentForm(prev => ({
          ...prev,
          selectedEmployees: prev.selectedEmployees.filter(name => name !== employee.name)
        }));
      }
    }
  };

  const handleTimelineStatusUpdate = (status: 'enrolled' | 'started' | 'completed') => {
    if (selectedEnrollment) {
      console.log(`Updating timeline status to: ${status}`, selectedEnrollment);
      // Here you would typically update the enrollment status in your backend
      // For now, we'll just log the action
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleNewSession = () => {
    console.log('Creating new session');
  };

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
    setIsSessionDetailsModalOpen(true);
  };

  const handleCloseSessionDetailsModal = () => {
    setIsSessionDetailsModalOpen(false);
    setSelectedSession(null);
  };

  const handleSendInvites = () => {
    console.log('Sending invites for session:', selectedSession);
    handleCloseSessionDetailsModal();
  };

  // Survey Details Modal Handlers
  const handleViewSurveyDetails = (survey: any) => {
    setSelectedSurvey(survey);
    setIsSurveyDetailsModalOpen(true);
  };

  const handleCloseSurveyDetailsModal = () => {
    setIsSurveyDetailsModalOpen(false);
    setSelectedSurvey(null);
  };

  const handleSendSurveyReminder = () => {
    console.log('Sending reminder for survey:', selectedSurvey);
    handleCloseSurveyDetailsModal();
  };

  const handleExportData = () => {
    console.log('Exporting data for survey:', selectedSurvey);
    handleCloseSurveyDetailsModal();
  };

  // Domain Details View Handlers
  const handleViewDomainDetails = (org: any, domain: string, score: number) => {
    setSelectedDomainDetails({
      organization: org.organization,
      domain: domain,
      score: score,
      keyFindings: [
        { title: 'Limited documentation of processes', subtitle: 'Identified in survey responses' },
        { title: 'Inconsistent policy implementation', subtitle: 'Needs standardization' }
      ],
      evidence: [
        {
          filename: 'Organizational_Structure_2025.pdf',
          author: 'Sarah Johnson',
          date: '3/15/2025',
          size: '2.4 MB'
        },
        {
          filename: 'Board_meeting_2025.docs',
          author: 'Micheal Torres',
          date: '3/20/2025',
          size: '856 KB'
        }
      ],
      linkedTrainings: [
        { title: 'Governance Essentials', subtitle: '8 weeks • Online' }
      ]
    });
    setShowDomainDetailsView(true);
  };

  const handleCreateActionPlan = () => {
    console.log('Creating action plan for domain:', selectedDomainDetails);
    setShowCreateActionPlanView(true);
  };

  const handleBackToDomainDetails = () => {
    setShowCreateActionPlanView(false);
  };

  const handleBackToCapacityScorecards = () => {
    setShowDomainDetailsView(false);
    setShowCreateActionPlanView(false);
    setSelectedDomainDetails(null);
  };

  // Assign Recommendation Modal Handlers
  const handleAssignRecommendation = (recommendation: any) => {
    setSelectedRecommendation(recommendation);
    setIsAssignRecommendationModalOpen(true);
  };

  const handleCloseAssignRecommendationModal = () => {
    setIsAssignRecommendationModalOpen(false);
    setSelectedRecommendation(null);
  };

  const handleAssignTraining = () => {
    console.log('Assigning training:', selectedRecommendation, assignRecommendationForm);
    handleCloseAssignRecommendationModal();
  };

  // Assign Bundle Modal Handlers
  const handleAddToBundle = (recommendation: any) => {
    const newBundleItem = {
      id: Date.now(),
      ...recommendation
    };
    setBundleItems([...bundleItems, newBundleItem]);
    setBundleRecommendationIds(new Set([...bundleRecommendationIds, recommendation.id]));
    setIsAssignBundleModalOpen(true);
  };

  const handleRemoveFromBundle = (itemId: number) => {
    const itemToRemove = bundleItems.find(item => item.id === itemId);
    if (itemToRemove) {
      setBundleRecommendationIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemToRemove.id);
        return newSet;
      });
    }
    setBundleItems(bundleItems.filter(item => item.id !== itemId));
  };

  const handleRemoveFromBundleByRecommendationId = (recommendationId: number) => {
    setBundleRecommendationIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(recommendationId);
      return newSet;
    });
    setBundleItems(bundleItems.filter(item => item.id !== recommendationId));
  };

  const handleCloseAssignBundleModal = () => {
    setIsAssignBundleModalOpen(false);
    setBundleItems([]);
    // Don't clear bundleRecommendationIds - keep "In Bundle" state after assignment
  };

  const handleAssignBundleToTeam = () => {
    console.log('Assigning bundle to team:', bundleForm, bundleItems);

    // Mark all bundle items as "In Bundle" when assigned
    const assignedIds = bundleItems.map(item => item.id);
    setBundleRecommendationIds(new Set([...bundleRecommendationIds, ...assignedIds]));

    handleCloseAssignBundleModal();
  };

  // Helper function to get impact badge color
  const getImpactBadgeColor = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-muted/500 text-white';
    }
  };

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score < 2.5) return 'bg-red-500 text-white';
    if (score >= 2.5 && score <= 3.5) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };

  const filteredData = trainingNeedsData.filter(item => {
    const matchesSearch = searchQuery === '' ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getLevelBadgeColor = (level: string, type: 'required' | 'current' | 'gap') => {
    if (type === 'gap') {
      return 'bg-red-500 text-white';
    }
    return 'bg-muted text-muted-foreground';
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Connected') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'Disconnected') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-muted text-muted-foreground';
  };

  const getCompletionStatusBadgeColor = (status: string) => {
    if (status === 'Completed') {
      return 'bg-green-100 text-green-800';
    } else if (status === 'Overdue') {
      return 'bg-red-100 text-red-800';
    } else if (status === 'Enrolled') {
      return 'bg-blue-100 text-blue-800';
    }
    return 'bg-muted text-muted-foreground';
  };

  // Training Plan View Component
  const TrainingPlanView = ({ course, onBack }: { course: any, onBack: () => void }) => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Course details</span>
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Create training plan</span>
        </div>

        {/* Course Overview Section */}
        <div className="space-y-4">
          {/* Course Tags */}
          <div className="flex space-x-2">
            <Badge className="bg-gray-900 text-white px-3 py-1 text-sm font-medium">
              Technical
            </Badge>
            <Badge className="bg-muted text-muted-foreground px-3 py-1 text-sm font-medium">
              Intermediate
            </Badge>
            <Badge className="bg-muted text-muted-foreground px-3 py-1 text-sm font-medium">
              Target: L3
            </Badge>
          </div>

          {/* Course Title */}
          <h1 className="text-3xl font-bold text-foreground">Course R-201: Advanced react development</h1>

          {/* Course Description */}
          <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl">
            Master advanced React concepts including hooks, context, performance optimization, and modern patterns. This comprehensive course will take you from intermediate to advanced React proficiency.
          </p>

          {/* Course Stats */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>8 weeks</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Self-paced</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>24/30 enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>4.8 (156 reviews)</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                <p className="text-sm text-muted-foreground">General details about the training plan</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="planName" className="text-sm font-medium text-foreground">
                    Plan Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="planName"
                    placeholder="e.g., Q2 2025 React Upskilling Program"
                    value={trainingPlanForm.planName}
                    onChange={(e) => setTrainingPlanForm(prev => ({ ...prev, planName: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the purpose and goals of this training plan..."
                    value={trainingPlanForm.description}
                    onChange={(e) => setTrainingPlanForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="targetRole" className="text-sm font-medium text-foreground">
                      Target Role <span className="text-red-500">*</span>
                    </Label>
                    <Select value={trainingPlanForm.targetRole} onValueChange={(value) => setTrainingPlanForm(prev => ({ ...prev, targetRole: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="se-ii">SE II</SelectItem>
                        <SelectItem value="se-iii">SE III</SelectItem>
                        <SelectItem value="se-iv">SE IV</SelectItem>
                        <SelectItem value="se-v">SE V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm font-medium text-foreground">Priority</Label>
                    <Select value={trainingPlanForm.priority} onValueChange={(value) => setTrainingPlanForm(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills to Address */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Skills to Address <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-muted-foreground">Select the skill gaps this plan will address</p>
              </div>

              <div className="space-y-3">
                {availableSkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={skill.id}
                        checked={trainingPlanForm.selectedSkills.includes(skill.id)}
                        onCheckedChange={() => handleSkillToggle(skill.id)}
                      />
                      <div>
                        <Label htmlFor={skill.id} className="text-sm font-medium text-foreground cursor-pointer">
                          {skill.name}
                        </Label>
                      </div>
                    </div>
                    <Badge className="bg-muted text-muted-foreground px-2 py-1 text-xs font-medium">
                      {skill.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses & Activities */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Courses & Activities <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-muted-foreground">Select courses and learning activities for this plan</p>
              </div>

              <div className="space-y-3">
                {availableCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={course.id}
                        checked={trainingPlanForm.selectedCourses.includes(course.id)}
                        onCheckedChange={() => handleCourseToggle(course.id)}
                      />
                      <div>
                        <Label htmlFor={course.id} className="text-sm font-medium text-foreground cursor-pointer">
                          {course.name}
                        </Label>
                        <p className="text-xs text-muted-foreground">{course.duration} · {course.format}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium text-foreground">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes or instructions..."
                  value={trainingPlanForm.notes}
                  onChange={(e) => setTrainingPlanForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Plan Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="planOwner" className="text-sm font-medium text-foreground">
                    Plan Owner <span className="text-red-500">*</span>
                  </Label>
                  <Select value={trainingPlanForm.planOwner} onValueChange={(value) => setTrainingPlanForm(prev => ({ ...prev, planOwner: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Assign owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jane-doe">Jane Doe</SelectItem>
                      <SelectItem value="john-smith">John Smith</SelectItem>
                      <SelectItem value="emily-johnson">Emily Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="startDate" className="text-sm font-medium text-foreground">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={trainingPlanForm.startDate}
                    onChange={(e) => setTrainingPlanForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                    Due Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={trainingPlanForm.dueDate}
                    onChange={(e) => setTrainingPlanForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                    <span className="text-sm text-foreground">Priority: {trainingPlanForm.priority}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground">Skills ({trainingPlanForm.selectedSkills.length})</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {trainingPlanForm.selectedSkills.map(skillId => {
                        const skill = availableSkills.find(s => s.id === skillId);
                        return skill ? (
                          <Badge key={skillId} className="bg-muted text-muted-foreground px-2 py-1 text-xs">
                            {skill.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground">Courses ({trainingPlanForm.selectedCourses.length})</h4>
                    <div className="space-y-1 mt-2">
                      {trainingPlanForm.selectedCourses.map(courseId => {
                        const course = availableCourses.find(c => c.id === courseId);
                        return course ? (
                          <div key={courseId} className="text-xs text-muted-foreground">
                            <div className="font-medium">{course.name}</div>
                            <div>{course.duration}</div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleSaveDraft}>
            Save draft
          </Button>
          <Button onClick={handleCreateTrainingPlan} className="bg-gray-900 hover:bg-gray-800 text-white">
            Create plan
          </Button>
        </div>
      </div>
    );
  };

  // Create Action Plan View Component
  const CreateActionPlanView = ({ onBack }: { onBack: () => void }) => {
    if (!selectedDomainDetails) return null;

    const handleFormSubmit = () => {
      console.log('Creating action plan:', actionPlanForm);
      // Navigate back to capacity scorecards
      setShowCreateActionPlanView(false);
      setShowDomainDetailsView(false);
      setSelectedDomainDetails(null);
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4 cursor-pointer" onClick={onBack} />
          <span>Capacity scorecards / Domain details / Create action plan</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create action plan</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedDomainDetails.organization} • {selectedDomainDetails.domain} (Score: {selectedDomainDetails.score})
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Plan Title */}
              <div>
                <Label htmlFor="planTitle" className="text-sm font-medium text-foreground">Plan title</Label>
                <Input
                  id="planTitle"
                  placeholder="Enter plan title"
                  value={actionPlanForm.planTitle}
                  onChange={(e) => setActionPlanForm({ ...actionPlanForm, planTitle: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Description & Objectives */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-foreground">Description & Objectives</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the objectives and expected outcomes of this action plan"
                  value={actionPlanForm.description}
                  onChange={(e) => setActionPlanForm({ ...actionPlanForm, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Priority and Target Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority" className="text-sm font-medium text-foreground">Priority</Label>
                  <Select value={actionPlanForm.priority} onValueChange={(value) => setActionPlanForm({ ...actionPlanForm, priority: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="targetDate" className="text-sm font-medium text-foreground">Target Completion Date</Label>
                  <Input
                    id="targetDate"
                    type="date"
                    value={actionPlanForm.targetCompletionDate}
                    onChange={(e) => setActionPlanForm({ ...actionPlanForm, targetCompletionDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Assigned To */}
              <div>
                <Label htmlFor="assignedTo" className="text-sm font-medium text-foreground">Assigned to</Label>
                <Select value={actionPlanForm.assignedTo} onValueChange={(value) => setActionPlanForm({ ...actionPlanForm, assignedTo: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="michael-torres">Michael Torres</SelectItem>
                    <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Budget */}
              <div>
                <Label htmlFor="budget" className="text-sm font-medium text-foreground">Estimated Budget (Optional)</Label>
                <div className="flex mt-1">
                  <Select value={actionPlanForm.currency} onValueChange={(value) => setActionPlanForm({ ...actionPlanForm, currency: value })}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0.00"
                    value={actionPlanForm.estimatedBudget}
                    onChange={(e) => setActionPlanForm({ ...actionPlanForm, estimatedBudget: e.target.value })}
                    className="ml-2"
                  />
                </div>
              </div>

              {/* Key Actions & Steps */}
              <div>
                <Label htmlFor="keyActions" className="text-sm font-medium text-foreground">Key Actions & Steps</Label>
                <Textarea
                  id="keyActions"
                  placeholder="List the specific actions and steps to be taken to achieve the objectives"
                  value={actionPlanForm.keyActions}
                  onChange={(e) => setActionPlanForm({ ...actionPlanForm, keyActions: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>

              {/* Linked Trainings */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">Linked Trainings</h3>
                  <Badge className="bg-green-100 text-green-800 text-xs">Recommended</Badge>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium text-foreground">{selectedDomainDetails.linkedTrainings[0]?.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{selectedDomainDetails.linkedTrainings[0]?.subtitle}</p>
                </div>
              </div>

              {/* Information Alert */}
              <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-violet-600 mt-0.5" />
                  <p className="text-sm text-violet-800">
                    This action plan will automatically create a training need in the Training Needs Matrix with the linked training course.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Create
          </Button>
        </div>
      </div>
    );
  };

  // Domain Details View Component
  const DomainDetailsView = ({ onBack }: { onBack: () => void }) => {
    if (!selectedDomainDetails) return null;

    const getScoreBackgroundColor = (score: number) => {
      if (score < 2.5) return 'bg-red-100';
      if (score >= 2.5 && score <= 3.5) return 'bg-yellow-100';
      return 'bg-green-100';
    };

    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4 cursor-pointer" onClick={onBack} />
          <span>Capacity scorecards / Domain details</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Domain details</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedDomainDetails.organization} • {selectedDomainDetails.domain}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Score Card */}
          <div className="lg:col-span-1">
            <Card className={`${getScoreBackgroundColor(selectedDomainDetails.score)}`}>
              <CardContent className="p-6 text-center">
                <div className="text-sm font-medium text-muted-foreground mb-2">Score</div>
                <div className="text-4xl font-bold text-foreground">{selectedDomainDetails.score}</div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Key Findings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Key findings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDomainDetails.keyFindings.map((finding: any, index: number) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-sm font-medium text-foreground">{finding.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{finding.subtitle}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Evidence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Evidence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDomainDetails.evidence.map((file: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-8 w-8 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{file.filename}</h4>
                          <div className="text-xs text-muted-foreground mt-1">
                            <div>{file.author}</div>
                            <div>{file.date}</div>
                            <div>{file.size}</div>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Linked Trainings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Linked trainings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDomainDetails.linkedTrainings.map((training: any, index: number) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium text-foreground">{training.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{training.subtitle}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateActionPlan}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Create action plan
          </Button>
        </div>
      </div>
    );
  };

  // Team Attendance Calendar Component
  const TeamAttendanceCalendar = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const monthName = monthNames[month];

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get starting day of week (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1; // Convert to Monday = 0

    // Generate calendar days
    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < adjustedStartDay; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    // Get events for a specific day
    const getEventsForDay = (day: number) => {
      return calendarEvents.filter(event => event.date === day);
    };

    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Attendance Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">Plan training sessions and visualize team availability</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            <Button
              onClick={handleNewSession}
              className="bg-violet-600 hover:bg-violet-700 text-white flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New session</span>
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">{monthName} {year}</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
              <span className="ml-1">Previous</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <span className="mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {/* Day Headers */}
              {dayNames.map((day) => (
                <div key={day} className="bg-muted/50 p-3 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                const events = day ? getEventsForDay(day) : [];

                return (
                  <div
                    key={index}
                    className="bg-card min-h-[120px] p-2 border-r border-b border-gray-200"
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium text-foreground mb-2">{day}</div>

                        {/* Events */}
                        <div className="space-y-1">
                          {events.map((event) => {
                            const IconComponent = event.icon || FileText;
                            return (
                              <div
                                key={event.id}
                                className={`${event.color} rounded px-2 py-1 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                                onClick={() => handleSessionClick(event)}
                              >
                                <div className="flex items-center space-x-1">
                                  {event.icon && <IconComponent className="h-3 w-3" />}
                                  <span className="truncate">{event.title}</span>
                                </div>
                                <div className="text-xs opacity-75 mt-0.5">{event.attendance}</div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Bulk Enrollment View Component
  const BulkEnrollmentView = ({ onBack }: { onBack: () => void }) => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Completion records</span>
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Bulk enrollment</span>
        </div>

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk enrollment</h1>
          <p className="text-sm text-muted-foreground mt-1">Enroll multiple employees into a training session</p>
        </div>

        {/* Available Sessions Alert */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 flex items-start space-x-3">
          <div className="w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">i</span>
          </div>
          <div>
            <p className="text-sm text-violet-800">
              <span className="font-medium">5 training sessions</span> available for enrollment. Sessions are created in the 'Add Session' page and appear here once they're open for registration.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Select Training Session */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Select Training Session</CardTitle>
                <p className="text-sm text-muted-foreground">Choose the session to enroll employees into</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="session" className="text-sm font-medium text-foreground">
                    Session <span className="text-red-500">*</span>
                  </Label>
                  <Select value={bulkEnrollmentForm.selectedSession} onValueChange={(value) => setBulkEnrollmentForm(prev => ({ ...prev, selectedSession: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="React Development">React Development</SelectItem>
                      <SelectItem value="Project Management">Project Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Spots:</span>
                    <span className="font-medium text-foreground">0/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instructor:</span>
                    <span className="font-medium text-foreground">Lisa Anderson</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="font-medium text-foreground">In-person</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Start date - End date:</span>
                    <span className="font-medium text-foreground">October 4th, 2025 - October 6th, 2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium text-foreground">October 2th, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Method */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">Enrollment Method</CardTitle>
                    <p className="text-sm text-muted-foreground">Choose how you want to select employees</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-foreground">Employee</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.map((employee) => (
                        <tr key={employee.id} className="border-b border-gray-200 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={bulkEnrollmentForm.selectedEmployees.includes(employee.name)}
                                onCheckedChange={(checked) => handleEmployeeSelection(employee.id, checked as boolean)}
                              />
                              <span className="text-foreground font-medium">{employee.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-foreground">{employee.department}</td>
                          <td className="py-3 px-4 text-foreground">{employee.role}</td>
                          <td className="py-3 px-4 text-foreground">{employee.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-muted-foreground">
                    Showing 1 to 8 of 50 employees
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enrollment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">Enrollment Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="sendNotifications"
                    checked={bulkEnrollmentForm.sendNotifications}
                    onCheckedChange={(checked) => setBulkEnrollmentForm(prev => ({ ...prev, sendNotifications: checked as boolean }))}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="sendNotifications" className="text-sm font-medium text-foreground">
                      Send enrollment notifications
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Employees will receive email notifications about their enrollment
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="requireManagerApproval"
                    checked={bulkEnrollmentForm.requireManagerApproval}
                    onCheckedChange={(checked) => setBulkEnrollmentForm(prev => ({ ...prev, requireManagerApproval: checked as boolean }))}
                    className="mt-1"
                  />
                  <div>
                    <Label htmlFor="requireManagerApproval" className="text-sm font-medium text-foreground">
                      Require manager approval
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enrollment will be pending until approved by each employee's manager
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Draft Button */}
            <div className="pt-4">
              <Button variant="outline" onClick={handleSaveBulkEnrollmentDraft}>
                Save draft
              </Button>
            </div>
          </div>

          {/* Right Sidebar - Enrollment Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Session</div>
                  <div className="space-y-1 text-sm text-foreground">
                    <div className="font-medium">{bulkEnrollmentForm.selectedSession}</div>
                    <div className="text-muted-foreground">Leadership Fundamentals</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Capacity</div>
                  <div className="flex items-center space-x-2 text-sm text-foreground">
                    <Users className="h-4 w-4" />
                    <span>5 spots available</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Selected employees</div>
                  <div className="text-sm font-medium text-foreground">{bulkEnrollmentForm.selectedEmployees.length}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Options</div>
                  <div className="space-y-2 text-sm text-foreground">
                    {bulkEnrollmentForm.sendNotifications && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Email notifications</span>
                      </div>
                    )}
                    {bulkEnrollmentForm.requireManagerApproval && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Manager approval</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Switch Module</span>
          </div>
          <Button onClick={handleCreateBulkEnrollment} className="bg-violet-600 hover:bg-violet-700 text-white">
            Create
          </Button>
        </div>
      </div>
    );
  };

  // Add Session View Component
  const AddSessionView = ({ onBack }: { onBack: () => void }) => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Completion records</span>
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Add training session</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content - Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Add training session</CardTitle>
                <p className="text-sm text-muted-foreground">Create a new session for an existing course</p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                    <p className="text-sm text-muted-foreground">General details about the training session</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="course" className="text-sm font-medium text-foreground">
                        Course <span className="text-red-500">*</span>
                      </Label>
                      <Select value={addSessionForm.course} onValueChange={(value) => setAddSessionForm(prev => ({ ...prev, course: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Leadership Fundamentals">Leadership Fundamentals</SelectItem>
                          <SelectItem value="React Development">React Development</SelectItem>
                          <SelectItem value="Project Management">Project Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sessionName" className="text-sm font-medium text-foreground">
                        Session name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="sessionName"
                        value={addSessionForm.sessionName}
                        onChange={(e) => setAddSessionForm(prev => ({ ...prev, sessionName: e.target.value }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what makes this session unique..."
                        value={addSessionForm.description}
                        onChange={(e) => setAddSessionForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessionFormat" className="text-sm font-medium text-foreground">
                          Session Format <span className="text-red-500">*</span>
                        </Label>
                        <Select value={addSessionForm.sessionFormat} onValueChange={(value) => setAddSessionForm(prev => ({ ...prev, sessionFormat: value }))}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In-person">In-person</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                            <SelectItem value="Blended">Blended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="duration" className="text-sm font-medium text-foreground">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 2 hours"
                          value={addSessionForm.duration}
                          onChange={(e) => setAddSessionForm(prev => ({ ...prev, duration: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location" className="text-sm font-medium text-foreground">
                        Location <span className="text-red-500">*</span>
                      </Label>
                      <Select value={addSessionForm.location} onValueChange={(value) => setAddSessionForm(prev => ({ ...prev, location: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Office - Training Room A">Office - Training Room A</SelectItem>
                          <SelectItem value="Office - Conference Room B">Office - Conference Room B</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Schedule</h3>
                    <p className="text-sm text-muted-foreground">Set dates and times for this session</p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="startDate" className="text-sm font-medium text-foreground">
                          Start date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={addSessionForm.startDate}
                          onChange={(e) => setAddSessionForm(prev => ({ ...prev, startDate: e.target.value }))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="endDate" className="text-sm font-medium text-foreground">
                          End date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={addSessionForm.endDate}
                          onChange={(e) => setAddSessionForm(prev => ({ ...prev, endDate: e.target.value }))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="registrationDeadline" className="text-sm font-medium text-foreground">
                          Registration deadline <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="registrationDeadline"
                          type="date"
                          value={addSessionForm.registrationDeadline}
                          onChange={(e) => setAddSessionForm(prev => ({ ...prev, registrationDeadline: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-foreground">Session Times (Optional)</Label>
                      <div className="space-y-3 mt-2">
                        {addSessionForm.sessionTimes.map((time, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Input
                              type="date"
                              value={time.date}
                              onChange={(e) => {
                                const newTimes = [...addSessionForm.sessionTimes];
                                newTimes[index].date = e.target.value;
                                setAddSessionForm(prev => ({ ...prev, sessionTimes: newTimes }));
                              }}
                              className="flex-1"
                            />
                            <Input
                              type="time"
                              value={time.startTime}
                              onChange={(e) => {
                                const newTimes = [...addSessionForm.sessionTimes];
                                newTimes[index].startTime = e.target.value;
                                setAddSessionForm(prev => ({ ...prev, sessionTimes: newTimes }));
                              }}
                              className="flex-1"
                            />
                            <span className="text-muted-foreground">to</span>
                            <Input
                              type="time"
                              value={time.endTime}
                              onChange={(e) => {
                                const newTimes = [...addSessionForm.sessionTimes];
                                newTimes[index].endTime = e.target.value;
                                setAddSessionForm(prev => ({ ...prev, sessionTimes: newTimes }));
                              }}
                              className="flex-1"
                            />
                          </div>
                        ))}
                        <Button variant="outline" size="sm" className="text-xs">
                          + Add Time
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instructor & Capacity */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Instructor & Capacity</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="instructor" className="text-sm font-medium text-foreground">
                        Instructor <span className="text-red-500">*</span>
                      </Label>
                      <Select value={addSessionForm.instructor} onValueChange={(value) => setAddSessionForm(prev => ({ ...prev, instructor: value }))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lisa Anderson - Leadership Coach">Lisa Anderson - Leadership Coach</SelectItem>
                          <SelectItem value="John Smith - Technical Trainer">John Smith - Technical Trainer</SelectItem>
                          <SelectItem value="Sarah Davis - Project Manager">Sarah Davis - Project Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="maxCapacity" className="text-sm font-medium text-foreground">Maximum capacity</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        value={addSessionForm.maxCapacity}
                        onChange={(e) => setAddSessionForm(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                        className="mt-1"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowWaitlist"
                        checked={addSessionForm.allowWaitlist}
                        onCheckedChange={(checked) => setAddSessionForm(prev => ({ ...prev, allowWaitlist: checked as boolean }))}
                      />
                      <Label htmlFor="allowWaitlist" className="text-sm font-medium text-foreground">
                        Allow waitlist
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Session Settings */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Session settings</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="requireManagerApproval"
                        checked={addSessionForm.requireManagerApproval}
                        onCheckedChange={(checked) => setAddSessionForm(prev => ({ ...prev, requireManagerApproval: checked as boolean }))}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor="requireManagerApproval" className="text-sm font-medium text-foreground">
                          Require manager approval for enrollment
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enrollments will be pending until approved by participant's manager
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="markAsMandatory"
                        checked={addSessionForm.markAsMandatory}
                        onCheckedChange={(checked) => setAddSessionForm(prev => ({ ...prev, markAsMandatory: checked as boolean }))}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor="markAsMandatory" className="text-sm font-medium text-foreground">
                          Mark as mandatory training
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          This session will be flagged as required compliance training
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="sendNotifications"
                        checked={addSessionForm.sendNotifications}
                        onCheckedChange={(checked) => setAddSessionForm(prev => ({ ...prev, sendNotifications: checked as boolean }))}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor="sendNotifications" className="text-sm font-medium text-foreground">
                          Send enrollment notifications
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Participants will receive email confirmations and reminders
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Prerequisites</h3>
                  </div>

                  <div>
                    <Textarea
                      placeholder="List any prerequisites or requirements..."
                      value={addSessionForm.prerequisites}
                      onChange={(e) => setAddSessionForm(prev => ({ ...prev, prerequisites: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Internal Notes */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Internal Notes</h3>
                  </div>

                  <div>
                    <Textarea
                      placeholder="Add any notes for coordinators or admins..."
                      value={addSessionForm.internalNotes}
                      onChange={(e) => setAddSessionForm(prev => ({ ...prev, internalNotes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>

                {/* Save Draft Button */}
                <div className="pt-4">
                  <Button variant="outline" onClick={handleSaveSessionDraft}>
                    Save draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Session Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Session Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Course</div>
                  <div className="text-sm font-medium text-foreground">{addSessionForm.course}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Format</div>
                  <Badge className="bg-muted text-muted-foreground px-2 py-1 text-xs font-medium">
                    {addSessionForm.sessionFormat}
                  </Badge>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Schedule</div>
                  <div className="space-y-1 text-sm text-foreground">
                    <div>Start date: {new Date(addSessionForm.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <div>End date: {new Date(addSessionForm.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    <div>Registration closes: {new Date(addSessionForm.registrationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Instructor</div>
                  <div className="space-y-1 text-sm text-foreground">
                    <div>{addSessionForm.instructor.split(' - ')[0]}</div>
                    <div className="text-muted-foreground">{addSessionForm.instructor.split(' - ')[1]}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Capacity</div>
                  <div className="flex items-center space-x-2 text-sm text-foreground">
                    <Users className="h-4 w-4" />
                    <span>{addSessionForm.maxCapacity} participants</span>
                  </div>
                  {addSessionForm.allowWaitlist && (
                    <div className="text-xs text-muted-foreground mt-1">Waitlist enabled</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Switch Module</span>
          </div>
          <Button onClick={handleCreateSession} className="bg-violet-600 hover:bg-violet-700 text-white">
            Create session
          </Button>
        </div>
      </div>
    );
  };

  // Course Detail View Component
  const CourseDetailView = ({ course, onBack }: { course: any, onBack: () => void }) => {
    const [activeDetailTab, setActiveDetailTab] = useState('overview');

    // Map database course to UI format
    const courseName = course?.course_name || 'Untitled Course';
    const courseDescription = course?.description || 'No description available.';
    const courseCategory = course?.category || 'General';
    const courseLevel = course?.level || 'All Levels';
    const courseType = course?.course_type || 'Self-paced';
    const duration = course?.duration_hours ? `${course.duration_hours} hours` : 'Self-paced';
    const provider = course?.provider || 'Internal';
    const status = course?.status || 'active';
    const enrollmentOpen = course?.enrollment_open ?? false;

    // Get enrollment count from training records
    const { data: trainingRecords = [] } = useTrainingRecords();
    const enrollmentCount = trainingRecords.filter(tr => tr.training_name === courseName).length;

    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Training needs</span>
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">View course details</span>
        </div>

        {/* Course Header */}
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex space-x-2">
            {courseCategory && (
              <Badge className="bg-gray-900 text-white px-3 py-1 text-sm font-medium">
                {courseCategory}
              </Badge>
            )}
            {courseLevel && (
              <Badge className="bg-muted text-muted-foreground px-3 py-1 text-sm font-medium">
                {courseLevel}
              </Badge>
            )}
            <Badge className={`px-3 py-1 text-sm font-medium ${enrollmentOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {enrollmentOpen ? 'Enrollment Open' : 'Enrollment Closed'}
            </Badge>
          </div>

          {/* Course Title */}
          <h1 className="text-3xl font-bold text-foreground">{courseName}</h1>

          {/* Course Description */}
          <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl">
            {courseDescription}
          </p>

          {/* Course Stats */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>{courseType}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{enrollmentCount} enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <Badge className={`px-2 py-1 text-xs ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {status}
              </Badge>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted max-w-md">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="curriculum"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="instructor"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
              >
                Instructor
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab}>
              <TabsContent value="overview" className="space-y-6">
                {/* Course Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-violet-600" />
                      <span>Course Information</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Details about this course</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-foreground">Category:</span>
                        <p className="text-sm text-muted-foreground mt-1">{courseCategory}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Level:</span>
                        <p className="text-sm text-muted-foreground mt-1">{courseLevel}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Type:</span>
                        <p className="text-sm text-muted-foreground mt-1">{courseType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Provider:</span>
                        <p className="text-sm text-muted-foreground mt-1">{provider}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Duration:</span>
                        <p className="text-sm text-muted-foreground mt-1">{duration}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">Status:</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          <Badge className={`px-2 py-1 text-xs ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {status}
                          </Badge>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                    <p className="text-sm text-muted-foreground">Course overview and details</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{courseDescription}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">Course Structure</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Course format and delivery method
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-card border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{courseName}</h3>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Format:</span> {courseType}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Duration:</span> {duration}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Category:</span> {courseCategory}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Level:</span> {courseLevel}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Detailed curriculum information will be available once course modules are added.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-foreground">Provider Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{provider}</h2>
                        <p className="text-lg text-muted-foreground mt-1">Course Provider</p>
                      </div>

                      <div>
                        <p className="text-muted-foreground leading-relaxed">
                          This course is provided by {provider}. For more information about the course provider, please contact your HR department.
                        </p>
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="outline"
                          className="border-gray-300 text-muted-foreground hover:bg-muted/50"
                        >
                          Contact Provider
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Enrollment Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Duration</span>
                  </div>
                  <p className="text-foreground font-medium">{duration}</p>

                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Format</span>
                  </div>
                  <p className="text-foreground font-medium">{courseType}</p>
                </div>

                {/* Enrollment Status */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Enrollment</span>
                  </div>
                  <p className="text-foreground font-medium">{enrollmentCount} enrolled</p>
                  <Badge className={`w-full justify-center ${enrollmentOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {enrollmentOpen ? 'Enrollment Open' : 'Enrollment Closed'}
                  </Badge>
                </div>

                {/* Course Status */}
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={`w-full justify-center ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {status}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                    onClick={handleEnrollNow}
                  >
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Training Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Learning & development</h1>
      </div>

      {/* Conditional Rendering */}
      {showCreateActionPlanView ? (
        <CreateActionPlanView onBack={handleBackToDomainDetails} />
      ) : showDomainDetailsView ? (
        <DomainDetailsView onBack={handleBackToCapacityScorecards} />
      ) : showBulkEnrollmentView ? (
        <BulkEnrollmentView onBack={handleBackToCompletionRecordsFromBulk} />
      ) : showAddSessionView ? (
        <AddSessionView onBack={handleBackToCompletionRecords} />
      ) : showTrainingPlanView && selectedCourse ? (
        <TrainingPlanView course={selectedCourse} onBack={handleBackToCourseDetail} />
      ) : showCourseDetail && selectedCourse ? (
        <CourseDetailView course={selectedCourse} onBack={handleBackToTrainingNeeds} />
      ) : (
        <>
          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-muted">
              <TabsTrigger
                value="training-needs"
                className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
              >
                Training needs
              </TabsTrigger>
              <TabsTrigger
                value="lms-integration"
                className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
              >
                LMS integration
              </TabsTrigger>
              <TabsTrigger
                value="completion-records"
                className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
              >
                Completion records
              </TabsTrigger>
              <TabsTrigger
                value="team-attendance"
                className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
              >
                Team attendance calendar
              </TabsTrigger>
              <TabsTrigger
                value="oca"
                className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
              >
                OCA
              </TabsTrigger>
            </TabsList>

            {/* Training Needs Tab Content */}
            <TabsContent value="training-needs" className="space-y-6 mt-6">
              {/* Training Needs Matrix Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Training Needs Matrix</CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Input
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      </div>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                      <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2" onClick={() => setIsSkillGapModalOpen(true)}>
                        <Plus className="h-4 w-4" />
                        <span>Create plan</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>

                  {/* Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">
                            <Checkbox
                              checked={selectAll}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Role / Teams</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Skill</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Owner</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Required</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Current</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Due</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Gap</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Plan</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((item) => (
                          <tr key={item.id} className="border-b border-gray-200 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Checkbox
                                checked={selectedRows.includes(item.id)}
                                onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-medium text-foreground">{item.role}</div>
                                <div className="text-sm text-muted-foreground">({item.team})</div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-foreground">{item.skill}</td>
                            <td className="py-3 px-4 text-foreground">{item.owner}</td>
                            <td className="py-3 px-4">
                              <Badge className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelBadgeColor(item.required, 'required')}`}>
                                {item.required}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelBadgeColor(item.current, 'current')}`}>
                                {item.current}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-foreground">{item.due}</td>
                            <td className="py-3 px-4">
                              <Badge className={`px-2 py-1 text-xs rounded-full font-medium ${getLevelBadgeColor(item.gap, 'gap')}`}>
                                {item.gap}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-foreground">{item.plan}</td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => setIsSkillGapModalOpen(true)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">View</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LMS Integration Tab Content */}
            <TabsContent value="lms-integration" className="space-y-6 mt-6">
              {/* LMS Integration Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Training Needs Matrix</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Connect to external learning management systems</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                      <Button className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Add connector</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* LMS Connectors Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">
                            <Checkbox />
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Provider</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Format</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Enrollment</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesLoading ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>Loading courses…</td></tr>
                        ) : availableCourses.length === 0 ? (
                          <tr><td className="py-6 px-4 text-muted-foreground" colSpan={7}>No courses found.</td></tr>
                        ) : availableCourses.map((course) => (
                          <tr key={course.id} className="border-b border-gray-200 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Checkbox />
                            </td>
                            <td className="py-3 px-4 text-foreground font-medium">{course.name}</td>
                            <td className="py-3 px-4 text-foreground">{course.provider}</td>
                            <td className="py-3 px-4 text-foreground">{course.format}</td>
                            <td className="py-3 px-4">
                              <Badge className="px-2 py-1 text-xs rounded-full font-medium">{course.status}</Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateCourse.mutate({ id: course.id, updates: { enrollment_open: !course.enrollment_open } })}
                                disabled={updateCourse.isPending}
                              >
                                {course.enrollment_open ? 'Open' : 'Closed'}
                              </Button>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => {
                                  setSelectedCourse(course.courseData);
                                  setShowCourseDetail(true);
                                }}>
                                  <Eye className="h-4 w-4" />
                                  <span className="text-sm">View</span>
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => updateCourse.mutate({ id: course.id, updates: { status: course.status === 'active' ? 'archived' : 'active' } })} disabled={updateCourse.isPending}>
                                  {course.status === 'active' ? 'Archive' : 'Activate'}
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteCourse.mutate(course.id)} disabled={deleteCourse.isPending}>
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Completion Records Tab Content */}
            <TabsContent value="completion-records" className="space-y-6 mt-6">
              {/* Completion Records Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">Completed records</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Track enrollments and completions for all training</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                        onClick={handleAddSession}
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add session</span>
                      </Button>
                      <Button
                        className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2"
                        onClick={handleBulkEnrollment}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Bulk enroll</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Completion Records Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4">
                            <Checkbox />
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Learner</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Course</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Due</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Completed</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Score</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Source</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completionRecordsData.map((record) => (
                          <tr key={record.id} className="border-b border-gray-200 hover:bg-muted/50">
                            <td className="py-3 px-4">
                              <Checkbox />
                            </td>
                            <td className="py-3 px-4 text-foreground font-medium">{record.learner}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                {record.hasRedDot && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                                <span className="text-foreground">{record.course}</span>
                              </div>
                            </td>
                            <td className={`py-3 px-4 ${record.dueOverdue ? 'text-red-600' : 'text-foreground'}`}>
                              {record.due}
                            </td>
                            <td className="py-3 px-4 text-foreground">{record.completed}</td>
                            <td className="py-3 px-4 text-foreground">{record.score}</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-muted text-muted-foreground px-2 py-1 text-xs font-medium">
                                {record.source}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={`px-2 py-1 text-xs rounded-full font-medium ${getCompletionStatusBadgeColor(record.status)}`}>
                                {record.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => handleViewEnrollmentDetails(record)}
                              >
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">View</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team-attendance" className="space-y-6 mt-6">
              <TeamAttendanceCalendar />
            </TabsContent>

            <TabsContent value="oca" className="space-y-6 mt-6">
              {/* OCA Secondary Tabs */}
              <Tabs value={ocaActiveTab} onValueChange={setOcaActiveTab} className="w-full">
                <TabsList className="flex w-fit bg-transparent space-x-8">
                  <TabsTrigger
                    value="self-assessment"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:rounded-none data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent px-0 py-3"
                  >
                    Self-assessment surveys
                  </TabsTrigger>
                  <TabsTrigger
                    value="capacity-scorecards"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:rounded-none data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent px-0 py-3"
                  >
                    Capacity Scorecards
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommendations"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-muted-foreground data-[state=active]:border-b-2 data-[state=active]:border-violet-600 data-[state=active]:rounded-none data-[state=inactive]:text-muted-foreground data-[state=inactive]:bg-transparent data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent px-0 py-3"
                  >
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                {/* Self-Assessment Surveys Tab */}
                <TabsContent value="self-assessment" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-foreground">Self-Assessment Surveys</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Collect structured capacity responses from teams and partners
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Assign survey
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium text-foreground">
                                <Checkbox />
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Org/Team</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Template</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Due</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Program</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Responses</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ocaSurveysData.map((survey) => (
                              <tr key={survey.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  <Checkbox />
                                </td>
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="text-sm font-semibold text-foreground">{survey.program}</div>
                                    <div className="text-xs text-muted-foreground">{survey.orgTeam}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                                    {survey.template}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  {survey.due}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-violet-600 h-2 rounded-full"
                                        style={{ width: `${survey.progress}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                      {survey.progress}%
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  {survey.responses.completed}/{survey.responses.total}
                                </td>
                                <td className="py-3 px-4">
                                  <Button variant="outline" size="sm" onClick={() => handleViewSurveyDetails(survey)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Capacity Scorecards Tab */}
                <TabsContent value="capacity-scorecards" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-foreground">Capacity Scorecards</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Visualize capacity strengths and gaps by domain
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Capacity Heatmap Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Capacity Heatmap</h3>

                        {/* Legend */}
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-muted-foreground">Below 2.5</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-muted-foreground">2.5 - 3.5</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-muted-foreground">Above 3.5</span>
                          </div>
                        </div>

                        {/* Heatmap Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium text-foreground">Organization</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Governance</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">HR</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Finance</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Programs</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">M&E</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">IT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {capacityScorecardsData.map((org) => (
                                <tr key={org.id} className="border-b hover:bg-muted/50">
                                  <td className="py-3 px-4 text-sm font-medium text-foreground">
                                    {org.organization}
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={`${getScoreColor(org.domains.governance)} text-xs px-2 py-1 cursor-pointer hover:opacity-80`}
                                      onClick={() => handleViewDomainDetails(org, 'Governance', org.domains.governance)}
                                    >
                                      {org.domains.governance}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={`${getScoreColor(org.domains.hr)} text-xs px-2 py-1 cursor-pointer hover:opacity-80`}
                                      onClick={() => handleViewDomainDetails(org, 'HR', org.domains.hr)}
                                    >
                                      {org.domains.hr}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={`${getScoreColor(org.domains.finance)} text-xs px-2 py-1 cursor-pointer hover:opacity-80`}
                                      onClick={() => handleViewDomainDetails(org, 'Finance', org.domains.finance)}
                                    >
                                      {org.domains.finance}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={`${getScoreColor(org.domains.programs)} text-xs px-2 py-1 cursor-pointer hover:opacity-80`}
                                      onClick={() => handleViewDomainDetails(org, 'Programs', org.domains.programs)}
                                    >
                                      {org.domains.programs}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={`${getScoreColor(org.domains.me)} text-xs px-2 py-1 cursor-pointer hover:opacity-80`}
                                      onClick={() => handleViewDomainDetails(org, 'M&E', org.domains.me)}
                                    >
                                      {org.domains.me}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Badge
                                      className={`${getScoreColor(org.domains.it)} text-xs px-2 py-1 cursor-pointer hover:opacity-80`}
                                      onClick={() => handleViewDomainDetails(org, 'IT', org.domains.it)}
                                    >
                                      {org.domains.it}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        {/* Average Score Card */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-foreground">Average Score</h4>
                              <div className="text-2xl font-bold text-foreground">3.2</div>
                              <div className="text-sm text-green-600 font-medium">+0.3 vs Q1</div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Organizations Below Target Card */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-foreground">Organizations Below Target</h4>
                              <div className="text-2xl font-bold text-foreground">2 of 4</div>
                              <Badge className="bg-red-500 text-white text-xs">Needs attention</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Lowest Domain Card */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-foreground">Lowest Domain</h4>
                              <div className="text-2xl font-bold text-foreground">M&E (2.7)</div>
                              <Badge className="bg-red-500 text-white text-xs">Critical</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-foreground">Recommendations Engine</h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            Turn capacity findings into targeted training plans
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              placeholder="Search..."
                              className="pl-10 w-64"
                            />
                          </div>
                          <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline" size="sm">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Bundle (0)
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Total Recommendations Card */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                                <ThumbsUp className="h-5 w-5 text-violet-600" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">4</div>
                                <div className="text-sm text-muted-foreground">Total recommendations</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* High Impact Card */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-red-600" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">2</div>
                                <div className="text-sm text-muted-foreground">High impact</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Acceptance Rate Card */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircleIcon className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-foreground">78%</div>
                                <div className="text-sm text-muted-foreground">Acceptance rate</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Recommendations Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium text-foreground">
                                <Checkbox />
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Finding</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Domain</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Suggestion</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Impact</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recommendationsData.map((recommendation) => (
                              <tr key={recommendation.id} className="border-b hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  <Checkbox />
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-foreground">
                                  {recommendation.finding}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                                    {recommendation.domain}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm text-muted-foreground">
                                  {recommendation.suggestion}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge className={`${getImpactBadgeColor(recommendation.impact)} text-xs px-2 py-1`}>
                                    {recommendation.impact}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAssignRecommendation(recommendation)}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      {recommendation.action}
                                    </Button>
                                    {bundleRecommendationIds.has(recommendation.id) ? (
                                      <div
                                        className="flex items-center px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md cursor-pointer hover:bg-gray-200 hover:text-muted-foreground transition-colors"
                                        onClick={() => handleRemoveFromBundleByRecommendationId(recommendation.id)}
                                        title="Click to remove from bundle"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        In Bundle
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddToBundle(recommendation)}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add to bundle
                                      </Button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Create Plan Modal */}
      <Dialog open={isCreatePlanModalOpen} onOpenChange={setIsCreatePlanModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-violet-600" />
              Create Training Plan
            </DialogTitle>
            <DialogDescription>
              Create a new training plan to address skill gaps and development needs.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Plan Title</Label>
                <Input
                  id="title"
                  placeholder="Enter plan title"
                  value={createPlanForm.title}
                  onChange={(e) => setCreatePlanForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill">Skill</Label>
                <Select value={createPlanForm.skill} onValueChange={(value) => setCreatePlanForm(prev => ({ ...prev, skill: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="react">React proficiency</SelectItem>
                    <SelectItem value="figma">Figma expertise</SelectItem>
                    <SelectItem value="python">Python skills</SelectItem>
                    <SelectItem value="seo">SEO strategies</SelectItem>
                    <SelectItem value="hacking">Ethical hacking</SelectItem>
                    <SelectItem value="ci">Continuous integration</SelectItem>
                    <SelectItem value="testing">Test automation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="level">Target Level</Label>
                <Select value={createPlanForm.level} onValueChange={(value) => setCreatePlanForm(prev => ({ ...prev, level: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L1">L1 - Beginner</SelectItem>
                    <SelectItem value="L2">L2 - Intermediate</SelectItem>
                    <SelectItem value="L3">L3 - Advanced</SelectItem>
                    <SelectItem value="L4">L4 - Expert</SelectItem>
                    <SelectItem value="L5">L5 - Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner">Owner</Label>
                <Select value={createPlanForm.employeeId} onValueChange={(value) => setCreatePlanForm(prev => ({ ...prev, employeeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employeeList.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{`${e.first_name} ${e.last_name}`}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={createPlanForm.dueDate}
                onChange={(e) => setCreatePlanForm(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the training plan objectives and approach"
                value={createPlanForm.description}
                onChange={(e) => setCreatePlanForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">Resources</Label>
              <Textarea
                id="resources"
                placeholder="List training resources, courses, or materials"
                value={createPlanForm.resources}
                onChange={(e) => setCreatePlanForm(prev => ({ ...prev, resources: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreatePlan}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan} className="bg-violet-600 hover:bg-violet-700" disabled={!isCreatePlanValid || createTraining.isPending}>
              {createTraining.isPending ? 'Creating…' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Skill Gap Details Modal */}
      <Dialog open={isSkillGapModalOpen} onOpenChange={setIsSkillGapModalOpen}>
        <DialogPortal>
          <DialogOverlay
            className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
          />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Skill gap details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Skill Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-foreground">
                    React proficiency for SE II
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current level</span>
                    <Badge className="px-2 py-1 text-xs rounded-full font-medium bg-muted text-muted-foreground">
                      L2
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Required level</span>
                    <Badge className="px-2 py-1 text-xs rounded-full font-medium bg-muted text-muted-foreground">
                      L3
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Suggested Courses */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Suggested courses</h4>

                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4 bg-muted/50">
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">Course R-201: Advanced React Development</div>
                      <div className="text-sm text-muted-foreground">8 weeks · Self-paced</div>
                      <div className="text-xs text-muted-foreground">Master advanced React concepts including hooks, context, performance optimization</div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-muted/50">
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">Course R-102: React Fundamentals</div>
                      <div className="text-sm text-muted-foreground">6 weeks · Self-paced</div>
                      <div className="text-xs text-muted-foreground">Build a solid foundation in React development</div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 bg-muted/50">
                    <div className="space-y-2">
                      <div className="font-medium text-foreground">Workshop W-15: React Best Practices</div>
                      <div className="text-sm text-muted-foreground">2 days · In-person</div>
                      <div className="text-xs text-muted-foreground">Hands-on workshop covering React best practices</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCloseSkillGapModal}>
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleViewCourseDetails}
                  className="bg-card border-gray-300 text-muted-foreground hover:bg-muted/50"
                >
                  View course details
                </Button>
                <Button
                  onClick={handleAddToPlan}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Add to plan
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Session Details Modal */}
      <Dialog open={isSessionDetailsModalOpen} onOpenChange={setIsSessionDetailsModalOpen}>
        <DialogPortal>
          <DialogOverlay
            className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                {selectedSession?.title}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSession?.details?.date}
              </p>
            </DialogHeader>

            {selectedSession && (
              <div className="space-y-6">
                {/* Capacity & Waitlist Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Capacity</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedSession.details.capacity.enrolled} enrolled • {selectedSession.details.capacity.max} max
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <CalendarIcon className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Waitlist</div>
                          <div className="text-sm text-muted-foreground">
                            {selectedSession.details.waitlist} people waiting
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Session format</div>
                      <div className="text-sm font-medium text-foreground">{selectedSession.details.format}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Location</div>
                      <div className="text-sm font-medium text-foreground">{selectedSession.details.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Instructor</div>
                      <div className="text-sm font-medium text-foreground">{selectedSession.details.instructor}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Course</div>
                      <div className="text-sm font-medium text-foreground">{selectedSession.details.course}</div>
                    </div>
                  </div>
                </div>

                {/* Attendees Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Attendees ({selectedSession.details.attendees.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedSession.details.attendees.map((attendee: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox />
                          <span className="text-sm font-medium text-foreground">{attendee.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {attendee.status === 'accepted' ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Accepted</span>
                            </>
                          ) : attendee.status === 'no-response' ? (
                            <>
                              <X className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">Didn't respond</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-muted-foreground">Pending</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCloseSessionDetailsModal}>
                Cancel
              </Button>
              <Button
                onClick={handleSendInvites}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Send invites
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Assign Bundle Modal */}
      <Dialog open={isAssignBundleModalOpen} onOpenChange={setIsAssignBundleModalOpen}>
        <DialogPortal>
          <DialogOverlay
            className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Assign Training Bundle
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure and assign {bundleItems.length} training recommendation{bundleItems.length !== 1 ? 's' : ''} as a package
              </p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Plan Title */}
              <div>
                <Label htmlFor="bundlePlanTitle" className="text-sm font-medium text-foreground">Plan title</Label>
                <Input
                  id="bundlePlanTitle"
                  placeholder="Enter plan title"
                  value={bundleForm.planTitle}
                  onChange={(e) => setBundleForm({ ...bundleForm, planTitle: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="bundleDescription" className="text-sm font-medium text-foreground">Description (optional)</Label>
                <Textarea
                  id="bundleDescription"
                  placeholder="Enter description"
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Bundle Contents */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Bundle Contents ({bundleItems.length} training{bundleItems.length !== 1 ? 's' : ''})
                </h3>
                <div className="space-y-3">
                  {bundleItems.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                              {item.domain}
                            </Badge>
                            <Badge className={`${getImpactBadgeColor(item.impact)} text-xs px-2 py-1`}>
                              {item.impact.toLowerCase()} impact
                            </Badge>
                          </div>
                          <h4 className="text-sm font-medium text-foreground">{item.suggestion.split(' (')[0]}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{item.finding}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromBundle(item.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <Label htmlFor="targetAudience" className="text-sm font-medium text-foreground">Target Audience</Label>
                <Select
                  value={bundleForm.targetAudience}
                  onValueChange={(value) => setBundleForm({ ...bundleForm, targetAudience: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="org-a">Org A</SelectItem>
                    <SelectItem value="org-b">Org B</SelectItem>
                    <SelectItem value="org-c">Org C</SelectItem>
                    <SelectItem value="org-d">Org D</SelectItem>
                    <SelectItem value="all-orgs">All Organizations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Completion Due Date */}
              <div>
                <Label htmlFor="completionDueDate" className="text-sm font-medium text-foreground">Completion Due Date</Label>
                <Input
                  id="completionDueDate"
                  type="date"
                  value={bundleForm.completionDueDate}
                  onChange={(e) => setBundleForm({ ...bundleForm, completionDueDate: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Require Approval From */}
              <div>
                <Label htmlFor="requireApprovalFrom" className="text-sm font-medium text-foreground">Require Approval From</Label>
                <Select
                  value={bundleForm.requireApprovalFrom}
                  onValueChange={(value) => setBundleForm({ ...bundleForm, requireApprovalFrom: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select approver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                    <SelectItem value="michael-torres">Michael Torres</SelectItem>
                    <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                    <SelectItem value="john-doe">John Doe</SelectItem>
                    <SelectItem value="no-approval">No Approval Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Push to LMS Integration */}
              <div className="flex justify-between items-center">
                <div>
                  <Label className="text-sm font-medium text-foreground">Push to LMS Integration</Label>
                  <p className="text-xs text-muted-foreground mt-1">Automatically create enrollments in connected learning management system.</p>
                </div>
                <Switch
                  checked={bundleForm.pushToLMS}
                  onCheckedChange={(checked) => setBundleForm({ ...bundleForm, pushToLMS: checked })}
                />
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCloseAssignBundleModal}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignBundleToTeam}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Assign bundle to team
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Assign Recommendation Modal */}
      <Dialog open={isAssignRecommendationModalOpen} onOpenChange={setIsAssignRecommendationModalOpen}>
        <DialogPortal>
          <DialogOverlay
            className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Assign Recommendation
              </DialogTitle>
              {selectedRecommendation && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedRecommendation.suggestion.split(' (')[0]}
                </p>
              )}
            </DialogHeader>

            {selectedRecommendation && (
              <div className="space-y-6">
                {/* Finding */}
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-foreground">Finding</Label>
                  <span className="text-sm text-muted-foreground">{selectedRecommendation.finding}</span>
                </div>

                {/* Suggested Training */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Suggested training</Label>
                  <div className="text-sm text-muted-foreground">
                    <div>{selectedRecommendation.suggestion.split(' (')[0]}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedRecommendation.suggestion.match(/\(([^)]+)\)/)?.[1]}
                    </div>
                  </div>
                </div>

                {/* Audience */}
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-foreground">Audience</Label>
                  <span className="text-sm text-muted-foreground">
                    {selectedRecommendation.finding.split(' ').pop()}
                  </span>
                </div>

                {/* Due Date */}
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-foreground">Due date</Label>
                  <span className="text-sm text-muted-foreground">12/02/2026</span>
                </div>

                {/* Approver */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Approver (optional)</Label>
                  <Select
                    value={assignRecommendationForm.approver}
                    onValueChange={(value) => setAssignRecommendationForm({ ...assignRecommendationForm, approver: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select approver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="michael-torres">Michael Torres</SelectItem>
                      <SelectItem value="lisa-anderson">Lisa Anderson</SelectItem>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Push to LMS */}
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-foreground">Push to LMS</Label>
                  <Switch
                    checked={assignRecommendationForm.pushToLMS}
                    onCheckedChange={(checked) => setAssignRecommendationForm({ ...assignRecommendationForm, pushToLMS: checked })}
                  />
                </div>

                {/* Expected Impact */}
                <div className="p-4 bg-violet-50 border border-violet-200 rounded-lg">
                  <p className="text-sm text-violet-800">
                    Expected to improve {selectedRecommendation.domain} score by 0.5-0.8 points
                  </p>
                </div>
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCloseAssignRecommendationModal}>
                Cancel
              </Button>
              <Button
                onClick={handleAssignTraining}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Assign training
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Survey Details Modal */}
      <Dialog open={isSurveyDetailsModalOpen} onOpenChange={setIsSurveyDetailsModalOpen}>
        <DialogPortal>
          <DialogOverlay
            className="fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            style={{
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          />
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-foreground">
                Survey details
              </DialogTitle>
              {selectedSurvey && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedSurvey.program} • {selectedSurvey.template}
                </p>
              )}
            </DialogHeader>

            {selectedSurvey && (
              <div className="space-y-6">
                {/* Progress Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Progress</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-violet-600 h-2 rounded-full"
                          style={{ width: `${selectedSurvey.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {selectedSurvey.progress}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedSurvey.responses.completed}/{selectedSurvey.responses.total} responses submitted
                    </p>
                  </div>
                </div>

                {/* Domain Scores Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Domain scores</h3>
                  <div className="space-y-3">
                    {selectedSurvey.domainScores.map((domain: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{domain.domain}</span>
                          <span className="text-sm text-muted-foreground">{domain.score}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-900 h-2 rounded-full"
                            style={{ width: `${(domain.score / domain.maxScore) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Evidence Section */}
                {selectedSurvey.missingEvidence.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Missing evidence</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedSurvey.missingEvidence.map((evidence: any, index: number) => (
                        <Card key={index} className="bg-muted/50">
                          <CardContent className="p-4">
                            <h4 className="text-sm font-medium text-foreground">{evidence.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{evidence.subtitle}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleCloseSurveyDetailsModal}>
                Cancel
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSendSurveyReminder}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Send remainder
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExportData}
                >
                  Export data
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Enrollment Details Modal */}
      <Dialog open={isEnrollmentDetailsModalOpen} onOpenChange={setIsEnrollmentDetailsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              Enrollment details
            </DialogTitle>
          </DialogHeader>

          {selectedEnrollment && (
            <div className="space-y-6">
              {/* Learning Timeline */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Learning timeline</h3>
                <div className="flex flex-col items-center space-y-4">
                  {/* Timeline Container */}
                  <div className="flex items-center w-full">
                    {/* Enrolled */}
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleTimelineStatusUpdate('enrolled')}
                        className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center hover:bg-violet-700 transition-colors cursor-pointer"
                      >
                        <FileTextIcon className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    {/* Timeline Line */}
                    <div className="flex-1 h-0.5 bg-violet-600 mx-4"></div>

                    {/* Started */}
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleTimelineStatusUpdate('started')}
                        className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center hover:bg-violet-700 transition-colors cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4 text-white" />
                      </button>
                    </div>

                    {/* Timeline Line */}
                    <div className="flex-1 h-0.5 bg-violet-600 mx-4"></div>

                    {/* Completed */}
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => handleTimelineStatusUpdate('completed')}
                        className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center hover:bg-violet-700 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Labels Container */}
                  <div className="flex w-full justify-between">
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">Enrolled</div>
                      <div className="text-xs text-muted-foreground">{selectedEnrollment.timeline?.enrolled?.date || '18 May, 2025'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">Started</div>
                      <div className="text-xs text-muted-foreground">{selectedEnrollment.timeline?.started?.date || '20 May, 2025'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-foreground">Completed</div>
                      <div className="text-xs text-muted-foreground">{selectedEnrollment.timeline?.completed?.date || '27 May, 2025'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Enrollment details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Learner</div>
                    <div className="text-sm font-medium text-foreground">{selectedEnrollment.learner}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Course</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">{selectedEnrollment.course}</span>
                      {selectedEnrollment.hasRedDot && (
                        <Badge className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium border border-red-200">
                          Mandatory
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Due</div>
                    <div className={`text-sm font-medium ${selectedEnrollment.dueOverdue ? 'text-red-600' : 'text-foreground'}`}>
                      {selectedEnrollment.due}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Completed</div>
                    <div className="text-sm font-medium text-foreground">{selectedEnrollment.completed}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Source</div>
                    <div className="text-sm font-medium text-foreground">{selectedEnrollment.source}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Score</div>
                    <div className="text-sm font-medium text-foreground">{selectedEnrollment.score}</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <Badge className={`px-2 py-1 text-xs rounded-full font-medium ${getCompletionStatusBadgeColor(selectedEnrollment.status)}`}>
                    {selectedEnrollment.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-center">
            <Button variant="outline" onClick={handleCloseEnrollmentDetailsModal}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default LearningDevelopment;
