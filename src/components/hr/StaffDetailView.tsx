import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEmployee } from '@/hooks/hr/useEmployees';
import { useLeaveRequests } from '@/hooks/hr/useLeaveRequests';
import { useEmployeeDocuments } from '@/hooks/hr/useEmployeeDocuments';
import { useTrainingRecords } from '@/hooks/hr/useTraining';
import { usePolicies, usePolicyAcknowledgments } from '@/hooks/hr/usePolicies';
import { useUpdateEmployee } from '@/hooks/hr/useEmployeeCRUD';
import { useEmployees } from '@/hooks/hr/useEmployees';
import { Loader2 } from 'lucide-react';
import {
  ArrowLeft,
  MessageCircle,
  FileText,
  Edit,
  ChevronUp,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  Briefcase,
  Clock,
  Building,
  Award,
  BookOpen,
  CalendarDays,
  FileCheck,
  Activity
} from 'lucide-react';

const StaffDetailView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const employeeId = searchParams.get('employeeId');

  const [personalInfoOpen, setPersonalInfoOpen] = useState(true);
  const [employmentDetailOpen, setEmploymentDetailOpen] = useState(true);
  const [skillsDevelopmentOpen, setSkillsDevelopmentOpen] = useState(true);
  const [leaveAttendanceOpen, setLeaveAttendanceOpen] = useState(true);
  const [documentsComplianceOpen, setDocumentsComplianceOpen] = useState(true);
  const [activityLogOpen, setActivityLogOpen] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    employee_id: '',
    first_name: '',
    last_name: '',
    email: '',
    department: '',
    position: '',
    employment_type: 'full-time',
    hire_date: '',
    status: 'active'
  });
  const [newDept, setNewDept] = useState('');
  const [showNewDept, setShowNewDept] = useState(false);
  const [newPosition, setNewPosition] = useState('');
  const [showNewPosition, setShowNewPosition] = useState(false);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });

  // Fetch real employee data
  const { data: employee, isLoading: employeeLoading } = useEmployee(employeeId || undefined);
  const { data: leaveRequests = [], isLoading: leaveLoading } = useLeaveRequests(employeeId || undefined);
  const { data: documents = [], isLoading: documentsLoading } = useEmployeeDocuments(undefined, employeeId || undefined);
  const { data: trainingRecords = [], isLoading: trainingLoading } = useTrainingRecords(employeeId || undefined);
  const { data: policies = [] } = usePolicies();
  const { data: policyAcks = [] } = usePolicyAcknowledgments(undefined, employeeId || undefined);
  const { data: allEmployees = [] } = useEmployees();
  const updateEmployee = useUpdateEmployee();

  // Calculate policy acknowledgments for this employee
  const policyAckSummary = useMemo(() => {
    if (!policies.length || !employeeId) return { total: 0, acknowledged: 0 };
    const total = policies.length;
    const acknowledged = policyAcks.filter(ack => ack.status === 'acknowledged').length;
    return { total, acknowledged };
  }, [policies, policyAcks, employeeId]);

  // Get expiring documents (within 30 days)
  const expiringDocuments = useMemo(() => {
    if (!documents.length) return null;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiring = documents.find(doc => {
      if (!doc.expiry_date) return false;
      const expiry = new Date(doc.expiry_date);
      return expiry <= thirtyDaysFromNow && expiry >= today;
    });

    return expiring;
  }, [documents]);

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  // Calculate leave balance (placeholder - would need leave balance table or calculation)
  const leaveBalance = useMemo(() => {
    // Placeholder calculation - in real app, this would come from leave_balance table
    const used = leaveRequests.filter(lr => lr.status === 'approved').reduce((sum, lr) => sum + (lr.days_requested || 0), 0);
    const available = 26 - used;
    return { used, available, total: 26 };
  }, [leaveRequests]);

  // Initialize edit form when employee data loads - MUST be before any early returns
  useEffect(() => {
    if (employee) {
      setEditForm({
        employee_id: employee.employee_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        department: employee.department || '',
        position: employee.position || '',
        employment_type: employee.employment_type || 'full-time',
        hire_date: employee.hire_date || '',
        status: employee.status || 'active'
      });
    }
  }, [employee]);

  // Handle edit employee
  const handleEditEmployee = async () => {
    if (!employee?.id || updateEmployee.isPending) return;
    try {
      await updateEmployee.mutateAsync({
        id: employee.id,
        updates: {
          employee_id: editForm.employee_id,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          email: editForm.email,
          department: editForm.department,
          position: editForm.position,
          employment_type: editForm.employment_type,
          hire_date: editForm.hire_date || null,
          status: editForm.status
        }
      });
      setIsEditOpen(false);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!employee?.email) {
      alert('Employee email is required to send a message');
      return;
    }
    // In a real app, this would integrate with a messaging system
    const mailtoLink = `mailto:${employee.email}?subject=${encodeURIComponent(messageForm.subject || 'Message from HR')}&body=${encodeURIComponent(messageForm.message || '')}`;
    window.location.href = mailtoLink;
    setIsMessageOpen(false);
    setMessageForm({ subject: '', message: '' });
  };

  if (employeeLoading || !employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{employeeLoading ? 'Loading employee...' : 'Employee not found'}</p>
        </div>
      </div>
    );
  }

  const fullName = `${employee.first_name} ${employee.last_name}`;
  const employeeStatus = employee.status || 'active';

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground capitalize">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate('/dashboard/hr/people-management')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span> Staff directory</span>
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Staff detail view</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => setIsMessageOpen(true)}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            onClick={() => setIsLogsOpen(true)}
          >
            <FileText className="h-4 w-4" />
            <span>View logs</span>
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700 flex items-center space-x-2"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
        </div>
      </div>

      {/* Staff Detail Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {employee.first_name?.[0]}{employee.last_name?.[0]}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Full name:</span>
                <span className="text-lg font-semibold text-foreground">{fullName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge className={employeeStatus === 'active' ? 'bg-green-100 text-green-800' : employeeStatus === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'}>
                  {employeeStatus.charAt(0).toUpperCase() + employeeStatus.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <Collapsible open={personalInfoOpen} onOpenChange={setPersonalInfoOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal information</span>
                </CardTitle>
                {personalInfoOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="text-sm text-foreground">{employee.email || '—'}</span>
              </div>
              {/* Note: Phone and Location fields don't exist in hr_employees table yet - can be added if needed */}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Employment Detail */}
      <Card>
        <Collapsible open={employmentDetailOpen} onOpenChange={setEmploymentDetailOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Employment detail</span>
                </CardTitle>
                {employmentDetailOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Employee ID:</span>
                <span className="text-sm text-foreground">{employee.employee_id || '—'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Start date:</span>
                <span className="text-sm text-foreground">{formatDate(employee.hire_date)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Position:</span>
                <span className="text-sm text-foreground">{employee.position || '—'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Employment type:</span>
                <span className="text-sm text-foreground capitalize">{employee.employment_type?.replace('-', ' ') || '—'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Department:</span>
                <span className="text-sm text-foreground">{employee.department || '—'}</span>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Skills & Development */}
      <Card>
        <Collapsible open={skillsDevelopmentOpen} onOpenChange={setSkillsDevelopmentOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Skills & development</span>
                </CardTitle>
                {skillsDevelopmentOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {trainingLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Training records:</span>
                    <span className="text-sm text-foreground">
                      {trainingRecords.filter(tr => tr.completion_status === 'completed').length}/{trainingRecords.length} completed
                    </span>
                  </div>
                  {trainingRecords.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Active trainings:</span>
                      <div className="space-y-2">
                        {trainingRecords.slice(0, 5).map((record) => (
                          <div key={record.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-xs text-foreground">{record.training_name}</span>
                            <Badge className={`text-xs ${record.completion_status === 'completed' ? 'bg-green-100 text-green-800' :
                              record.completion_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                              {record.completion_status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Leave & Attendance */}
      <Card>
        <Collapsible open={leaveAttendanceOpen} onOpenChange={setLeaveAttendanceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <CalendarDays className="h-5 w-5" />
                  <span>Leave & attendance</span>
                </CardTitle>
                {leaveAttendanceOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Leave Balance */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Leave balance</h4>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Used {leaveBalance.used} days</span>
                  <span>Available {leaveBalance.available} days</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-violet-600 h-2 rounded-full"
                    style={{ width: `${leaveBalance.total > 0 ? (leaveBalance.available / leaveBalance.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Leave Requests Table */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Leave requests</h4>
                {leaveLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : leaveRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No leave requests found</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">ID</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Type</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Date created</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Leave range</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Duration</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Approver</th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveRequests.map((request) => {
                          const startDate = formatDate(request.start_date);
                          const endDate = formatDate(request.end_date);
                          const createdDate = formatDate(request.created_at);
                          const duration = request.days_requested ? `${request.days_requested} day${request.days_requested !== 1 ? 's' : ''}` : '—';
                          return (
                            <tr key={request.id} className="border-b border-border">
                              <td className="py-2 px-3 text-xs text-foreground">{request.id.slice(0, 8)}...</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground capitalize">{request.leave_type?.replace('_', ' ') || '—'}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{createdDate}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{startDate} - {endDate}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{duration}</td>
                              <td className="py-2 px-3 text-xs text-muted-foreground">{request.approved_by ? `User ${request.approved_by.slice(0, 8)}` : '—'}</td>
                              <td className="py-2 px-3 text-xs">
                                {getStatusBadge(request.status)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Documents & Compliance */}
      <Card>
        <Collapsible open={documentsComplianceOpen} onOpenChange={setDocumentsComplianceOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>Documents & compliance</span>
                </CardTitle>
                {documentsComplianceOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              {documentsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Policy acknowledgement:</span>
                    <span className="text-sm text-foreground">{policyAckSummary.acknowledged}/{policyAckSummary.total}</span>
                  </div>
                  {documents.length > 0 && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Documents:</span>
                      <span className="text-sm text-foreground">{documents.length} total</span>
                    </div>
                  )}
                  {expiringDocuments && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-muted-foreground">Expiring document:</span>
                      <span className="text-sm text-foreground">{expiringDocuments.document_name}</span>
                      {expiringDocuments.expiry_date && (
                        <span className="text-sm text-red-600 font-medium">
                          ({Math.ceil((new Date(expiringDocuments.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days)
                        </span>
                      )}
                    </div>
                  )}
                  {documents.length === 0 && !expiringDocuments && (
                    <p className="text-sm text-muted-foreground">No documents on file</p>
                  )}
                </>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Activity Log */}
      <Card>
        <Collapsible open={activityLogOpen} onOpenChange={setActivityLogOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Activity log</span>
                </CardTitle>
                {activityLogOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {/* Recent Leave Requests */}
              {leaveRequests.length > 0 && (
                <>
                  {leaveRequests.slice(0, 3).map((request) => {
                    const createdDate = formatDate(request.created_at);
                    return (
                      <div key={request.id} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">
                          Leave request ({request.leave_type}) - {createdDate}
                        </span>
                        <Badge className={`text-xs ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                          {request.status}
                        </Badge>
                      </div>
                    );
                  })}
                </>
              )}

              {/* Recent Training Records */}
              {trainingRecords.length > 0 && (
                <>
                  {trainingRecords.slice(0, 3).map((record) => {
                    const startDate = formatDate(record.start_date);
                    return (
                      <div key={record.id} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">
                          Training: {record.training_name} - {startDate}
                        </span>
                        <Badge className={`text-xs ${record.completion_status === 'completed' ? 'bg-green-100 text-green-800' :
                          record.completion_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                          {record.completion_status}
                        </Badge>
                      </div>
                    );
                  })}
                </>
              )}

              {(leaveRequests.length === 0 && trainingRecords.length === 0) && (
                <p className="text-sm text-muted-foreground py-2">No recent activity</p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Edit Employee Modal */}
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (!open) {
          setShowNewDept(false);
          setShowNewPosition(false);
          setNewDept('');
          setNewPosition('');
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employee ID *</Label>
                <Input
                  value={editForm.employee_id || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, employee_id: e.target.value }))}
                  placeholder="EMP-0001"
                />
              </div>
              <div>
                <Label>Hire Date</Label>
                <Input
                  type="date"
                  value={editForm.hire_date || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, hire_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={editForm.first_name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={editForm.last_name || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Department</Label>
                {!showNewDept ? (
                  <div className="space-y-2">
                    <Select
                      value={editForm.department || ''}
                      onValueChange={(v) => {
                        if (v === '__add_new__') {
                          setShowNewDept(true);
                        } else {
                          setEditForm(prev => ({ ...prev, department: v }));
                        }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select or add department" /></SelectTrigger>
                      <SelectContent>
                        {[...new Set(allEmployees.map(e => e.department).filter(Boolean))].length > 0 ? (
                          [...new Set(allEmployees.map(e => e.department).filter(Boolean))].map(d => (
                            <SelectItem key={d} value={d || ''}>{d}</SelectItem>
                          ))
                        ) : null}
                        <SelectItem value="__add_new__" className="font-medium text-violet-600">+ Add New Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      placeholder="Enter new department name"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (newDept.trim()) {
                            setEditForm(prev => ({ ...prev, department: newDept.trim() }));
                            setShowNewDept(false);
                            setNewDept('');
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowNewDept(false); setNewDept(''); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <Label>Position</Label>
                {!showNewPosition ? (
                  <div className="space-y-2">
                    <Select
                      value={editForm.position || ''}
                      onValueChange={(v) => {
                        if (v === '__add_new__') {
                          setShowNewPosition(true);
                        } else {
                          setEditForm(prev => ({ ...prev, position: v }));
                        }
                      }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select or add position" /></SelectTrigger>
                      <SelectContent>
                        {[...new Set(allEmployees.map(e => e.position).filter(Boolean))].length > 0 ? (
                          [...new Set(allEmployees.map(e => e.position).filter(Boolean))].map(p => (
                            <SelectItem key={p} value={p || ''}>{p}</SelectItem>
                          ))
                        ) : null}
                        <SelectItem value="__add_new__" className="font-medium text-violet-600">+ Add New Position</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      placeholder="Enter new position name"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if (newPosition.trim()) {
                            setEditForm(prev => ({ ...prev, position: newPosition.trim() }));
                            setShowNewPosition(false);
                            setNewPosition('');
                          }
                        }}
                      >
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setShowNewPosition(false); setNewPosition(''); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employment Type</Label>
                <Select
                  value={editForm.employment_type || 'full-time'}
                  onValueChange={(v) => setEditForm(prev => ({ ...prev, employment_type: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editForm.status || 'active'}
                  onValueChange={(v) => setEditForm(prev => ({ ...prev, status: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button
              onClick={handleEditEmployee}
              className="bg-violet-600 hover:bg-violet-700"
              disabled={updateEmployee.isPending || !editForm.first_name || !editForm.last_name || !editForm.employee_id}
            >
              {updateEmployee.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Send a message to {fullName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Input value={employee?.email || ''} disabled />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={messageForm.subject}
                onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Message subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={messageForm.message}
                onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsMessageOpen(false);
              setMessageForm({ subject: '', message: '' });
            }}>
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-violet-600 hover:bg-violet-700"
              disabled={!employee?.email}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Logs Modal */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Logs</DialogTitle>
            <DialogDescription>View activity history for {fullName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Recent Leave Requests</h3>
              {leaveRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">No leave requests found</p>
              ) : (
                <div className="space-y-2">
                  {leaveRequests.slice(0, 10).map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {request.leave_type} - {formatDate(request.start_date)} to {formatDate(request.end_date)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {formatDate(request.created_at)} • Status: {request.status}
                        </p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Training Records</h3>
              {trainingRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">No training records found</p>
              ) : (
                <div className="space-y-2">
                  {trainingRecords.slice(0, 10).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium text-foreground">{record.training_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(record.start_date)} - {formatDate(record.end_date) || 'Ongoing'} • {record.completion_percentage}% complete
                        </p>
                      </div>
                      <Badge className={`text-xs ${record.completion_status === 'completed' ? 'bg-green-100 text-green-800' :
                        record.completion_status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {record.completion_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Documents</h3>
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">No documents found</p>
              ) : (
                <div className="space-y-2">
                  {documents.slice(0, 10).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                      <div>
                        <p className="text-sm font-medium text-foreground">{doc.document_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Type: {doc.document_type} • Expires: {formatDate(doc.expiry_date) || 'N/A'}
                        </p>
                      </div>
                      {doc.expiry_date && new Date(doc.expiry_date) < new Date() && (
                        <Badge className="bg-red-100 text-red-800 text-xs">Expired</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffDetailView;
