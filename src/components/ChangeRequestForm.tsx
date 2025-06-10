"use client";
import React, { useState } from "react";

// Define interfaces for form data and errors
interface FormData {
  urgency: string;
  reason: string;
  attachments: File[];
}

interface FormErrors {
  urgency: string;
  reason: string;
  attachments: string;
}

interface ChangeRequestFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const ChangeRequestForm: React.FC<ChangeRequestFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<FormData>({
    urgency: "",
    reason: "",
    attachments: [],
  });

  const [errors, setErrors] = useState<FormErrors>({
    urgency: "",
    reason: "",
    attachments: "",
  });

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = {
      urgency: "",
      reason: "",
      attachments: "",
    };

    if (!formData.urgency.trim()) {
      newErrors.urgency = "Urgency level is required";
      isValid = false;
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Reason for request is required";
      isValid = false;
    } else if (formData.reason.length < 10) {
      newErrors.reason = "Reason must be at least 10 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (files.length !== validFiles.length) {
      setErrors((prev) => ({
        ...prev,
        attachments: "Only image and video files are allowed",
      }));
    } else {
      setErrors((prev) => ({ ...prev, attachments: "" }));
    }

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...validFiles],
    }));
  };

  const removeFile = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({ ...prev, attachments: "" }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ urgency: "", reason: "", attachments: [] });
      setErrors({ urgency: "", reason: "", attachments: "" });
    }
  };

  const buttonStyles = {
    primary:
      "justify-center rounded-md bg-[#573CFA] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#7D64FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#573CFA]",
    secondary:
      "justify-center rounded-md bg-[#FB8D1A] px-3 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-[#FFAA4D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FB8D1A]",
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Change Request</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
            Urgency Level
          </label>
          <select
            value={formData.urgency}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, urgency: e.target.value }))
            }
            className="w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-500 transition-all duration-300"
          >
            <option value="">Select Urgency Level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          {errors.urgency && (
            <p className="text-red-500 text-sm mt-1">{errors.urgency}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
            Reason for Request
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            rows={4}
            className="outline-none w-full px-4 py-2 border rounded-lg bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-500 transition-all duration-300"
            placeholder="Please describe your request..."
          ></textarea>
          {errors.reason && (
            <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-hover:text-blue-600">
            Attachments
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                Images & videos up to 10MB each
              </p>
            </div>
          </div>
          {errors.attachments && (
            <p className="text-red-500 text-sm mt-1">{errors.attachments}</p>
          )}
        </div>

        {formData.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Uploaded Files
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.attachments.map((file, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-40 w-full object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(file)}
                      className="h-40 w-full object-cover rounded-lg"
                      controls
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-white hover:text-red-500 transition-colors p-2"
                      aria-label={`Remove ${file.name}`}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate px-2">
                    {file.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onCancel}
            className={`font-medium py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform ${buttonStyles.secondary}`}
            aria-label="Cancel form submission"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`font-medium py-2 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform ${buttonStyles.primary}`}
            aria-label="Submit change request"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeRequestForm;
