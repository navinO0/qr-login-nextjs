"use client"
import { useState } from 'react';

const DietPlan = () => {
  // Sample data for meals and activities, this can be fetched from an API
  const mealData = {
    "2025-04-15": {
      breakfast: { name: "Oatmeal with Almonds and Banana", calories: 400 },
      lunch: { name: "Grilled Chicken Salad", calories: 600 },
      dinner: { name: "Salmon with Quinoa", calories: 500 },
      snack: { name: "Greek Yogurt with Honey", calories: 300 },
    },
    "2025-04-16": {
      breakfast: { name: "Avocado Toast with Eggs", calories: 350 },
      lunch: { name: "Turkey and Veggie Wrap", calories: 550 },
      dinner: { name: "Chicken Stir Fry with Brown Rice", calories: 600 },
      snack: { name: "Protein Shake", calories: 200 },
    },
  };

  // Sample data for water and activities
  const activityData = {
    "2025-04-15": {
      waterIntake: 0, // Tracks water intake, measured in cups
      activities: [
        { name: "Morning Walk", completed: false },
        { name: "Yoga", completed: false },
        { name: "Strength Training", completed: false },
      ],
    },
    "2025-04-16": {
      waterIntake: 0,
      activities: [
        { name: "Morning Walk", completed: false },
        { name: "Yoga", completed: false },
        { name: "Cycling", completed: false },
      ],
    },
  };

  const [selectedDate, setSelectedDate] = useState("2025-04-15");
  const [waterIntake, setWaterIntake] = useState(activityData[selectedDate].waterIntake);
  const [activities, setActivities] = useState(activityData[selectedDate].activities);

  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    setWaterIntake(activityData[date].waterIntake);
    setActivities(activityData[date].activities);
  };

  const handleWaterIntakeChange = (event) => {
    setWaterIntake(event.target.checked ? waterIntake + 1 : waterIntake - 1);
  };

  const handleActivityCompletion = (index) => {
    const updatedActivities = [...activities];
    updatedActivities[index].completed = !updatedActivities[index].completed;
    setActivities(updatedActivities);
  };

  const meals = mealData[selectedDate];

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-gradient-to-r from-teal-100 to-teal-200 shadow-xl rounded-xl">
      <h1 className="text-4xl font-extrabold text-teal-600 mb-8 text-center">Your Personalized Diet & Activity Plan</h1>

      <div className="mb-6">
        {/* Date Selector */}
        <label htmlFor="date" className="block text-lg font-semibold text-teal-700 mb-2">Select Date</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="w-full p-4 text-lg bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Meal Plan */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Total Calories: <span className="font-bold text-teal-600">{Object.values(meals).reduce((acc, meal) => acc + meal.calories, 0)} kcal</span></h2>

        <div className="space-y-6">
          {Object.keys(meals).map((mealType, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">{meals[mealType].name}</h3>
              <p className="text-lg text-teal-600">Calories: {meals[mealType].calories} kcal</p>
            </div>
          ))}
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-teal-800 mb-2">Water Intake Tracker</h3>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <label className="text-lg text-teal-700 mr-4">Have you had a glass of water?</label>
          <input
            type="checkbox"
            checked={waterIntake > 0}
            onChange={handleWaterIntakeChange}
            className="mr-2"
          />
          <span className="text-lg">Water intake: {waterIntake} glass(es)</span>
        </div>
      </div>

      {/* Activities Tracker */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-teal-800 mb-4">Activities Tracker</h3>
        {activities.map((activity, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg mb-4 flex items-center">
            <input
              type="checkbox"
              checked={activity.completed}
              onChange={() => handleActivityCompletion(index)}
              className="mr-4"
            />
            <span className={activity.completed ? "text-teal-600 line-through" : "text-teal-800"}>{activity.name}</span>
          </div>
        ))}
      </div>

      <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg text-lg font-semibold transition ease-in-out duration-300">
        Save Plan
      </button>
    </div>
  );
};

export default DietPlan;
