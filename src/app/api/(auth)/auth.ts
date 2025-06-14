import { toast } from "react-hot-toast";

// Define interfaces for better type safety
interface AuthResponse {
  isValid?: boolean;
  message?: string;
  user?: any;
  token?: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile_image?: string;
  [key: string]: any;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

interface ToastPromiseOptions {
  loading: string;
  success: string;
  error: (err: Error) => string;
}

interface ToastStyle {
  style: {
    minWidth: string;
  };
}

// Utility function for creating toast promises (currently unused but fixed)
const createToast = (
  promise: Promise<any>,
  loadingMessage: string,
  successMessage: string,
  errorMessage: string
) =>
  toast.promise(
    promise,
    {
      loading: loadingMessage,
      success: successMessage,
      error: (err: Error) => err.message || errorMessage,
    } as ToastPromiseOptions,
    {
      style: { minWidth: "250px" },
    } as ToastStyle
  );

// Check if we're in browser environment
const isBrowser = typeof window !== "undefined";

export const getAuthHeader = (): {
  Authorization: string;
  "Content-Type": string;
} => {
  if (!isBrowser) {
    return {
      Authorization: "Bearer ",
      "Content-Type": "application/json",
    };
  }

  // First try to get token from localStorage
  let token = localStorage.getItem("token");

  // If not found, try cookies as fallback
  if (!token) {
    const cookies = document.cookie;
    token =
      cookies
        .split("; ")
        .find((row) => row.startsWith("digital-signage="))
        ?.split("=")[1] || "";
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Helper function to handle API responses
const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Network error" }));
    throw new Error(
      errorData?.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

export const authService = {
  async validateToken(token: string): Promise<boolean> {
    try {
      if (!token) return false;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
          credentials: "include",
        }
      );

      return res.ok;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  },

  async logout(): Promise<boolean> {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: getAuthHeader(),
        }
      );

      if (res.ok && isBrowser) {
        // Clear all auth data
        localStorage.clear();
        // Clear specific cookie
        document.cookie =
          "digital-signage=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }

      return res.ok;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  },

  async checkAuthStatus(): Promise<boolean> {
    try {
      if (!isBrowser) return false;

      const token = localStorage.getItem("token");
      if (!token) return false;

      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        localStorage.clear();
        return false;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`,
        {
          method: "GET",
          headers: getAuthHeader(),
          credentials: "include",
        }
      );

      if (!res.ok) {
        localStorage.clear();
        return false;
      }

      const data: AuthResponse = await res.json();
      if (data.isValid) {
        return true;
      } else {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      console.error("Auth status check error:", error);
      if (isBrowser) {
        localStorage.clear();
      }
      return false;
    }
  },

  async getUserProfile(): Promise<UserProfile> {
    try {
      if (!isBrowser) {
        throw new Error("Cannot access localStorage in server environment");
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user_test`,
        {
          method: "GET",
          headers: getAuthHeader(),
          credentials: "include",
        }
      );

      return await handleApiResponse(res);
    } catch (error) {
      console.error("Get user profile error:", error);
      throw error;
    }
  },

  async updateProfile(userData: Partial<UserProfile>): Promise<UserProfile> {
    const loadingToast = toast.loading("Updating profile...");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user_test`,
        {
          method: "PUT",
          headers: getAuthHeader(),
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      const data = await handleApiResponse(res);
      toast.success("Profile updated successfully", { id: loadingToast });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async changePassword(passwordData: PasswordData): Promise<any> {
    const loadingToast = toast.loading("Changing password...");
    try {
      // Validate password data
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        throw new Error("Current password and new password are required");
      }

      if (
        passwordData.confirmPassword &&
        passwordData.newPassword !== passwordData.confirmPassword
      ) {
        throw new Error("New password and confirm password do not match");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/change-password`,
        {
          method: "POST",
          headers: getAuthHeader(),
          credentials: "include",
          body: JSON.stringify(passwordData),
        }
      );

      const data = await handleApiResponse(res);
      toast.success("Password changed successfully", { id: loadingToast });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<any> {
    const loadingToast = toast.loading("Sending reset instructions...");
    try {
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        throw new Error("Please provide a valid email address");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await handleApiResponse(res);
      toast.success("Reset instructions sent to your email", {
        id: loadingToast,
      });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to send reset instructions";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async verifyOTP(email: string, otp: string): Promise<any> {
    const loadingToast = toast.loading("Verifying OTP...");
    try {
      if (!email || !otp) {
        throw new Error("Email and OTP are required");
      }

      if (!/^\d{6}$/.test(otp)) {
        throw new Error("OTP must be 6 digits");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await handleApiResponse(res);
      toast.success("OTP verified successfully", { id: loadingToast });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid OTP";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async resetPassword(email: string, newPassword: string): Promise<any> {
    const loadingToast = toast.loading("Resetting password...");
    try {
      if (!email || !newPassword) {
        throw new Error("Email and new password are required");
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await handleApiResponse(res);
      toast.success("Password reset successful", { id: loadingToast });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async updateProfileImage(imageFile: File): Promise<any> {
    const loadingToast = toast.loading("Updating profile image...");
    try {
      if (!imageFile) {
        throw new Error("Please select an image file");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error(
          "Please select a valid image file (JPEG, PNG, or WebP)"
        );
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        throw new Error("Image size should be less than 5MB");
      }

      const formData = new FormData();
      formData.append("profile_image", imageFile);

      const authHeader = getAuthHeader();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/image`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: authHeader.Authorization,
            // Don't set Content-Type for FormData; browser will set it with boundary
          },
          body: formData,
        }
      );

      const data = await handleApiResponse(res);
      toast.success("Profile image updated successfully", { id: loadingToast });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update profile image";
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },
};

// Export types for use in other files
export type { UserProfile, PasswordData, AuthResponse };
