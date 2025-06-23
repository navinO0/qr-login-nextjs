"use client"
// import React, { useState, useEffect, useCallback } from 'react';
// import { Button } from '@/components/ui/button'; // Assumed - adjust path if needed
// import { Input } from '@/components/ui/input';     // Assumed - adjust path if needed
// import { Calendar } from '@/components/ui/calendar' // Assumed
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'; // Assumed
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select" // Assumed
// import { cn } from '@/lib/utils'; // Assumed - for conditional classes
// import { CalendarIcon, CheckCircle, ChevronDown, Loader2, Plus, RotateCw, Trash2, User, XCircle } from 'lucide-react';
// import { format, addDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

// // --- Helper Functions ---
// const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// // --- Components ---

// // User Profile Component
// const UserProfileScreen = ({
//     user,
//     onUpdatePreferences,
//     onUpdateCalorieGoal,
// }) => {
//     const [preferences, setPreferences] = useState(user.preferences);
//     const [calorieGoal, setCalorieGoal] = useState(user.calorieGoal);
//     const [isEditing, setIsEditing] = useState(false);

//     const handleSave = () => {
//         onUpdatePreferences(preferences);
//         onUpdateCalorieGoal(calorieGoal);
//         setIsEditing(false);
//     };

//     return (
//         <Card className="w-full max-w-md mx-auto">
//             <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                     <User className="w-5 h-5" />
//                     User Profile
//                 </CardTitle>
//                 <CardDescription>Manage your preferences and settings.</CardDescription>
//             </CardHeader>
//             <CardContent>
//                 {isEditing ? (
//                     <div className="space-y-4">
//                          <div className="space-y-2">
//                             <label htmlFor="preferences" className="text-sm font-medium block">
//                                 Dietary Preferences
//                             </label>
//                             <Select onValueChange={setPreferences} value={preferences}>
//                                 <SelectTrigger id="preferences">
//                                     <SelectValue placeholder="Select preferences" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="vegetarian">Vegetarian</SelectItem>
//                                     <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
//                                     <SelectItem value="vegan">Vegan</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="space-y-2">
//                             <label htmlFor="calorieGoal" className="text-sm font-medium block">
//                                 Daily Calorie Goal (optional)
//                             </label>
//                             <Input
//                                 id="calorieGoal"
//                                 type="number"
//                                 value={calorieGoal === null ? '' : calorieGoal}
//                                 onChange={(e) => setCalorieGoal(e.target.value === '' ? null : Number(e.target.value))}
//                                 placeholder="Enter your calorie goal"
//                                 className="w-full"
//                             />
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         <div className="p-4 rounded-md bg-gray-100 dark:bg-gray-800">
//                             <p className="text-sm">
//                                 <span className="font-semibold">Name:</span> {user.name}
//                             </p>
//                             <p className="text-sm">
//                                 <span className="font-semibold">Email:</span> {user.email}
//                             </p>
//                             <p className="text-sm">
//                                 <span className="font-semibold">Preferences:</span> {user.preferences || 'Not set'}
//                             </p>
//                             <p className="text-sm">
//                                 <span className="font-semibold">Calorie Goal:</span> {user.calorieGoal !== null ? user.calorieGoal : 'Not set'}
//                             </p>
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//             <CardFooter>
//                 {isEditing ? (
//                     <div className="flex justify-end gap-2">
//                         <Button variant="outline" onClick={() => setIsEditing(false)}>
//                             Cancel
//                         </Button>
//                         <Button onClick={handleSave}>Save</Button>
//                     </div>
//                 ) : (
//                     <Button onClick={() => setIsEditing(true)} className="w-full">
//                         Edit Profile
//                     </Button>
//                 )}
//             </CardFooter>
//         </Card>
//     );
// };

// // Meal Plan Component
// const MealPlanScreen = ({
//     mealPlan,
//     onRegenerateMeal,
//     onAddToFavorites,
// }) => {
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [regeneratingMeal, setRegeneratingMeal] = useState(null);

//     const handleRegenerate = async (mealId) => {
//         setRegeneratingMeal(mealId); // Set loading state
//         await onRegenerateMeal(mealId);
//         setRegeneratingMeal(null); // Clear loading state
//     };

