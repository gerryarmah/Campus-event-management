import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/events');
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-list">
      {events.map((event) => (
        <div key={event._id} className="event-card">
          <h3 className="event-name">{event.name}</h3>
          <p>{event.date}</p>
          <p>{event.location}</p>
        </div>
      ))}
    </div>
  );
}

export default Events;
