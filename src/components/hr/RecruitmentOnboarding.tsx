import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import OnboardingDetailView from './OnboardingDetailView';
import JobDescriptionLibrary from './JobDescriptionLibrary';
import { useJobPostings, useJobApplications, useUpdateApplicationStage } from '@/hooks/hr/useJobPostings';
import {
  Search,
  Plus,
  List,
  Grid,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  GraduationCap,
  FileText
} from 'lucide-react';

const RecruitmentOnboarding = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('onboarding-checklist');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showDetailView, setShowDetailView] = useState(false);

  // Live data from database
  const { data: jobPostings, isLoading: postingsLoading } = useJobPostings('open');
  const { data: allApplications } = useJobApplications();
  const updateStage = useUpdateApplicationStage();

  // Transform job postings with applications into vacancy tracker format
  const vacancyData = useMemo(() => {
    if (!jobPostings || !allApplications) return [];

    return jobPostings.map((posting) => {
      const applications = allApplications.filter(app => app.job_posting_id === posting.id && app.status === 'active');
      const stageCounts = {
        applied: applications.filter(a => a.stage === 'applied').length,
        screen: applications.filter(a => a.stage === 'screen').length,
        interview: applications.filter(a => a.stage === 'interview').length,
        offer: applications.filter(a => a.stage === 'offer').length,
        hired: applications.filter(a => a.stage === 'hired').length,
      };

      const topStage = ['hired', 'offer', 'interview', 'screen', 'applied'].find(s => stageCounts[s as keyof typeof stageCounts] > 0) || 'applied';
      const totalCandidates = applications.length;
      const topCandidates = applications
        .map(app => ({
          initials: app.candidate_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          name: app.candidate_name
        }))
        .slice(0, 2);

      const stageColors: { [key: string]: string } = {
        applied: 'bg-muted text-muted-foreground',
        screen: 'bg-yellow-100 text-yellow-800',
        interview: 'bg-purple-100 text-purple-800',
        offer: 'bg-blue-100 text-blue-800',
        hired: 'bg-green-100 text-green-800',
      };

      return {
        id: posting.id,
        requisition: posting.position_title,
        location: '—', // Can be added to schema later
        manager: '—', // Can be added to schema later
        department: posting.department || '—',
        candidates: topCandidates,
        additionalCandidates: Math.max(0, totalCandidates - 2),
        nextEvent: 'N/a', // Can be calculated from interviews/offers
        currentStage: topStage.charAt(0).toUpperCase() + topStage.slice(1),
        stageColor: stageColors[topStage] || 'bg-muted text-muted-foreground',
        priority: 'Medium', // Can be added to schema
        priorityColor: 'bg-yellow-500'
      };
    });
  }, [jobPostings, allApplications]);

  // Reference checks from applications in screening/interview stage
  const referenceChecksData = useMemo(() => {
    if (!allApplications) return [];

    return allApplications
      .filter(app => ['screen', 'interview'].includes(app.stage) && app.status === 'active')
      .map((app) => {
        const posting = jobPostings?.find(p => p.id === app.job_posting_id);
        return {
          id: app.id,
          candidateName: app.candidate_name,
          candidateEmail: app.candidate_email,
          requisition: posting?.position_title || '—',
          department: posting?.department || '—',
          refs: 3, // Default - can add reference table later
          received: 0, // Can add reference table later
          flags: 0,
          status: 'Requested'
        };
      });
  }, [allApplications, jobPostings]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Requested':
        return 'bg-blue-100 text-blue-800';
      case 'Received':
        return 'bg-purple-100 text-purple-800';
      case 'Verified':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string, color: string) => {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded ${color}`}></div>
        <span className="text-sm text-muted-foreground">{priority}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {showDetailView ? (
        <OnboardingDetailView onBack={() => setShowDetailView(false)} />
      ) : (
        <>
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recruitment & onboarding</h1>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger
                  value="vacancy-tracker"
                  className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
                >
                  Vacancy Tracker
                </TabsTrigger>
                <TabsTrigger
                  value="reference-checks"
                  className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
                >
                  Reference Checks
                </TabsTrigger>
                <TabsTrigger
                  value="onboarding-checklist"
                  className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
                >
                  Onboarding Checklist
                </TabsTrigger>
                <TabsTrigger
                  value="job-description-library"
                  className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
                >
                  Job Description Library
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vacancy-tracker" className="space-y-6 mt-6">
                {/* Vacancy Tracker Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Vacancy tracker lists</h2>

                  {/* Search and Actions Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search...."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-muted' : ''}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'bg-muted' : ''}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button className="bg-violet-600 hover:bg-violet-700">
                        <Plus className="h-4 w-4 mr-2" />
                        New requisition
                      </Button>
                    </div>
                  </div>

                  {/* Vacancy List/Grid View */}
                  {viewMode === 'list' ? (
                    <Card>
                      <CardContent className="p-0">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                              <tr>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Requisition</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Manager</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Department</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Candidates</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Next event</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Current stage</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Priority</th>
                                <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {vacancyData.map((vacancy) => (
                                <tr key={vacancy.id} className="border-b border-border hover:bg-muted/50">
                                  <td className="py-3 px-4">
                                    <div>
                                      <div className="font-medium text-foreground">{vacancy.requisition}</div>
                                      <div className="text-sm text-muted-foreground">{vacancy.location}</div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-muted-foreground">{vacancy.manager}</td>
                                  <td className="py-3 px-4 text-muted-foreground">{vacancy.department}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-2">
                                      {vacancy.candidates.map((candidate, index) => (
                                        <div
                                          key={index}
                                          className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground"
                                        >
                                          {candidate.initials}
                                        </div>
                                      ))}
                                      <span className="text-sm text-muted-foreground">+{vacancy.additionalCandidates}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-muted-foreground">{vacancy.nextEvent}</td>
                                  <td className="py-3 px-4">
                                    <Badge className={vacancy.stageColor}>
                                      {vacancy.currentStage}
                                    </Badge>
                                  </td>
                                  <td className="py-3 px-4">
                                    {getPriorityBadge(vacancy.priority, vacancy.priorityColor)}
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center space-x-1"
                                      onClick={() => navigate('/dashboard/hr/reference-check-detail')}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span>View</span>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vacancyData.map((vacancy) => (
                        <Card key={vacancy.id} className="border-purple-200">
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <div className="font-medium text-foreground">{vacancy.requisition}</div>
                              <div className="text-sm text-muted-foreground">{vacancy.location}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Manager:</span>
                                <span className="text-sm font-medium text-foreground">{vacancy.manager}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Department:</span>
                                <span className="text-sm font-medium text-foreground">{vacancy.department}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Candidates:</span>
                                <div className="flex items-center space-x-1">
                                  {vacancy.candidates.map((candidate, index) => (
                                    <div
                                      key={index}
                                      className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground"
                                    >
                                      {candidate.initials}
                                    </div>
                                  ))}
                                  <span className="text-sm text-muted-foreground">+{vacancy.additionalCandidates}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Next event:</span>
                                <span className="text-sm font-medium text-foreground">{vacancy.nextEvent}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Current stage:</span>
                                <Badge className={vacancy.stageColor}>
                                  {vacancy.currentStage}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Priority:</span>
                                {getPriorityBadge(vacancy.priority, vacancy.priorityColor)}
                              </div>
                            </div>

                            <div className="pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full flex items-center justify-center space-x-1"
                                onClick={() => navigate('/dashboard/hr/requisition-detail')}
                              >
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing 1 to 86 of 120 recruitment & onboarding lists
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
                </div>
              </TabsContent>

              <TabsContent value="reference-checks" className="space-y-6">
                {/* Reference Checks Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Reference checks lists</h2>

                  {/* Search and Actions Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  {/* Reference Checks Table */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 border-b border-border">
                            <tr>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Candidate</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Requisition</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Refs</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Received</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Flags</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Status</th>
                              <th className="text-left py-3 px-4 font-medium text-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {referenceChecksData.map((check, index) => (
                              <tr key={check.id} className={`border-b border-border hover:bg-muted/50 ${index % 2 === 1 ? 'bg-muted/50' : 'bg-card'}`}>
                                <td className="py-3 px-4">
                                  <div className="flex items-center space-x-3">
                                    <input type="checkbox" className="w-4 h-4 text-muted-foreground border-border rounded" />
                                    <div>
                                      <div className="font-medium text-foreground">{check.candidateName}</div>
                                      <div className="text-sm text-muted-foreground">{check.candidateEmail}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div>
                                    <div className="font-medium text-foreground">{check.requisition}</div>
                                    <div className="text-sm text-muted-foreground">{check.department}</div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{check.refs}</td>
                                <td className="py-3 px-4 text-muted-foreground">{check.received}</td>
                                <td className="py-3 px-4">
                                  {check.flags > 0 ? (
                                    <div className="flex items-center space-x-1">
                                      <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">Δ{check.flags}</span>
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">{check.flags}</span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <Badge className={getStatusBadgeColor(check.status)}>
                                    {check.status}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center space-x-1"
                                    onClick={() => navigate('/dashboard/hr/reference-check-detail')}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>View</span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Showing 1 to 8 of 120 reference checks lists
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
                </div>
              </TabsContent>

              <TabsContent value="onboarding-checklist" className="space-y-6 mt-6">
                {/* Onboarding Checklist Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Onboarding checklist</h2>

                    {/* Search and Filter */}
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search..."
                          className="pl-10 w-64"
                        />
                      </div>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  {/* Onboarding Checklist Table */}
                  <Card>
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Hire</th>
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Start date</th>
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Manager</th>
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progress</th>
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Blockers</th>
                              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Sarah Chen */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Sarah Chen</div>
                                    <div className="text-sm text-muted-foreground">sarah.chen@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Software engineer</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Aug 5, 2025</div>
                                  <div className="text-sm text-muted-foreground">Engineering onboarding</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Alicia smith</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-yellow-600 font-medium">62%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-red-600">
                                  <span className="mr-1">▲</span>
                                  <span className="font-medium">2</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* Michael Johnson */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Michael Johnson</div>
                                    <div className="text-sm text-muted-foreground">michael.johnson@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Product manager</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Sep 12, 2025</div>
                                  <div className="text-sm text-muted-foreground">Product launch</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">John Doe</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-yellow-600 font-medium">75%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-red-600">
                                  <span className="mr-1">▲</span>
                                  <span className="font-medium">2</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* Emily Davis */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Emily Davis</div>
                                    <div className="text-sm text-muted-foreground">emily.davis@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Designer</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Oct 1, 2025</div>
                                  <div className="text-sm text-muted-foreground">Design sprint</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Alice Brown</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-green-600 font-medium">100%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">0</div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* David Kim */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">David Kim</div>
                                    <div className="text-sm text-muted-foreground">david.kim@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Data analyst</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Nov 17, 2025</div>
                                  <div className="text-sm text-muted-foreground">Data review</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Carol Jones</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-yellow-600 font-medium">70%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-red-600">
                                  <span className="mr-1">▲</span>
                                  <span className="font-medium">2</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* Laura Wilson */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Laura Wilson</div>
                                    <div className="text-sm text-muted-foreground">laura.wilson@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Marketing specialist</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Dec 9, 2025</div>
                                  <div className="text-sm text-muted-foreground">Campaign kickoff</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Tom White</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-yellow-600 font-medium">85%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">0</div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* Chris Lee */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Chris Lee</div>
                                    <div className="text-sm text-muted-foreground">chris.lee@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">UX researcher</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Jan 15, 2026</div>
                                  <div className="text-sm text-muted-foreground">User testing</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">James Green</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-red-600 font-medium">30%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center text-red-600">
                                  <span className="mr-1">▲</span>
                                  <span className="font-medium">1</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* Anna Martinez */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Anna Martinez</div>
                                    <div className="text-sm text-muted-foreground">anna.martinez@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Frontend developer</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Feb 20, 2026</div>
                                  <div className="text-sm text-muted-foreground">Feature development</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Rebecca Black</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-green-600 font-medium">90%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">0</div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>

                            {/* Robert Taylor */}
                            <tr className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <input type="checkbox" className="rounded" />
                                  <div>
                                    <div className="font-medium text-foreground">Robert Taylor</div>
                                    <div className="text-sm text-muted-foreground">robert.taylor@gmail.com</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Backend developer</div>
                              </td>
                              <td className="py-3 px-4">
                                <div>
                                  <div className="text-muted-foreground">Mar 25, 2026</div>
                                  <div className="text-sm text-muted-foreground">System architecture</div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">Megan White</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-green-600 font-medium">88%</div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-muted-foreground">0</div>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => setShowDetailView(true)}
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/50">
                        <div className="text-sm text-muted-foreground">
                          Showing 1 to 8 of 120 onboarding checklists
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" disabled>
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Previous
                          </Button>
                          <Button variant="outline" size="sm">
                            Next
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="job-description-library" className="space-y-6 mt-6">
                <JobDescriptionLibrary />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default RecruitmentOnboarding;
