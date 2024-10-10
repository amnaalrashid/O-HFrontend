import React, { useState, useContext, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { getAllRecipes } from "../api/recipes";
import { logout } from "../api/storage";
import { Link } from "react-router-dom";

export const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useContext(UserContext);
  const navigate = useNavigate();

  const {
    data: recipes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipes"],
    queryFn: getAllRecipes,
  });

  const handleSignOut = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const filteredRecipes = recipes
    ? recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="bg-olive min-h-screen flex flex-col p-5 text-white">
      <Header
        user={user}
        handleSignOut={handleSignOut}
        handleSignIn={handleSignIn}
        navigate={navigate}
      />
      <main className="flex flex-col items-stretch flex-grow">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <RecipeGrid
          isLoading={isLoading}
          error={error}
          filteredRecipes={filteredRecipes}
          handleRecipeClick={handleRecipeClick}
        />
      </main>
    </div>
  );
};

const Header = ({ user, handleSignOut, handleSignIn, navigate }) => (
  <header className="flex flex-col mb-12">
    <div className="mb-4">
      <BackButton navigate={navigate} />
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <CreateRecipeButton navigate={navigate} />
        <PrepPageLink />
      </div>
      <div className="flex items-center space-x-4">
        <SignButton
          user={user}
          handleSignOut={handleSignOut}
          handleSignIn={handleSignIn}
        />
        {user && <ProfileButton navigate={navigate} />}
      </div>
    </div>
  </header>
);

const BackButton = ({ navigate }) => (
  <button
    onClick={() => navigate("/")}
    className="text-white hover:text-olive-light transition-colors"
    aria-label="Return to Landing Page"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="#8C9089"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  </button>
);

const CreateRecipeButton = ({ navigate }) => (
  <button
    onClick={() => navigate("/recipes")}
    className="text-white hover:text-olive-light hover:underline transition-colors text-xl"
  >
    Tap here to create your own recipe!
  </button>
);

const PrepPageLink = () => (
  <Link
    to="/prep"
    className="text-white hover:text-olive-light hover:underline transition-colors text-xl"
  >
    Go to Prep Page
  </Link>
);

const SignButton = ({ user, handleSignOut, handleSignIn }) => (
  <button
    onClick={user ? handleSignOut : handleSignIn}
    className="text-white hover:text-olive-light hover:underline transition-colors text-xl"
  >
    {user ? "Sign Out" : "Sign In"}
  </button>
);

const ProfileButton = ({ navigate }) => (
  <button
    onClick={() => navigate("/profile")}
    className="text-white hover:text-olive-light transition-colors"
    aria-label="Go to profile"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  </button>
);

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="relative w-full max-w-3xl mb-8">
    <input
      type="text"
      placeholder="Search recipes..."
      className="w-full p-2 pl-10 bg-white bg-opacity-40 rounded text-white placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-1 focus:ring-olive transition duration-150 ease-in-out"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  </div>
);

const RecipeGrid = ({
  isLoading,
  error,
  filteredRecipes,
  handleRecipeClick,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
    {isLoading && <p>Loading recipes...</p>}
    {error && <p>Error loading recipes: {error.message}</p>}
    {filteredRecipes.map((recipe) => (
      <RecipeCard
        key={recipe._id}
        recipe={recipe}
        handleRecipeClick={handleRecipeClick}
      />
    ))}
    {filteredRecipes.length < 12 &&
      Array(12 - filteredRecipes.length)
        .fill()
        .map((_, i) => <div key={`placeholder-${i}`} className="h-[260px]" />)}
  </div>
);

const RecipeCard = ({ recipe, handleRecipeClick }) => {
  console.log("Recipe data:", recipe); // This line helps with debugging

  return (
    <div
      className="h-[260px] rounded-lg p-4 shadow-md cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-olive-dark hover:shadow-lg relative flex flex-col justify-between bg-white bg-opacity-40 overflow-hidden"
      onClick={() => handleRecipeClick(recipe._id)}
    >
      {recipe.recipeImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={"http://localhost:10000/" + recipe.recipeImage}
            alt={recipe.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}
      <div className="relative z-10 flex flex-col justify-between h-full">
        <h2 className="text-xl font-semibold mb-2 transition-colors duration-300 ease-in-out hover:text-yellow-300">
          {recipe.name}
        </h2>
        {recipe.user && (
          <p className="text-md mb-2">Created by: {recipe.user.username}</p>
        )}
      </div>
    </div>
  );
};

export default Home;
