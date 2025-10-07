import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Play, FileText, Download } from 'lucide-react';

interface Session {
  id: string;
  date: string;
  time: string;
  title: string;
  facilitator: string;
  action: 'join' | 'register';
  actionText: string;
}

interface CalendarSession {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  instructor: string;
  sessionTitle: string;
  instructorAvatar: string;
}

interface SessionCardProps {
  session: Session;
}

interface CalendarSessionCardProps {
  session: CalendarSession;
}

interface MySession {
  id: string;
  date: string;
  time: string;
  title: string;
  facilitator: string;
  status: 'upcoming' | 'past';
}

interface MySessionCardProps {
  session: MySession;
}

interface Recording {
  id: string;
  date: string;
  time: string;
  title: string;
  facilitator: string;
  tags: string[];
  downloadMaterial: {
    type: 'transcript' | 'notes' | 'feedback';
    label: string;
  };
}

interface RecordingCardProps {
  recording: Recording;
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const getButtonClass = () => {
    return session.action === 'join' 
      ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
      : 'bg-muted hover:bg-muted/80 text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-6">
        {/* Left Section - Date & Time */}
        <div className="flex-shrink-0">
          <div className="text-xl font-semibold text-card-foreground">
            {session.date}
          </div>
          <div className="text-sm text-muted-foreground">
            {session.time}
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="w-px h-12 bg-border"></div>

        {/* Middle Section - Session Details */}
        <div className="flex-1">
          <div className="text-xl font-semibold text-gray-800 mb-1">
            {session.title}
          </div>
          <div className="text-sm text-muted-foreground">
            Facilitator: {session.facilitator}
          </div>
        </div>

        {/* Right Section - Action Button */}
        <div className="flex-shrink-0">
          <button 
            className={`py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200 ${getButtonClass()}`}
          >
            {session.actionText}
          </button>
        </div>
      </div>
    </div>
  );
};

const CalendarSessionCard: React.FC<CalendarSessionCardProps> = ({ session }) => {
  return (
    <div className="bg-primary/10 border border-primary/20 rounded-lg hover:shadow-md transition-shadow duration-200 min-h-full flex flex-col">
      <div className="flex flex-col min-h-full p-3">
        {/* Instructor Avatar */}
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-xs">
              {session.instructor.split(' ').map(name => name[0]).join('')}
            </span>
          </div>
          <div className="text-sm font-medium text-primary">
            {session.instructor}
          </div>
        </div>
        
        {/* Session Title */}
        <div className="text-sm font-medium text-primary mb-2 flex-1">
          {session.sessionTitle}
        </div>
        
        {/* Bottom Row: Time and Button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {session.startTime} - {session.endTime}
          </div>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded text-xs font-medium transition-colors duration-200">
            Join session
          </button>
        </div>
      </div>
    </div>
  );
};

const MySessionCard: React.FC<MySessionCardProps> = ({ session }) => {
  const isPastSession = session.status === 'past';
  
  const getButtonContent = () => {
    if (isPastSession) {
      return (
        <button 
          disabled
          className="bg-muted text-muted-foreground py-2 px-6 rounded-md text-sm font-medium cursor-not-allowed opacity-60"
        >
          Join session
        </button>
      );
    }
    return (
      <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-6 rounded-md text-sm font-medium transition-colors duration-200">
        Join session
      </button>
    );
  };

  return (
    <div className={`bg-card border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${
      isPastSession ? 'border-border opacity-90' : 'border-border'
    }`}>
      <div className="flex items-center space-x-6">
        {/* Left Section - Date & Time */}
        <div className="flex-shrink-0">
          <div className={`text-xl font-semibold ${
            isPastSession ? 'text-muted-foreground' : 'text-gray-800'
          }`}>
            {session.date}
          </div>
          <div className={`text-sm ${
            isPastSession ? 'text-muted-foreground' : 'text-muted-foreground'
          }`}>
            {session.time}
          </div>
          {isPastSession && (
            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
              ✓ Completed
            </div>
          )}
        </div>

        {/* Vertical Separator */}
        <div className={`w-px h-12 ${
          isPastSession ? 'bg-border' : 'bg-border'
        }`}></div>

        {/* Middle Section - Session Details */}
        <div className="flex-1">
          <div className={`text-xl font-semibold mb-1 ${
            isPastSession ? 'text-muted-foreground' : 'text-card-foreground'
          }`}>
            {session.title}
          </div>
          <div className={`text-sm ${
            isPastSession ? 'text-muted-foreground' : 'text-muted-foreground'
          }`}>
            Facilitator: {session.facilitator}
          </div>
        </div>

        {/* Right Section - Action Button(s) */}
        <div className="flex-shrink-0">
          {getButtonContent()}
        </div>
      </div>
    </div>
  );
};

