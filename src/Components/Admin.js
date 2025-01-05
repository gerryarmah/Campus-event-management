// frontend/src/Components/Admin.js
import React, { useState, useEffect } from 'react';
import API from '../utils/api';

function Admin() {
  const [events, setEvents] = useState([]);
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    type: ''  // Added event type field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Event types for dropdown
  const eventTypes = [
    'Workshop',
    'Seminar',
    'Club Activity',
    'Sports Event',
    'Cultural Event',
    'Academic',
    'Other'
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await API.post('/events', eventData);
      setSuccess('Event created successfully!');
      setEventData({
        name: '',
        date: '',
        time: '',
        location: '',
        capacity: '',
        type: ''
      });
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await API.delete(`/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
        setSuccess('Event deleted successfully!');
      } catch (err) {
        setError('Failed to delete event');
      }
    }
  };

  const handleEdit = async (eventId) => {
    try {
      const eventToEdit = events.find(event => event._id === eventId);
      setEventData(eventToEdit);
      // Scroll to form
      document.getElementById('eventForm').scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError('Failed to load event data');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        
        {/* Error and Success Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            {error}
            <button 
              className="absolute top-0 right-0 p-4"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
            {success}
            <button 
              className="absolute top-0 right-0 p-4"
              onClick={() => setSuccess('')}
            >
              ×
            </button>
          </div>
        )}

        {/* Create/Edit Event Form */}
        <form id="eventForm" onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">
            {eventData._id ? 'Edit Event' : 'Create New Event'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Event Type</label>
              <select
                name="type"
                value={eventData.type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Event Type</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={eventData.capacity}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
                min="1"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {eventData._id && (
              <button
                type="button"
                onClick={() => {
                  setEventData({
                    name: '',
                    date: '',
                    time: '',
                    location: '',
                    capacity: '',
                    type: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Processing...' : (eventData._id ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>

        {/* Events List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-6">Manage Events</h3>
          
          {loading && <div className="text-center py-4">Loading events...</div>}
          
          <div className="space-y-6">
            {events.map(event => (
              <div 
                key={event._id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold">{event.name}</h4>
                    <p className="text-sm text-gray-600">Type: {event.type}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <p className="text-sm">Date: {event.date}</p>
                      <p className="text-sm">Time: {event.time}</p>
                      <p className="text-sm">Location: {event.location}</p>
                      <p className="text-sm">
                        Capacity: {event.availableSeats}/{event.capacity}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(event._id)}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {events.length === 0 && !loading && (
              <div className="text-center py-4 text-gray-500">
                No events found. Create your first event above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;