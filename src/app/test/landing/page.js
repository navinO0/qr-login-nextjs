
"use client"
// pages/index.js
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-400">
      <div className="text-center text-white p-8 rounded-lg shadow-lg bg-opacity-70">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Personal AI Planner</h1>
        <p className="text-lg mb-6">Get personalized diet and workout plans tailored to your goals.</p>
        <Link href="/profile">
          {/* <a className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg text-xl">Get Started</a> */}
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
