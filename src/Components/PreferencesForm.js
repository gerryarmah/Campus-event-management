import React, { useState, useEffect } from 'react';
import API from '../utils/api';

function PreferencesForm() {
  const [preferences, setPreferences] = useState([]);
  const categories = ['workshop', 'seminar', 'club', 'sports', 'academic'];

  const handlePreferenceChange = async (category) => {
    try {
      const newPreferences = preferences.includes(category)
        ? preferences.filter(p => p !== category)
        : [...preferences, category];
      
      await API.post('/auth/preferences', { preferences: newPreferences });
      setPreferences(newPreferences);
    } catch (err) {
      console.error('Error updating preferences:', err);
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">Event Preferences</h3>
      <div className="space-y-2">
        {categories.map(category => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.includes(category)}
              onChange={() => handlePreferenceChange(category)}
              className="form-checkbox"
            />
            <span className="capitalize">{category}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PreferencesForm; 