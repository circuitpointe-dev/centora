import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Send } from 'lucide-react';
import { overdueByItemType, complianceStatusData, upcomingDueDates } from './data/complianceMonitorData';
import ReminderForm from '../opportunity-tracking/pipeline/ReminderForm';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'report' | 'meeting' | 'deadline' | 'review';
}

export const ComplianceCharts = () => {
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  // Sample calendar events for July-December 2025
  const calendarEvents: CalendarEvent[] = [
    { id: '1', date: '2025-07-08', title: 'Mid-Year Review Meeting', description: 'Comprehensive mid-year progress assessment', type: 'meeting' },
    { id: '2', date: '2025-07-15', title: 'Grant Application Deadline', description: 'Submit Q3 grant applications', type: 'deadline' },
    { id: '3', date: '2025-07-22', title: 'Compliance Audit', description: 'Semi-annual compliance audit review', type: 'review' },
    { id: '4', date: '2025-08-05', title: 'Stakeholder Meeting', description: 'Monthly stakeholder progress review', type: 'meeting' },
    { id: '5', date: '2025-08-18', title: 'Financial Report Due', description: 'Submit Q2 financial compliance report', type: 'deadline' },
    { id: '6', date: '2025-09-10', title: 'Training Workshop', description: 'Compliance training for all staff members', type: 'meeting' },
    { id: '7', date: '2025-09-25', title: 'Documentation Review', description: 'Quarterly documentation compliance check', type: 'review' },
    { id: '8', date: '2025-10-07', title: 'Board Meeting', description: 'Quarterly board review and planning session', type: 'meeting' },
    { id: '9', date: '2025-10-20', title: 'Annual Report Due', description: 'Submit comprehensive annual report', type: 'deadline' },
    { id: '10', date: '2025-11-12', title: 'Performance Review', description: 'Annual performance and compliance review', type: 'review' },
    { id: '11', date: '2025-11-28', title: 'Budget Planning Meeting', description: 'Next year budget planning session', type: 'meeting' },
    { id: '12', date: '2025-12-15', title: 'Year-End Report Due', description: 'Final compliance report for 2025', type: 'deadline' }
  ];

  // Get dates that have due items
  const dueDates = upcomingDueDates.map(item => new Date(item.date));
  
  // Get dates that have calendar events
  const eventDates = calendarEvents.map(event => new Date(event.date));

  const isDueDate = (date: Date) => {
    return dueDates.some(dueDate => 
      dueDate.getDate() === date.getDate() &&
      dueDate.getMonth() === date.getMonth() &&
      dueDate.getFullYear() === date.getFullYear()
    );
  };

  const isEventDate = (date: Date) => {
    return eventDates.some(eventDate => 
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  };

  const getEventForDate = (date: Date) => {
    return calendarEvents.find(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear();
    });
  };

  const handleDateClick = (date: Date | undefined) => {
    if (date && isEventDate(date)) {
      const event = getEventForDate(date);
      if (event) {
        setSelectedEvent(event);
        setShowEventDialog(true);
      }
    }
    setCalendarDate(date);
  };

  const modifiers = {
    dueDate: dueDates,
    eventDate: eventDates
  };

  const modifiersStyles = {
    dueDate: {
      backgroundColor: 'hsl(var(--destructive))',
      color: 'white',
      borderRadius: '4px',
      fontWeight: 'bold'
    },
    eventDate: {
      backgroundColor: '#7c3aed',
      color: 'white',
      borderRadius: '4px',
      fontWeight: 'bold'
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Overdue Compliance By Item Type - Bar Chart */}
        <Card className="h-96">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Overdue Compliance By Item Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={overdueByItemType} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  fontSize={10}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Status - Doughnut Chart */}
        <Card className="h-96">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={complianceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {complianceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {complianceStatusData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.fill }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Due Dates - Calendar */}
        <Card className="h-96">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Upcoming Due Dates</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex justify-center">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={handleDateClick}
              className="pointer-events-auto scale-90 origin-top"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              showOutsideDays={false}
            />
          </CardContent>
        </Card>
      </div>

      {/* Event Details Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-md bg-white text-black border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-black text-lg font-semibold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Event Details
            </DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="text-lg font-semibold text-black">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Event name</span>
                  <span className="text-sm font-medium text-black">{selectedEvent.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Organization</span>
                  <span className="text-sm font-medium text-black">UNICEF</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Region</span>
                  <span className="text-sm font-medium text-black">West</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Checklist items</span>
                  <span className="text-sm font-medium text-black">12</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Met</span>
                  <span className="text-sm font-medium text-black">10</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overdue</span>
                  <span className="text-sm font-medium text-black">1</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending</span>
                  <span className="text-sm font-medium text-black">1</span>
                </div>
              </div>
              
              {new Date(selectedEvent.date) > new Date() && (
                <Button 
                  className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => setShowReminderForm(true)}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send reminder
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reminder Form */}
      <ReminderForm
        open={showReminderForm}
        date={selectedEvent ? new Date(selectedEvent.date) : undefined}
        initialValue=""
        onClose={() => setShowReminderForm(false)}
        onSave={(text) => {
          console.log('Reminder saved:', text);
          setShowReminderForm(false);
        }}
      />
    </>
  );
};