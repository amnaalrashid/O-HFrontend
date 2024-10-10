import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOneRecipe } from "../api/recipes";
import { getMe } from "../api/users";
import { getAllCategories } from "../api/category";
import { getAllIngredients } from "../api/ingredients";
import RecipeModal from "./RecipeModal";
import { logout } from "../api/storage";
const NavItem = ({ title, content, className, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        className={`px-4 py-2 rounded transition-colors relative ${className}`}
        onClick={onClick}
      >
        {title}
        <span
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform origin-left transition-transform duration-300 ${
            isHovered ? "scale-x-100" : "scale-x-0"
          }`}
        ></span>
      </button>
      {isHovered && content && (
        <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700">{content}</div>
          </div>
        </div>
      )}
    </li>
  );
};

export const Recipes = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientsFilter, setIngredientsFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getMe,
  });

  const { data: ingredients, isLoading: ingredientsLoading } = useQuery({
    queryKey: ["ingredients"],
    queryFn: getAllIngredients,
  });

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategories,
  });

  useEffect(() => {
    if (user && user.recipes && ingredients && category) {
      console.log("Filtering recipes:");
      console.log("Ingredients Filter:", ingredientsFilter);
      console.log("Category Filter:", categoryFilter);

      const filtered = user.recipes.filter((recipe) => {
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
          recipe.name.toLowerCase().includes(searchLower) ||
          recipe.timeToCook.toString().includes(searchLower) ||
          recipe.calories.toString().includes(searchLower);

        const matchesIngredient =
          ingredientsFilter === "" ||
          (Array.isArray(recipe.ingredients) &&
            recipe.ingredients.some(
              (ing) =>
                ing.name.toLowerCase() === ingredientsFilter.toLowerCase()
            ));

        const matchesCategory =
          categoryFilter === "" ||
          (Array.isArray(recipe.category) &&
            recipe.category.some(
              (cat) => cat.name.toLowerCase() === categoryFilter.toLowerCase()
            ));

        console.log(`Recipe: ${recipe.name}`);
        console.log(`Matches Search: ${matchesSearch}`);
        console.log(`Matches Ingredient: ${matchesIngredient}`);
        console.log(`Matches Category: ${matchesCategory}`);

        return matchesSearch && matchesIngredient && matchesCategory;
      });

      console.log("Filtered Recipes:", filtered);
      setFilteredRecipes(filtered);
    }
  }, [
    searchTerm,
    ingredientsFilter,
    categoryFilter,
    user,
    ingredients,
    category,
  ]);

  const deleteMutation = useMutation({
    queryKey: ["deleteOneRecipe"],
    mutationFn: deleteOneRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["currentUser"]);
    },
    onError: (error) => {
      console.error("Error deleting recipe:", error);
      alert(
        "An error occurred while deleting the recipe. The page will refresh to show the current state."
      );
    },
    onSettled: () => {
      refetchUser();
    },
  });

  const handleCreateRecipe = () => {
    setEditingRecipe(null);
    setShowModal(true);
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowModal(true);
  };

  const handleDeleteRecipe = async (recipe) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteMutation.mutateAsync(recipe._id);
      } catch (error) {
        // Error is handled in the mutation's onError callback
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecipe(null);
    refetchUser();
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleSignOut = () => {
    logout(); // This function should remove the token
    queryClient.clear(); // Clear all React Query caches
    navigate("/"); // Navigate to home page after logout
  };

  return (
    <div className="bg-olive min-h-screen flex flex-col p-12 text-white font-telugu">
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1">
          <button
            onClick={() => navigate(-1)}
            className="text-[#8C9084] hover:text-olive-light transition-colors"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <h1 className="text-6xl font-bold">Recipes</h1>
        </div>
        <div className="flex items-center justify-end flex-1">
          <button
            onClick={handleSignOut}
            className="text-white hover:text-[#A3B18A] transition-colors mr-6 text-xl font-semibold underline"
          >
            Sign Out
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center"
            aria-label="Go to profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10 text-white hover:text-[#A3B18A] transition-colors"
            >
              <path
                fillRule="evenodd"
                d="M12 4a4 4 0 100 8 4 4 0 000-8zm-2 9a4 4 0 00-4 4v1a1 1 0 001 1h10a1 1 0 001-1v-1a4 4 0 00-4-4h-4z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      <nav className="mb-8">
        <ul className="flex items-center space-x-8">
          <NavItem
            title="Favorites"
            content="View your favorite recipes."
            className="text-2xl font-semibold"
            onClick={() => navigate("/fav")}
          />
        </ul>
      </nav>

      {/* Search and filter inputs */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search recipes by name, cook time, or calories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded-md text-olive focus:outline-none focus:ring-0"
        />
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <select
              value={ingredientsFilter}
              onChange={(e) => setIngredientsFilter(e.target.value)}
              className="w-full p-2 pr-8 rounded-md text-olive focus:outline-none focus:ring-0 appearance-none"
            >
              <option value="">All Ingredients</option>
              {ingredients &&
                ingredients.map((ing) => (
                  <option key={ing._id} value={ing.name}>
                    {ing.name}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-olive"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div className="relative flex-1">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 pr-8 rounded-md text-olive focus:outline-none focus:ring-0 appearance-none"
            >
              <option value="">All Categories</option>
              {category &&
                category.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-4 w-4 text-olive"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
        <button
          className="rounded-lg p-6 shadow-md w-full h-64 flex items-center justify-center transition-all hover:bg-opacity-90 bg-white"
          onClick={handleCreateRecipe}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-olive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-lg p-6 shadow-md w-full h-64 relative cursor-pointer"
              onClick={() => handleRecipeClick(recipe._id)}
            >
              <h3 className="text-olive text-xl font-bold mb-2">
                {recipe.name}
              </h3>
              {console.log("image", recipe)}
              <img
                src={"http://localhost:10000/" + recipe.recipeImage}
                alt={recipe.name}
                className="w-full h-32 object-cover rounded-md"
              />
              <p className="text-olive-dark">{recipe.description}</p>
              <p className="text-olive-dark mt-2">
                Time to cook: {recipe.timeToCook} minutes
              </p>
              <p className="text-olive-dark">Calories: {recipe.calories}</p>
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditRecipe(recipe);
                  }}
                  className="bg-olive text-white p-2 rounded-full hover:bg-olive-dark transition-colors"
                  aria-label="Edit recipe"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRecipe(recipe);
                  }}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Delete recipe"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-xl">
            No recipes match the current filters. Try adjusting your search or
            filters.
          </div>
        )}
      </div>
      {(userLoading || ingredientsLoading || categoryLoading) && (
        <p>Loading...</p>
      )}
      {userError && <p className="text-red-500">{userError.message}</p>}

      <RecipeModal
        show={showModal}
        onClose={handleCloseModal}
        recipe={editingRecipe}
      />
    </div>
  );
};

export const Navigation = () => {
  return (
    <nav className="bg-olive p-4">
      <ul className="flex space-x-4">
        <NavItem title="Home" to="/" />
        <NavItem title="Recipes" to="/recipes" />
        <NavItem
          title="Favorites"
          to="/favorites"
          content="View your favorite recipes"
        />
        {/* Add other navigation items as needed */}
      </ul>
    </nav>
  );
};
