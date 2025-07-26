import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { overdueByItemType, complianceStatusData, upcomingDueDates } from './data/complianceMonitorData';

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

  // Sample calendar events for 2025
  const calendarEvents: CalendarEvent[] = [
    { id: '1', date: '2025-01-15', title: 'Quarterly Report Due', description: 'Submit quarterly compliance report for Q4 2024', type: 'deadline' },
    { id: '2', date: '2025-01-22', title: 'Compliance Review Meeting', description: 'Monthly review meeting with compliance team', type: 'meeting' },
    { id: '3', date: '2025-02-05', title: 'Grant Documentation Review', description: 'Review and update grant documentation', type: 'review' },
    { id: '4', date: '2025-02-14', title: 'Mid-Year Report Due', description: 'Submit mid-year progress report', type: 'deadline' },
    { id: '5', date: '2025-02-28', title: 'Stakeholder Meeting', description: 'Quarterly stakeholder review meeting', type: 'meeting' },
    { id: '6', date: '2025-03-10', title: 'Compliance Audit', description: 'Annual compliance audit review', type: 'review' },
    { id: '7', date: '2025-03-25', title: 'Financial Report Due', description: 'Submit quarterly financial compliance report', type: 'deadline' },
    { id: '8', date: '2025-04-08', title: 'Training Session', description: 'Compliance training for new staff', type: 'meeting' },
    { id: '9', date: '2025-04-20', title: 'Document Review', description: 'Review updated compliance procedures', type: 'review' },
    { id: '10', date: '2025-05-15', title: 'Annual Report Due', description: 'Submit annual compliance report', type: 'deadline' }
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
      backgroundColor: 'hsl(var(--primary))',
      color: 'white',
      borderRadius: '4px'
    },
    eventDate: {
      backgroundColor: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
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
              <div>
                <h3 className="text-black font-medium text-base">{selectedEvent.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{selectedEvent.description}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Type:</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  selectedEvent.type === 'deadline' ? 'bg-red-100 text-red-800' :
                  selectedEvent.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                  selectedEvent.type === 'review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};