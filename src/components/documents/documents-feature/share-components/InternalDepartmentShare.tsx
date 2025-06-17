
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Building2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Document } from '../data';
import { departmentList } from '@/data/departmentData';

interface InternalDepartmentShareProps {
  document: Document;
}

const InternalDepartmentShare = ({ document }: InternalDepartmentShareProps) => {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleDepartmentToggle = (departmentId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(departmentId)
        ? prev.filter(id => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleShare = async () => {
    if (selectedDepartments.length === 0) {
      toast({
        title: "No departments selected",
        description: "Please select at least one department to share with.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    
    // Simulate API call
    setTimeout(() => {
      const departmentNames = selectedDepartments.map(id => 
        departmentList.find(dept => dept.id === id)?.name
      ).join(', ');

      toast({
        title: "Document shared successfully",
        description: `${document.fileName} has been shared with ${departmentNames} (View access).`,
      });
      
      setIsSharing(false);
      setSelectedDepartments([]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-2">Share with Departments</h3>
        <p className="text-sm text-gray-600 mb-4">
          All selected departments will have view access to this document.
        </p>
      </div>

      <div className="space-y-3">
        {departmentList.map((department) => (
          <div
            key={department.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <Checkbox
                id={`dept-${department.id}`}
                checked={selectedDepartments.includes(department.id)}
                onCheckedChange={() => handleDepartmentToggle(department.id)}
              />
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500" />
                <label 
                  htmlFor={`dept-${department.id}`}
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {department.name}
                </label>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              View
            </Badge>
          </div>
        ))}
      </div>

      {selectedDepartments.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              {selectedDepartments.length} department(s) selected
            </span>
          </div>
          <p className="text-xs text-blue-700">
            Selected departments will receive view access to this document.
          </p>
        </div>
      )}

      <Button
        onClick={handleShare}
        disabled={selectedDepartments.length === 0 || isSharing}
        className="w-full bg-violet-600 hover:bg-violet-700"
      >
        {isSharing ? 'Sharing...' : 'Share with Departments'}
      </Button>
    </div>
  );
};

export default InternalDepartmentShare;
