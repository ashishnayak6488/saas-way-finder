"use client";

import toast from "react-hot-toast";
// Define interfaces for data structures
interface Organization {
  id: string;
  entity_name: string;
  entity_type: string;
  entity_key: string;
  address: string;
  description: string;
  current_content: number;
  current_playlist: number;
  current_group: number;
  current_screen: number;
  max_screen: number;
  max_content: number;
  max_playlist: number;
  max_group: number;
  maintainer_users: User[];
  admins: User[];
}

interface User {
  user_uuid: string;
  name: string;
  email: string;
  role_name: string;
}

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await fetch("/api/organization/getAllMaintainer", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch organizations");
    }

    const data = await response.json();
    return Array.isArray(data.entities)
      ? data.entities.map((org: any) => ({
          id: org.entity_uuid,
          entity_name: org.entity_name || "",
          entity_type: org.entity_type || "",
          entity_key: org.entity_key || "",
          address: org.address || "No address specified",
          description: org.description || "No description specified",
          current_content: org.currentLimit?.content || 0,
          current_playlist: org.currentLimit?.playlist || 0,
          current_group: org.currentLimit?.group || 0,
          current_screen: org.currentLimit?.screen || 0,
          max_screen: org.maxLimit?.screen || 0,
          max_content: org.maxLimit?.content || 0,
          max_playlist: org.maxLimit?.playlist || 0,
          max_group: org.maxLimit?.group || 0,
          maintainer_users: org.maintainer_users || [],
          admins: org.admins || [],
        }))
      : [];
  } catch (error: any) {
    toast.error(`Error fetching organizations: ${error.message || "An unexpected error occurred"}`);
    return [];
  }
};

export const addUser = (
  adminData: Organization[],
  setAdminData: React.Dispatch<React.SetStateAction<Organization[]>>,
  orgId: string,
  userData: UserData
): void => {
  setAdminData((prevOrgs) =>
    prevOrgs.map((org) =>
      org.id === orgId
        ? {
            ...org,
            maintainer_users: [
              ...org.maintainer_users,
              {
                name: `${userData.first_name} ${userData.last_name}`.trim(),
                email: userData.email,
                role_name: "User",
                user_uuid: Date.now().toString(), // Temporary ID until refresh
              },
            ],
          }
        : org
    )
  );
};

export const updateUser = (
  adminData: Organization[],
  setAdminData: React.Dispatch<React.SetStateAction<Organization[]>>,
  orgId: string,
  oldEmail: string,
  updatedUserData: UserData
): void => {
  setAdminData((prevOrgs) =>
    prevOrgs.map((org) =>
      org.id === orgId
        ? {
            ...org,
            maintainer_users: org.maintainer_users.map((user) =>
              user.email === oldEmail
                ? {
                    ...user,
                    name: `${updatedUserData.first_name} ${updatedUserData.last_name}`.trim(),
                    email: updatedUserData.email,
                  }
                : user
            ),
          }
        : org
    )
  );
};

export const filterUsers = (users: User[], searchQuery: string): User[] => {
  if (!searchQuery.trim() || !users) return users || [];
  
  return users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
};