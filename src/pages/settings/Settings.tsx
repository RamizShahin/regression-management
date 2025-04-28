import React, { useState, FormEvent, ChangeEvent } from "react";
import styles from "./Settings.module.css";
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
      .regex(
        /^\+\d+$/,
        "Phone number must start with '+' followed by numbers only"
      ),
  });

  // type UserFormData = z.infer<typeof userFormSchema>;

  const [formData, setFormData] = useState({
    name: authService.getUser()?.name || "",
    phone: authService.getUser()?.phone || "",
  });

  const passwordFormSchema = z
    .object({
      currentPassword: z.string().min(6, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters long"),
      confirmPassword: z
        .string()
        .min(8, "Confirm password must match new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "New passwords do not match",
      path: ["confirmPassword"],
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
          // profileId: authService.getUser()?.user_id.toString() || "",
        },
        body: JSON.stringify({
          ...validatedData,
          // profileId: authService.getUser()?.user_id,
        }),
      });

      // Update authService current user with the new data
      const currentUser = authService.getUser();

      const updatedUser = {
        ...currentUser,
        name: validatedData.name,
        phone: validatedData.phone,
        user_id: currentUser?.user_id!,
        email: currentUser?.email!,
        role: currentUser?.role!,
      };
      authService["currentUser"] = updatedUser;

      alert("Profile updated successfully!");
      navigate(0);
    } catch (error) {
      console.error("Validation error:", error);
      return;
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validatedData = passwordFormSchema.parse(passwordData);

      const response = await authService.makeAuthenticatedRequest(
        "/api/profile/password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: validatedData.currentPassword,
            newPassword: validatedData.newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
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
    <div className={styles.settingsContainer}>
      <h1 className={styles.header}>Profile Settings</h1>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={authService.getUser()?.email || ""}
                disabled
                className={styles.input}
              />
              <p className={styles.helpText}>Email cannot be changed</p>
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.button}>
                Update Profile
              </button>
            </div>
          </form>
        </div>

        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Change Password</h2>
          <form onSubmit={handlePasswordChange} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.label}>
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                // value={formData.currentPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                // value={formData.newPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                // value={formData.confirmPassword}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.button}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