const RecordingCard: React.FC<RecordingCardProps> = ({ recording }) => {
  const getDownloadIcon = (type: string) => {
    switch (type) {
      case 'transcript':
        return (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <FileText size={12} className="text-muted-foreground" />
            </div>
            <span>Transcript</span>
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <Download size={12} className="text-muted-foreground" />
            </div>
          </div>
        );
      case 'notes':
        return (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <FileText size={12} className="text-muted-foreground" />
            </div>
            <span>Notes</span>
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <Download size={12} className="text-muted-foreground" />
            </div>
          </div>
        );
      case 'feedback':
        return (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <FileText size={12} className="text-muted-foreground" />
            </div>
            <span>Feedback</span>
            <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
              <Download size={12} className="text-muted-foreground" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-6">
        {/* Left Section - Date & Time */}
        <div className="flex-shrink-0">
          <div className="text-xl font-semibold text-card-foreground">
            {recording.date}
          </div>
          <div className="text-sm text-muted-foreground">
            {recording.time}
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="w-px h-12 bg-border"></div>

        {/* Middle Section - Session Details */}
        <div className="flex-1">
          <div className="text-xl font-semibold text-gray-800 mb-1">
            {recording.title}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            Facilitator: {recording.facilitator}
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {recording.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs rounded-full bg-muted text-card-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex-shrink-0 flex flex-col space-y-3">
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2">
            <Play size={16} />
            <span>Play recording</span>
          </button>
          {getDownloadIcon(recording.downloadMaterial.type)}
        </div>
      </div>
    </div>
  );
};

const LiveSessionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('Monthly');
  const [currentWeek, setCurrentWeek] = useState('August 10 - 14, 2025');
  const [activeSubTab, setActiveSubTab] = useState('my-sessions');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'my-sessions', label: 'My sessions' },
    { id: 'recordings', label: 'Recordings' },
  ];

  const sessions: Session[] = [
    {
      id: '1',
      date: 'Aug 15, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Leadership workshop',
      facilitator: 'Jane Doe',
      action: 'join',
      actionText: 'Join session'
    },
    {
      id: '2',
      date: 'Aug 16, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Project management training',
      facilitator: 'Mark Doe',
      action: 'join',
      actionText: 'Join session'
    },
    {
      id: '3',
      date: 'Aug 19, 2025',
      time: '10:00 AM - 12:00 PM',
      title: 'UX Research Techniques',
      facilitator: 'Sara Lee',
      action: 'register',
      actionText: 'Register'
    },
    {
      id: '4',
      date: 'Aug 20, 2025',
      time: '1:00 PM - 3:00 PM',
      title: 'Prototyping Basics',
      facilitator: 'Mike Brown',
      action: 'register',
      actionText: 'Register'
    },
    {
      id: '5',
      date: 'Aug 21, 2025',
      time: '9:00 AM - 11:00 AM',
      title: 'Agile Methodologies',
      facilitator: 'Lisa Green',
      action: 'register',
      actionText: 'Register'
    },
    {
      id: '6',
      date: 'Aug 21, 2025',
      time: '1:00 PM - 2:30 PM',
      title: 'Effective Communication Skills',
      facilitator: 'Robert Brown',
      action: 'join',
      actionText: 'Join session'
    },
    {
      id: '7',
      date: 'Aug 22, 2025',
      time: '10:00 AM - 12:00 PM',
      title: 'User Experience Design',
      facilitator: 'Emily White',
      action: 'register',
      actionText: 'Register'
    },
    {
      id: '8',
      date: 'Aug 16, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Project management training',
      facilitator: 'Mark Doe',
      action: 'join',
      actionText: 'Join session'
    }
  ];

  const calendarSessions: CalendarSession[] = [
    {
      id: 'cal-1',
      day: 10, // Wednesday
      startTime: '04:00 PM',
      endTime: '05:00 PM',
      instructor: 'Leslie Alex',
      sessionTitle: 'Web accessibility basics',
      instructorAvatar: '/placeholder-leslie.jpg'
    },
    {
      id: 'cal-2',
      day: 12, // Friday
      startTime: '02:00 PM',
      endTime: '03:00 PM',
      instructor: 'John Nike',
      sessionTitle: 'Data analysis workshop',
      instructorAvatar: '/placeholder-john.jpg'
    },
    {
      id: 'cal-3',
      day: 12, // Friday
      startTime: '09:00 PM',
      endTime: '10:00 PM',
      instructor: 'Mark Lee',
      sessionTitle: 'NGO fundraising strategies',
      instructorAvatar: '/placeholder-mark.jpg'
    }
  ];

  const mySessions: MySession[] = [
    {
      id: 'my-1',
      date: 'Aug 15, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Leadership workshop',
      facilitator: 'Jane Doe',
      status: 'upcoming'
    },
    {
      id: 'my-2',
      date: 'Aug 16, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Project management training',
      facilitator: 'Mark Doe',
      status: 'upcoming'
    },
    {
      id: 'my-3',
      date: 'Aug 17, 2025',
      time: '1:00 PM - 2:30 PM',
      title: 'Team building retreat',
      facilitator: 'Emily Smith',
      status: 'upcoming'
    },
    {
      id: 'my-4',
      date: 'Aug 18, 2025',
      time: '3:00 PM - 4:00 PM',
      title: 'Time management seminar',
      facilitator: 'John Brown',
      status: 'upcoming'
    },
    {
      id: 'my-5',
      date: 'Aug 19, 2025',
      time: '9:00 AM - 10:30 AM',
      title: 'Effective communication skills',
      facilitator: 'Alice Johnson',
      status: 'upcoming'
    },
    {
      id: 'my-6',
      date: 'Aug 20, 2025',
      time: '2:00 PM - 3:30 PM',
      title: 'Conflict resolution strategies',
      facilitator: 'Robert Lee',
      status: 'upcoming'
    }
  ];

  const pastSessions: MySession[] = [
    {
      id: 'past-1',
      date: 'Aug 8, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Digital marketing fundamentals',
      facilitator: 'Sarah Wilson',
      status: 'past'
    },
    {
      id: 'past-2',
      date: 'Aug 9, 2025',
      time: '2:00 PM - 3:30 PM',
      title: 'Financial planning basics',
      facilitator: 'Michael Chen',
      status: 'past'
    },
    {
      id: 'past-3',
      date: 'Aug 10, 2025',
      time: '9:00 AM - 10:30 AM',
      title: 'Public speaking skills',
      facilitator: 'Lisa Rodriguez',
      status: 'past'
    },
    {
      id: 'past-4',
      date: 'Aug 11, 2025',
      time: '1:00 PM - 2:00 PM',
      title: 'Customer service excellence',
      facilitator: 'David Kim',
      status: 'past'
    },
    {
      id: 'past-5',
      date: 'Aug 12, 2025',
      time: '3:00 PM - 4:30 PM',
      title: 'Strategic thinking workshop',
      facilitator: 'Jennifer Taylor',
      status: 'past'
    },
    {
      id: 'past-6',
      date: 'Aug 13, 2025',
      time: '11:00 AM - 12:30 PM',
      title: 'Innovation and creativity',
      facilitator: 'Alex Thompson',
      status: 'past'
    }
  ];

  // Combine all sessions
  const allMySessions = [...mySessions, ...pastSessions];

  const recordings: Recording[] = [
    {
      id: 'rec-1',
      date: 'Aug 15, 2025',
      time: '10:00 AM - 11:00 AM',
      title: 'Leadership workshop',
      facilitator: 'Jane Doe',
      tags: ['Leadership'],
      downloadMaterial: { type: 'transcript', label: 'Transcript' }
    },
    {
      id: 'rec-2',
      date: 'Sep 02, 2025',
      time: '2:00 PM - 3:00 PM',
      title: 'Advanced Presentation Skills',
      facilitator: 'Michael Chen',
      tags: ['Communication'],
      downloadMaterial: { type: 'transcript', label: 'Transcript' }
    },
    {
      id: 'rec-3',
      date: 'Aug 16, 2025',
      time: '1:00 PM - 2:30 PM',
      title: 'Team Building Retreat',
      facilitator: 'John Smith',
      tags: ['Team Dynamics'],
      downloadMaterial: { type: 'transcript', label: 'Transcript' }
    },
    {
      id: 'rec-4',
      date: 'Sep 10, 2025',
      time: '9:00 AM - 10:30 AM',
      title: 'Product Strategy Workshop',
      facilitator: 'Lisa Wong',
      tags: ['Market Analysis'],
      downloadMaterial: { type: 'notes', label: 'Notes' }
    },
    {
      id: 'rec-5',
      date: 'Aug 17, 2025',
      time: '9:00 AM - 10:00 AM',
      title: 'Conflict Resolution Seminar',
      facilitator: 'Emily Johnson',
      tags: ['Communication Skills'],
      downloadMaterial: { type: 'transcript', label: 'Transcript' }
    },
    {
      id: 'rec-6',
      date: 'Oct 5, 2025',
      time: '1:30 PM - 3:00 PM',
      title: 'UX Design Sprint',
      facilitator: 'Michael Johnson',
      tags: ['User Research'],
      downloadMaterial: { type: 'feedback', label: 'Feedback' }
    }
  ];

  console.log('Calendar sessions:', calendarSessions);

  const timeSlots = ['2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'];
  const days = [
    { day: 10, label: 'Wed' },
    { day: 11, label: 'Thu' },
    { day: 12, label: 'Fri' },
    { day: 13, label: 'Sat' },
    { day: 14, label: 'Sun' }
  ];

  const getSessionsForTimeSlot = (day: number, timeSlot: string) => {
    // Convert timeSlot format (e.g., "4 PM") to session format (e.g., "04:00 PM")
    const slotTime = timeSlot.replace(' PM', ':00 PM').replace(' AM', ':00 AM');
    
    // Handle single digit hours (e.g., "2 PM" -> "02:00 PM")
    const formattedSlotTime = slotTime.replace(/^(\d):/, '0$1:');
    
    const sessions = calendarSessions.filter(session => {
      return session.day === day && session.startTime === formattedSlotTime;
    });
    
    console.log(`Looking for sessions on day ${day} at ${formattedSlotTime}:`, sessions);
    console.log(`Available sessions:`, calendarSessions.map(s => `${s.day} at ${s.startTime}`));
    
    return sessions;
  };
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-card-foreground hover:border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header with Filter */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Upcoming sessions ({sessions.length})
                </h2>
                <div className="relative">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Daily">Daily</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              {/* Calendar Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 border border-border rounded-md text-sm font-medium text-card-foreground hover:bg-accent">
                    Today
                  </button>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 border border-border rounded-md hover:bg-accent">
                      <ChevronLeft size={16} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 border border-border rounded-md hover:bg-accent">
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={currentWeek}
                      onChange={(e) => setCurrentWeek(e.target.value)}
                      className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                    >
                      <option value="August 10 - 14, 2025">August 10 - 14, 2025</option>
                      <option value="August 17 - 21, 2025">August 17 - 21, 2025</option>
                      <option value="August 24 - 28, 2025">August 24 - 28, 2025</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none">
                    <option value="all">All categories</option>
                    <option value="workshop">Workshops</option>
                    <option value="training">Training</option>
                    <option value="meeting">Meetings</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-card border border-border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
                {/* Calendar Header */}
                <div className="grid grid-cols-6 border-b border-border sticky top-0 bg-card z-10">
                  <div className="p-4 border-r border-border bg-muted"></div>
                  {days.map((day) => (
                    <div key={day.day} className="p-4 border-r border-border bg-muted text-center">
                      <div className="text-sm font-medium text-card-foreground">{day.day}</div>
                      <div className="text-xs text-muted-foreground">{day.label}</div>
                    </div>
                  ))}
                </div>

                {/* Calendar Body */}
                <div className="grid grid-cols-6">
                  {/* Time Slots Column */}
                  <div className="border-r border-border">
                    {timeSlots.map((timeSlot) => (
                      <div key={timeSlot} className="min-h-24 border-b border-border flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">{timeSlot}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day Columns */}
                  {days.map((day) => (
                    <div key={day.day} className="border-r border-border">
                      {timeSlots.map((timeSlot) => {
                        const sessions = getSessionsForTimeSlot(day.day, timeSlot);
                        return (
                          <div key={`${day.day}-${timeSlot}`} className="min-h-24 border-b border-border">
                            {sessions.map((session) => (
                              <CalendarSessionCard key={session.id} session={session} />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'my-sessions' && (
            <div className="space-y-6">
              {/* Sub-tabs */}
              <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveSubTab('my-sessions')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeSubTab === 'my-sessions'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  My sessions
                </button>
                <button
                  onClick={() => setActiveSubTab('past-sessions')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeSubTab === 'past-sessions'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-card-foreground'
                  }`}
                >
                  Past sessions
                </button>
              </div>

              {/* Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allMySessions
                  .filter(session => activeSubTab === 'my-sessions' ? session.status === 'upcoming' : session.status === 'past')
                  .map((session) => (
                    <MySessionCard key={session.id} session={session} />
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'recordings' && (
            <div className="space-y-6">
              {/* Header with Filter */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-card-foreground">
                  Recordings ({recordings.length})
                </h2>
                <div className="relative">
                  <select className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none">
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Recordings Grid */}
              <div className="space-y-4">
                {recordings.map((recording) => (
                  <RecordingCard key={recording.id} recording={recording} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveSessionsPage;

