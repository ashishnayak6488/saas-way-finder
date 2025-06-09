import { toast } from 'react-hot-toast';

const createToast = (promise, loadingMessage, successMessage, errorMessage) =>
  toast.promise(promise, {
    loading: loadingMessage,
    success: successMessage,
    error: (err) => err.message || errorMessage,
  }, {
    style: { minWidth: '250px' },
  });

export const getAuthHeader = () => {
  const cookies = document.cookie;
  const token = cookies
    .split('; ')
    .find(row => row.startsWith('digital-signage='))
    ?.split('=')[1];

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const authService = {
  async validateToken(token) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      credentials: 'include',
    });
    return res.ok;
  },

  async logout() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.ok;
  },

  async checkAuthStatus() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
        localStorage.clear();
        return false;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate-token`, {
        method: 'GET',
        headers: getAuthHeader(),
        credentials: 'include',
      });

      if (!res.ok) {
        localStorage.clear();
        return false;
      }

      const data = await res.json();
      if (data.isValid) {
        return true;
      } else {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }
  },

  async getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found. Please log in.');

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user_test`, {
        method: 'GET',
        headers: getAuthHeader(),
        credentials: 'include',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to fetch profile');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateProfile(userData) {
    const loadingToast = toast.loading('Updating profile...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/user_test`, {
        method: 'PUT',
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to update profile');
      }

      const data = await res.json();
      toast.success('Profile updated successfully', { id: loadingToast });
      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile', { id: loadingToast });
      throw error;
    }
  },

  async changePassword(passwordData) {
    const loadingToast = toast.loading('Changing password...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/change-password`, {
        method: 'POST',
        headers: getAuthHeader(),
        credentials: 'include',
        body: JSON.stringify(passwordData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to change password');
      }

      const data = await res.json();
      toast.success('Password changed successfully', { id: loadingToast });
      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to change password', { id: loadingToast });
      throw error;
    }
  },

  async forgotPassword(email) {
    const loadingToast = toast.loading('Sending reset instructions...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to send reset instructions');
      }

      const data = await res.json();
      toast.success('Reset instructions sent', { id: loadingToast });
      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to send reset instructions', { id: loadingToast });
      throw error;
    }
  },

  async verifyOTP(email, otp) {
    const loadingToast = toast.loading('Verifying OTP...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Invalid OTP');
      }

      const data = await res.json();
      toast.success('OTP verified', { id: loadingToast });
      return data;
    } catch (error) {
      toast.error(error.message || 'Invalid OTP', { id: loadingToast });
      throw error;
    }
  },

  async resetPassword(email, newPassword) {
    const loadingToast = toast.loading('Resetting password...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Password reset failed');
      }

      const data = await res.json();
      toast.success('Password reset successful', { id: loadingToast });
      return data;
    } catch (error) {
      toast.error(error.message || 'Password reset failed', { id: loadingToast });
      throw error;
    }
  },

  async updateProfileImage(imageFile) {
    const loadingToast = toast.loading('Updating profile image...');
    const formData = new FormData();
    formData.append('profile_image', imageFile);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/image`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          // Do NOT set Content-Type for FormData; browser will set it with boundary
          Authorization: getAuthHeader().Authorization,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Failed to update profile image');
      }

      const data = await res.json();
      toast.success('Profile image updated', { id: loadingToast });
      return data;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile image', { id: loadingToast });
      throw error;
    }
  },
};
