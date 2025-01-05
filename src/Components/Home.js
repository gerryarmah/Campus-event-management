// frontend/src/Components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import OpenImage from '../assets/Open.jpeg'; // Import your background image

function Home() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Hero section with background image */}
      <div 
        className="h-[500px] relative bg-cover bg-center"
        style={{ backgroundImage: `url(${OpenImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"> {/* Dark overlay */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                Welcome to Campus Event Management
              </h1>
              <p className="text-2xl mb-12 text-blue-100">
                Discover and join exciting events happening on campus
              </p>
              
              {!isAuthenticated && (
                <div className="space-x-6">
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition duration-300"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold text-lg border-2 border-white hover:bg-white hover:text-blue-600 transition duration-300"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Browse Events"
            description="Explore upcoming workshops, seminars, and activities"
            icon="🎯"
          />
          <FeatureCard
            title="Easy Registration"
            description="Quick and simple event registration process"
            icon="✨"
          />
          <FeatureCard
            title="Stay Updated"
            description="Get notifications about your registered events"
            icon="🔔"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default Home;