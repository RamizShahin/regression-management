import { useState, FormEvent, ChangeEvent } from "react";
import authService from "../../services/auth";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const userFormSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    phone: z
      .string()
      .min(10, "Phone number is required")
      .regex(/^\+\d+$/, "Phone number must start with '+' followed by numbers only"),
  });

  const passwordFormSchema = z
    .object({
      currentPassword: z.string().min(6, "Current password is required"),
      newPassword: z.string().min(8, "New password must be at least 8 characters long"),
      confirmPassword: z.string().min(8, "Confirm password must match new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "New passwords do not match",
      path: ["confirmPassword"],
    });

  const [formData, setFormData] = useState({
    name: authService.getUser()?.name || "",
    phone: authService.getUser()?.phone || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (["currentPassword", "newPassword", "confirmPassword"].includes(name)) {
      setPasswordData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedData = userFormSchema.parse(formData);
      await authService.makeAuthenticatedRequest("/api/profile/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const currentUser = authService.getUser();
      authService["currentUser"] = {
        ...currentUser,
        name: validatedData.name,
        phone: validatedData.phone,
        user_id: currentUser?.user_id!,
        email: currentUser?.email!,
        role: currentUser?.role!,
      };

      alert("Profile updated successfully!");
      navigate(0);
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const validatedData = passwordFormSchema.parse(passwordData);
      const response = await authService.makeAuthenticatedRequest("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: validatedData.currentPassword,
          newPassword: validatedData.newPassword,
        }),
      });

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        navigate(0);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to change password");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors[0]?.message || "Validation failed");
      } else {
        console.error("Password change error:", error);
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8">
      <h1 className="text-2xl mb-6 md:ml-10">Profile Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto md:mx-0 md:ml-10">
        {/* Profile Info Form */}
        <div className="bg-gray-900 rounded-xl p-5 space-y-4">
          <h2 className="text-sm mb-2">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4 text-sm">
            <div>
              <label htmlFor="name" className="block mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md bg-gray-800 text-white p-2 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block mb-1">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md bg-gray-800 text-white p-2 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={authService.getUser()?.email || ""}
                disabled
                className="w-full rounded-md bg-gray-800 text-white p-2 border border-gray-700 opacity-50 cursor-not-allowed text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition text-sm"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-gray-900 rounded-xl p-5 space-y-4">
          <h2 className="text-lg mb-2">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 text-sm">
            <div>
              <label htmlFor="currentPassword" className="block mb-1">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                onChange={handleChange}
                className="w-full rounded-md bg-gray-800 text-white p-2 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block mb-1">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                onChange={handleChange}
                className="w-full rounded-md bg-gray-800 text-white p-2 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleChange}
                className="w-full rounded-md bg-gray-800 text-white p-2 border border-gray-700 focus:outline-none focus:ring focus:ring-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md transition text-sm"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