//       const getMealsForDate = (date) => {
//         const formattedDate = format(date, 'PPPP'); // e.g., Monday, January 1, 2024
//         return mealPlan[formattedDate] || [];
//     };

//     const displayDate = selectedDate ? selectedDate : new Date();

//     return (
//         <div className="w-full">
//              <div className="mb-4">
//                 <Calendar
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={setSelectedDate}
//                     className="rounded-md border shadow"
//                 />
//             </div>
//             <Card className="w-full">
//                 <CardHeader>
//                     <CardTitle>Meal Plan for {format(displayDate, 'PPPP')}</CardTitle>
//                     <CardDescription>Your meals for the selected day.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {getMealsForDate(displayDate).length > 0 ? (
//                         <div className="space-y-4">
//                             {getMealsForDate(displayDate).map((meal, index) => (
//                                 <div key={index} className="p-4 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
//                                     <div>
//                                         <h3 className="font-semibold">{meal.meal}</h3>
//                                         <p className="text-sm">{meal.description}</p>
//                                     </div>
//                                     <div className="flex gap-2">
//                                         <Button
//                                             variant="outline"
//                                             size="icon"
//                                             onClick={() => handleAddToFavorites(meal)}
//                                             title="Add to Favorites"
//                                         >
//                                             <CheckCircle className="w-4 h-4 text-green-500" />
//                                         </Button>
//                                         <Button
//                                             variant="destructive"
//                                             size="icon"
//                                             onClick={() => handleRegenerate(meal.meal)}
//                                             title="Regenerate Meal"
//                                             disabled={regeneratingMeal === meal.meal}
//                                         >
//                                              {regeneratingMeal === meal.meal ? (
//                                                 <Loader2 className="w-4 h-4 animate-spin" />
//                                             ) : (
//                                                 <RotateCw className="w-4 h-4" />
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-gray-500">No meals found for this day.</p>
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// // Grocery List Component
// const GroceryListScreen = ({
//     groceryList,
//     onUpdateGroceryList,
// }) => {
//     const [localGroceryList, setLocalGroceryList] = useState(groceryList);
//     const [newItemName, setNewItemName] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('Other');
//     const [isEditing, setIsEditing] = useState(false);

//     // Initialize local state when the groceryList prop changes
//       useEffect(() => {
//         setLocalGroceryList(groceryList);
//     }, [groceryList]);

//     const categories = Object.keys(localGroceryList);

//      const handleAddItem = () => {
//         if (newItemName.trim() === '') return;

//         const updatedList = { ...localGroceryList };
//         if (updatedList[selectedCategory]) {
//             updatedList[selectedCategory].push(newItemName.trim());
//         } else {
//             updatedList[selectedCategory] = [newItemName.trim()];
//         }
//         setLocalGroceryList(updatedList);
//         setNewItemName(''); // Clear input
//         setSelectedCategory('Other');
//     };

//     const handleRemoveItem = (category, itemIndex) => {
//         const updatedList = { ...localGroceryList };
//         if (updatedList[category]) {
//             updatedList[category] = updatedList[category].filter((_, index) => index !== itemIndex);
//              if (updatedList[category].length === 0) {
//                 delete updatedList[category];
//             }
//         }
//         setLocalGroceryList(updatedList);
//     };

//     const handleSaveList = () => {
//         onUpdateGroceryList(localGroceryList);
//         setIsEditing(false);
//     }

