// frontend/src/Components/EventDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await API.get(`/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!event) return <div className="text-center p-4">Event not found</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Date: {event.date}</p>
              <p className="text-gray-600">Time: {event.time}</p>
            </div>
            <div>
              <p className="text-gray-600">Location: {event.location}</p>
              <p className="text-gray-600">
                Available Seats: {event.availableSeats}/{event.capacity}
              </p>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            disabled={event.availableSeats === 0}
          >
            {event.availableSeats === 0 ? 'Fully Booked' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
