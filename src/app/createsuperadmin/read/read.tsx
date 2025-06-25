// "use client";

// import { toast } from "react-hot-toast";

// // Define interfaces for data structures
// interface Organization {
//   entity_uuid: string;
//   name: string;
//   description?: string | null;
//   domain?: string | null;
//   entity_type?: string;
//   address_id?: number | null;
//   logo_url?: string | null;
//   superadmin_user?: User[];
//   admin_users?: User[];
//   maintainer_users?: User[];
// }

// interface User {
//   user_uuid: string;
//   name: string;
//   email: string;
//   role_name: string;
//   role_id: number;
// }

// interface Role {
//   id: number;
//   name: string;
// }

// interface OrgUsers {
//   entity_uuid: string;
//   superadmin_user?: User[];
//   admin_users?: User[];
//   maintainer_users?: User[];
// }

// export const fetchOrganizations = async (): Promise<Organization[]> => {
//   try {
//     const response = await fetch("/api/organization/getAllParentOrg", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch organizations");
//     }

//     const data = await response.json();

//     return Array.isArray(data.entities)
//       ? data.entities.map((org: any) => ({
//           ...org,
//           superadmin_user: org.superadmin_user || [],
//           admin_users: org.admin_users || [],
//           maintainer_users: org.maintainer_users || [],
//         }))
//       : [];
//   } catch (error: any) {
//     toast.error(`Error fetching organizations: ${error.message || "An unexpected error occurred"}`);
//     return [];
//   }
// };

// export const fetchAllUsers = async (): Promise<OrgUsers[]> => {
//   try {
//     const response = await fetch("/api/organization/getAllUser", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch users");
//     }

//     const data = await response.json();

//     return Array.isArray(data.entities)
//       ? data.entities.map((org: any) => ({
//           entity_uuid: org.entity_uuid,
//           superadmin_user: org.superadmin_user || [],
//           admin_users: org.admin_users || [],
//           maintainer_users: org.maintainer_users || [],
//         }))
//       : [];
//   } catch (error: any) {
//     toast.error(`Error fetching users: ${error.message || "An unexpected error occurred"}`);
//     return [];
//   }
// };

// export const fetchAllRole = async (): Promise<Role[]> => {
//   try {
//     const response = await fetch("/api/organization/fetchAllRole", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch roles");
//     }

//     const data = await response.json();

//     return Array.isArray(data)
//       ? data.map((role: any) => ({
//           id: role.id,
//           name: role.name,
//         }))
//       : [];
//   } catch (error: any) {
//     toast.error(`Error fetching roles: ${error.message || "An unexpected error occurred"}`);
//     return [];
//   }
// };

// export const addOrganization = (
//   organizations: Organization[],
//   setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
//   organization: Organization
// ): void => {
//   const newOrg: Organization = {
//     ...organization,
//     entity_uuid: organization.entity_uuid || Date.now().toString(),
//     superadmin_user: organization.superadmin_user || [],
//     admin_users: organization.admin_users || [],
//     maintainer_users: organization.maintainer_users || [],
//   };
//   setOrganizations([...organizations, newOrg]);
// };

// export const addUserOrAdmin = (
//   organizations: Organization[],
//   setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
//   orgId: string,
//   user: User
// ): void => {
//   setOrganizations(
//     organizations.map((org) =>
//       org.entity_uuid === orgId
//         ? {
//             ...org,
//             superadmin_user:
//               user.role_name === "Superadmin"
//                 ? [...(org.superadmin_user || []), user]
//                 : org.superadmin_user || [],
//             admin_users:
//               user.role_name === "Admin"
//                 ? [...(org.admin_users || []), user]
//                 : org.admin_users || [],
//             maintainer_users:
//               user.role_name === "Maintainer"
//                 ? [...(org.maintainer_users || []), user]
//                 : org.maintainer_users || [],
//           }
//         : org
//     )
//   );
// };






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
  username?: string;
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

// API Response interfaces
interface OrganizationApiResponse {
  entities?: Organization[];
  data?: Organization[];
  success?: boolean;
  message?: string;
}

interface UsersApiResponse {
  entities?: OrgUsers[];
  data?: OrgUsers[];
  success?: boolean;
  message?: string;
}

interface RolesApiResponse extends Array<Role> {}

