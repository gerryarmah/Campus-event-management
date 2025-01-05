// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Calendar from './Components/Calendar';
import EventList from './Components/EventList';
import UserProfile from './Components/UserProfile';
import AdminDashboard from './Components/AdminDashboard';
import PrivateRoute from './Components/PrivateRoute';
import AdminRoute from './Components/AdminRoute';
import NotFound from './Components/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            path="/calendar" 
            element={
              <PrivateRoute>
                <Calendar />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <PrivateRoute>
                <EventList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;