import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, ChevronUp, ChevronDown } from 'lucide-react';

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
  currentProgress: number;
  onUpdateProgress: (newProgress: number, achievement: string, nextSteps: string) => void;
}

const ProgressUpdateModal: React.FC<ProgressUpdateModalProps> = ({
  isOpen,
  onClose,
  goalTitle,
  currentProgress,
  onUpdateProgress
}) => {
  const [newProgress, setNewProgress] = useState(currentProgress);
  const [achievement, setAchievement] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQuickOption = (option: string) => {
    switch (option) {
      case '+10%':
        setNewProgress(Math.min(100, newProgress + 10));
        break;
      case '+25%':
        setNewProgress(Math.min(100, newProgress + 25));
        break;
      case 'Complete':
        setNewProgress(100);
        break;
      case '-5%':
        setNewProgress(Math.max(0, newProgress - 5));
        break;
    }
  };

  const incrementProgress = () => {
    setNewProgress(Math.min(100, newProgress + 1));
  };

  const decrementProgress = () => {
    setNewProgress(Math.max(0, newProgress - 1));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!achievement.trim()) {
      newErrors.achievement = 'Achievement description is required';
    }
    
    if (newProgress < 0 || newProgress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onUpdateProgress(newProgress, achievement, nextSteps);
    handleClose();
  };

  const handleClose = () => {
    setNewProgress(currentProgress);
    setAchievement('');
    setNextSteps('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-white/30" />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 h-[600px] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Update progress: {goalTitle}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Quick progress update with key details to keep your goal on track.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Progress Display */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Current Progress</Label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 min-w-[3rem]">{currentProgress}%</span>
            </div>
          </div>

          {/* New Progress Input */}
          <div className="space-y-2">
            <Label htmlFor="new-progress" className="text-sm font-semibold text-gray-900">
              New Progress (%) <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementProgress}
                className="h-10 w-10"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Input
                id="new-progress"
                type="number"
                value={newProgress}
                onChange={(e) => setNewProgress(parseInt(e.target.value) || 0)}
                className="text-center focus:ring-purple-500 focus:border-purple-500"
                min="0"
                max="100"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementProgress}
                className="h-10 w-10"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
            {errors.progress && (
              <p className="text-sm text-red-500">{errors.progress}</p>
            )}
          </div>

          {/* Quick Options */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">Quick options</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickOption('+10%')}
                className="text-gray-600 hover:text-gray-900"
              >
                +10%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickOption('+25%')}
                className="text-gray-600 hover:text-gray-900"
              >
                +25%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickOption('Complete')}
                className="text-gray-600 hover:text-gray-900"
              >
                Complete
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickOption('-5%')}
                className="text-gray-600 hover:text-gray-900"
              >
                -5%
              </Button>
            </div>
          </div>

          {/* Achievement Textarea */}
          <div className="space-y-2">
            <Label htmlFor="achievement" className="text-sm font-semibold text-gray-900">
              What did you achieve? <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="achievement"
              value={achievement}
              onChange={(e) => setAchievement(e.target.value)}
              placeholder="Describe what you accomplished..."
              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
              required
            />
            {errors.achievement && (
              <p className="text-sm text-red-500">{errors.achievement}</p>
            )}
          </div>

          {/* Next Steps Textarea */}
          <div className="space-y-2">
            <Label htmlFor="next-steps" className="text-sm font-semibold text-gray-900">
              Next steps
            </Label>
            <Textarea
              id="next-steps"
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
              placeholder="What are your next steps..."
              className="min-h-[100px] focus:ring-purple-500 focus:border-purple-500 resize-none"
            />
          </div>
        </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6"
          >
            Update progress
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressUpdateModal;
