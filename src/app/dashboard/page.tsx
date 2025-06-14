
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { getDashboardComponents } from "@/components/dashboard/dashboardConfig";
import LogoutConfirmationModal from "@/components/LogoutConfirmationModal";

export default function Dashboard() {
  const [activeComponent, setActiveComponent] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] =
    useState<boolean>(false);

  const { user, logout } = useAuth();
  const userRole: string | undefined = user?.role_id;

  // Load saved active component from localStorage
  useEffect(() => {
    const storedComponent = localStorage.getItem("activeComponent");
    if (storedComponent) {
      setActiveComponent(storedComponent);
    }

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleComponentChange = (componentId: string) => {
    setActiveComponent(componentId);
    localStorage.setItem("activeComponent", componentId);
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

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
      setShowLogoutConfirmation(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

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
