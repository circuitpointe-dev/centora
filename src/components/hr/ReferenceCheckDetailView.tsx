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
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
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
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
              MJ
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Micheal Johnson - Reference check</h1>
              <p className="text-gray-600 mt-1">
                Review reference check details, referee responses, scoring, and risk assessment for this candidate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
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
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-violet-600 h-3 rounded-full"
                      style={{ width: isRiskView ? '72%' : '85%' }}
                    ></div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{isRiskView ? '7.2/10' : '8.5/10'}</div>
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
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-violet-600 h-3 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">3/3</div>
                  <div className="text-sm text-gray-600">{isRiskView ? 'All references received' : '2 pending'}</div>
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
                          <span className="text-sm font-medium text-gray-700">Issue description:</span>
                          <p className="text-sm text-gray-900 mt-1">Communication concerns mentioned by former manager regarding clarity with technical teams.</p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Source:</span>
                          <span className="text-sm font-medium text-gray-900">David Brown - Former manager</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Flagged by:</span>
                          <span className="text-sm font-medium text-gray-900">HR Team</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Date:</span>
                          <span className="text-sm font-medium text-gray-900">Jan 21, 2025</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Risk type:</span>
                          <span className="text-sm font-medium text-gray-900">Communication</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Recommended Actions */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Recommended actions:</h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>Conduct additional reference checks with former supervisors</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>Schedule follow-up interview to address specific concerns</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>Document risk mitigation strategies if proceeding</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-gray-400 mt-1">•</span>
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
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Check details
                    </CardTitle>
                    {checkDetailsOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Position:</span>
                      <span className="text-sm font-medium text-gray-900">Software Engineer</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Department:</span>
                      <span className="text-sm font-medium text-gray-900">Engineering</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge className="bg-blue-100 text-blue-800">{isRiskView ? 'Received' : 'Requested'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Template:</span>
                      <Badge className="bg-gray-100 text-gray-800">eng-template</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Consent received:</span>
                      <span className="text-sm font-medium text-gray-900">Yes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Anonymity:</span>
                      <span className="text-sm font-medium text-gray-900">Named</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Risk level:</span>
                      {isRiskView ? (
                        <Badge className="bg-red-100 text-red-800">1 risk detected</Badge>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">No risks</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Last activity:</span>
                      <span className="text-sm font-medium text-gray-900">2d ago</span>
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
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Recent activity
                    </CardTitle>
                    {recentActivityOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
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
                        <div className="font-medium text-gray-900">{activity.title}</div>
                        <div className="text-sm text-gray-600">{activity.team}</div>
                        <div className="text-sm text-gray-500 mt-1">
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
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              {isRefereeIssueView ? 'Show Normal View' : 'Show Issue View'}
            </Button>
          </div>

          {/* Referees Section */}
          <Card>
            <Collapsible open={true} onOpenChange={() => {}}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Referees
                    </CardTitle>
                    <ChevronUp className="h-5 w-5 text-gray-500" />
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
                            <span className="text-sm text-gray-500">Name:</span>
                            <span className="text-sm font-medium text-gray-900">Moses Kennedy</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm font-medium text-gray-900">moses.kennedy@gmail.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="text-sm font-medium text-gray-900">Senior Engineering Manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Company:</span>
                            <span className="text-sm font-medium text-gray-900">TechCorp</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Relation:</span>
                            <span className="text-sm font-medium text-gray-900">Former manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Consent:</span>
                            <span className="text-sm font-medium text-gray-900">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last contact:</span>
                            <span className="text-sm font-medium text-gray-900">May 2, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Performance</div>
                                    <div className="text-lg font-bold text-green-600">8/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How would you rate their technical skills?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Excellent technical skills, very strong problem solver</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Communication</div>
                                    <div className="text-lg font-bold text-green-600">9/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How effective are they in conveying ideas?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Very clear communicator, easily articulates complex concepts.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Teamwork</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How well do they collaborate with others?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Generally cooperative, but can be assertive in discussions.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Adaptability</div>
                                    <div className="text-lg font-bold text-green-600">8/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How quickly do they adjust to changes?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Quick to adapt, embraces new challenges with enthusiasm.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>

                      {/* Referee 2: Alice Smith */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Name:</span>
                            <span className="text-sm font-medium text-gray-900">Alice Smith</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm font-medium text-gray-900">alice.smith@hotmail.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="text-sm font-medium text-gray-900">Product Designer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Company:</span>
                            <span className="text-sm font-medium text-gray-900">DesignHub</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Relation:</span>
                            <span className="text-sm font-medium text-gray-900">Former colleague</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">1</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Consent:</span>
                            <span className="text-sm font-medium text-gray-900">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last contact:</span>
                            <span className="text-sm font-medium text-gray-900">April 15, 2025</span>
                          </div>
                        </div>
                      </div>

                      {/* Referee 3: Jordan Lee */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Name:</span>
                            <span className="text-sm font-medium text-gray-900">Jordan Lee</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm font-medium text-gray-900">jordan.lee@yahoo.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="text-sm font-medium text-gray-900">Project Manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Company:</span>
                            <span className="text-sm font-medium text-gray-900">ManageIt</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Relation:</span>
                            <span className="text-sm font-medium text-gray-900">Product manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Consent:</span>
                            <span className="text-sm font-medium text-gray-900">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last contact:</span>
                            <span className="text-sm font-medium text-gray-900">March 29, 2025</span>
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
                            <span className="text-sm text-gray-500">Name:</span>
                            <span className="text-sm font-medium text-gray-900">David Brown</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm font-medium text-gray-900">david.brown@bigcorp.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="text-sm font-medium text-gray-900">VP Product</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Company:</span>
                            <span className="text-sm font-medium text-gray-900">BigCorp</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Relation:</span>
                            <span className="text-sm font-medium text-gray-900">Former Manager</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Consent:</span>
                            <span className="text-sm font-medium text-gray-900">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last contact:</span>
                            <span className="text-sm font-medium text-gray-900">May 2, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Performance</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">Leadership and strategy skills?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Good strategic thinking, room for improvement in team leadership.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="text-sm font-semibold text-gray-900">Communication</div>
                                      <Badge className="bg-red-100 text-red-800 text-xs">Risk flag</Badge>
                                    </div>
                                    <div className="text-lg font-bold text-red-600">6/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">Communication with stakeholders?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Sometimes struggled with clear communication to engineering teams.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>

                      {/* Referee 2: Sarah Kim */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Name:</span>
                            <span className="text-sm font-medium text-gray-900">Sarah Kim</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm font-medium text-gray-900">sarah.kim@innovate.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="text-sm font-medium text-gray-900">Senior Designer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Company:</span>
                            <span className="text-sm font-medium text-gray-900">Innovate Inc.</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Relation:</span>
                            <span className="text-sm font-medium text-gray-900">Peer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">1</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Consent:</span>
                            <span className="text-sm font-medium text-gray-900">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last contact:</span>
                            <span className="text-sm font-medium text-gray-900">April 15, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Performance</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How would you rate their creativity?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Exceptional creativity, consistently generates innovative ideas.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Communication</div>
                                    <div className="text-lg font-bold text-green-600">8/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How effective are they in sharing feedback?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Constructive feedback provider, encourages open dialogue.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Teamwork</div>
                                    <div className="text-lg font-bold text-green-600">9/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How well do they support team goals?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Reliable team player, actively contributes to group dynamics.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Adaptability</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How do they handle unexpected challenges?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Highly adaptable, thrives under pressure.</div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </div>

                      {/* Referee 3: Michael Lee */}
                      <div className="border-t border-gray-200 pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Name:</span>
                            <span className="text-sm font-medium text-gray-900">Michael Lee</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Email:</span>
                            <span className="text-sm font-medium text-gray-900">michael.lee@techsolutions.com</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role:</span>
                            <span className="text-sm font-medium text-gray-900">Software Engineer</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <Badge className="bg-green-100 text-green-800">Responded</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Company:</span>
                            <span className="text-sm font-medium text-gray-900">Tech Solutions</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Relation:</span>
                            <span className="text-sm font-medium text-gray-900">Former Colleague</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Reminder:</span>
                            <span className="text-sm font-medium text-gray-900">0</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Consent:</span>
                            <span className="text-sm font-medium text-gray-900">Given</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Last contact:</span>
                            <span className="text-sm font-medium text-gray-900">March 30, 2025</span>
                          </div>
                        </div>

                        {/* Reference Responses */}
                        <div className="mt-6">
                          <h4 className="text-md font-semibold text-white mb-4">Reference responses</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Performance</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How would you assess their coding skills?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Solid coding skills, proficient in multiple languages.</div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-gray-200 bg-white">
                              <CardContent className="p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-sm font-semibold text-gray-900">Communication</div>
                                    <div className="text-lg font-bold text-green-600">7/10</div>
                                  </div>
                                  <div className="text-xs text-gray-500">Question:</div>
                                  <div className="text-sm text-gray-700">How well do they communicate within the team?</div>
                                  <div className="text-xs text-gray-500">Answer:</div>
                                  <div className="text-sm text-gray-900">Clear communicator but sometimes needs prompting.</div>
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
                  <label className="text-sm font-medium text-gray-900">File name</label>
                  <input
                    type="text"
                    placeholder="Enter file name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Evidence type</label>
                  <div className="relative">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white">
                      <option value="call-note">Call note</option>
                      <option value="email">Email</option>
                      <option value="document">Document</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Choose a file or drag & drop it here</p>
                <Button variant="outline" className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
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
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">sarah_chen_call_notes.pdf</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>call-notes</span>
                      <span className="mx-2">•</span>
                      <span>245 KB</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
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
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
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
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Excellent Reference</div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
                  <p className="text-sm text-gray-600">Detailed scoring across different assessment categories</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Performance</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">8/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Excellent</div>
                  </div>

                  {/* Communication */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Communication</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">9/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Excellent</div>
                  </div>

                  {/* Teamwork */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Teamwork</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Satisfactory</div>
                  </div>

                  {/* Adaptability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Adaptability</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">8/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Excellent</div>
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
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Satisfactory Reference</div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Category Breakdown</CardTitle>
                  <p className="text-sm text-gray-600">Detailed scoring across different assessment categories</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Performance</div>
                        <div className="text-sm text-gray-500">Based on 3 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Satisfactory</div>
                  </div>

                  {/* Communication with Risk Flag */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div>
                          <div className="font-medium text-gray-900">Communication</div>
                          <div className="text-sm text-gray-500">Based on 1 response</div>
                        </div>
                        <Badge className="bg-red-100 text-red-800 text-xs">Risk flag</Badge>
                      </div>
                      <div className="text-lg font-bold text-red-600">6/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Satisfactory</div>
                  </div>

                  {/* Communication (Normal) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Communication</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">8/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Excellent</div>
                  </div>

                  {/* Communication (Another) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Communication</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Satisfactory</div>
                  </div>

                  {/* Teamwork */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Teamwork</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-green-600">9/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Excellent</div>
                  </div>

                  {/* Adaptability */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Adaptability</div>
                        <div className="text-sm text-gray-500">Based on 1 response</div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">7/10</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="text-sm text-gray-500">Satisfactory</div>
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
