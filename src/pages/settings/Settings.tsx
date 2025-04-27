import React, { useState, FormEvent, ChangeEvent } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
} from "@mui/material";

const Settings = () => {
  const [formData, setFormData] = useState({
    name: "John Doe",
    phone: "+1 234 567 8900",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement API call to update user profile
    console.log("Profile updated:", formData);
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement API call to change password
    console.log("Password change attempted");

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    alert("Password changed successfully!");
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <form onSubmit={handleProfileUpdate}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                disabled
                label="Email"
                value="user@example.com"
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handlePasswordChange}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Change Password
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default Settings;
