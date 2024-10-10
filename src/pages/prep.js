import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { generateMealPlan, getMealPlan, updateMealPlan } from "../api/m";
import { useNavigate } from "react-router-dom";

export const Prep = () => {
  const [totalCalories, setTotalCalories] = useState(2000);
  const [numberOfMeals, setNumberOfMeals] = useState(3);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: currentMealPlan, isLoading: isMealPlanLoading } = useQuery({
    queryKey: ["mealplan"],
    queryFn: getMealPlan,
  });

  useEffect(() => {
    if (currentMealPlan) {
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }, [currentMealPlan]);

  const generateMealPlanMutation = useMutation({
    mutationFn: generateMealPlan,
    onSuccess: (newMealPlan) => {
      if (currentMealPlan) {
        // If there's an existing plan, update it
        updateMealPlanMutation.mutate({
          id: currentMealPlan._id,
          meals: newMealPlan.meals,
        });
      } else {
        // If it's a new plan, just invalidate the query
        queryClient.invalidateQueries({ queryKey: ["mealplan"] });
      }
      setShowForm(false);
    },
  });

  const updateMealPlanMutation = useMutation({
    mutationFn: updateMealPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mealplan"] });
    },
  });

  const handleGenerateMealPlan = (e) => {
    e.preventDefault();
    generateMealPlanMutation.mutate({
      totalCalories,
      numberOfMeals,
    });
  };

  const handleMealClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const renderMealPlanCalendar = () => {
    if (!currentMealPlan || !currentMealPlan.meals) return null;

    const mealsByDay = currentMealPlan.meals.reduce((acc, meal) => {
      if (!acc[meal.day]) acc[meal.day] = [];
      acc[meal.day].push(meal);
      return acc;
    }, {});

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return (
      <div className="grid grid-cols-7 gap-1 bg-gray-200 p-1 rounded-lg">
        {days.map((day, index) => (
          <div key={index} className="bg-white p-2 min-h-[200px]">
            <h3 className="font-bold mb-2 text-blue-600 border-b pb-1">
              {day}
            </h3>
            <div className="space-y-2">
              {mealsByDay[index + 1]?.map((meal, mealIndex) => (
                <div
                  key={mealIndex}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => handleMealClick(meal.recipe._id)}
                >
                  <div className="flex items-center space-x-2">
                    <img
                      src={meal.recipe.image}
                      alt={meal.recipe.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold text-sm">
                        Meal {meal.mealNumber}
                      </p>
                      <p className="text-xs text-gray-600">
                        {meal.recipe.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {meal.recipe.calories} cal
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meal Prep Planner</h1>

      {!showForm && currentMealPlan && (
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          Generate New Plan
        </button>
      )}

      {showForm ? (
        <form onSubmit={handleGenerateMealPlan} className="mb-8">
          <div className="mb-4">
            <label htmlFor="totalCalories" className="block mb-2">
              Total Calories per Day
            </label>
            <input
              type="number"
              id="totalCalories"
              value={totalCalories}
              onChange={(e) => setTotalCalories(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
              min="1000"
              max="5000"
              step="100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfMeals" className="block mb-2">
              Number of Meals per Day
            </label>
            <input
              type="number"
              id="numberOfMeals"
              value={numberOfMeals}
              onChange={(e) => setNumberOfMeals(Number(e.target.value))}
              className="w-full p-2 border rounded text-black"
              min="1"
              max="6"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {currentMealPlan ? "Update Meal Plan" : "Generate Meal Plan"}
          </button>
        </form>
      ) : isMealPlanLoading ? (
        <p>Loading meal plan...</p>
      ) : currentMealPlan ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Weekly Meal Plan</h2>
          {renderMealPlanCalendar()}
        </div>
      ) : (
        <p>No meal plan generated yet. Please generate a new plan.</p>
      )}
    </div>
  );
};
