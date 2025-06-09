// utils/auth.ts
export const getAuthHeader = (): { headers: Record<string, string> } => {
  const cookies = document.cookie;
  const token = cookies
    .split('; ')
    .find(row => row.startsWith('digital-signage='))
    ?.split('=')[1];

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// services/userService.ts
import toast from 'react-hot-toast';
import { getAuthHeader } from '../../../utils/auth';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

export const UserService = {
  async getUserProfile() {
    const loadingToast = toast.loading('Fetching profile...');
    try {
      const response = await axios.get(`${API_BASE_URL}/v1/user_test`, {
        withCredentials: true,
        ...getAuthHeader(),
      });
      toast.success('Profile successfully loaded', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async updateProfile(userData: Record<string, any>) {
    const loadingToast = toast.loading('Updating profile...');
    try {
      const response = await axios.put(
        `${API_BASE_URL}/v1/user_test`,
        userData,
        {
          withCredentials: true,
          ...getAuthHeader(),
        }
      );
      toast.success('Profile updated successfully', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error('Failed to update profile', { id: loadingToast });
      throw error;
    }
  },

  async changePassword(passwordData: Record<string, any>) {
    const loadingToast = toast.loading('Changing password...');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/change-password`,
        passwordData,
        getAuthHeader()
      );
      toast.success('Password changed successfully', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error('Failed to change password', { id: loadingToast });
      throw error;
    }
  },

  async forgotPassword(email: string) {
    const loadingToast = toast.loading('Sending reset instructions...');
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      toast.success('Reset instructions sent', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error('Failed to send reset instructions', { id: loadingToast });
      throw error;
    }
  },

  async verifyOTP(email: string, otp: string) {
    const loadingToast = toast.loading('Verifying OTP...');
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
      toast.success('OTP verified', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error('Invalid OTP', { id: loadingToast });
      throw error;
    }
  },

  async resetPassword(email: string, newPassword: string) {
    const loadingToast = toast.loading('Resetting password...');
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        newPassword,
      });
      toast.success('Password reset successful', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error('Password reset failed', { id: loadingToast });
      throw error;
    }
  },

  async updateProfileImage(imageFile: File) {
    const loadingToast = toast.loading('Updating profile image...');
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/profile/image`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeader().headers,
          },
        }
      );
      toast.success('Profile image updated', { id: loadingToast });
      return response.data;
    } catch (error) {
      toast.error('Failed to update profile image', { id: loadingToast });
      throw error;
    }
  },
};
