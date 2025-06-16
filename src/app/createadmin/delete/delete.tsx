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

// TypeScript Interfaces
interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  organizationId: string | null;
  organizationName: string | null;
  onClose: () => void;
  onConfirm: (e: React.MouseEvent) => Promise<void>;
}

export const DeleteConfirmationDialog: React.FC<
  DeleteConfirmationDialogProps
> = ({ isOpen, organizationName, onClose, onConfirm }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            organization
            <strong className="font-semibold"> &quot;{organizationName}&quot;</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const deleteOrganization = async (
  entity_uuid: string
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/organization/deleteOrganization`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: entity_uuid }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete organization");
    }

    toast.success("Organization deleted successfully");
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(`Failed to delete organization: ${errorMessage}`);
    return false;
  }
};

export const deleteUserOrAdmin = async (
  user_uuid: string,
  // setOrganizations?: React.Dispatch<React.SetStateAction<any[]>>,
  // orgId?: string | null,
  // userRole?: string,
  // index?: number | null
): Promise<boolean> => {
  try {
    const response = await fetch(`/api/organization/deleteUsers`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_uuid }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user");
    }

    toast.success("User deleted successfully");
    return true;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(`Failed to delete user: ${errorMessage}`);
    return false;
  }
};