export const fetchOrganizations = async (): Promise<Organization[]> => {
  try {
    const response = await fetch("/api/organization/getAllParentOrg", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch organizations:", response.status, errorText);
      throw new Error(`Failed to fetch organizations: ${response.status} ${response.statusText}`);
    }

    const data: OrganizationApiResponse = await response.json();

    // Handle different response structures
    const organizations = data.entities || data.data || [];
    
    if (!Array.isArray(organizations)) {
      console.error("Invalid organizations data structure:", data);
      return [];
    }

    return organizations.map((org: any) => ({
      entity_uuid: org.entity_uuid,
      name: org.name || "",
      description: org.description || null,
      domain: org.domain || null,
      entity_type: org.entity_type || "parent",
      address_id: org.address_id || null,
      logo_url: org.logo_url || null,
      superadmin_user: org.superadmin_user || [],
      admin_users: org.admin_users || [],
      maintainer_users: org.maintainer_users || [],
    }));
  } catch (error: any) {
    console.error("Error fetching organizations:", error);
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
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to fetch users:", response.status, errorText);
      throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
    }

    const data: UsersApiResponse = await response.json();

    // Handle different response structures
    const users = data.entities || data.data || [];
    
    if (!Array.isArray(users)) {
      console.error("Invalid users data structure:", data);
      return [];
    }

    return users.map((org: any) => ({
      entity_uuid: org.entity_uuid,
      superadmin_user: Array.isArray(org.superadmin_user) ? org.superadmin_user.map((user: any) => ({
        user_uuid: user.user_uuid,
        name: user.name || "",
        email: user.email || "",
        username: user.username || user.email || "",
        role_name: user.role_name || "Superadmin",
        role_id: user.role_id || 1,
      })) : [],
      admin_users: Array.isArray(org.admin_users) ? org.admin_users.map((user: any) => ({
        user_uuid: user.user_uuid,
        name: user.name || "",
        email: user.email || "",
        username: user.username || user.email || "",
        role_name: user.role_name || "Admin",
        role_id: user.role_id || 2,
      })) : [],
      maintainer_users: Array.isArray(org.maintainer_users) ? org.maintainer_users.map((user: any) => ({
        user_uuid: user.user_uuid,
        name: user.name || "",
        email: user.email || "",
        username: user.username || user.email || "",
        role_name: user.role_name || "Maintainer",
        role_id: user.role_id || 3,
      })) : [],
    }));
  } catch (error: any) {
    console.error("Error fetching users:", error);
    toast.error(`Error fetching users: ${error.message || "An unexpected error occurred"}`);
    return [];
  }
};

// export const fetchAllRole = async (): Promise<Role[]> => {
//   try {
//     const response = await fetch("/api/organization/fetchAllRole", {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Failed to fetch roles:", response.status, errorText);
//       throw new Error(`Failed to fetch roles: ${response.status} ${response.statusText}`);
//     }

//     const data: RolesApiResponse = await response.json();

//     if (!Array.isArray(data)) {
//       console.error("Invalid roles data structure:", data);
//       return [];
//     }

//     return data.map((role: any) => ({
//       id: role.id || 0,
//       name: role.name || "",
//     }));
//   } catch (error: any) {
//     console.error("Error fetching roles:", error);
//     toast.error(`Error fetching roles: ${error.message || "An unexpected error occurred"}`);
//     return [];
//   }
// };

// Helper function to add organization to state


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
  
  setOrganizations((prev) => [...prev, newOrg]);
};

// Helper function to add user or admin to organization
export const addUserOrAdmin = (
  organizations: Organization[],
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
  orgId: string,
  user: User
): void => {
  setOrganizations((prevOrgs) =>
    prevOrgs.map((org) => {
      if (org.entity_uuid === orgId) {
        const updatedOrg = { ...org };
        
        // Add user to appropriate role array based on role_name
        switch (user.role_name) {
          case "Superadmin":
            updatedOrg.superadmin_user = [...(org.superadmin_user || []), user];
            break;
          case "Admin":
            updatedOrg.admin_users = [...(org.admin_users || []), user];
            break;
          case "Maintainer":
            updatedOrg.maintainer_users = [...(org.maintainer_users || []), user];
            break;
          default:
            console.warn(`Unknown role: ${user.role_name}`);
            break;
        }
        
        return updatedOrg;
      }
      return org;
    })
  );
};

// Helper function to remove user from organization
export const removeUserFromOrganization = (
  organizations: Organization[],
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
  orgId: string,
  userId: string,
  role: string
): void => {
  setOrganizations((prevOrgs) =>
    prevOrgs.map((org) => {
      if (org.entity_uuid === orgId) {
        const updatedOrg = { ...org };
        
        switch (role) {
          case "Superadmin":
            updatedOrg.superadmin_user = (org.superadmin_user || []).filter(
              (user) => user.user_uuid !== userId
            );
            break;
          case "Admin":
            updatedOrg.admin_users = (org.admin_users || []).filter(
              (user) => user.user_uuid !== userId
            );
            break;
          case "Maintainer":
            updatedOrg.maintainer_users = (org.maintainer_users || []).filter(
              (user) => user.user_uuid !== userId
            );
            break;
          default:
            console.warn(`Unknown role: ${role}`);
            break;
        }
        
        return updatedOrg;
      }
      return org;
    })
  );
};

// Helper function to update organization in state
export const updateOrganizationInState = (
  organizations: Organization[],
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>,
  updatedOrg: Organization
): void => {
  setOrganizations((prevOrgs) =>
    prevOrgs.map((org) =>
      org.entity_uuid === updatedOrg.entity_uuid ? updatedOrg : org
    )
  );
};
