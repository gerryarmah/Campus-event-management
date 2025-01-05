import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const eventTypeOptions = [
  'workshop',
  'seminar',
  'club',
  'sports',
  'academic',
  'social',
  'career'
];

function UserProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    preferences: {
      eventTypes: [],
      notifications: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  useEffect(() => {
    fetchUserProfile();
    fetchUserEvents();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await API.auth.getProfile();
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const response = await API.get('/events/user');
      setRegisteredEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch registered events:', err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await API.auth.updateProfile({
        name: profile.name,
        preferences: profile.preferences
      });

      setProfile(response.data.user);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleEventTypeToggle = (type) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        eventTypes: prev.preferences.eventTypes.includes(type)
          ? prev.preferences.eventTypes.filter(t => t !== type)
          : [...prev.preferences.eventTypes, type]
      }
    }));
  };

  const handleUnregister = async (eventId) => {
    try {
      await API.events.unregister(eventId);
      setRegisteredEvents(prev => prev.filter(event => event._id !== eventId));
      setSuccess('Successfully unregistered from event');
    } catch (err) {
      setError('Failed to unregister from event');
    }
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500 bg-gray-50"
                />
              </div>

              {/* Event Preferences */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Event Preferences
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {eventTypeOptions.map(type => (
                    <label key={type} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={profile.preferences.eventTypes.includes(type)}
                        onChange={() => handleEventTypeToggle(type)}
                        disabled={!isEditing}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={profile.preferences.notifications}
                    onChange={() => setProfile(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        notifications: !prev.preferences.notifications
                      }
                    }))}
                    disabled={!isEditing}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="text-gray-700">Receive email notifications about events</span>
                </label>
              </div>

              {/* Form Buttons */}
              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserProfile(); // Reset form
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Registered Events Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Registered Events</h2>
          {registeredEvents.length > 0 ? (
            <div className="space-y-4">
              {registeredEvents.map(event => (
                <div key={event._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <p className="text-gray-600">
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                      </p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                    <button
                      onClick={() => handleUnregister(event._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Unregister
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't registered for any events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;