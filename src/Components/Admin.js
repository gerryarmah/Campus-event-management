import React, { useState } from 'react';
import API from '../utils/api';

function Admin() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: eventName,
      date: eventDate,
      location: eventLocation,
    };

    try {
      await API.post('/events', formData);
      alert('Event created successfully!');
    } catch (err) {
      alert('Failed to create event!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Event</h2>
      <input
        type="text"
        placeholder="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        required
      />
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={eventLocation}
        onChange={(e) => setEventLocation(e.target.value)}
        required
      />
      <button type="submit">Create Event</button>
    </form>
  );
}

export default Admin;
