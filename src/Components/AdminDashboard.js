// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import EventForm from './EventForm';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [eventsRes, usersRes] = await Promise.all([
        API.get('/events'),
        API.get('/admin/users')
      ]);
      setEvents(eventsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreate = async (eventData) => {
    try {
      const response = await API.post('/events', eventData);
      setEvents([...events, response.data]);
      setShowEventForm(false);
    } catch (err) {
      setError('Failed to create event');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Events Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Events Management</h3>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Event
            </button>
          </div>

          <div className="space-y-4">
            {events.map(event => (
              <div key={event._id} className="border-b pb-4">
                <h4 className="font-medium">{event.name}</h4>
                <p className="text-sm text-gray-600">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Available Seats: {event.availableSeats}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">User Management</h3>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user._id} className="border-b pb-4">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Creation Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <EventForm
              onSubmit={handleEventCreate}
              onCancel={() => setShowEventForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;