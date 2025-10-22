import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Shield,
  Upload
} from 'lucide-react';

const ReferenceCheckDetailView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [checkDetailsOpen, setCheckDetailsOpen] = useState(true);
  const [recentActivityOpen, setRecentActivityOpen] = useState(true);
  const [isRiskView, setIsRiskView] = useState(false);
  const [isRefereeIssueView, setIsRefereeIssueView] = useState(false);
  const [isScoringIssueView, setIsScoringIssueView] = useState(false);

  const recentActivities = [
    {
      title: 'Reference requests sent to all 3 referees',
      team: 'HR Team',
      date: 'Jan 18, 2025',
      time: '11:30 AM'
    },
    {
      title: 'Interviews scheduled with shortlisted candidates',
      team: 'Recruitment Team',
      date: 'Jan 20, 2025',
      time: '10:00 AM'
    },
    {
      title: 'Final candidate selection meeting',
      team: 'Hiring Manager',
      date: 'Jan 25, 2025',
      time: '2:00 PM'
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
            <span>Reference checks / Candidate detail view</span>
          </Button>
        </div>
      </div>

      {/* Candidate Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-xl font-bold text-muted-foreground">
              MJ
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Micheal Johnson - Reference check</h1>
              <p className="text-muted-foreground mt-1">
                Review reference check details, referee responses, scoring, and risk assessment for this candidate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger
            value="overview"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="referees"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Referees
          </TabsTrigger>
          <TabsTrigger
            value="scoring"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Scoring
          </TabsTrigger>
          <TabsTrigger
            value="evidence"
            className={`data-[state=active]:bg-violet-600 data-[state=active]:text-white`}
          >
            Evidence
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Score Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Overall score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-violet-600 h-3 rounded-full"
                      style={{ width: isRiskView ? '72%' : '85%' }}
                    ></div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{isRiskView ? '7.2/10' : '8.5/10'}</div>
              </div>
            </CardContent>
          </Card>

          {/* Reference Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reference progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-violet-600 h-3 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">3/3</div>
                  <div className="text-sm text-muted-foreground">{isRiskView ? 'All references received' : '2 pending'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment Card */}
          <Card className={isRiskView ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <CardContent className="p-6">
              {!isRiskView ? (
                // No Risk View
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-800">Risk assessment</h3>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-xl font-semibold text-green-800 mb-2">No Risk Flags Detected</div>
                    <div className="text-green-700 mb-4">
                      All reference checks completed successfully with no concerns identified.
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsRiskView(true)}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ) : (
                // Risk View
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-6 w-6 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-800">Risk assessment</h3>
                    </div>
                    <Badge className="bg-red-100 text-red-800">1 Risk</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Risk Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-red-100 text-red-800">Communication risk</Badge>
                        <Badge className="bg-orange-100 text-orange-800">Medium severity</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium text-muted-foreground">Issue description:</span>
                          <p className="text-sm text-foreground mt-1">Communication concerns mentioned by former manager regarding clarity with technical teams.</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Source:</span>
                          <span className="text-sm font-medium text-foreground">David Brown - Former manager</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Flagged by:</span>
                          <span className="text-sm font-medium text-foreground">HR Team</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Date:</span>
                          <span className="text-sm font-medium text-foreground">Jan 21, 2025</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Risk type:</span>
                          <span className="text-sm font-medium text-foreground">Communication</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recommended Actions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Recommended actions:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>Conduct additional reference checks with former supervisors</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>Schedule follow-up interview to address specific concerns</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>Document risk mitigation strategies if proceeding</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-muted-foreground mt-1">•</span>
                          <span>Consider probationary period with close monitoring</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsRiskView(false)}
                      className="text-red-700 border-red-300 hover:bg-red-100"
                    >
                      Hide Details
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check Details Card */}
          <Card>
            <Collapsible open={checkDetailsOpen} onOpenChange={setCheckDetailsOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Check details
                    </CardTitle>
                    {checkDetailsOpen ? (
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Position:</span>
                      <span className="text-sm font-medium text-foreground">Software Engineer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Department:</span>
                      <span className="text-sm font-medium text-foreground">Engineering</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge className="bg-blue-100 text-blue-800">{isRiskView ? 'Received' : 'Requested'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Template:</span>
                      <Badge className="bg-muted text-muted-foreground">eng-template</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Consent received:</span>
                      <span className="text-sm font-medium text-foreground">Yes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Anonymity:</span>
                      <span className="text-sm font-medium text-foreground">Named</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk level:</span>
                      {isRiskView ? (
                        <Badge className="bg-red-100 text-red-800">1 risk detected</Badge>
                      ) : (
                        <span className="text-sm font-medium text-foreground">No risks</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last activity:</span>
                      <span className="text-sm font-medium text-foreground">2d ago</span>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Recent Activity Card */}
          <Card>
            <Collapsible open={recentActivityOpen} onOpenChange={setRecentActivityOpen}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Recent activity
                    </CardTitle>
                    {recentActivityOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-violet-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.team}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {activity.date} • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>

        <TabsContent value="referees" className="space-y-6">
          {/* Switch Button */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsRefereeIssueView(!isRefereeIssueView)}
              className="text-muted-foreground border-border hover:bg-muted"
            >
              {isRefereeIssueView ? 'Show Normal View' : 'Show Issue View'}
            </Button>
          </div>

          {/* Referees Section */}
          <Card>
            <Collapsible open={true} onOpenChange={() => {}}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Referees
                    </CardTitle>
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {!isRefereeIssueView ? (
                    // Normal Referees View
                    <>
                      {/* Referee 1: Moses Kennedy */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">Moses Kennedy</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium text-foreground">moses.kennedy@gmail.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <span className="text-sm font-medium text-foreground">Senior Engineering Manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <span className="text-sm font-medium text-foreground">TechCorp</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Relation:</span>
                            <span className="text-sm font-medium text-foreground">Former manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reminder:</span>
                            <span className="text-sm font-medium text-foreground">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Consent:</span>
                            <span className="text-sm font-medium text-foreground">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last contact:</span>
                            <span className="text-sm font-medium text-foreground">May 2, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Performance</div>
                                    <div className="text-lg font-bold text-green-600">8/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How would you rate their technical skills?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Excellent technical skills, very strong problem solver</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Communication</div>
                                    <div className="text-lg font-bold text-green-600">9/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How effective are they in conveying ideas?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Very clear communicator, easily articulates complex concepts.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Teamwork</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How well do they collaborate with others?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Generally cooperative, but can be assertive in discussions.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Adaptability</div>
                                    <div className="text-lg font-bold text-green-600">8/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How quickly do they adjust to changes?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Quick to adapt, embraces new challenges with enthusiasm.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>

                      {/* Referee 2: Alice Smith */}
                      <div className="border-t border-border pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">Alice Smith</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium text-foreground">alice.smith@hotmail.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <span className="text-sm font-medium text-foreground">Product Designer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <span className="text-sm font-medium text-foreground">DesignHub</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Relation:</span>
                            <span className="text-sm font-medium text-foreground">Former colleague</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reminder:</span>
                            <span className="text-sm font-medium text-foreground">1</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Consent:</span>
                            <span className="text-sm font-medium text-foreground">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last contact:</span>
                            <span className="text-sm font-medium text-foreground">April 15, 2025</span>
                          </div>
                        </div>
                      </div>

                      {/* Referee 3: Jordan Lee */}
                      <div className="border-t border-border pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">Jordan Lee</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium text-foreground">jordan.lee@yahoo.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <span className="text-sm font-medium text-foreground">Project Manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <span className="text-sm font-medium text-foreground">ManageIt</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Relation:</span>
                            <span className="text-sm font-medium text-foreground">Product manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reminder:</span>
                            <span className="text-sm font-medium text-foreground">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Consent:</span>
                            <span className="text-sm font-medium text-foreground">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last contact:</span>
                            <span className="text-sm font-medium text-foreground">March 29, 2025</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Issue Referees View
                    <>
                      {/* Referee 1: David Brown */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">David Brown</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium text-foreground">david.brown@bigcorp.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <span className="text-sm font-medium text-foreground">VP Product</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <span className="text-sm font-medium text-foreground">BigCorp</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Relation:</span>
                            <span className="text-sm font-medium text-foreground">Former Manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reminder:</span>
                            <span className="text-sm font-medium text-foreground">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Consent:</span>
                            <span className="text-sm font-medium text-foreground">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last contact:</span>
                            <span className="text-sm font-medium text-foreground">May 2, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Performance</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">Leadership and strategy skills?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Good strategic thinking, room for improvement in team leadership.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="text-sm font-semibold text-foreground">Communication</div>
                                      <Badge className="bg-red-100 text-red-800 text-xs">Risk flag</Badge>
                                    </div>
                                    <div className="text-lg font-bold text-red-600">6/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">Communication with stakeholders?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Sometimes struggled with clear communication to engineering teams.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>

                      {/* Referee 2: Sarah Kim */}
                      <div className="border-t border-border pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">Sarah Kim</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium text-foreground">sarah.kim@innovate.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <span className="text-sm font-medium text-foreground">Senior Designer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <span className="text-sm font-medium text-foreground">Innovate Inc.</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Relation:</span>
                            <span className="text-sm font-medium text-foreground">Peer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reminder:</span>
                            <span className="text-sm font-medium text-foreground">1</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Consent:</span>
                            <span className="text-sm font-medium text-foreground">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last contact:</span>
                            <span className="text-sm font-medium text-foreground">April 15, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Performance</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How would you rate their creativity?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Exceptional creativity, consistently generates innovative ideas.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Communication</div>
                                    <div className="text-lg font-bold text-green-600">8/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How effective are they in sharing feedback?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Constructive feedback provider, encourages open dialogue.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Teamwork</div>
                                    <div className="text-lg font-bold text-green-600">9/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How well do they support team goals?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Reliable team player, actively contributes to group dynamics.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Adaptability</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How do they handle unexpected challenges?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Highly adaptable, thrives under pressure.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>

                      {/* Referee 3: Michael Lee */}
                      <div className="border-t border-border pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="text-sm font-medium text-foreground">Michael Lee</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium text-foreground">michael.lee@techsolutions.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Role:</span>
                            <span className="text-sm font-medium text-foreground">Software Engineer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <span className="text-sm font-medium text-foreground">Tech Solutions</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Relation:</span>
                            <span className="text-sm font-medium text-foreground">Former Colleague</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Reminder:</span>
                            <span className="text-sm font-medium text-foreground">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Consent:</span>
                            <span className="text-sm font-medium text-foreground">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last contact:</span>
                            <span className="text-sm font-medium text-foreground">March 30, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Performance</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How would you assess their coding skills?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Solid coding skills, proficient in multiple languages.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-border bg-card">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-foreground">Communication</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">Question:</div>
                                  <div className="text-sm text-muted-foreground">How well do they communicate within the team?</div>
                                  <div className="text-xs text-muted-foreground">Answer:</div>
                                  <div className="text-sm text-foreground">Clear communicator but sometimes needs prompting.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>


        <TabsContent value="evidence" className="space-y-6">
          {/* Upload Evidence Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Upload evidence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Name and Evidence Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">File name</label>
                  <input
                    type="text"
                    placeholder="Enter file name"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Evidence type</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-card">
                      <option value="call-note">Call note</option>
                      <option value="email">Email</option>
                      <option value="document">Document</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/50">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Choose a file or drag & drop it here</p>
                <Button variant="outline" className="bg-card border-border text-muted-foreground hover:bg-muted/50">
                  Browse file
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Evidence Files Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Evidence files (1)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* File Entry */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                  <div className="flex-1">
                    <div className="font-medium text-foreground">sarah_chen_call_notes.pdf</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span>call-notes</span>
                      <span className="mx-2">•</span>
                      <span>245 KB</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>Uploaded by HR Team</div>
                    <div>Jul 2, 2025</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scoring Tab */}
        <TabsContent value="scoring" className="space-y-6">
          {/* Switch Button */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsScoringIssueView(!isScoringIssueView)}
              className="text-muted-foreground border-border hover:bg-muted"
            >
              {isScoringIssueView ? 'Show Normal View' : 'Show Issue View'}
            </Button>
          </div>

          {!isScoringIssueView ? (
            // Normal Scoring View
            <>
              {/* Overall Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Overall assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">8/10</div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Excellent Reference</div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
                  <p className="text-sm text-muted-foreground">Detailed scoring across different assessment categories</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Performance</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">8/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Excellent</div>
                  </div>

                  {/* Communication */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Communication</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">9/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Excellent</div>
                  </div>

                  {/* Teamwork */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Teamwork</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Satisfactory</div>
                  </div>

                  {/* Adaptability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Adaptability</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">8/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Excellent</div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            // Issue Scoring View
            <>
              {/* Overall Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Overall assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">7.3/10</div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Satisfactory Reference</div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
                  <p className="text-sm text-muted-foreground">Detailed scoring across different assessment categories</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Performance</div>
                        <div className="text-sm text-muted-foreground">Based on 3 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Satisfactory</div>
                  </div>

                  {/* Communication with Risk Flag */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium text-foreground">Communication</div>
                          <div className="text-sm text-muted-foreground">Based on 1 response</div>
                        </div>
                        <Badge className="bg-red-100 text-red-800 text-xs">Risk flag</Badge>
                      </div>
                      <div className="text-lg font-bold text-red-600">6/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Satisfactory</div>
                  </div>

                  {/* Communication (Normal) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Communication</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">8/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Excellent</div>
                  </div>

                  {/* Communication (Another) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Communication</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Satisfactory</div>
                  </div>

                  {/* Teamwork */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Teamwork</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">9/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Excellent</div>
                  </div>

                  {/* Adaptability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">Adaptability</div>
                        <div className="text-sm text-muted-foreground">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-muted-foreground">Satisfactory</div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReferenceCheckDetailView;
