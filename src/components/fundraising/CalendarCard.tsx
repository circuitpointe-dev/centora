
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarEvent, mockCalendarEvents } from "@/data/fundraisingData";

interface DayProps {
  date: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  currentDate: Date;
  onEventClick: (event: CalendarEvent) => void;
}

const Day: React.FC<DayProps> = ({
  date,
  events,
  onDateClick,
  currentDate,
  onEventClick,
}) => {
  const dayNumber = date.getDate();
  const today = new Date();
  const isOtherMonth = date.getMonth() !== currentDate.getMonth();

  return (
    <div
      className={`p-2 border border-transparent rounded-md cursor-pointer
      hover:bg-gray-100 min-h-[80px] ${
        date.toDateString() === today.toDateString() ? "bg-blue-50" : ""
      } ${isOtherMonth ? "text-gray-400 bg-gray-50" : "text-gray-800"}`}
      onClick={() => onDateClick(date)}
    >
      <div className="text-right text-sm text-gray-600 mb-1">{dayNumber}</div>
      <div className="space-y-1">
        {events.map((event) => (
          <div
            key={event.id}
            className="text-xs p-1 rounded truncate cursor-pointer text-white"
            style={{ backgroundColor: event.color }}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          >
            <span>{event.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CalendarCard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [clickedEvent, setClickedEvent] = useState<CalendarEvent | null>(null);

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const calendarDays: Date[] = [];

    const startDay = firstDay.getDay();
    for (let i = startDay - 1; i >= 0; i--) {
      calendarDays.push(new Date(year, month, -i));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendarDays.push(new Date(year, month, i));
    }

    const endDay = lastDay.getDay();
    for (let i = 1; i <= 6 - endDay; i++) {
      calendarDays.push(new Date(year, month + 1, i));
    }

    return calendarDays;
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    setClickedEvent(null);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleAddEvent = () => {
    if (selectedDate && newEventTitle.trim()) {
      setEvents([
        ...events,
        {
          id: Date.now().toString(),
          date: selectedDate,
          title: newEventTitle,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        },
      ]);
      setSelectedDate(null);
      setNewEventTitle("");
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">Calendar</CardTitle>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-full border border-gray-300 bg-white"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full border border-gray-300 bg-white"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {events.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <Calendar className="h-8 w-8 mb-2 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">No calendar events yet</p>
            <p className="text-xs text-gray-500">Click a date to add your first event.</p>
          </div>
        )}
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
          {generateCalendar(currentDate).map((date, index) => (
            <Day
              key={index}
              date={date}
              events={events.filter(
                (e) => e.date.toDateString() === date.toDateString()
              )}
              onDateClick={setSelectedDate}
              currentDate={currentDate}
              onEventClick={setClickedEvent}
            />
          ))}
        </div>

        {/* Event Details Dialog - Black and White Theme */}
        {clickedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-900">{clickedEvent.title}</h3>
              <div className="text-sm text-gray-600 mb-4">
                {clickedEvent.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setClickedEvent(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded border border-gray-300 text-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteEvent(clickedEvent.id)}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Dialog - Black and White Theme */}
        {selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Add Event for {selectedDate.toLocaleDateString()}
              </h3>
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Event title"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedDate(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Add Event
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
