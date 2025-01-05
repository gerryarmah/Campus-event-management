import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import socket from '../utils/socket';

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [userPreferences, setUserPreferences] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchUserPreferences();

    // Socket.io event listeners
    socket.on('eventUpdated', handleEventUpdate);
    socket.on('newEvent', handleNewEvent);

    return () => {
      socket.off('eventUpdated', handleEventUpdate);
      socket.off('newEvent', handleNewEvent);
    };
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await API.auth.getProfile();
      setUserPreferences(response.data.preferences.eventTypes);
    } catch (err) {
      console.error('Failed to fetch user preferences:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await API.events.getAll();
      setEvents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events');
      setLoading(false);
    }
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  const handleNewEvent = (newEvent) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const handleRegister = async (eventId) => {
    try {
      await API.events.register(eventId);
      
      // Update events list
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event._id === eventId
            ? { ...event, availableSeats: event.availableSeats - 1 }
            : event
        )
      );

      // Show success message
      setSuccessMessage('Successfully registered for the event!');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Emit socket event
      socket.emit('eventRegistration', { eventId });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register for event');
      setTimeout(() => setError(''), 3000);
    }
  };

  const filteredEvents = events
    .filter(event => {
      // Search filter
      const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesFilter = filter === 'all' || 
        filter === 'recommended' ? userPreferences.includes(event.eventType) : 
        event.eventType === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Events</option>
            <option value="recommended">Recommended</option>
            <option value="workshop">Workshops</option>
            <option value="seminar">Seminars</option>
            <option value="club">Club Events</option>
            <option value="sports">Sports</option>
            <option value="academic">Academic</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {event.image && (
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{event.name}</h3>
                <span className={`px-2 py-1 text-sm rounded ${
                  event.availableSeats > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {event.availableSeats} seats left
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-700 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-700 mb-2">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.time}</span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {event.eventType}
                </span>
                <button
                  onClick={() => handleRegister(event._id)}
                  disabled={event.availableSeats === 0}
                  className={`px-4 py-2 rounded-md ${
                    event.availableSeats === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {event.availableSeats === 0 ? 'Full' : 'Register'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No events found matching your criteria
        </div>
      )}
    </div>
  );
}

export default Events;