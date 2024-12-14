import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Campus Event Management</h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage and create events on your campus with ease.
        </p>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
