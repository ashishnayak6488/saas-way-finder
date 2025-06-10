import axios, { AxiosResponse } from 'axios';
import toast from 'react-hot-toast';
import { getAuthHeader } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

interface UserProfile {
  // Add specific fields if you have a type
  [key: string]: any;
}

export const UserService = {
  async getUserProfile(): Promise<UserProfile> {
    const loadingToast = toast.loading('Fetching profile...');
    try {
      const response: AxiosResponse<UserProfile> = await axios.get(
        `${API_BASE_URL}/v1/user_test`,
        {
          withCredentials: true,
          ...getAuthHeader(),
        }
      );
      toast.success('Profile successfully loaded', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(errorMessage, { id: loadingToast });
      throw error;
    }
  },

  async updateProfile(userData: Record<string, any>): Promise<UserProfile> {
    const loadingToast = toast.loading('Updating profile...');
    try {
      const response: AxiosResponse<UserProfile> = await axios.put(
        `${API_BASE_URL}/v1/user_test`,
        userData,
        {
          withCredentials: true,
          ...getAuthHeader(),
        }
      );
      toast.success('Profile updated successfully', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      toast.error('Failed to update profile', { id: loadingToast });
      throw error;
    }
  },

  async changePassword(passwordData: Record<string, any>): Promise<any> {
    const loadingToast = toast.loading('Changing password...');
    try {
      const response = await axios.post(
        `${API_BASE_URL}/change-password`,
        passwordData,
        getAuthHeader()
      );
      toast.success('Password changed successfully', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      toast.error('Failed to change password', { id: loadingToast });
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<any> {
    const loadingToast = toast.loading('Sending reset instructions...');
    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      toast.success('Reset instructions sent', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      toast.error('Failed to send reset instructions', { id: loadingToast });
      throw error;
    }
  },

  async verifyOTP(email: string, otp: string): Promise<any> {
    const loadingToast = toast.loading('Verifying OTP...');
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
      toast.success('OTP verified', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      toast.error('Invalid OTP', { id: loadingToast });
      throw error;
    }
  },

  async resetPassword(email: string, newPassword: string): Promise<any> {
    const loadingToast = toast.loading('Resetting password...');
    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        newPassword,
      });
      toast.success('Password reset successful', { id: loadingToast });
      return response.data;
    } catch (error: any) {
      toast.error('Password reset failed', { id: loadingToast });
      throw error;
    }
  },

  async updateProfileImage(imageFile: File): Promise<any> {
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
    } catch (error: any) {
      toast.error('Failed to update profile image', { id: loadingToast });
      throw error;
    }
  },
};
