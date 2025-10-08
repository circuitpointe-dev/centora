import React, { useState } from 'react';
import { ArrowLeft, Bell, ChevronDown, Search, Filter, Eye, Heart, MessageCircle, Users, BookOpen, Award, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useParams } from 'react-router-dom';

interface ModuleData {
  name: string;
  timeSpent: number;
}

interface QuizData {
  title: string;
  avgScore: number;
  attempts: number;
  passRate: number;
}

interface LearnerData {
  id: string;
  name: string;
  email: string;
  department: string;
  enrollments: number;
  progress: number;
  lastActive: string;
  status: 'active' | 'inactive';
}

interface DiscussionPost {
  id: string;
  author: {
    name: string;
    role: 'Instructor' | 'Student';
    avatar: string;
  };
  topic: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
}

const CourseAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [learnerSearchQuery, setLearnerSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const learnersPerPage = 8;

  // Mock data
  const courseTitle = "Responsive Design Principles";
  
  const modules: ModuleData[] = [
    { name: "Module 1", timeSpent: 50 },
    { name: "Module 2", timeSpent: 43 },
    { name: "Module 3", timeSpent: 35 },
    { name: "Module 4", timeSpent: 29 },
    { name: "Module 5", timeSpent: 25 },
  ];

  const quizzes: QuizData[] = [
    { title: "Collaboration basics", avgScore: 75, attempts: 1.5, passRate: 95 },
    { title: "Conflict Resolution", avgScore: 90, attempts: 1.2, passRate: 98 },
    { title: "Leadership Strategies", avgScore: 85, attempts: 2.5, passRate: 92 },
    { title: "Time Management", avgScore: 80, attempts: 1.8, passRate: 93 },
    { title: "Conflict Resolution", avgScore: 88, attempts: 1.9, passRate: 97 },
    { title: "Team Building", avgScore: 92, attempts: 2.1, passRate: 96 },
  ];

  const learners: LearnerData[] = [
    { id: '1', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 0, lastActive: 'Jul 2, 2025 09:00 pm', status: 'active' },
    { id: '2', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 5, lastActive: 'Jul 2, 2025 09:00 pm', status: 'active' },
    { id: '3', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 50, lastActive: 'Jul 2, 2025 09:00 pm', status: 'active' },
    { id: '4', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 100, lastActive: 'Jul 2, 2025 09:00 pm', status: 'active' },
    { id: '5', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 0, lastActive: 'Jul 2, 2025 09:00 pm', status: 'inactive' },
    { id: '6', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 5, lastActive: 'Jul 2, 2025 09:00 pm', status: 'active' },
    { id: '7', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 50, lastActive: 'Jul 2, 2025 09:00 pm', status: 'active' },
    { id: '8', name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', enrollments: 4, progress: 100, lastActive: 'Jul 2, 2025 09:00 pm', status: 'inactive' },
  ];

  const discussionPosts: DiscussionPost[] = [
    {
      id: '1',
      author: { name: 'Leslie Alex', role: 'Instructor', avatar: '/placeholder-avatar.jpg' },
      topic: 'Accessibility in E-learning',
      content: 'What are your thoughts on the principles of accessibility in e-learning? How can we enhance the learning experience for all students?',
      timestamp: '3 hours ago',
      likes: 15,
      comments: 2
    },
    {
      id: '2',
      author: { name: 'Somachi ogbuh', role: 'Student', avatar: '/placeholder-avatar.jpg' },
      topic: 'Accessibility in E-learning',
      content: 'What are your thoughts on the principles of accessibility in e-learning? How can we enhance the learning experience for all students?',
      timestamp: '3 hours ago',
      likes: 15,
      comments: 2
    },
    {
      id: '3',
      author: { name: 'Max well', role: 'Student', avatar: '/placeholder-avatar.jpg' },
      topic: 'Inclusive Design in Online Learning',
      content: 'What are your views on accessibility strategies and platform improvements for inclusive design in online learning?',
      timestamp: '3 hours ago',
      likes: 15,
      comments: 1
    }
  ];

  const filteredLearners = learners.filter(learner =>
    learner.name.toLowerCase().includes(learnerSearchQuery.toLowerCase()) ||
    learner.email.toLowerCase().includes(learnerSearchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLearners.length / learnersPerPage);
  const startIndex = (currentPage - 1) * learnersPerPage;
  const endIndex = startIndex + learnersPerPage;
  const currentLearners = filteredLearners.slice(startIndex, endIndex);

  const handleBackToCourseList = () => {
    navigate('/dashboard/lmsAuthor/dashboard');
  };

  const getStatusBadge = (status: 'active' | 'inactive') => {
    if (status === 'active') {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">Active</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200">Inactive</Badge>;
  };

  const getProgressBarColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (progress < 50) return 'bg-red-500';
    if (progress < 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToCourseList}
            className="flex items-center text-primary hover:text-primary/90 font-medium"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Course list
          </button>
          <h1 className="text-2xl font-bold text-foreground">{courseTitle}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
          
          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Enrollments */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">1,250</div>
            <div className="text-sm text-muted-foreground font-medium">Enrollments</div>
          </div>
        </div>

        {/* Active Learners */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">32</div>
            <div className="text-sm text-muted-foreground font-medium">Active learners</div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Target className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">67%</div>
            <div className="text-sm text-muted-foreground font-medium">Completion rate</div>
          </div>
        </div>

        {/* Average Quiz Score */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">24</div>
            <div className="text-sm text-muted-foreground font-medium">Avg. quiz score</div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-card p-6 rounded-lg border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-center min-h-[140px]">
          <div className="p-4 rounded-full bg-primary/10 mb-4">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-card-foreground">24</div>
            <div className="text-sm text-muted-foreground font-medium">Certificates</div>
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time Spent per Module Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Time spent per module (min)</h3>
          
          {/* Chart Container */}
          <div className="relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex justify-between">
              {[0, 20, 25, 30, 35, 40, 45, 50].map((value) => (
                <div key={value} className="flex flex-col h-full">
                  <div className="text-xs text-muted-foreground mb-2">{value}</div>
                  <div className="flex-1 border-l border-gray-200 dark:border-gray-700"></div>
                </div>
              ))}
            </div>
            
            {/* Chart Bars */}
            <div className="relative space-y-4 pt-6">
              {modules.map((module, index) => (
                <div key={index} className="relative">
                  {/* Module Label */}
                  <div className="absolute left-0 top-0 w-20 text-sm text-muted-foreground">
                    {module.name}
                  </div>
                  
                  {/* Bar Container */}
                  <div className="ml-24 relative">
                    {/* Background Bar */}
                    <div className="w-full h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    
                    {/* Data Bar */}
                    <div 
                      className="absolute top-0 h-8 bg-primary rounded flex items-center justify-end pr-3"
                      style={{ width: `${(module.timeSpent / 50) * 100}%` }}
                    >
                      <span className="text-white text-sm font-medium">{module.timeSpent}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* X-axis Label */}
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Minutes
            </div>
          </div>
        </Card>

        {/* Quizzes Table */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quizzes</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Avg. score</th>
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Attempts</th>
                  <th className="text-left py-2 text-sm font-medium text-muted-foreground">Pass rate</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="py-3 text-sm text-foreground">{quiz.title}</td>
                    <td className="py-3 text-sm text-foreground">{quiz.avgScore}%</td>
                    <td className="py-3 text-sm text-foreground">{quiz.attempts}</td>
                    <td className="py-3 text-sm text-foreground">{quiz.passRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Learners List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Learners list</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search learners..."
                value={learnerSearchQuery}
                onChange={(e) => setLearnerSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Department</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Enrollments</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Progress (%)</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Last active</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLearners.map((learner) => (
                <tr key={learner.id} className="border-b border-border last:border-b-0">
                  <td className="py-3">
                    <div>
                      <div className="text-sm font-medium text-foreground">{learner.name}</div>
                      <div className="text-xs text-muted-foreground">{learner.email}</div>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-foreground">{learner.department}</td>
                  <td className="py-3 text-sm text-foreground">{learner.enrollments} Enrollments</td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(learner.progress)}`}
                          style={{ width: `${learner.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-foreground">{learner.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">{learner.lastActive}</td>
                  <td className="py-3">{getStatusBadge(learner.status)}</td>
                  <td className="py-3">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLearners.length)} of {filteredLearners.length} learner list
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Discussion Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Discussion</h3>
        <div className="space-y-4">
          {discussionPosts.map((post) => (
            <div key={post.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>
                    {post.author.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-foreground">{post.author.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {post.author.role}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{post.topic}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{post.likes} Likes</span>
                    </button>
                    <button className="flex items-center space-x-1 text-muted-foreground hover:text-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments} Comments</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CourseAnalyticsPage;
