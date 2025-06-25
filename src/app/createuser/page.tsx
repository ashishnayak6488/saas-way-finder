"use client";

import { Button } from "@/components/ui/Button";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Plus,
  User,
  AlertCircle,
  BadgeHelp,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";
// Import components from separated files
import { CreateUserOrAdmin } from "./create/create";
import {
  fetchOrganizations,
  filterUsers,
  addUser,
  updateUser,
} from "./read/read";
import { deleteUser, DeleteConfirmationDialog } from "./delete/delete";

// Define interfaces
interface Organization {
  id: string;
  entity_name: string;
  entity_type: string;
  entity_key: string;
  address: string;
  description: string;
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
  password?: string;
  role_id: number;
  entity_uuid: string;
  provider?: string;
}

interface ModalState {
  isOpen: boolean;
  orgId: string | null;
  editUserData: User | null;
}

interface DeleteConfirmationState {
  isOpen: boolean;
  userId: string | null;
  userName: string | null;
}

const Page: React.FC = () => {
  const [adminData, setAdminData] = useState<Organization[]>([]);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    orgId: null,
    editUserData: null,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      isOpen: false,
      userId: null,
      userName: null,
    });

  const fetchOrganizationsData = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchOrganizations();
      setAdminData(data);
    } catch (error: any) {
      setError("Failed to load organizations. Please try again.");
      console.error("Error fetching organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationsData();
  }, []);

  const toggleExpand = (orgId: string): void => {
    setExpandedOrg(expandedOrg === orgId ? null : orgId);
  };

  const handleAddUser = (orgId: string, userData: UserData): void => {
    addUser(adminData, setAdminData, orgId, {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
    });
  };

  const handleUpdateUser = (
    orgId: string,
    oldEmail: string,
    updatedUserData: UserData
  ): void => {
    updateUser(adminData, setAdminData, orgId, oldEmail, {
      first_name: updatedUserData.first_name,
      last_name: updatedUserData.last_name,
      email: updatedUserData.email,
    });
  };

  const handleDeleteUser = (user_uuid: string, userName: string): void => {
    setDeleteConfirmation({
      isOpen: true,
      userId: user_uuid,
      userName,
    });
  };

  const confirmDeleteUser = async (userId: string): Promise<void> => {
    const success = await deleteUser(userId);
    if (success) {
      await fetchOrganizationsData();
    }
  };

  const editUser = (orgId: string, user: User): void => {
    setModalState({ isOpen: true, orgId, editUserData: user });
  };

  const openCreateUserModal = (orgId: string): void => {
    setModalState({ isOpen: true, orgId, editUserData: null });
  };

  const closeModal = (): void => {
    setModalState({ isOpen: false, orgId: null, editUserData: null });
  };

  const handleResetPassword = async (
    user_uuid: string,
    email: string
  ): Promise<void> => {
    try {
      toast.loading("Sending password reset email...");

      const response = await fetch("/api/otp_handling/requestPasswordReset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to send password reset email"
        );
      }

      toast.success("Password reset email sent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center mb-4">
          <AlertCircle className="h-6 w-6 mr-2" />
          <p>{error}</p>
        </div>
        <Button onClick={fetchOrganizationsData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-transparent shadow-sm p-4 sm:p-6 flex justify-between items-center">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
          Maintainer Management
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-2 sm:p-2">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((key) => (
                <div key={key}>
                  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : adminData.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <User size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-4">
                No organizations available for user management.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {adminData.map((org) => (
                <div
                  key={org.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300"
                >
                  <div
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(org.id)}
                  >
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {org.entity_name}
                      </h3>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        {org.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs sm:text-sm">
                        {org.maintainer_users?.length || 0} Users
                      </span>
                      <span className="text-gray-500">
                        {expandedOrg === org.id ? (
                          <ChevronUp size={24} className="text-blue-500" />
                        ) : (
                          <ChevronDown size={24} className="text-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>

                  {expandedOrg === org.id && (
                    <div className="p-4 sm:p-6 border-t border-gray-200">
                      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">
                            Remaining Contents
                          </p>
                          <p className="text-gray-700 capitalize">
                            {org.max_content - org.current_content} /{" "}
                            {org.max_content}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">
                            Remaining Playlists
                          </p>
                          <p className="text-gray-700 capitalize">
                            {org.max_playlist - org.current_playlist} /{" "}
                            {org.max_playlist}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">
                            Remaining Screens
                          </p>
                          <p className="text-gray-700 capitalize">
                            {org.max_screen - org.current_screen} /{" "}
                            {org.max_screen}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm text-gray-500 mb-1">
                            Remaining Groups
                          </p>
                          <p className="text-gray-700 capitalize">
                            {org.max_group - org.current_group} /{" "}
                            {org.max_group}
                          </p>
                        </div>
                      </div> */}
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6 p-4 sm:p-6 border-t border-gray-200">
                        <Button
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCreateUserModal(org.id);
                          }}
                        >
                          <Plus size={16} />
                          Create Maintainer
                        </Button>

                        <div className="relative w-full sm:w-64">
                          <Input
                            type="text"
                            placeholder="Search Maintainer..."
                            value={searchQuery}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setSearchQuery(e.target.value)}
                            className="pl-9 w-full"
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <User size={20} className="mr-2 text-blue-600" />
                        Maintainers
                      </h4>

                      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                        {org.maintainer_users &&
                        org.maintainer_users.length > 0 ? (
                          <table className="w-full border-collapse min-w-[600px]">
                            <thead>
                              <tr className="bg-gray-50 text-left">
                                <th className="text-xs sm:text-sm font-semibold text-gray-700 border-b">
                                  Name
                                </th>
                                <th className="text-xs sm:text-sm font-semibold text-gray-700 border-b">
                                  Email
                                </th>
                                <th className="text-xs sm:text-sm font-semibold text-gray-700 border-b">
                                  Role
                                </th>
                                <th className="text-xs sm:text-sm font-semibold text-gray-700 border-b">
                                  Reset Password
                                </th>
                                <th className="text-xs sm:text-sm font-semibold text-gray-700 border-b">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filterUsers(
                                org.maintainer_users,
                                searchQuery
                              ).map((user, index) => (
                                <tr
                                  key={user.user_uuid || index}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="p-3 text-sm text-gray-700">
                                    {user.name}
                                  </td>
                                  <td className="p-3 text-sm text-gray-700">
                                    {user.email}
                                  </td>
                                  <td className="p-3 text-sm text-gray-700">
                                    {user.role_name || "Maintainer"}
                                  </td>
                                  <td className="p-3 text-sm text-gray-700">
                                    <BadgeHelp
                                      // title="Request Reset Password"
                                      size={16}
                                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                                      onClick={() =>
                                        handleResetPassword(
                                          user.user_uuid,
                                          user.email
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="p-3">
                                    <div className="flex justify-center gap-3">
                                      {/* <button
                                        className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                                        title="Edit User"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          editUser(org.id, user);
                                        }}
                                      >
                                        <Edit
                                          size={18}
                                          className="text-blue-500 hover:text-blue-700"
                                        />
                                      </button> */}
                                      <button
                                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                        title="Delete User"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteUser(
                                            user.user_uuid,
                                            user.name
                                          );
                                        }}
                                      >
                                        <Trash2
                                          size={18}
                                          className="text-red-500 hover:text-red-700"
                                        />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-6 text-center">
                            <div className="text-gray-400 mb-3">
                              <User size={36} className="mx-auto" />
                            </div>
                            <p className="text-gray-500 mb-4">
                              {searchQuery
                                ? "No matching users found"
                                : "No users found for this organization"}
                            </p>
                            <Button
                              className="flex items-center gap-2 mx-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCreateUserModal(org.id);
                              }}
                            >
                              <Plus size={16} />
                              Add First User
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {modalState.isOpen && modalState.orgId && (
        <CreateUserOrAdmin
          orgId={modalState.orgId}
          onAddUser={(userData) => handleAddUser(modalState.orgId, userData)}
          onUpdateUser={handleUpdateUser}
          fetchOrganizationsData={fetchOrganizationsData}
          onClose={closeModal}
          editUserData={modalState.editUserData}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        userName={deleteConfirmation.userName}
        userId={deleteConfirmation.userId}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, userId: null, userName: null })
        }
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default Page;
