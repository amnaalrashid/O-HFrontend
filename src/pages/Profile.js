import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateUser, signin } from "../api/users";
import { useNavigate } from "react-router-dom";
import { FollowModal } from "./FollowModal";

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [passwordVerificationMode, setPasswordVerificationMode] =
    useState(false);
  const [password, setPassword] = useState("");
  const [editedUser, setEditedUser] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert(
        "Profile updated successfully. Please log in again with your new password if you changed it."
      );
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Error updating user");
    },
  });

  const verifyPasswordMutation = useMutation({
    mutationFn: (password) => signin({ username: user.username, password }),
    onSuccess: () => {
      setPasswordVerificationMode(false);
      setEditMode(true);
    },
    onError: (error) => {
      alert("Incorrect password. Please try again.");
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
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setPasswordError("");

    const formData = new FormData();
    Object.keys(editedUser).forEach((key) => {
      formData.append(key, editedUser[key]);
    });

    if (currentPassword && newPassword) {
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
    }

    if (fileInputRef.current.files[0]) {
      formData.append("profileImage", fileInputRef.current.files[0]);
    }

    updateMutation.mutate(formData);
  };

  const handlePasswordVerification = (e) => {
    e.preventDefault();
    verifyPasswordMutation.mutate(password);
  };

  if (isLoading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-olive min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl -mt-24">
        <div className="bg-white rounded-lg shadow-md text-olive p-8">
          {passwordVerificationMode ? (
            <form
              onSubmit={handlePasswordVerification}
              className="p-8 space-y-6"
            >
              <h2 className="text-2xl font-bold text-center mb-6">
                Edit Profile
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to continue
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 shadow-sm bg-white focus:outline-none p-3"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setPasswordVerificationMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors"
                >
                  Verify
                </button>
              </div>
            </form>
          ) : editMode ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Edit mode form content */}
              {/* ... (unchanged) */}
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <img
                  src={`http://localhost:10000/${user.profileImage}`}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
                <button
                  onClick={() => setPasswordVerificationMode(true)}
                  className="px-6 py-3 bg-olive text-white rounded-md hover:bg-olive-dark transition-colors text-lg"
                >
                  Edit Profile
                </button>
              </div>
              <h2 className="text-4xl font-bold">{user.username}</h2>
              <p className="text-xl text-gray-600">{user.email}</p>
              <p className="text-lg text-gray-800">
                {user.bio || "No bio provided"}
              </p>
              <p className="text-lg text-gray-600">
                Gender: {user.gender || "Not specified"}
              </p>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Status</h3>
                <div className="grid grid-cols-3 gap-8 text-center">
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
