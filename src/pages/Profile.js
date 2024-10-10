import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateUser } from "../api/users";
import { useNavigate } from "react-router-dom";
import { FollowModal } from "./FollowModal";

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (user) {
      setEditedUser(user);
      setPreviewImage(`http://localhost:10000/${user.profileImage}`);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
      setEditMode(false);
      alert("Profile updated successfully.");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Error updating user");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedUser({ ...editedUser, profileImage: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an object with only the editable fields
    const updatedUserData = {
      username: editedUser.username,
      email: editedUser.email,
      gender: editedUser.gender,
    };

    // Add the profile image if a new one was selected
    if (fileInputRef.current.files[0]) {
      updatedUserData.profileImage = fileInputRef.current.files[0];
    }

    updateMutation.mutate(updatedUserData);
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-olive min-h-screen flex flex-col p-12 text-white font-telugu">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-white hover:text-olive-light transition-colors mr-4"
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
          <h1 className="text-4xl font-bold">Profile</h1>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-lg p-8 shadow-md text-olive">
        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div
                className="relative w-24 h-24 cursor-pointer"
                onClick={handleImageClick}
              >
                <img
                  src={previewImage}
                  alt={editedUser.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">Change Image</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={editedUser.username || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive focus:ring focus:ring-olive focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editedUser.email || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive focus:ring focus:ring-olive focus:ring-opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={editedUser.gender || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive focus:ring focus:ring-olive focus:ring-opacity-50"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <img
                src={`http://localhost:10000/${user.profileImage}`}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-center">{user.username}</h2>
            <p className="text-gray-600 text-center">{user.email}</p>
            <p className="text-gray-600 text-center">
              Gender: {user.gender || "Not specified"}
            </p>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2 text-center">Stats</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => navigate("/recipes")}
                >
                  <p className="font-bold">{user.recipes?.length || 0}</p>
                  <p className="text-gray-600">Recipes</p>
                </div>
                <div
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => setShowFollowersModal(true)}
                >
                  <p className="font-bold">{user.followers?.length || 0}</p>
                  <p className="text-gray-600">Followers</p>
                </div>
                <div
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                  onClick={() => setShowFollowingModal(true)}
                >
                  <p className="font-bold">{user.following?.length || 0}</p>
                  <p className="text-gray-600">Following</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FollowModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        users={user?.followers || []}
        currentUserId={user?._id}
      />

      <FollowModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        users={user?.following || []}
        currentUserId={user?._id}
      />
    </div>
  );
};
