import toast from "react-hot-toast";
import { getAuthHeader } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface UserProfile {
  [key: string]: any;
}

async function handleFetch(
  url: string,
  options: RequestInit,
  successMessage: string,
  errorMessage: string,
  toastId: string
) {
  try {
    const res = await fetch(url, options);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || errorMessage);
    }

    toast.success(successMessage, { id: toastId });
    return data;
  } catch (err: any) {
    toast.error(err.message || errorMessage, { id: toastId });
    throw err;
  }
}

export const UserService = {
  async getUserProfile(): Promise<UserProfile> {
    const loadingToast = toast.loading("Fetching profile...");
    return handleFetch(
      `${API_BASE_URL}/v1/user_test`,
      {
        method: "GET",
        credentials: "include",
        ...getAuthHeader(),
      },
      "Profile successfully loaded",
      "Failed to fetch profile",
      loadingToast
    );
  },

  async updateProfile(userData: Record<string, any>): Promise<UserProfile> {
    const loadingToast = toast.loading("Updating profile...");
    return handleFetch(
      `${API_BASE_URL}/v1/user_test`,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(userData),
        ...getAuthHeader(),
      },
      "Profile updated successfully",
      "Failed to update profile",
      loadingToast
    );
  },

  async changePassword(passwordData: Record<string, any>): Promise<any> {
    const loadingToast = toast.loading("Changing password...");
    return handleFetch(
      `${API_BASE_URL}/change-password`,
      {
        method: "POST",
        body: JSON.stringify(passwordData),
        ...getAuthHeader(),
      },
      "Password changed successfully",
      "Failed to change password",
      loadingToast
    );
  },

  async forgotPassword(email: string): Promise<any> {
    const loadingToast = toast.loading("Sending reset instructions...");
    return handleFetch(
      `${API_BASE_URL}/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
        ...getAuthHeader(),
      },
      "Reset instructions sent",
      "Failed to send reset instructions",
      loadingToast
    );
  },

  async verifyOTP(email: string, otp: string): Promise<any> {
    const loadingToast = toast.loading("Verifying OTP...");
    return handleFetch(
      `${API_BASE_URL}/verify-otp`,
      {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        ...getAuthHeader(),
      },
      "OTP verified",
      "Invalid OTP",
      loadingToast
    );
  },

  async resetPassword(email: string, newPassword: string): Promise<any> {
    const loadingToast = toast.loading("Resetting password...");
    return handleFetch(
      `${API_BASE_URL}/reset-password`,
      {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
        ...getAuthHeader(),
      },
      "Password reset successful",
      "Password reset failed",
      loadingToast
    );
  },

  async updateProfileImage(imageFile: File): Promise<any> {
    const loadingToast = toast.loading("Updating profile image...");
    const formData = new FormData();
    formData.append("profile_image", imageFile);

    try {
      const res = await fetch(`${API_BASE_URL}/user/profile/image`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...getAuthHeader().headers,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile image");
      }

      toast.success("Profile image updated", { id: loadingToast });
      return data;
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile image", {
        id: loadingToast,
      });
      throw err;
    }
  },
};
