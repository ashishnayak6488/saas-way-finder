"use client";

import { CreateUserOrAdmin } from "../create/create";

// Re-export CreateUserOrAdmin as EditUser for consistency
export const EditUser = CreateUserOrAdmin;

// Define interfaces
interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role_id: number;
  entity_uuid: string;
  provider?: string;
}

interface UserResponse {
  user_uuid: string;
  name: string;
  email: string;
  role_id: number;
  [key: string]: any; // Allow additional fields from API response
}

export const updateUser = async (userData: UserData, userId: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`/api/organization/updateUser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...userData,
        user_uuid: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return await response.json();
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};