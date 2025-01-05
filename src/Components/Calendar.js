import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import API from '../utils/api';
import socket from '../utils/socket';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const eventTypeColors = {
  workshop: '#3B82F6', // blue
  seminar: '#10B981', // green
  club: '#F59E0B',    // yellow
  sports: '#EF4444',  // red
  academic: '#8B5CF6', // purple
  social: '#EC4899',   // pink
  career: '#6366F1'    // indigo
};

function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('month');
  const [selectedEventTypes, setSelectedEventTypes] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);

  useEffect(() => {
    fetchEvents();
    
    // Socket listeners for real-time updates
    socket.on('eventCreated', handleNewEvent);
    socket.on('eventUpdated', handleEventUpdate);
    socket.on('eventDeleted', handleEventDelete);

    return () => {
      socket.off('eventCreated', handleNewEvent);
      socket.off('eventUpdated', handleEventUpdate);
      socket.off('eventDeleted', handleEventDelete);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.events.getAll();
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.date + 'T' + event.time),
        end: new Date(event.date + 'T' + event.time),
        title: event.name
      }));
      setEvents(formattedEvents);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  const handleNewEvent = (event) => {
    const formattedEvent = {
      ...event,
      start: new Date(event.date + 'T' + event.time),
      end: new Date(event.date + 'T' + event.time),
      title: event.name
    };
    setEvents(prev => [...prev, formattedEvent]);
  };

  const handleEventUpdate = (updatedEvent) => {
    const formattedEvent = {
      ...updatedEvent,
      start: new Date(updatedEvent.date + 'T' + updatedEvent.time),
      end: new Date(updatedEvent.date + 'T' + updatedEvent.time),
      title: updatedEvent.name
    };
    setEvents(prev => prev.map(event => 
      event._id === updatedEvent._id ? formattedEvent : event
    ));
  };

  const handleEventDelete = (eventId) => {
    setEvents(prev => prev.filter(event => event._id !== eventId));
  };

  const toggleEventType = (type) => {
    setSelectedEventTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredEvents = events.filter(event =>
    selectedEventTypes.length === 0 || selectedEventTypes.includes(event.eventType)
  );

  const eventStyleGetter = (event) => {
    const backgroundColor = eventTypeColors[event.eventType] || '#3B82F6';
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Event Type Filters */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter by Event Type</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(eventTypeColors).map(type => (
            <button
              key={type}
              onClick={() => toggleEventType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedEventTypes.includes(type)
                  ? `bg-${type}-600 text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <BigCalendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={setView}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleEventClick}
          tooltipAccessor={event => event.name}
          popup
        />
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold">Date:</span>{' '}
                {format(selectedEvent.start, 'PPP')}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Time:</span>{' '}
                {format(selectedEvent.start, 'p')}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Location:</span>{' '}
                {selectedEvent.location}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Type:</span>{' '}
                <span className="capitalize">{selectedEvent.eventType}</span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Available Seats:</span>{' '}
                {selectedEvent.availableSeats}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Description:</span><br />
                {selectedEvent.description}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowEventDetails(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;