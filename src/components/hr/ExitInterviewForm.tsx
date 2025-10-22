import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Plus,
  X
} from 'lucide-react';

interface ExitInterviewFormProps {
  onBack: () => void;
  onSave: (data: any) => void;
}

const ExitInterviewForm = ({ onBack, onSave }: ExitInterviewFormProps) => {
  const [formData, setFormData] = useState({
    interviewee: 'Jane Doe',
    role: 'Marketing Lead',
    organization: 'Marketing',
    date: '4/24/2025',
    time: '10:30:00 AM',
    exitCase: 'EX-1042',
    ratings: {
      managerSupport: 0,
      workload: 0,
      growthOpportunities: 0,
      compensation: 0
    },
    notes: '',
    themes: [] as string[],
    actionItems: [] as Array<{
      id: number;
      description: string;
      owner: string;
    }>
  });

  const [newTheme, setNewTheme] = useState('');
  const [newActionItem, setNewActionItem] = useState({
    description: '',
    owner: ''
  });

  const handleBack = () => {
    onBack();
  };

  const handleRatingChange = (category: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: rating
      }
    }));
  };

  const handleAddTheme = () => {
    if (newTheme.trim() && !formData.themes.includes(newTheme.trim())) {
      setFormData(prev => ({
        ...prev,
        themes: [...prev.themes, newTheme.trim()]
      }));
      setNewTheme('');
    }
  };

  const handleRemoveTheme = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      themes: prev.themes.filter(t => t !== theme)
    }));
  };

  const handleAddActionItem = () => {
    if (newActionItem.description.trim() && newActionItem.owner.trim()) {
      setFormData(prev => ({
        ...prev,
        actionItems: [...prev.actionItems, {
          id: Date.now(),
          description: newActionItem.description.trim(),
          owner: newActionItem.owner.trim()
        }]
      }));
      setNewActionItem({ description: '', owner: '' });
    }
  };

  const handleRemoveActionItem = (id: number) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter(item => item.id !== id)
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const renderStars = (category: string, rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleRatingChange(category, index + 1)}
        className="focus:outline-none"
      >
        <Star
          className={`w-4 h-4 ${
            index < rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        />
      </button>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Exits</h1>
      </div>

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

      {/* Exit Interview Header Card */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-foreground">
                Exit Interview - {formData.interviewee}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{formData.role}</span>
                <span>•</span>
                <span>{formData.organization}</span>
                <span>•</span>
                <span>{formData.date}, {formData.time}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <span>{formData.exitCase}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              Scheduled
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rating Section */}
      <Card>
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Manager Support</span>
              <div className="flex items-center space-x-1">
                {renderStars('managerSupport', formData.ratings.managerSupport)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Workload</span>
              <div className="flex items-center space-x-1">
                {renderStars('workload', formData.ratings.workload)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Growth Opportunities</span>
              <div className="flex items-center space-x-1">
                {renderStars('growthOpportunities', formData.ratings.growthOpportunities)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Compensation</span>
              <div className="flex items-center space-x-1">
                {renderStars('compensation', formData.ratings.compensation)}
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
              <Textarea
                placeholder="Enter interview notes and key insights..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[120px] resize-none"
              />
            </CardContent>
          </Card>

          {/* Themes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Themes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.themes.map((theme, index) => (
                  <Badge key={index} variant="secondary" className="text-sm flex items-center gap-1">
                    {theme}
                    <button
                      type="button"
                      onClick={() => handleRemoveTheme(theme)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a theme..."
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTheme()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTheme}
                  disabled={!newTheme.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

      {/* Action Items Section */}
      <Card>
        <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Action items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.actionItems.map((item) => (
            <div
              key={item.id}
              className="bg-muted/50 rounded-lg p-4 border border-gray-200 flex items-start justify-between"
            >
              <div className="flex-1">
                <p className="text-foreground font-medium mb-2">{item.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Owner: {item.owner}</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveActionItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          
          <div className="space-y-3 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Description"
                value={newActionItem.description}
                onChange={(e) => setNewActionItem(prev => ({ ...prev, description: e.target.value }))}
              />
              <Input
                placeholder="Owner"
                value={newActionItem.owner}
                onChange={(e) => setNewActionItem(prev => ({ ...prev, owner: e.target.value }))}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddActionItem}
              disabled={!newActionItem.description.trim() || !newActionItem.owner.trim()}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add action item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleBack}>
          Cancel
        </Button>
        <Button variant="outline">
          Save draft
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-gray-900 hover:bg-gray-800"
        >
          Complete interview
        </Button>
      </div>
    </div>
  );
};

export default ExitInterviewForm;
