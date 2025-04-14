export default function MealPlans({ meals }) {
    if (!meals || meals.length === 0) {
      return <div className="text-center mt-6 text-xl">No meals found for your preferences.</div>;
    }
  
    return (
      <div className="mt-8">
        <h2 className="text-center text-3xl">Your Personalized Meal Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {meals.map((meal) => (
            <div key={meal.id} className="border p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{meal.title}</h3>
              <img src={meal.image} alt={meal.title} className="w-full h-48 object-cover rounded-md mt-2" />
              <a
                href={meal.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 mt-2 block"
              >
                View Recipe
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }