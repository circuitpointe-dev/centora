import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  Download,
  FileText,
  MessageSquare,
  Calendar,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  ExternalLink,
  User,
  Handshake,
  CheckCircle,
  Clock,
  MapPin,
  DollarSign,
  Building,
  Users,
  Activity,
  ArrowUp
} from 'lucide-react';

const RequisitionDetailView = () => {
  const navigate = useNavigate();
  const [requisitionOverviewOpen, setRequisitionOverviewOpen] = useState(true);
  const [candidatesOpen, setCandidatesOpen] = useState(true);
  const [interviewProgressOpen, setInterviewProgressOpen] = useState(true);
  const [activityTimelineOpen, setActivityTimelineOpen] = useState(true);
  const [nextStepOpen, setNextStepOpen] = useState(true);
  const [currentStageName, setCurrentStageName] = useState('Applied');

  // Mock data for candidates
  const candidates = [
    {
      id: 1,
      name: 'Sarah Chen',
      initials: 'SC',
      email: 'sarah.chen@gmail.com',
      phone: '+1 (555) 123-4567',
      status: 'Phone screen',
      date: 'Jan 01, 2025',
      source: 'LinkedIn'
    },
    {
      id: 2,
      name: 'John Doe',
      initials: 'JD',
      email: 'john.doe@example.com',
      phone: '+1 (555) 987-6543',
      status: 'Interviewed',
      date: 'Jan 02, 2025',
      source: 'Referral'
    },
    {
      id: 3,
      name: 'Jack Harlow',
      initials: 'JH',
      email: 'jack.harlow@example.com',
      phone: '+1 (555) 234-5678',
      status: 'Offered',
      date: 'Jan 03, 2025',
      source: 'LinkedIn'
    },
    {
      id: 4,
      name: 'Alice Lee',
      initials: 'AL',
      email: 'alice.lee@example.com',
      phone: '+1 (555) 654-3210',
      status: 'Offered',
      date: 'Jan 03, 2025',
      source: 'LinkedIn'
    }
  ];

  const pipelineStages = [
    { name: 'Applied', icon: Download },
    { name: 'Screen', icon: FileText },
    { name: 'Interview', icon: MessageSquare },
    { name: 'Offer', icon: Handshake },
    { name: 'Hired', icon: User }
  ];

  const interviewSchedules = [
    {
      name: 'Sarah chen',
      date: 'Jan 02, 2025',
      time: '09:30 AM',
      status: 'Scheduled'
    },
    {
      name: 'John doe',
      date: 'Jan 02, 2025',
      time: '10:00 AM',
      status: 'Scheduled'
    },
    {
      name: 'Jack harlow',
      date: 'Jan 02, 2025',
      time: '10:30 AM',
      status: 'Scheduled'
    },
    {
      name: 'Alice lee',
      date: 'Jan 02, 2025',
      time: '11:00 AM',
      status: 'Scheduled'
    }
  ];

  const activities = [
    {
      title: 'Requisition created',
      description: 'New req created for Software Engineer II position',
      date: 'Jan 01, 2025',
      by: 'Adam Mark'
    },
    {
      title: 'First application',
      description: 'Sarah Chen applied via LinkedIn',
      date: 'Jan 01, 2025',
      by: 'System'
    },
    {
      title: 'Screen scheduled',
      description: 'Phone scheduled for tomorrow',
      date: 'Jan 02, 2025',
      by: 'Adam Mark'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard/hr/recruitment-onboarding')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Vacancy tracker / Requisition detail view</span>
          </Button>
        </div>
      </div>

      {/* Job Requisition Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">Software Engineer II</h1>
            <Badge className="bg-red-100 text-red-800">High</Badge>
          </div>
          <p className="text-muted-foreground">
            View detailed information about this requisition and its progress through the hiring pipeline.
          </p>
        </CardContent>
      </Card>

      {/* Pipeline Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Pipeline progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative flex items-start justify-between">
            {pipelineStages.map((stage, index) => {
              const IconComponent = stage.icon;
              const currentStageIndex = pipelineStages.findIndex(s => s.name === currentStageName);
              const isCurrent = stage.name === currentStageName;
              const isActive = index <= currentStageIndex;
              
              return (
                <div 
                  key={stage.name} 
                  className="flex flex-col items-center relative z-10 cursor-pointer"
                  onClick={() => setCurrentStageName(stage.name)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isActive ? 'bg-purple-600' : 'bg-muted'
                  }`}>
                    <IconComponent className={`h-6 w-6 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stage.name}
                    </div>
                    {isCurrent && (
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full mt-1">Current</div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Connecting line - positioned between circles */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-muted z-0"></div>
          </div>
        </CardContent>
      </Card>

      {/* Requisition Overview Card */}
      <Card>
        <Collapsible open={requisitionOverviewOpen} onOpenChange={setRequisitionOverviewOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Requisition overview
                </CardTitle>
                {requisitionOverviewOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Manager</div>
                    <div className="font-medium text-foreground">Mary Ann</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Salary</div>
                    <div className="font-medium text-foreground">$120,000 - $160,000</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Location</div>
                    <div className="font-medium text-foreground">San Francisco, CA</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Source</div>
                    <div className="font-medium text-foreground">LinkedIn</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Department</div>
                    <div className="font-medium text-foreground">Engineering</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Candidates Card */}
      <Card>
        <Collapsible open={candidatesOpen} onOpenChange={setCandidatesOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Candidate ({candidates.length})
                </CardTitle>
                {candidatesOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidates.map((candidate) => (
                  <div key={candidate.id} className="p-4 bg-card rounded-lg border border-border shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                          {candidate.initials}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{candidate.name}</div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{candidate.email}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{candidate.source}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-muted text-muted-foreground text-xs">{candidate.status}</Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{candidate.phone}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{candidate.status} {candidate.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 text-xs">
                        <FileText className="h-3 w-3" />
                        <span>Resume</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 text-xs">
                        <MessageSquare className="h-3 w-3" />
                        <span>Notes</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center space-x-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>Schedule</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Interview Progress Card */}
      <Card>
        <Collapsible open={interviewProgressOpen} onOpenChange={setInterviewProgressOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Interview progress
                </CardTitle>
                {interviewProgressOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-2">Phone screen</div>
                <div className="space-y-3">
                  {interviewSchedules.map((interview, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="font-medium text-foreground">{interview.name}</div>
                        <div className="text-sm text-muted-foreground">{interview.date} • {interview.time}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{interview.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Activity Timeline Card */}
      <Card>
        <Collapsible open={activityTimelineOpen} onOpenChange={setActivityTimelineOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Activity timeline
                </CardTitle>
                {activityTimelineOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{activity.title}</div>
                    <div className="text-sm text-muted-foreground">{activity.description}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {activity.date} • By {activity.by}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Next Step Card */}
      <Card>
        <Collapsible open={nextStepOpen} onOpenChange={setNextStepOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Next step
                </CardTitle>
                {nextStepOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="text-muted-foreground">
                Phone screen with candidate tomorrow.
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default RequisitionDetailView;
