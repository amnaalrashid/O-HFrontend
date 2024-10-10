import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./pages/Home";
import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { Account } from "./pages/Account";
import { Recipes } from "./pages/Recipes";
import { Profile } from "./pages/Profile";
import { RecipeDetail } from "./pages/RecipeDetail";
import { Fav } from "./pages/Fav";
import { Prep } from "./pages/prep";
import "./index.css";
import App from "./App";
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/home", element: <Home /> },
      { path: "/recipes", element: <Recipes /> },
      { path: "/account/:id", element: <Account /> },
      { path: "/recipe/:id", element: <RecipeDetail /> },
      { path: "/profile", element: <Profile /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/fav", element: <Fav /> },
      { path: "/prep", element: <Prep /> },
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
