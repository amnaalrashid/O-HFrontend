import React, { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, Navigate, NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";
import { signup } from "../api/users";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [user, setUser] = useContext(UserContext);

  const { mutate } = useMutation({
    mutationKey: ["signup"],
    mutationFn: () => signup(formData),
    onSuccess: () => {
      setUser(true);
    },
    onError: (error) => {
      setError(
        error.response?.data?.message || "An error occurred during signup"
      );
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    mutate();
  };

  if (user) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="flex min-h-screen bg-olive">
      <div className="flex flex-col justify-center w-full px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="w-full max-w-md mx-auto -mt-64">
          <h2 className="text-left text-2xl text-white leading-normal mb-6">
            Register now for fresh, simple recipes. Bring new flavors to your
            table daily.
          </h2>
          <div>
            <form className="space-y-4 max-w-[360px]" onSubmit={handleSubmit}>
              <div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Username"
                  className="block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#344E41] focus:border-[#344E41] sm:text-sm bg-white bg-opacity-60 text-white placeholder-white"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  className="block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#344E41] focus:border-[#344E41] sm:text-sm bg-white bg-opacity-40 text-white placeholder-white"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Password"
                  className="block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#344E41] focus:border-[#344E41] sm:text-sm bg-white bg-opacity-40 text-white placeholder-white"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Confirm Password"
                  className="block w-full rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#344E41] focus:border-[#344E41] sm:text-sm bg-white bg-opacity-40 text-white placeholder-white"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  required
                  className="block w-full rounded-md shadow-sm py-2 px-3 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10 bg-white bg-opacity-40 text-white"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="" disabled className="text-gray-700">
                    Select gender
                  </option>
                  <option value="male" className="text-gray-700">
                    Male
                  </option>
                  <option value="female" className="text-gray-700">
                    Female
                  </option>
                  <option value="other" className="text-gray-700">
                    Other
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}
            </form>

            <div className="mt-8 max-w-[360px]">
              <button
                onClick={handleSubmit}
                className="w-full flex justify-center py-2 px-3 rounded-md shadow-sm text-sm font-medium text-white bg-white bg-opacity-40 hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#344E41]"
              >
                Register
              </button>
            </div>
            {/* Sign in link */}
            <div className="text-center mt-2 max-w-[360px]">
              <span className="text-xs font-medium text-white">
                Already have an account?{" "}
                <Link to="/signin" className="hover:underline">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-start p-6 -ml-[116px] -mt-[76px] mb-20">
        <div className="relative w-[780px] h-[400px] rounded-3xl overflow-hidden mb-6">
          <img
            className="w-full h-full object-cover object-[center_calc(50%-96px)]"
            src="https://i.pinimg.com/564x/cb/7a/5b/cb7a5b75db01e1d844118789f8146088.jpg"
            alt="Sign up background"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-6">
            <h2 className="text-4xl font-bold mb-3 drop-shadow">
              Culinary Adventure
            </h2>
            <p className="text-xl drop-shadow mb-6">Begin Your Journey Today</p>
            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-4 w-4/5 text-center">
              <h3 className="text-olive text-lg font-semibold mb-2">
                Kitchen Measuring Tips
              </h3>
              <p className="text-gray-800 text-sm">
                Precise measurements are key to culinary success. Use proper
                tools for consistent results.
              </p>
            </div>
          </div>
        </div>
        <div className="relative w-[780px] h-[200px] rounded-3xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/564x/b2/61/e4/b261e420e8961ed8e088fbf015bb2505.jpg"
            alt="Meal prep background"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute inset-0 flex justify-between items-center text-white p-8">
            <div className="w-2/3">
              <h3 className="text-3xl font-bold mb-2 drop-shadow">
                New: Weekly Meal Prep Planner
              </h3>
              <p className="text-lg drop-shadow mb-4">
                Organize your meals, save time, and eat healthier with our new
                feature
              </p>
              <NavLink
                to="/prep"
                className="bg-olive text-white px-6 py-2 rounded-full hover:bg-olive-dark transition duration-300"
              >
                Try It Now
              </NavLink>
            </div>
            <div className="w-1/3 bg-white bg-opacity-80 rounded-lg shadow-lg p-4 text-center">
              <h4 className="text-olive text-xl font-semibold mb-2">
                Personalized Plans
              </h4>
              <p className="text-gray-800">Customize Your Meals</p>
              <p className="text-gray-600 text-sm">Set your calorie goals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
