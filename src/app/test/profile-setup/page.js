"use client"
// pages/profile.js
import { useState } from 'react';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    activityLevel: '',
    goal: '',
    dietaryPreference: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-4">Create Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Activity Level</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Activity Level</option>
            <option value="sedentary">Sedentary</option>
            <option value="lightly-active">Lightly Active</option>
            <option value="moderately-active">Moderately Active</option>
            <option value="very-active">Very Active</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Goal</label>
          <select
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Select Goal</option>
            <option value="weight-loss">Weight Loss</option>
            <option value="muscle-gain">Muscle Gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Dietary Preferences</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="dietaryPreference"
                value="vegan"
                onChange={(e) => handleChange(e)}
                className="mr-2"
              />
              Vegan
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="dietaryPreference"
                value="vegetarian"
                onChange={(e) => handleChange(e)}
                className="mr-2"
              />
              Vegetarian
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
