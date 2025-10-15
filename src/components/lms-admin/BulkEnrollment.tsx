import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  X, 
  ChevronDown,
  Check
} from 'lucide-react';

const BulkEnrollment = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('notifications');
  const [selectedCourses, setSelectedCourses] = useState(['Introduction to finance', 'Management course']);
  const [enrollmentSettings, setEnrollmentSettings] = useState({
    enrollImmediately: true,
    allowSelfEnrollment: false,
    addToCatalogVisibility: true
  });
  const [notificationSettings, setNotificationSettings] = useState({
    sendWelcomeEmail: true,
    sendReminder: false,
    sendEnrollmentConfirmation: false,
    sendCalendarInvite: true
  });
  const [reminderTime, setReminderTime] = useState('24 hours before start');
  const [isReminderDropdownOpen, setIsReminderDropdownOpen] = useState(false);
  const reminderDropdownRef = useRef<HTMLDivElement>(null);
  const [emailTemplate, setEmailTemplate] = useState({
    subject: 'Welcome to {{CourseTitle}}',
    body: 'Hi {{name}},\n\nYou have been enrolled in this course "{{Course name}}"\n\nLogin and start your learning journey today.'
  });

  const reminderOptions = [
    '24 hours before start',
    '48 hours before start',
    '1 week before start',
    '2 weeks before start'
  ];

  const steps = [
    { id: 'target', label: 'Target' },
    { id: 'preview', label: 'Preview & validate' },
    { id: 'notifications', label: 'Notifications' }
  ];

  const uploadedLearners = [
    { id: 1, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' },
    { id: 2, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' },
    { id: 3, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' },
    { id: 4, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' },
    { id: 5, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' },
    { id: 6, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' },
    { id: 7, name: 'Jane Doe', email: 'janedoe@gmail.com', department: 'Field Ops', result: 'Will enroll' }
  ];

  const handleRemoveCourse = (courseToRemove: string) => {
    setSelectedCourses(selectedCourses.filter(course => course !== courseToRemove));
  };

  // Close reminder dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reminderDropdownRef.current && !reminderDropdownRef.current.contains(event.target as Node)) {
        setIsReminderDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingChange = (setting: string) => {
    setEnrollmentSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleNotificationSettingChange = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleReminderTimeSelect = (time: string) => {
    setReminderTime(time);
    setIsReminderDropdownOpen(false);
  };

  const handleEmailTemplateChange = (field: string, value: string) => {
    setEmailTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBack = () => {
    navigate('/dashboard/lmsAdmin/learner-management');
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Navigation */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleBack}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Learners list</span>
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bulk enrollment</h1>
      </div>

      {/* Process Steps */}
      <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
        {steps.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeStep === step.id
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeStep === 'preview' && (
          <>
            {/* Course Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course</label>
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 p-3 border border-border rounded-lg bg-background min-h-[42px]">
                  {selectedCourses.map((course, index) => (
                    <div key={index} className="flex items-center space-x-1 bg-muted px-2 py-1 rounded-md">
                      <span className="text-sm text-foreground">{course}</span>
                      <button
                        onClick={() => handleRemoveCourse(course)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                </div>
              </div>
            </div>

            {/* Enrollment Settings */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Enrollment Settings</label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={enrollmentSettings.enrollImmediately}
                      onChange={() => handleSettingChange('enrollImmediately')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      enrollmentSettings.enrollImmediately 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-border'
                    }`}>
                      {enrollmentSettings.enrollImmediately && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground">Enroll learners immediately</span>
                </label>

                <label className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={enrollmentSettings.allowSelfEnrollment}
                      onChange={() => handleSettingChange('allowSelfEnrollment')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      enrollmentSettings.allowSelfEnrollment 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-border'
                    }`}>
                      {enrollmentSettings.allowSelfEnrollment && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground">Allow self-enrollment</span>
                </label>

                <label className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={enrollmentSettings.addToCatalogVisibility}
                      onChange={() => handleSettingChange('addToCatalogVisibility')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      enrollmentSettings.addToCatalogVisibility 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-border'
                    }`}>
                      {enrollmentSettings.addToCatalogVisibility && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground">Add learners to catalog visibility</span>
                </label>
              </div>
            </div>

            {/* Uploaded File Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">Uploaded file</label>
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Department</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadedLearners.map((learner) => (
                        <tr key={learner.id} className="border-b border-border">
                          <td className="py-3 px-4 text-sm text-foreground">{learner.name}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{learner.email}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{learner.department}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {learner.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeStep === 'notifications' && (
          <div className="space-y-8">
            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Notification</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notificationSettings.sendWelcomeEmail}
                      onChange={() => handleNotificationSettingChange('sendWelcomeEmail')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      notificationSettings.sendWelcomeEmail 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-border'
                    }`}>
                      {notificationSettings.sendWelcomeEmail && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground">Send welcome email</span>
                </label>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={notificationSettings.sendReminder}
                        onChange={() => handleNotificationSettingChange('sendReminder')}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        notificationSettings.sendReminder 
                          ? 'bg-purple-600 border-purple-600' 
                          : 'border-border'
                      }`}>
                        {notificationSettings.sendReminder && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-foreground">Send reminder</span>
                  </label>
                  <div className="relative" ref={reminderDropdownRef}>
                    <button
                      onClick={() => setIsReminderDropdownOpen(!isReminderDropdownOpen)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent bg-background"
                    >
                      <span>{reminderTime}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {isReminderDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-lg z-10">
                        <div className="py-1">
                          {reminderOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleReminderTimeSelect(option)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors text-foreground"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <label className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notificationSettings.sendEnrollmentConfirmation}
                      onChange={() => handleNotificationSettingChange('sendEnrollmentConfirmation')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      notificationSettings.sendEnrollmentConfirmation 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-border'
                    }`}>
                      {notificationSettings.sendEnrollmentConfirmation && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground">Send enrollment confirmation</span>
                </label>

                <label className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notificationSettings.sendCalendarInvite}
                      onChange={() => handleNotificationSettingChange('sendCalendarInvite')}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      notificationSettings.sendCalendarInvite 
                        ? 'bg-purple-600 border-purple-600' 
                        : 'border-border'
                    }`}>
                      {notificationSettings.sendCalendarInvite && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-foreground">Send calendar invite</span>
                </label>
              </div>
            </div>

            {/* Email Template Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Create email template</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    value={emailTemplate.subject}
                    onChange={(e) => handleEmailTemplateChange('subject', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Body</label>
                  <textarea
                    value={emailTemplate.body}
                    onChange={(e) => handleEmailTemplateChange('body', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                    placeholder="Enter email body"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-8">
        <button 
          onClick={handleBack}
          className="px-6 py-3 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-accent transition-colors"
        >
          Cancel
        </button>
        <button className="px-6 py-3 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
          {activeStep === 'notifications' ? 'Confirm & enroll' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default BulkEnrollment;
