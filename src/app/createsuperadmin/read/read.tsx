"use client";

import { toast } from "react-hot-toast";

// Define interfaces for data structures
interface Organization {
  entity_uuid: string;
  name: string;
  description?: string | null;
  domain?: string | null;
  entity_type?: string;
  address_id?: number | null;
  logo_url?: string | null;
  superadmin_user?: User[];
  admin_users?: User[];
  maintainer_users?: User[];
}

interface User {
  user_uuid: string;
  name: string;
  email: string;
  role_name: string;
  role_id: number;
}

interface Role {
  id: number;
  name: string;
}

interface OrgUsers {
  entity_uuid: string;
  superadmin_user?: User[];
  admin_users?: User[];
  maintainer_users?: User[];
}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await fetch("/api/organization/getAllParentOrg", {
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
          ...org,
          superadmin_user: org.superadmin_user || [],
          admin_users: org.admin_users || [],
          maintainer_users: org.maintainer_users || [],
        }))
      : [];
  } catch (error: any) {
    toast.error(`Error fetching organizations: ${error.message || "An unexpected error occurred"}`);
    return [];
  }
};

export const fetchAllUsers = async (): Promise<OrgUsers[]> => {
  try {
    const response = await fetch("/api/organization/getAllUser", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await response.json();

    return Array.isArray(data.entities)
      ? data.entities.map((org: any) => ({
          entity_uuid: org.entity_uuid,
          superadmin_user: org.superadmin_user || [],
          admin_users: org.admin_users || [],
          maintainer_users: org.maintainer_users || [],
        }))
      : [];
  } catch (error: any) {
    toast.error(`Error fetching users: ${error.message || "An unexpected error occurred"}`);
    return [];
  }
};

export const fetchAllRole = async (): Promise<Role[]> => {
  try {
    const response = await fetch("/api/organization/fetchAllRole", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }

    const data = await response.json();

    return Array.isArray(data)
      ? data.map((role: any) => ({
          id: role.id,
          name: role.name,
        }))
      : [];
  } catch (error: any) {
    toast.error(`Error fetching roles: ${error.message || "An unexpected error occurred"}`);
    return [];
  }
};

export const addOrganization = (
  organizations: Organization[],
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
  organization: Organization
): void => {
  const newOrg: Organization = {
    ...organization,
    entity_uuid: organization.entity_uuid || Date.now().toString(),
    superadmin_user: organization.superadmin_user || [],
    admin_users: organization.admin_users || [],
    maintainer_users: organization.maintainer_users || [],
  };
  setOrganizations([...organizations, newOrg]);
};

export const addUserOrAdmin = (
  organizations: Organization[],
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
  orgId: string,
  user: User
): void => {
  setOrganizations(
    organizations.map((org) =>
      org.entity_uuid === orgId
        ? {
            ...org,
            superadmin_user:
              user.role_name === "Superadmin"
                ? [...(org.superadmin_user || []), user]
                : org.superadmin_user || [],
            admin_users:
              user.role_name === "Admin"
                ? [...(org.admin_users || []), user]
                : org.admin_users || [],
            maintainer_users:
              user.role_name === "Maintainer"
                ? [...(org.maintainer_users || []), user]
                : org.maintainer_users || [],
          }
        : org
    )
  );
};