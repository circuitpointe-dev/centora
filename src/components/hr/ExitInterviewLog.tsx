import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Search,
  Filter,
  Plus,
  Eye,
  MessageCircle,
  Calendar,
  ClipboardCheck
} from 'lucide-react';
import ScheduleExitInterviewModal from './ScheduleExitInterviewModal';
import ExitInterviewDetailView from './ExitInterviewDetailView';
import ExitInterviewForm from './ExitInterviewForm';

const ExitInterviewLog = () => {
  const [selectedInterviews, setSelectedInterviews] = useState<string[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Mock data for interview log
  const interviewData = [
    {
      id: 'INT-101',
      interviewee: 'Jane Doe',
      role: 'Software Engineer II',
      organization: 'Engineering',
      exitCase: 'EX-1042',
      date: 'Jul 2, 2025',
      time: '02:00 PM',
      owner: 'HR - Emmanuel',
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'INT-100',
      interviewee: 'Sarah Williams',
      role: 'Marketing Lead',
      organization: 'Marketing',
      exitCase: 'EX-1038',
      date: 'Jul 2, 2025',
      time: '02:00 PM',
      owner: 'HR - Ayo',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'INT-100',
      interviewee: 'Sarah Williams',
      role: 'Volunteer Coordinator',
      organization: 'Community programs',
      exitCase: 'EX-1040',
      date: 'Jul 2, 2025',
      time: '02:00 PM',
      owner: 'Coord - Sarah',
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      id: 'INT-100',
      interviewee: 'Sarah Williams',
      role: 'Product Designer',
      organization: 'Product',
      exitCase: 'EX-1039',
      date: 'Jul 2, 2025',
      time: '02:00 PM',
      owner: 'HR - Emmanuel',
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInterviews(interviewData.map(item => item.id));
    } else {
      setSelectedInterviews([]);
    }
  };

  const handleSelectInterview = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedInterviews(prev => [...prev, id]);
    } else {
      setSelectedInterviews(prev => prev.filter(interviewId => interviewId !== id));
    }
  };

  const handleScheduleInterview = () => {
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
  };

  const handleViewInterview = (interview: any) => {
    setSelectedInterview(interview);
    setShowDetailView(true);
  };

  const handleBackToList = () => {
    setShowDetailView(false);
    setSelectedInterview(null);
  };

  const handleSaveInterview = (interviewData: any) => {
    console.log('Saving interview data:', interviewData);
    // Here you would typically save the interview data
    // For now, we'll just go back to the list
    handleBackToList();
  };

  return (
    <div className="space-y-6">
      {showDetailView ? (
        <ExitInterviewForm onBack={handleBackToList} onSave={handleSaveInterview} />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Interviews Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Total interviews</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Interviews Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Scheduled interviews</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rate Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                  <ClipboardCheck className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Completion rate</p>
                <p className="text-2xl font-bold text-gray-900">50%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Log Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Exit interview log</h2>
          
          {/* Search and Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button 
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={handleScheduleInterview}
            >
              <Plus className="w-4 h-4" />
              Schedule interview
            </Button>
          </div>
        </div>

        {/* Interview Log Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                      <Checkbox
                        checked={selectedInterviews.length === interviewData.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Interviewee</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Role / Org</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Exit case</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date / Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {interviewData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Checkbox
                          checked={selectedInterviews.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectInterview(item.id, checked as boolean)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.interviewee}</div>
                          <div className="text-sm text-gray-600">({item.id})</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.role}</div>
                          <div className="text-sm text-gray-600">{item.organization}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="text-xs">
                          {item.exitCase}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-gray-900">{item.date}</div>
                          <div className="text-sm text-gray-600">{item.time}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-700">{item.owner}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${item.statusColor} text-xs`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewInterview(item)}
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}

      {/* Schedule Interview Modal */}
      <ScheduleExitInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
      />
    </div>
  );
};

export default ExitInterviewLog;
