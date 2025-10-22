import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock,
  Save,
  Send,
  PenTool,
  Download,
  Lock
} from 'lucide-react';

interface AppraisalDetailViewProps {
  onBack: () => void;
}

const AppraisalDetailView: React.FC<AppraisalDetailViewProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    goals: true,
    competencies: false,
    values: false,
    feedback: false,
    signoff: false
  });
  const [signoffData, setSignoffData] = useState({
    improvementPlanRequired: true,
    improvementGoals: '',
    timeline: '',
    support: '',
    followUpDate: '',
    flagForHR: true,
    exceptionType: '',
    description: '',
    resolution: '',
    finalComments: ''
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const reviewData = {
    employee: 'Jane Doe',
    manager: 'J. Smith',
    dueDate: '2025-05-10',
    summary: {
      goals: 3.5,
      competencies: 3.8,
      values: 5
    },
    goals: [
      {
        id: 1,
        title: 'Complete Q2 Platform Migration',
        description: 'Migrate 100% of services',
        progress: 100,
        status: 'Exceeded target by 20%',
        statusColor: 'text-green-600',
        rating: 4,
        badge: 'Exceeded',
        badgeColor: 'bg-muted text-gray-800',
        ratingText: 'Outstanding',
        ratingTextColor: 'text-green-600',
        lastUpdated: '2025-09-29 by J. Smith'
      },
      {
        id: 2,
        title: 'Mentor Junior Developers',
        description: 'Support 3 junior team members',
        progress: 100,
        status: 'On Track',
        statusColor: 'text-green-600',
        rating: 3,
        badge: 'On Track',
        badgeColor: 'bg-green-100 text-green-800',
        ratingText: 'Exceeds Expectations',
        ratingTextColor: 'text-blue-600',
        lastUpdated: '2025-09-28 by J. Smith'
      },
      {
        id: 3,
        title: 'Improve Code Quality',
        description: 'Reduce technical debt by 15%',
        progress: 80,
        status: 'Met',
        statusColor: 'text-muted-foreground',
        rating: 3,
        badge: 'Met',
        badgeColor: 'bg-blue-100 text-blue-800',
        ratingText: 'Meets Expectations',
        ratingTextColor: 'text-muted-foreground',
        lastUpdated: '2025-09-27 by J. Smith'
      },
      {
        id: 4,
        title: 'Team Collaboration',
        description: 'Lead cross-functional initiatives',
        progress: 90,
        status: 'On Track',
        statusColor: 'text-green-600',
        rating: 4,
        badge: 'On Track',
        badgeColor: 'bg-green-100 text-green-800',
        ratingText: 'Exceeds Expectations',
        ratingTextColor: 'text-blue-600',
        lastUpdated: '2025-09-26 by J. Smith'
      }
    ],
    reviewHistory: [
      { period: '2024 Annual', rating: '3.7' },
      { period: '2024 Mid-Year', rating: '3.5' },
      { period: '2023 Annual', rating: '3.4' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <button 
          onClick={onBack}
          className="flex items-center space-x-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Performance management</span>
        </button>
        <span>/</span>
        <span>Appraisal & reviews</span>
        <span>/</span>
        <span>Review overview detail view</span>
      </div>

      {/* Review Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{reviewData.employee} - Performance Review</h1>
          <p className="text-muted-foreground mt-1">
            Manager: {reviewData.manager} • Due: {reviewData.dueDate}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save draft
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Send className="h-4 w-4 mr-2" />
            Submit review
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Review Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Review Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Review summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{reviewData.summary.goals}</div>
                  <div className="text-sm text-muted-foreground">Goals</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{reviewData.summary.competencies}</div>
                  <div className="text-sm text-muted-foreground">Competencies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">{reviewData.summary.values}</div>
                  <div className="text-sm text-muted-foreground">Values</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals Assessment Section */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <button
                  onClick={() => toggleSection('goals')}
                  className="flex items-center space-x-2 text-lg font-semibold text-foreground hover:text-purple-600 transition-colors"
                >
                  {expandedSections.goals ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                  <span>Goal's assessment</span>
                </button>
                
                {expandedSections.goals && (
                  <div className="space-y-6 pl-7">
                    {/* Overall Goals Rating */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-foreground">Overall Goals Rating</Label>
                        <Badge className="bg-blue-100 text-blue-800">Exceeds Expectations</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full"
                            style={{ width: '70%' }}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">3.5 / 5.0</div>
                      </div>
                    </div>

                    {/* Individual Goals */}
                    <div className="space-y-6">
                      {reviewData.goals.map((goal) => (
                        <div key={goal.id} className="border border-gray-200 rounded-lg p-4 space-y-4">
                          <div>
                            <h4 className="font-semibold text-foreground">{goal.title}</h4>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Progress</span>
                              <span className={`text-sm font-medium ${goal.statusColor}`}>{goal.status}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Rating</span>
                              <div className="flex items-center space-x-2">
                                <Badge className={goal.badgeColor}>{goal.badge}</Badge>
                                <Button variant="outline" size="sm">
                                  {goal.rating * 20}% Update
                                </Button>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${goal.rating * 20}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${goal.ratingTextColor}`}>{goal.ratingText}</span>
                              <span className="text-xs text-muted-foreground">Progress last updated: {goal.lastUpdated}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Goals Comments */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Goals Comments</Label>
                      <Textarea
                        placeholder="Provide detailed feedback on goal achievement..."
                        className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Feedback Section */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <button
                  onClick={() => toggleSection('feedback')}
                  className="flex items-center space-x-2 text-lg font-semibold text-foreground hover:text-purple-600 transition-colors w-full"
                >
                  {expandedSections.feedback ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                  <span>Additional feedback</span>
                </button>
                
                {expandedSections.feedback && (
                  <div className="space-y-6 pl-7">
                    {/* Strengths */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Strengths</Label>
                      <Textarea
                        placeholder="Describe the employee's key strengths and positive contributions..."
                        className="min-h-[120px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>

                    {/* Areas for development */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Areas for development</Label>
                      <Textarea
                        placeholder="Identify areas where the employee can improve and grow..."
                        className="min-h-[120px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>

                    {/* Career development */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Career development</Label>
                      <Textarea
                        placeholder="Provide guidance on career progression and development opportunities..."
                        className="min-h-[120px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>

                    {/* Next year goals */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Next year goals</Label>
                      <Textarea
                        placeholder="Outline objectives and goals for the upcoming year..."
                        className="min-h-[120px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Competencies Section */}
          <Card>
            <CardContent className="p-6">
              <button
                onClick={() => toggleSection('competencies')}
                className="flex items-center space-x-2 text-lg font-semibold text-foreground hover:text-purple-600 transition-colors w-full"
              >
                {expandedSections.competencies ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span>Competencies</span>
              </button>
            </CardContent>
          </Card>

          {/* Values Section */}
          <Card>
            <CardContent className="p-6">
              <button
                onClick={() => toggleSection('values')}
                className="flex items-center space-x-2 text-lg font-semibold text-foreground hover:text-purple-600 transition-colors w-full"
              >
                {expandedSections.values ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span>Values</span>
              </button>
            </CardContent>
          </Card>

          {/* Sign-off Section */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <button
                  onClick={() => toggleSection('signoff')}
                  className="flex items-center space-x-2 text-lg font-semibold text-foreground hover:text-purple-600 transition-colors w-full"
                >
                  {expandedSections.signoff ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                  <span>Sign-off</span>
                </button>
                
                {expandedSections.signoff && (
                  <div className="space-y-8 pl-7">
                    {/* Review Summary for Sign-off */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground">Review Summary for Sign-off</h3>
                      
                      {/* Overall Ratings */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">3.5</div>
                          <div className="text-sm text-muted-foreground">Goals</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">3.8</div>
                          <div className="text-sm text-muted-foreground">Competencies</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="text-2xl font-bold text-foreground">4.0</div>
                          <div className="text-sm text-muted-foreground">Values</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-700">3.8</div>
                          <div className="text-sm text-green-600">Overall</div>
                        </div>
                      </div>

                      {/* Goal Achievement */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Goal Achievement</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Complete Q2 Platform Migration</span>
                            <span className="text-sm font-medium text-foreground">85%</span>
                          </div>
                          <div className="flex justify-between items-center py-2 bg-gray-800 text-white px-3 rounded">
                            <span className="text-sm">Improve Code Review Quality</span>
                            <span className="text-sm font-medium">120%</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Mentor Junior Developers</span>
                            <span className="text-sm font-medium text-foreground">75%</span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-muted-foreground">Technical Documentation</span>
                            <span className="text-sm font-medium text-foreground">100%</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Review Period:</span>
                            <span className="text-sm font-medium text-foreground">2025 Mid-Year</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Employee Level:</span>
                            <span className="text-sm font-medium text-foreground">Senior</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Department:</span>
                            <span className="text-sm font-medium text-foreground">Engineering</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Review Date:</span>
                            <span className="text-sm font-medium text-foreground">9/30/2025</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Improvement Plan */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="improvement-plan" 
                          checked={signoffData.improvementPlanRequired}
                          onCheckedChange={(checked) => 
                            setSignoffData(prev => ({ ...prev, improvementPlanRequired: !!checked }))
                          }
                        />
                        <Label htmlFor="improvement-plan" className="font-medium text-foreground">
                          Improvement plan required
                        </Label>
                      </div>

                      {signoffData.improvementPlanRequired && (
                        <div className="space-y-4 pl-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Specific Goals for Improvement</Label>
                            <Textarea
                              value={signoffData.improvementGoals}
                              onChange={(e) => setSignoffData(prev => ({ ...prev, improvementGoals: e.target.value }))}
                              placeholder="Define specific, measurable goals for improvement..."
                              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Timeline & Milestones</Label>
                            <Textarea
                              value={signoffData.timeline}
                              onChange={(e) => setSignoffData(prev => ({ ...prev, timeline: e.target.value }))}
                              placeholder="Outline timeline and key milestones..."
                              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Support & Resources</Label>
                            <Textarea
                              value={signoffData.support}
                              onChange={(e) => setSignoffData(prev => ({ ...prev, support: e.target.value }))}
                              placeholder="Describe support, training, or resources to be provided..."
                              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Follow-up Review Date</Label>
                            <input
                              type="date"
                              value={signoffData.followUpDate}
                              onChange={(e) => setSignoffData(prev => ({ ...prev, followUpDate: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* HR Exceptions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="flag-hr" 
                          checked={signoffData.flagForHR}
                          onCheckedChange={(checked) => 
                            setSignoffData(prev => ({ ...prev, flagForHR: !!checked }))
                          }
                        />
                        <Label htmlFor="flag-hr" className="font-medium text-foreground">
                          Flag for HR review
                        </Label>
                      </div>

                      {signoffData.flagForHR && (
                        <div className="space-y-4 pl-6">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-foreground">Exception Type</Label>
                            <RadioGroup 
                              value={signoffData.exceptionType}
                              onValueChange={(value) => setSignoffData(prev => ({ ...prev, exceptionType: value }))}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="performance" id="performance" />
                                <Label htmlFor="performance">Performance Issue</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="conduct" id="conduct" />
                                <Label htmlFor="conduct">Conduct Issue</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="rating" id="rating" />
                                <Label htmlFor="rating">Rating Disagreement</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="legal" id="legal" />
                                <Label htmlFor="legal">Legal/Compliance Concern</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="other" id="other" />
                                <Label htmlFor="other">Other</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Description</Label>
                            <Textarea
                              value={signoffData.description}
                              onChange={(e) => setSignoffData(prev => ({ ...prev, description: e.target.value }))}
                              placeholder="Provide detailed description of the issue..."
                              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-foreground">Recommended Resolution</Label>
                            <Textarea
                              value={signoffData.resolution}
                              onChange={(e) => setSignoffData(prev => ({ ...prev, resolution: e.target.value }))}
                              placeholder="Suggest next steps or resolution approach..."
                              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Electronic Signatures */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Electronic Signatures</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground">Manager Signature</Label>
                          <p className="text-sm text-muted-foreground">Click to sign as manager</p>
                          <Button variant="outline" className="w-full">
                            <PenTool className="h-4 w-4 mr-2" />
                            Sign as Manager
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-foreground">Employee Acknowledgment</Label>
                          <p className="text-sm text-muted-foreground">Employee acknowledgment required</p>
                          <Button variant="outline" className="w-full">
                            <PenTool className="h-4 w-4 mr-2" />
                            Acknowledge Review
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Final Comments */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Final Comments (Optional)</Label>
                      <Textarea
                        value={signoffData.finalComments}
                        onChange={(e) => setSignoffData(prev => ({ ...prev, finalComments: e.target.value }))}
                        placeholder="Any final comments or notes for this review..."
                        className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
                      />
                    </div>

                    {/* Review Actions */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Generate PDF
                        </Button>
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                          <Lock className="h-4 w-4 mr-2" />
                          Finalize Review
                        </Button>
                      </div>
                      <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
                        ⚠️ Once finalized, this review cannot be modified. Ensure all signatures are collected and information is accurate.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Guidance & History */}
        <div className="space-y-6">
          {/* Guidance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Guidance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Rating Scale</p>
                  <p className="text-sm text-muted-foreground">1=Needs Improvement, 3=Meets, 5=Outstanding</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Be Specific</p>
                  <p className="text-sm text-muted-foreground">Provide concrete examples and actionable feedback</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Flags Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Risk Flags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <p className="text-sm text-muted-foreground">Missing Q1 goal data. Please verify with employee.</p>
              </div>
            </CardContent>
          </Card>

          {/* Review History Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Review History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviewData.reviewHistory.map((review, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">{review.period}</span>
                    <span className="text-sm font-semibold text-foreground">{review.rating}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppraisalDetailView;
