"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

interface SignupProps {
  onLoginClick: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function Signup({ onLoginClick }: SignupProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleTermsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const isFormComplete = (): boolean => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    return (
      firstName.trim() !== "" &&
      lastName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      agreedToTerms
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading("Creating account...");
    setIsLoading(true);

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      toast.success("Account created successfully!", { id: loadingToast });
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.", {
        id: loadingToast,
      });
    }

    setIsLoading(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="flex items-center justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8 border">
        <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-1 group relative">
              <User className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                label="First Name"
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                error={errors.firstName}
                disabled={isLoading}
                required
                className="pl-10"
              />
            </div>
            <div className="mb-1 group relative">
              <User className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
              <Input
                label="Last Name"
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                error={errors.lastName}
                disabled={isLoading}
                required
                className="pl-10"
              />
            </div>
          </div>

          <div className="mb-4 group relative">
            <Mail className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              label="Email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="mail@abc.com"
              error={errors.email}
              disabled={isLoading}
              required
              className="pl-10"
            />
          </div>

          <div className="mb-4 group relative">
            <Lock className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="**********"
              error={errors.password}
              disabled={isLoading}
              required
              className="pl-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Eye className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="mb-4 group relative">
            <Lock className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="**********"
              error={errors.confirmPassword}
              disabled={isLoading}
              required
              className="pl-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-12 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-6 w-6" />
              ) : (
                <Eye className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="mb-4 group relative">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              checked={agreedToTerms}
              onChange={handleTermsChange}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-gray-700">
              I agree to the{" "}
              <Link
                href="/termandcondition"
                className="text-blue-500 hover:underline"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className={`w-full ${
              !isFormComplete() ? "cursor-not-allowed opacity-50" : ""
            }`}
            disabled={isLoading || !isFormComplete()}
            size="default"
            fullWidth={true}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onLoginClick}
            className="text-indigo-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
