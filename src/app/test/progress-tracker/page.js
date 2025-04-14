// pages/progress.js
const ProgressTracker = () => {
    return (
      <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold mb-4">Track Your Progress</h1>
        <div className="mb-6">
          <h2 className="text-xl font-medium">Weight Progress</h2>
          {/* Add a graph component here */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Last Updated: 3 days ago</p>
            <p>Current Weight: 75 kg</p>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-medium">Workout Progress</h2>
          {/* Add a graph component here */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Last Completed: 2 days ago</p>
            <p>Completed Workouts: 12/15</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProgressTracker;
  