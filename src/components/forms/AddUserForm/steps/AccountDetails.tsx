import React from "react";
import { UserFormData } from "../validationSchema";

type AccountDetailsProps = {
  formData: UserFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onProjectsChange?: (selectedProjects: string[]) => void;
  errors: Record<string, string>;
};

const AccountDetails: React.FC<AccountDetailsProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          <span className="mr-2">🔒</span>
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className={`w-full rounded-md border px-4 py-2 min-h-[44px] bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-base ${
            errors.password ? "border-red-500" : "border-gray-700"
          }`}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          <span className="mr-2">👑</span>
          Role
        </label>
        <div className="relative">
          <select
              id="role"
              name="role"
              value={formData.role}
              style={{ backgroundColor: '#1f2937', color: 'white'  }} // gray-800
              onChange={onChange}
              className={`appearance-none w-full min-w-[10rem] sm:min-w-[15rem] md:min-w-[20rem] lg:min-w-[20rem] rounded-md border bg-gray-800 text-white text-base px-4 py-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.role ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Select a role</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-500">{errors.role}</p>
        )}
      </div>
    </div>
  );
};

export default AccountDetails;