//     return (
//         <Card className="w-full">
//             <CardHeader>
//                 <CardTitle>Grocery List</CardTitle>
//                 <CardDescription>
//                     {isEditing ? 'Edit your grocery list' : 'View your shopping list'}
//                 </CardDescription>
//             </CardHeader>
//             <CardContent>
//                 {isEditing ? (
//                     <div className="space-y-4">
//                         {Object.entries(localGroceryList).map(([category, items]) => (
//                             <div key={category} className="space-y-2">
//                                 <h3 className="font-semibold capitalize">{category}</h3>
//                                 {items.map((item, index) => (
//                                     <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-100 dark:bg-gray-800">
//                                         <span>{item}</span>
//                                         <Button
//                                             variant="ghost"
//                                             size="icon"
//                                             onClick={() => handleRemoveItem(category, index)}
//                                             className="text-red-500"
//                                         >
//                                             <Trash2 className="w-4 h-4" />
//                                         </Button>
//                                     </div>
//                                 ))}
//                             </div>
//                         ))}
//                         <div className="flex gap-2">
//                             <Input
//                                 placeholder="Add new item"
//                                 value={newItemName}
//                                 onChange={(e) => setNewItemName(e.target.value)}
//                                 className="flex-1"
//                             />
//                              <Select onValueChange={setSelectedCategory} value={selectedCategory}>
//                                 <SelectTrigger className="w-[180px]">
//                                     <SelectValue placeholder="Category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="Other">Other</SelectItem>
//                                     <SelectItem value="Meat">Meat</SelectItem>
//                                     <SelectItem value="Protein">Protein</SelectItem>
//                                     <SelectItem value="Grains">Grains</SelectItem>
//                                     <SelectItem value="Produce">Produce</SelectItem>
//                                     <SelectItem value="Dairy">Dairy</SelectItem>
//                                     <SelectItem value="Pantry">Pantry</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                             <Button onClick={handleAddItem} disabled={!newItemName.trim()}>
//                                 <Plus className="w-4 h-4 mr-2" /> Add
//                             </Button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                          {Object.entries(localGroceryList).length > 0 ? (
//                             Object.entries(localGroceryList).map(([category, items]) => (
//                                 <div key={category} className="space-y-2">
//                                     <h3 className="font-semibold capitalize">{category}</h3>
//                                     {items.map((item, index) => (
//                                         <div key={index} className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
//                                             <span>{item}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ))
//                          ) : (
//                             <p className="text-gray-500">No items in your grocery list yet.</p>
//                          )}
//                     </div>
//                 )}
//             </CardContent>
//             <CardFooter>
//                 {isEditing ? (
//                     <div className="flex justify-end">
//                         <Button onClick={handleSaveList}>Save List</Button>
//                     </div>
//                 ) : (
//                     <Button onClick={() => setIsEditing(true)} className="w-full">
//                         Edit List
//                     </Button>
//                 )}
//             </CardFooter>
//         </Card>
//     );
// };

// // Main App Component
// const MealPlannerApp = () => {
//     const [user, setUser] = useState({
//         email: 'test@example.com',  // Replace with actual user data from NextAuth
//         name: 'Test User',
//         preferences: 'non-vegetarian', // Default
//         restrictions: '',
//         calorieGoal: 2000,
//         favoriteMeals: [],
//     });
//     const [mealPlan, setMealPlan] = useState({});
//     const [groceryList, setGroceryList] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//       const [currentScreen, setCurrentScreen] = useState('mealPlan'); // Added screen state

//     // --- Data Fetching (Simulated) ---
//     // In a real app, these would be API calls to your Fastify backend

//     const fetchMealPlan = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             // Simulate API call
//             const response = await new Promise((resolve) => {
//                 setTimeout(() => {
//                     // Dummy meal plan data
//                     const dummyMealPlan = {
//                         [format(new Date(), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Oatmeal with berries' },
//                             { meal: 'Lunch', description: 'Chicken salad sandwich' },
//                             { meal: 'Dinner', description: 'Salmon with roasted vegetables' },
//                             { meal: 'Snack', description: 'Apple with peanut butter' },
//                         ],
//                         [format(addDays(new Date(), 1), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Greek yogurt with granola' },
//                             { meal: 'Lunch', description: 'Turkey and avocado wrap' },
//                             { meal: 'Dinner', description: 'Beef stir-fry with rice' },
//                             { meal: 'Snack', description: 'Banana' },
//                         ],
//                         [format(addDays(new Date(), 2), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Scrambled eggs with toast' },
//                             { meal: 'Lunch', description: 'Lentil soup' },
//                             { meal: 'Dinner', description: 'Chicken pot pie' },
//                             { meal: 'Snack', description: 'Carrot sticks with hummus' },
//                         ],
//                         [format(addDays(new Date(), 3), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Smoothie' },
//                             { meal: 'Lunch', description: 'Salad with grilled chicken' },
//                             { meal: 'Dinner', description: 'Pasta with meatballs' },
//                             { meal: 'Snack', description: 'Orange' },
//                         ],
//                         [format(addDays(new Date(), 4), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Pancakes' },
//                             { meal: 'Lunch', description: 'Tuna salad' },
//                             { meal: 'Dinner', description: 'Pizza' },
//                             { meal: 'Snack', description: 'Popcorn' },
//                         ],
//                         [format(addDays(new Date(), 5), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Cereal with milk' },
//                             { meal: 'Lunch', description: 'Chicken Caesar salad' },
//                             { meal: 'Dinner', description: 'Steak with mashed potatoes' },
//                             { meal: 'Snack', description: 'Trail mix' },
//                         ],
//                          [format(addDays(new Date(), 6), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Breakfast Burrito' },
//                             { meal: 'Lunch', description: 'BLT Sandwich' },
//                             { meal: 'Dinner', description: 'Roast Chicken' },
//                             { meal: 'Snack', description: 'Mixed Nuts' },
//                         ],
//                     };
//                     const dummyGroceryList = {
//                         Produce: ['Apple', 'Banana', 'Carrot', 'Broccoli', 'Spinach'],
//                         Meat: ['Chicken', 'Salmon'],
//                         Grains: ['Rice', 'Pasta', 'Bread'],
//                         Dairy: ['Milk', 'Cheese', 'Yogurt', 'Eggs'],
//                         Pantry: ['Oil', 'Salt', 'Sugar', 'Pepper'],
//                         Other: ['Oats', 'Peanut Butter']
//                     };
//                     resolve({ mealPlan: dummyMealPlan, groceryList: dummyGroceryList });
//                 }, 1000); // Simulate 1 second delay
//             });

