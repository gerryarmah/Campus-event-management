// frontend/src/components/EventList.js
import React, { useState, useEffect } from 'react';
import API from '../utils/api';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/rsvp`);
      fetchEvents(); // Refresh events list
    } catch (err) {
      setError('Failed to RSVP');
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.eventType === filter);

  // frontend/src/components/EventList.js (continued)
  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-gray-300"
        >
          <option value="all">All Events</option>
          <option value="workshop">Workshops</option>
          <option value="seminar">Seminars</option>
          <option value="club">Club Activities</option>
          <option value="sports">Sports Events</option>
          <option value="academic">Academic Events</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map(event => (
          <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span>{' '}
                  {new Date(event.date).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span>{' '}
                  {event.location}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Available Seats:</span>{' '}
                  {event.availableSeats}
                </p>
              </div>

              <button
                onClick={() => handleRSVP(event._id)}
                disabled={event.availableSeats === 0}
                className={`mt-4 w-full py-2 px-4 rounded-md ${
                  event.availableSeats === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {event.availableSeats === 0 ? 'Fully Booked' : 'RSVP'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventList;