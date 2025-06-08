import React from "react";
import { UserFormData } from "../validationSchema";

interface Props {
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProjectsChange?: (selectedProjects: string[]) => void;
  errors: Record<string, string>;
}

const PersonalInfo: React.FC<Props> = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
          <span className="mr-1">👤</span> Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          className={`w-full rounded-md bg-gray-800 text-white px-4 py-2 border ${
            errors.fullName ? 'border-red-500' : 'border-gray-700'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          <span className="mr-1">✉️</span> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`w-full rounded-md bg-gray-800 text-white px-4 py-2 border ${
            errors.email ? 'border-red-500' : 'border-gray-700'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
          <span className="mr-1">📱</span> Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className={`w-full rounded-md bg-gray-800 text-white px-4 py-2 border ${
            errors.phone ? 'border-red-500' : 'border-gray-700'
          } focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
      </div>
    </div>
  );
};

export default PersonalInfo;