//             setMealPlan(response.mealPlan);
//             setGroceryList(response.groceryList);
//         } catch (err) {
//             setError(err.message || 'Failed to fetch meal plan');
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchMealPlan();
//     }, [fetchMealPlan]);

//     const handleRegenerateMeal = async (mealId) => {
//         setLoading(true);
//         setError(null);
//          try {
//             // Simulate API call
//             const response = await new Promise((resolve) => {
//                 setTimeout(() => {
//                     // Dummy meal plan data
//                     const dummyMealPlan = {
//                          [format(new Date(), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Oatmeal with berries' },
//                             { meal: 'Lunch', description: 'New Chicken salad sandwich' }, // Regenerated
//                             { meal: 'Dinner', description: 'Salmon with roasted vegetables' },
//                             { meal: 'Snack', description: 'Apple with peanut butter' },
//                         ],
//                         [format(addDays(new Date(), 1), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Greek yogurt with granola' },
//                             { meal: 'Lunch', description: 'Turkey and avocado wrap' },
//                             { meal: 'Dinner', description: 'Beef stir-fry with rice' },
//                             { meal: 'Snack', description: 'Banana' },
//                         ],
//                         [format(addDays(new Date(), 2), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Scrambled eggs with toast' },
//                             { meal: 'Lunch', description: 'Lentil soup' },
//                             { meal: 'Dinner', description: 'Chicken pot pie' },
//                             { meal: 'Snack', description: 'Carrot sticks with hummus' },
//                         ],
//                         [format(addDays(new Date(), 3), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Smoothie' },
//                             { meal: 'Lunch', description: 'Salad with grilled chicken' },
//                             { meal: 'Dinner', description: 'Pasta with meatballs' },
//                             { meal: 'Snack', description: 'Orange' },
//                         ],
//                         [format(addDays(new Date(), 4), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Pancakes' },
//                             { meal: 'Lunch', description: 'Tuna salad' },
//                             { meal: 'Dinner', description: 'Pizza' },
//                             { meal: 'Snack', description: 'Popcorn' },
//                         ],
//                         [format(addDays(new Date(), 5), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Cereal with milk' },
//                             { meal: 'Lunch', description: 'Chicken Caesar salad' },
//                             { meal: 'Dinner', description: 'Steak with mashed potatoes' },
//                             { meal: 'Snack', description: 'Trail mix' },
//                         ],
//                          [format(addDays(new Date(), 6), 'PPPP')]: [
//                             { meal: 'Breakfast', description: 'Breakfast Burrito' },
//                             { meal: 'Lunch', description: 'BLT Sandwich' },
//                             { meal: 'Dinner', description: 'Roast Chicken' },
//                             { meal: 'Snack', description: 'Mixed Nuts' },
//                         ],
//                     };
//                     const dummyGroceryList = {
//                          Produce: ['Oats', 'Banana', 'Carrot', 'Broccoli', 'Spinach'], // changed
//                         Meat: ['Chicken', 'Salmon'],
//                         Grains: ['Rice', 'Pasta', 'Bread'],
//                         Dairy: ['Milk', 'Cheese', 'Yogurt', 'Eggs'],
//                         Pantry: ['Oil', 'Salt', 'Sugar', 'Pepper'],
//                         Other: ['Oats', 'Peanut Butter']
//                     };
//                     resolve({ mealPlan: dummyMealPlan, groceryList: dummyGroceryList });
//                 }, 1000); // Simulate 1 second delay
//             });

