import React from 'react';
import { MapPin, Monitor } from 'lucide-react';

interface TrainingEvent {
  date: string;
  time: string;
  title: string;
  locationType: 'physical' | 'virtual';
  locationDetail: string;
  canJoin?: boolean;
}

interface TrainingCardProps {
  event: TrainingEvent;
}

const TrainingCard: React.FC<TrainingCardProps> = ({ event }) => {
  const { date, time, title, locationType, locationDetail, canJoin } = event;
  const LocationIcon = locationType === 'virtual' ? Monitor : MapPin;

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border border-border flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm text-muted-foreground mb-2">
          <div className="font-medium text-card-foreground">{date}</div>
          <div>{time}</div>
        </div>
        <div className="font-semibold text-card-foreground mb-2">{title}</div>
        <div className="flex items-center text-sm text-muted-foreground">
          <LocationIcon size={16} className="mr-2 text-muted-foreground" />
          <span>{locationDetail}</span>
        </div>
      </div>
      {canJoin && (
        <button className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 text-sm font-medium">
          Join
        </button>
      )}
    </div>
  );
};

const UpcomingTrainings: React.FC = () => {
  const trainings: TrainingEvent[] = [
    { 
      date: 'Aug 15, 2025', 
      time: '10:00 AM - 11:00 AM', 
      title: 'Leadership workshop', 
      locationType: 'physical', 
      locationDetail: 'Lagos, Nigeria' 
    },
    { 
      date: 'Aug 16, 2025', 
      time: '10:00 AM - 11:00 AM', 
      title: 'Project management training', 
      locationType: 'virtual', 
      locationDetail: 'Virtual', 
      canJoin: true 
    },
    { 
      date: 'Aug 17, 2025', 
      time: '10:00 AM - 11:00 AM', 
      title: 'Team building retreat', 
      locationType: 'physical', 
      locationDetail: 'Nairobi, Kenya' 
    },
    { 
      date: 'Aug 18, 2025', 
      time: '10:00 AM - 11:00 AM', 
      title: 'Agile methodologies seminar', 
      locationType: 'virtual', 
      locationDetail: 'Virtual', 
      canJoin: true 
    },
    { 
      date: 'Aug 19, 2025', 
      time: '10:00 AM - 11:00 AM', 
      title: 'Conflict resolution workshop', 
      locationType: 'physical', 
      locationDetail: 'Accra, Ghana' 
    },
    { 
      date: 'Aug 20, 2025', 
      time: '10:00 AM - 11:00 AM', 
      title: 'Innovation strategy conference', 
      locationType: 'virtual', 
      locationDetail: 'Virtual' 
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">Upcoming trainings</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trainings.map((training, index) => (
            <TrainingCard key={index} event={training} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingTrainings;
