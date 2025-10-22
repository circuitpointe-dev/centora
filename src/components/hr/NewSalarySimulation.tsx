import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SalarySimulationModal from './SalarySimulationModal';
import {
  ArrowLeft,
  Users,
  FileText,
  Check
} from 'lucide-react';

interface NewSalarySimulationProps {
  onBack?: () => void;
}

const NewSalarySimulation: React.FC<NewSalarySimulationProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(3);
  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roleFamily: 'Product',
    role: 'Product designer',
    level: 'L5 - Senior IC',
    location: 'Lagos, Nigeria',
    employeeName: '',
    department: '',
    simulationType: 'existing-employee'
  });

  const steps = [
    {
      number: 1,
      title: 'Select benchmark context',
      icon: Check,
      active: currentStep === 1,
      completed: currentStep > 1
    },
    {
      number: 2,
      title: 'Employee details',
      icon: Users,
      active: currentStep === 2,
      completed: currentStep > 2
    },
    {
      number: 3,
      title: 'Ready to simulate',
      icon: FileText,
      active: currentStep === 3,
      completed: false
    }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleOpenSimulation = () => {
    setIsSimulationModalOpen(true);
  };

  const handleApproveSimulation = () => {
    console.log('Simulation approved and applied');
    setIsSimulationModalOpen(false);
    // Could also close the entire wizard or navigate somewhere
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    // Handle cancel logic - could navigate back or close modal
    console.log('Cancel simulation');
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const IconComponent = step.icon;
        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                step.active 
                  ? 'bg-purple-600 text-white' 
                  : step.completed 
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-muted-foreground'
              }`}>
                {step.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <IconComponent className="w-4 h-4" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step.active ? 'text-purple-600' : 'text-muted-foreground'
                }`}>
                  Step {step.number} of 3: {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-0.5 ${
                  step.completed ? 'bg-green-600' : 'bg-gray-200'
                }`}></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const Step1Content = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Role family</label>
          <Select 
            value={formData.roleFamily} 
            onValueChange={(value) => setFormData({...formData, roleFamily: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Data">Data</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Role</label>
          <Select 
            value={formData.role} 
            onValueChange={(value) => setFormData({...formData, role: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Product designer">Product designer</SelectItem>
              <SelectItem value="Product manager">Product manager</SelectItem>
              <SelectItem value="Product analyst">Product analyst</SelectItem>
              <SelectItem value="Product owner">Product owner</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Level</label>
          <Select 
            value={formData.level} 
            onValueChange={(value) => setFormData({...formData, level: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L3 - IC3">L3 - IC3</SelectItem>
              <SelectItem value="L4 - IC4">L4 - IC4</SelectItem>
              <SelectItem value="L5 - Senior IC">L5 - Senior IC</SelectItem>
              <SelectItem value="L6 - Staff IC">L6 - Staff IC</SelectItem>
              <SelectItem value="L7 - Principal IC">L7 - Principal IC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Location</label>
          <Select 
            value={formData.location} 
            onValueChange={(value) => setFormData({...formData, location: value})}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lagos, Nigeria">Lagos, Nigeria</SelectItem>
              <SelectItem value="Nairobi, Kenya">Nairobi, Kenya</SelectItem>
              <SelectItem value="Accra, Ghana">Accra, Ghana</SelectItem>
              <SelectItem value="Kampala, Uganda">Kampala, Uganda</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Selected Benchmark Preview */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Selected Benchmark Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Market P50 (Median)</p>
            <p className="text-lg font-semibold text-foreground">8.5m NGN</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Internal Band</p>
            <p className="text-lg font-semibold text-foreground">7.0m NGN - 9.5m NGN</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-foreground">Apr 2025</p>
          </div>
        </div>
      </div>
    </div>
  );

  const Step2Content = () => (
    <div className="space-y-6">
      {/* Employee Details Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Employee / Candidate name</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select employee or enter name" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sarah-chen">Sarah Chen</SelectItem>
              <SelectItem value="michael-johnson">Michael Johnson</SelectItem>
              <SelectItem value="emily-davis">Emily Davis</SelectItem>
              <SelectItem value="david-kim">David Kim</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Department (optional)</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Simulation Type Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-muted-foreground">Stimulation type</label>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={formData.simulationType === 'existing-employee' ? 'default' : 'ghost'}
            className={`flex-1 ${
              formData.simulationType === 'existing-employee' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-transparent text-muted-foreground hover:bg-gray-200'
            }`}
            onClick={() => setFormData({...formData, simulationType: 'existing-employee'})}
          >
            Existing Employee
          </Button>
          <Button
            variant={formData.simulationType === 'new-hire' ? 'default' : 'ghost'}
            className={`flex-1 ${
              formData.simulationType === 'new-hire' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-transparent text-muted-foreground hover:bg-gray-200'
            }`}
            onClick={() => setFormData({...formData, simulationType: 'new-hire'})}
          >
            New Hire
          </Button>
          <Button
            variant={formData.simulationType === 'external-offer' ? 'default' : 'ghost'}
            className={`flex-1 ${
              formData.simulationType === 'external-offer' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-transparent text-muted-foreground hover:bg-gray-200'
            }`}
            onClick={() => setFormData({...formData, simulationType: 'external-offer'})}
          >
            External Offer
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {formData.simulationType === 'existing-employee' && 'Analyze adjustment for current employee'}
          {formData.simulationType === 'new-hire' && 'Simulate compensation for new hire'}
          {formData.simulationType === 'external-offer' && 'Evaluate external offer competitiveness'}
        </p>
      </div>

      {/* Simulation Context Preview */}
      <div className="bg-muted/50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-3">Simulation Context</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Role:</span>
                <span className="text-sm font-medium text-foreground">SE II (L5)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Location:</span>
                <span className="text-sm font-medium text-foreground">Lagos, Nigeria</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="text-sm font-medium text-foreground">
                  {formData.simulationType === 'existing-employee' && 'Existing Employee'}
                  {formData.simulationType === 'new-hire' && 'New Hire'}
                  {formData.simulationType === 'external-offer' && 'External Offer'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Step3Content = () => (
    <div className="space-y-8">
      {/* Ready to Run Simulation Section */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Ready to Run Simulation</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          You've configured all the necessary context. Click continue to open the simulation tool.
        </p>
      </div>

      {/* Employee Details Summary */}
      <div className="bg-card border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-4">Employee Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Employee:</span>
            <span className="text-sm font-medium text-foreground">John Doe</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Role & Level:</span>
            <span className="text-sm font-medium text-foreground">SE II (L5)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Location:</span>
            <span className="text-sm font-medium text-foreground">Lagos, Nigeria</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Type:</span>
            <Badge className="bg-gray-900 text-white text-xs">
              {formData.simulationType === 'existing-employee' && 'Existing Employee'}
              {formData.simulationType === 'new-hire' && 'New Hire'}
              {formData.simulationType === 'external-offer' && 'External Offer'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Content />;
      case 2:
        return <Step2Content />;
      case 3:
        return <Step3Content />;
      default:
        return <Step1Content />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
        </Button>
        <span>Salary benchmarking</span>
        <span>/</span>
        <span className="text-foreground font-medium">New stimulation</span>
      </div>

      {/* Main Card */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">New Salary Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Indicator */}
          <StepIndicator />

          {/* Step Content */}
          {renderStepContent()}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
            {currentStep === 3 ? (
              <Button 
                onClick={handleOpenSimulation}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Open stimulation
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 3}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Salary Simulation Modal */}
      <SalarySimulationModal
        isOpen={isSimulationModalOpen}
        onClose={() => setIsSimulationModalOpen(false)}
        onApprove={handleApproveSimulation}
      />
    </div>
  );
};

export default NewSalarySimulation;
