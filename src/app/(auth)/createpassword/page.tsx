"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { EyeClosed, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Define form data type
interface FormData {
  newPassword: string;
  confirmPassword: string;
}

// Define errors type (can be string or array of strings for newPassword)
interface FormErrors {
  newPassword?: string[];
  confirmPassword?: string;
  api?: string;
}

// CreateNewPasswordPage component with TypeScript
const CreateNewPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const validatePassword = (password: string): string[] => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };

    const messages: string[] = [];
    if (!validations.length)
      messages.push("Password must be at least 8 characters");
    if (!validations.uppercase)
      messages.push("Include at least one uppercase letter");
    if (!validations.lowercase)
      messages.push("Include at least one lowercase letter");
    if (!validations.number) messages.push("Include at least one number");
    if (!validations.special)
      messages.push("Include at least one special character");

    return messages;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: "",
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;
    const newErrors: FormErrors = {};

    // Validate password strength
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation.length > 0) {
      newErrors.newPassword = passwordValidation;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const email = localStorage.getItem("userEmail");
      const otpVerified = localStorage.getItem("otpVerified");

      if (!email || !otpVerified) {
        throw new Error("Please verify your email first");
      }

      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password");
      }

      if (data.success) {
        // Clear sensitive data from localStorage
        localStorage.removeItem("userEmail");
        localStorage.removeItem("otpVerified");

        router.push("/");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update password. Please try again.";
      setErrors({
        api: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 sm:p-8 border">
      <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
        Create New Password
      </h2>

      {errors.api && (
        <div className="mb-4 p-2 text-center text-red-500 bg-red-50 rounded">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4 group relative">
          <Input
            label="New Password"
            type={isPasswordVisible ? "text" : "password"}
            id="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            // error={errors.newPassword}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-600 top-4 z-10"
          >
            {isPasswordVisible ? <Eye /> : <EyeClosed />}
          </button>
        </div>

        {Array.isArray(errors.newPassword) && (
          <ul className="text-sm text-red-500 list-disc pl-5">
            {errors.newPassword.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        <div className="mb-4 group relative">
          <Input
            label="Confirm Password"
            type={isPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
          size="sm"
          fullWidth={true}
        >
          {isLoading ? "Creating Password..." : "Create Password"}
        </Button>
      </form>
    </div>
  );
};
export default CreateNewPasswordPage;
