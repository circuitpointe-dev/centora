import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Plus,
  Download,
  Copy,
  Edit,
  Trash2,
  MapPin,
  User,
  DollarSign,
  Building,
  Clock,
  Award,
  ChevronRight
} from 'lucide-react';

const JobDescriptionLibrary = () => {
  const [selectedJob, setSelectedJob] = useState('software-engineer-ii');
  const [searchQuery, setSearchQuery] = useState('');
  const [familyFilter, setFamilyFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for job descriptions
  const jobDescriptions = [
    {
      id: 'software-engineer-ii',
      title: 'Software Engineer II',
      department: 'Engineering',
      level: 'L5',
      grade: 'IC5',
      location: 'San Francisco, CA / Remote',
      status: 'Published',
      statusColor: 'bg-purple-100 text-purple-800',
      updated: 'Mar 12, 2025',
      requisitions: 3,
      skills: ['Full-stack', 'React', 'Node.js'],
      additionalSkills: 2,
      salary: '$120,000 - $160,000',
      hires: 12,
      isSelected: true
    },
    {
      id: 'hr-generalist',
      title: 'HR Generalist',
      department: 'People Ops',
      level: 'L3',
      grade: 'IC3',
      location: 'New York, NY',
      status: 'Draft',
      statusColor: 'bg-gray-100 text-gray-800',
      updated: 'Feb 28, 2025',
      requisitions: 0,
      skills: ['HR', 'Generalist', 'Employee-relations'],
      additionalSkills: 2,
      salary: '$70,000 - $95,000',
      hires: 0,
      isSelected: false
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      department: 'Product',
      level: 'L4',
      grade: 'IC4',
      location: 'Austin, TX / Remote',
      status: 'Published',
      statusColor: 'bg-purple-100 text-purple-800',
      updated: 'Jan 15, 2025',
      requisitions: 2,
      skills: ['Product-management', 'analytics', 'roadmap'],
      additionalSkills: 2,
      salary: '$130,000 - $170,000',
      hires: 8,
      isSelected: false
    },
    {
      id: 'ux-designer',
      title: 'UX Designer',
      department: 'Design',
      level: 'L3',
      grade: 'Remote',
      location: 'Remote',
      status: 'Approved',
      statusColor: 'bg-green-100 text-green-800',
      updated: 'Mar 1, 2025',
      requisitions: 1,
      skills: ['ux', 'ui', 'design-systems'],
      additionalSkills: 2,
      salary: '$90,000 - $125,000',
      hires: 5,
      isSelected: false
    },
    {
      id: 'senior-data-scientist',
      title: 'Senior Data Scientist',
      department: 'Data',
      level: 'L6',
      grade: 'IC6',
      location: 'Seattle, WA / Remote',
      status: 'Published',
      statusColor: 'bg-purple-100 text-purple-800',
      updated: 'Mar 10, 2025',
      requisitions: 2,
      skills: ['machine-learning', 'python', 'statistics'],
      additionalSkills: 2,
      salary: '$160,000 - $220,000',
      hires: 3,
      isSelected: false
    }
  ];

  const selectedJobData = jobDescriptions.find(job => job.id === selectedJob);

  const JobCard = ({ job }: { job: any }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        job.isSelected 
          ? 'border-purple-500 bg-purple-50' 
          : 'hover:shadow-md hover:border-gray-300'
      }`}
      onClick={() => setSelectedJob(job.id)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">
                {job.department} • {job.level} • {job.grade}
              </p>
            </div>
            <Badge className={`text-xs ${job.statusColor}`}>
              {job.status}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>{job.location}</p>
            <p>Updated {job.updated}</p>
          </div>
          
          {job.requisitions > 0 && (
            <div className="text-sm text-blue-600 font-medium">
              {job.requisitions} active req{job.requisitions > 1 ? 's' : ''}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            {job.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.additionalSkills > 0 && (
              <Badge variant="secondary" className="text-xs">
                +{job.additionalSkills}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{job.salary}</span>
            {job.hires > 0 && (
              <span className="text-gray-600">{job.hires} hires</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Left Column - Job Descriptions Library */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Job Descriptions Library</h2>
          <p className="text-sm text-gray-600">Central repository for all role descriptions</p>
        </div>

        <div className="flex items-center justify-between">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Job Description
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input 
                placeholder="Search title, family, skills, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Select value={familyFilter} onValueChange={setFamilyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Families" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Families</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="people-ops">People Ops</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="l3">L3</SelectItem>
                <SelectItem value="l4">L4</SelectItem>
                <SelectItem value="l5">L5</SelectItem>
                <SelectItem value="l6">L6</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Job Descriptions List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {jobDescriptions.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Right Column - Job Description Detail View */}
      <div className="space-y-6">
        {selectedJobData && (
          <>
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedJobData.title}</h2>
                  <p className="text-sm text-gray-600">
                    {selectedJobData.department} • {selectedJobData.level} • {selectedJobData.grade}
                  </p>
                </div>
                <Badge className={selectedJobData.statusColor}>
                  {selectedJobData.status}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Created by Sarah Chen • Version v1.3 (Current)</p>
                {selectedJobData.requisitions > 0 && (
                  <p className="text-blue-600 cursor-pointer hover:underline">
                    {selectedJobData.requisitions} active requisitions
                  </p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Use this JD → New Req
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>

                {/* Key Details */}
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedJobData.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">Engineering Manager</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedJobData.salary}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedJobData.department}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">3-5 years</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{selectedJobData.grade}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Summary</h3>
                  <p className="text-gray-700">
                    We are seeking a mid-level Software Engineer to join our platform team. You will be responsible for building and maintaining scalable web applications that serve millions of users.
                  </p>
                </div>

                {/* Key Responsibilities */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Design and implement scalable web applications using modern technologies</li>
                    <li>Collaborate with cross-functional teams to deliver high-quality features</li>
                    <li>Participate in code reviews and maintain coding standards</li>
                    <li>Troubleshoot and resolve production issues</li>
                    <li>Mentor junior engineers and contribute to technical documentation</li>
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>3+ years of experience in software development</li>
                    <li>Proficiency in JavaScript, TypeScript, and React</li>
                    <li>Experience with Node.js and cloud platforms (AWS/GCP)</li>
                    <li>Strong understanding of system design principles</li>
                    <li>Bachelor's degree in Computer Science or equivalent experience</li>
                  </ul>
                </div>

                {/* Required Skills */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'System Design'].map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Key Competencies */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Competencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Problem Solving', 'Technical Communication', 'Code Quality', 'Collaboration', 'Continuous Learning'].map((competency) => (
                      <Badge key={competency} variant="outline">
                        {competency}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Education & Experience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Education</h4>
                    <p className="text-sm text-gray-600">Bachelor's degree in Computer Science or equivalent</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Experience</h4>
                    <p className="text-sm text-gray-600">3-5 years</p>
                  </div>
                </div>

                {/* Linked Resources */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Interview Kits</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Technical Screening', 'System Design', 'Behavioral'].map((kit) => (
                        <Button key={kit} variant="outline" size="sm" className="flex items-center gap-1">
                          {kit}
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Salary Benchmarks</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Market Data 2025', 'Tech Industry Survey'].map((benchmark) => (
                        <Button key={benchmark} variant="outline" size="sm" className="flex items-center gap-1">
                          {benchmark}
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['#full-stack', '#react', '#node.js', '#cloud', '#mentoring'].map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="versions">
                <div className="text-center py-8">
                  <p className="text-gray-500">Version history will be displayed here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default JobDescriptionLibrary;
