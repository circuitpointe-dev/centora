import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Star,
  ExternalLink
} from 'lucide-react';

interface ExitInterviewDetailViewProps {
  onBack: () => void;
}

const ExitInterviewDetailView = ({ onBack }: ExitInterviewDetailViewProps) => {
  const handleBack = () => {
    onBack();
  };

  // Mock data for the interview detail
  const interviewData = {
    interviewee: 'Sarah Williams',
    role: 'Marketing Lead',
    organization: 'Marketing',
    date: '4/24/2025',
    time: '10:30:00 AM',
    exitCase: 'EX-1038',
    status: 'Completed',
    statusColor: 'bg-green-100 text-green-800',
    ratings: {
      managerSupport: 4,
      growthOpportunities: 3,
      workload: 3,
      compensation: 3
    },
    notes: 'Sarah expressed appreciation for the team culture and management support. Main reason for leaving is relocation for family reasons. Mentioned that limited remote work options made it difficult to stay. Would have preferred more senior role opportunities internally before looking externally.',
    themes: ['Relocation', 'Career Path', 'Remote Work'],
    actionItems: [
      {
        id: 1,
        text: 'Review remote work policy for exceptional cases',
        owner: 'HR-Emma',
        dueDate: '5/15/2025'
      },
      {
        id: 2,
        text: 'Create clearer internal promotion criteria for marketing',
        owner: 'Marketing-VP',
        dueDate: '5/30/2025'
      }
    ]
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
        <span className="text-muted-foreground">Exit interview log / Detail view</span>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                  Exit Interview - {interviewData.interviewee}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{interviewData.role}</span>
                  <span>•</span>
                  <span>{interviewData.organization}</span>
                  <span>•</span>
                  <span>{interviewData.date}, {interviewData.time}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <span>{interviewData.exitCase}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
              <Badge className={`${interviewData.statusColor} text-xs`}>
                {interviewData.status}
              </Badge>
            </div>
          </div>

          {/* Rating Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Manager Support</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(interviewData.ratings.managerSupport)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Growth Opportunities</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(interviewData.ratings.growthOpportunities)}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Workload</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(interviewData.ratings.workload)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Compensation</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(interviewData.ratings.compensation)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Interview notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {interviewData.notes}
              </p>
            </CardContent>
          </Card>

          {/* Themes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Themes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {interviewData.themes.map((theme, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Action items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {interviewData.actionItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-muted/50 rounded-lg p-4 border border-gray-200"
                >
                  <p className="text-foreground font-medium mb-2">{item.text}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Owner: {item.owner}</span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Footer Button */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ExitInterviewDetailView;