//             setMealPlan(response.mealPlan);
//             setGroceryList(response.groceryList);
//         } catch (err) {
//             setError(err.message || 'Failed to regenerate meal');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAddToFavorites = (meal) => {
//         setUser((prevUser) => ({ ...prevUser, favoriteMeals: [...prevUser.favoriteMeals, meal] }));
//         // In a real app, you'd also send this to the backend
//         console.log('Meal added to favorites:', meal);
//     };

//      const handleUpdatePreferences = (preferences) => {
//         setUser((prevUser) => ({ ...prevUser, preferences }));
//         // In a real app, you'd also send this to the backend
//         console.log('Preferences updated:', preferences);
//     };

//     const handleUpdateCalorieGoal = (calorieGoal) => {
//         setUser((prevUser) => ({ ...prevUser, calorieGoal }));
//         // In a real app, you'd also send this to the backend
//         console.log('Calorie goal updated:', calorieGoal);
//     };

//     const handleUpdateGroceryList = (newList) => {
//         setGroceryList(newList);
//         // In a real app, you'd send this to the backend
//         console.log('Grocery list updated:', newList);
//     };

//     // --- UI ---
//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//             <header className="bg-white dark:bg-gray-800 shadow py-4">
//                 <div className="container mx-auto flex justify-between items-center">
//                     <h1 className="text-xl font-bold text-gray-900 dark:text-white">Meal Planner</h1>
//                     <nav className="space-x-4">
//                          <Button
//                             variant={currentScreen === 'mealPlan' ? 'default' : 'ghost'}
//                             onClick={() => setCurrentScreen('mealPlan')}
//                         >
//                             Meal Plan
//                         </Button>
//                         <Button
//                             variant={currentScreen === 'groceryList' ? 'default' : 'ghost'}
//                             onClick={() => setCurrentScreen('groceryList')}
//                         >
//                             Grocery List
//                         </Button>
//                         <Button
//                             variant={currentScreen === 'profile' ? 'default' : 'ghost'}
//                             onClick={() => setCurrentScreen('profile')}
//                         >
//                             Profile
//                         </Button>
//                     </nav>
//                 </div>
//             </header>

//             <main className="container mx-auto py-8">
//                 {loading && (
//                     <div className="flex justify-center items-center h-64">
//                         <Loader2 className="w-10 h-10 animate-spin text-gray-500" />
//                     </div>
//                 )}
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                         <strong className="font-bold">Error: </strong>
//                         <span className="block sm:inline">{error}</span>
//                         <button
//                             onClick={() => setError(null)}
//                             className="absolute top-0 bottom-0 right-0 px-4 py-3"
//                         >
//                             <XCircle className="h-6 w-6 text-red-500" />
//                         </button>
//                     </div>
//                 )}

//                 {!loading && !error && (
//                     <>
//                         {currentScreen === 'profile' && (
//                             <UserProfileScreen
//                                 user={user}
//                                 onUpdatePreferences={handleUpdatePreferences}
//                                 onUpdateCalorieGoal={handleUpdateCalorieGoal}
//                             />
//                         )}
//                         {currentScreen === 'mealPlan' && (
//                             <MealPlanScreen
//                                 mealPlan={mealPlan}
//                                 onRegenerateMeal={handleRegenerateMeal}
//                                 onAddToFavorites={handleAddToFavorites}
//                             />
//                         )}
//                         {currentScreen === 'groceryList' && (
//                             <GroceryListScreen
//                                 groceryList={groceryList}
//                                 onUpdateGroceryList={handleUpdateGroceryList}
//                             />
//                         )}
//                     </>
//                 )}
//             </main>
//         </div>
//     );
// };

// export default MealPlannerApp;


