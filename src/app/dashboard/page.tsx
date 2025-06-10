"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboardComponents } from "@/components/dashboard/dashboardConfig";
import LogoutConfirmationModal from "@/components/LogoutConfirmationModal";

interface User {
  role_id: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<boolean>;
}

interface DashboardLayoutProps {
  userRole: string | undefined;
  activeComponent: string;
  handleComponentChange: (componentId: string) => void;
  handleLogout: () => void;
}

interface LogoutConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  message: string;
}

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] =
    useState<boolean>(false);
  const { user, logout } = useAuth() as AuthContextType;
  const userRole: string | undefined = user?.role_id;

  // Update active component from localStorage on client-side only
  useEffect(() => {
    const storedComponent = localStorage.getItem("activeComponent");
    if (storedComponent) {
      setActiveComponent(storedComponent);
    }
    // Simulate loading of dashboard components
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle component change
  const handleComponentChange = (componentId: string) => {
    setActiveComponent(componentId);
    localStorage.setItem("activeComponent", componentId);
  };

  // Handle logout
  const handleLogout = () => {
    // Show confirmation dialog instead of logging out immediately
    setShowLogoutConfirmation(true);
  };

  // Perform the actual logout
  const confirmLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        toast.success("Logged out successfully");
        localStorage.setItem("activeComponent", "dashboard");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    } finally {
      // Close the confirmation dialog
      setShowLogoutConfirmation(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Get components based on user role
  const components = getDashboardComponents(userRole);

  return (
    <DashboardLayout
      userRole={userRole}
      activeComponent={activeComponent}
      handleComponentChange={handleComponentChange}
      handleLogout={handleLogout}
    >
      {components[activeComponent]}
      {showLogoutConfirmation && (
        <LogoutConfirmationModal
          onClose={() => setShowLogoutConfirmation(false)}
          onConfirm={confirmLogout}
          message="Are you sure you want to log out?"
        />
      )}
    </DashboardLayout>
  );
}
