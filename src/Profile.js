import React, { useState, useEffect } from 'react';
import API from './utils/api';

function Profile() {
  const [userEvents, setUserEvents] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await API.get('/auth/profile');
        const eventsResponse = await API.get('/events/user');
        
        setUserProfile(profileResponse.data);
        setUserEvents(eventsResponse.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        
        {userProfile && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-xl mb-4">Personal Information</h3>
            <p>Name: {userProfile.name}</p>
            <p>Email: {userProfile.email}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl mb-4">My Registered Events</h3>
          {userEvents.length > 0 ? (
            <div className="space-y-4">
              {userEvents.map(event => (
                <div key={event._id} className="border-b pb-4">
                  <h4 className="font-bold">{event.name}</h4>
                  <p>Date: {event.date}</p>
                  <p>Time: {event.time}</p>
                  <p>Location: {event.location}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No registered events</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;