// "use client";

// import { toast } from "react-hot-toast";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/Alert-Dialog";

// // Define interfaces for props
// interface DeleteConfirmationDialogProps {
//   isOpen: boolean;
//   organizationId: string | null;
//   organizationName: string | null;
//   onClose: () => void;
//   onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
// }

// interface DeleteUserConfirmationDialogProps {
//   isOpen: boolean;
//   userId: string | null;
//   userName: string | null;
//   userEmail: string | null;
//   userRole: string | null;
//   onClose: () => void;
//   onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
// }

// // Define interface for organization (simplified for deleteUserOrAdmin)
// interface Organization {
//   entity_uuid: string;
//   superadmin_user?: Array<{ user_uuid: string }>;
//   admin_users?: Array<{ user_uuid: string }>;
//   maintainer_users?: Array<{ user_uuid: string }>;
// }

// export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
//   isOpen,
//   organizationId,
//   organizationName,
//   onClose,
//   onConfirm,
// }) => {
//   return (
//     <AlertDialog open={isOpen} onOpenChange={onClose}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete the organization
//             <strong className="font-semibold"> "{organizationName || "Unknown"}"</strong>.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={onConfirm}
//             className="bg-red-600 hover:bg-red-700"
//           >
//             Delete
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export const DeleteUserConfirmationDialog: React.FC<DeleteUserConfirmationDialogProps> = ({
//   isOpen,
//   userId,
//   userName,
//   userEmail,
//   userRole,
//   onClose,
//   onConfirm,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <AlertDialog open={isOpen} onOpenChange={onClose}>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Delete {userRole || "User"}?</AlertDialogTitle>
//           <AlertDialogDescription>
//             Are you sure you want to delete this {userRole || "user"}?
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <div className="mt-2 p-3 border rounded-md bg-gray-50">
//           <span className="font-semibold block mb-2">
//             This will permanently remove:
//           </span>
//           <span className="block">Name: {userName || "Unknown"}</span>
//           <span className="block">Email: {userEmail || "Unknown"}</span>
//         </div>
//         <AlertDialogFooter>
//           <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
//           <AlertDialogAction
//             onClick={onConfirm}
//             className="bg-red-500 hover:bg-red-600"
//           >
//             Delete
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export const deleteOrganization = async (entity_uuid: string): Promise<boolean> => {
//   console.log("Deleting organization with ID:", entity_uuid);
//   try {
//     const response = await fetch(`/api/organization/deleteOrganization`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ _id: entity_uuid }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to delete organization");
//     }

//     toast.success("Organization deleted successfully");
//     return true;
//   } catch (error: any) {
//     toast.error(`Failed to delete organization: ${error.message || "An unexpected error occurred"}`);
//     return false;
//   }
// };

// export const deleteUserOrAdmin = async (
//   user_uuid: string,
//   setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>> | null,
//   orgId: string,
//   role: string,
//   index: number
// ): Promise<boolean> => {
//   try {
//     const response = await fetch(`/api/organization/deleteUsers`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ user_uuid }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to delete user");
//     }

//     if (setOrganizations) {
//       setOrganizations((prevOrgs) =>
//         prevOrgs.map((org) => {
//           if (org.entity_uuid === orgId) {
//             const updatedOrg = { ...org };
//             const roleKey =
//               role === "Superadmin"
//                 ? "superadmin_user"
//                 : role === "Admin"
//                 ? "admin_users"
//                 : "maintainer_users";

//             if (updatedOrg[roleKey]) {
//               updatedOrg[roleKey] = updatedOrg[roleKey]!.filter((_, i) => i !== index);
//             }

//             return updatedOrg;
//           }
//           return org;
//         })
//       );
//     }

//     return true;
//   } catch (error: any) {
//     toast.error(`Failed to delete ${role.toLowerCase()}: ${error.message || "An unexpected error occurred"}`);
//     return false;
//   }
// };



"use client";

import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/Alert-Dialog";

// Define interfaces for props
interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  organizationId: string | null;
  organizationName: string | null;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface DeleteUserConfirmationDialogProps {
  isOpen: boolean;
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Define interface for organization (simplified for deleteUserOrAdmin)
interface Organization {
  entity_uuid: string;
  superadmin_user?: Array<{ user_uuid: string }>;
  admin_users?: Array<{ user_uuid: string }>;
  maintainer_users?: Array<{ user_uuid: string }>;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  organizationId,
  organizationName,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the organization{" "}
            <strong className="font-semibold">"{organizationName || "Unknown"}"</strong> and all
            associated users and data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            Delete Organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const DeleteUserConfirmationDialog: React.FC<DeleteUserConfirmationDialogProps> = ({
  isOpen,
  userId,
  userName,
  userEmail,
  userRole,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {userRole || "User"}?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this {userRole?.toLowerCase() || "user"}? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 p-3 border rounded-md bg-gray-50">
          <span className="font-semibold block mb-2 text-gray-700">
            This will permanently remove:
          </span>
          <div className="space-y-1 text-sm text-gray-600">
            <div><span className="font-medium">Name:</span> {userName || "Unknown"}</div>
            <div><span className="font-medium">Email:</span> {userEmail || "Unknown"}</div>
            <div><span className="font-medium">Role:</span> {userRole || "Unknown"}</div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Delete {userRole || "User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// export const deleteOrganization = async (entity_uuid: string): Promise<boolean> => {
//   console.log("Deleting organization with ID:", entity_uuid);
  
//   if (!entity_uuid) {
//     toast.error("Organization ID is required");
//     return false;
//   }

//   try {
//     const response = await fetch(`/api/organization/deleteOrganization`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       credentials: "include",
//       body: JSON.stringify({ _id: entity_uuid }),
//     });

//     let data: any;
//     try {
//       data = await response.json();
//     } catch (e) {
//       console.error("Failed to parse response as JSON");
//       data = { message: "Invalid response from server" };
//     }

//     if (!response.ok) {
//       const errorMessage = data.message || data.detail || "Failed to delete organization";
//       throw new Error(errorMessage);
//     }

//     return true;
//   } catch (error: any) {
//     console.error("Error deleting organization:", error);
//     const errorMessage = error.message || "An unexpected error occurred";
//     toast.error(`Failed to delete organization: ${errorMessage}`);
//     return false;
//   }
// };


export const deleteOrganization = async (entity_uuid: string): Promise<boolean> => {
  // console.log("Deleting organization with ID:", entity_uuid);

  toast.loading("Deleting organization...");
  
  if (!entity_uuid) {
    toast.error("Organization ID is required");
    return false;
  }

  try {
    const response = await fetch(`/api/organization/deleteOrganization`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ _id: entity_uuid }), // ✅ This matches the fixed API
    });

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON");
      data = { message: "Invalid response from server" };
    }

    if (!response.ok) {
      const errorMessage = data.message || data.detail || "Failed to delete organization";
      throw new Error(errorMessage);
    }

    toast.success("Organization deleted successfully"); // ✅ Move success toast here
    return true;
  } catch (error: any) {
    console.error("Error deleting organization:", error);
    const errorMessage = error.message || "An unexpected error occurred";
    toast.error(`Failed to delete organization: ${errorMessage}`);
    return false;
  }
};


export const deleteUserOrAdmin = async (
  user_uuid: string,
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>> | null,
  orgId: string,
  role: string,
  index: number
): Promise<boolean> => {

  toast.loading(`Deleting ${role}...`);
  if (!user_uuid) {
    toast.error("User ID is required");
    return false;
  }

  if (!orgId) {
    toast.error("Organization ID is required");
    return false;
  }

  console.log('Attempting to delete user:', { user_uuid, orgId, role, index });

  try {
    const response = await fetch(`/api/organization/deleteUsers`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ user_uuid }),
    });

    let data: any;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse response as JSON");
      data = { message: "Invalid response from server" };
    }

    console.log('Delete user response:', { status: response.status, data });

    if (!response.ok) {
      const errorMessage = data.message || data.detail || "Failed to delete user";
      throw new Error(errorMessage);
    }

    // Update local state if setOrganizations is provided
    if (setOrganizations) {
      setOrganizations((prevOrgs) =>
        prevOrgs.map((org) => {
          if (org.entity_uuid === orgId) {
            const updatedOrg = { ...org };
            const roleKey =
              role === "Superadmin"
                ? "superadmin_user"
                : role === "Admin"
                ? "admin_users"
                : "maintainer_users";

            if (updatedOrg[roleKey]) {
              updatedOrg[roleKey] = updatedOrg[roleKey]!.filter((_, i) => i !== index);
            }

            return updatedOrg;
          }
          return org;
        })
      );
    }

    toast.success(`${role} deleted successfully`);
    return true;
  } catch (error: any) {
    console.error(`Error deleting ${role.toLowerCase()}:`, error);
    const errorMessage = error.message || "An unexpected error occurred";
    toast.error(`Failed to delete ${role.toLowerCase()}: ${errorMessage}`);
    return false;
  }
};
