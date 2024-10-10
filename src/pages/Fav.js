import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { getFavoriteRecipes, removeFromFavorites } from "../api/users";
import { logout } from "../api/storage";
export const Fav = () => {
  const [user] = useContext(UserContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: favoriteRecipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["favoriteRecipes"],
    queryFn: getFavoriteRecipes,
    enabled: !!user,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"]);
    },
  });

  const handleRemoveFavorite = (recipeId) => {
    removeFavoriteMutation.mutate(recipeId);
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  if (!user) {
    return (
      <div className="bg-olive min-h-screen flex flex-col items-center justify-center p-5 text-white">
        <h1 className="text-3xl font-bold mb-4">Favorites</h1>
        <p>Please sign in to view your favorite recipes.</p>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 bg-white text-olive px-4 py-2 rounded hover:bg-olive-light hover:text-white transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-olive min-h-screen flex flex-col p-5 text-white">
      <header className="flex flex-col items-center mb-10">
        <div className="w-full flex justify-between items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="text-[#8C9084] hover:text-olive-light transition-colors"
            aria-label="Return to Home"
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
          <div className="flex items-center">
            <button
              onClick={() => {
                logout();
              }}
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
        <h1 className="text-3xl font-bold my-4 text-center mb-6 animate-pulse">
          See all your favorite recipes here!
        </h1>
      </header>
      {isLoading && <p>Loading favorite recipes...</p>}
      {error && <p>Error loading favorite recipes: {error.message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favoriteRecipes &&
          favoriteRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="rounded-lg p-3 shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-olive-dark hover:shadow-lg relative aspect-square flex flex-col justify-between bg-white bg-opacity-40"
            >
              <div
                onClick={() => handleRecipeClick(recipe._id)}
                className="flex-grow"
              >
                <h2 className="text-lg font-semibold mb-2 transition-colors duration-300 ease-in-out hover:text-yellow-300">
                  {recipe.name}
                </h2>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(recipe._id);
                }}
                className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
              >
                Remove from Favorite
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
