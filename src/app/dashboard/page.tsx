
// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { toast } from "react-hot-toast";
// import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
// import DashboardLayout from "@/components/dashboard/DashboardLayout";
// import { getDashboardComponents } from "@/components/dashboard/dashboardConfig";
// import LogoutConfirmationModal from "@/components/LogoutConfirmationModal";

// export default function Dashboard() {
//   const [activeComponent, setActiveComponent] = useState<string>("dashboard");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [showLogoutConfirmation, setShowLogoutConfirmation] =
//     useState<boolean>(false);

//   const { user, logout } = useAuth();

//   console.log("User in Dashboard:", user);
//   const userRole: string | undefined = user?.role_id;
//   console.log("User Role in Dashboard:", userRole);


//   // Load saved active component from localStorage
//   useEffect(() => {
//     const storedComponent = localStorage.getItem("activeComponent");
//     if (storedComponent) {
//       setActiveComponent(storedComponent);
//     }

//     const timer = setTimeout(() => setIsLoading(false), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleComponentChange = (componentId: string) => {
//     setActiveComponent(componentId);
//     localStorage.setItem("activeComponent", componentId);
//   };

//   const handleLogout = () => {
//     setShowLogoutConfirmation(true);
//   };

//   const confirmLogout = async () => {
//     try {
//       const success = await logout();
//       if (success) {
//         toast.success("Logged out successfully");
//         localStorage.setItem("activeComponent", "dashboard");
//       } else {
//         toast.error("Failed to log out");
//       }
//     } catch (error) {
//       toast.error("An error occurred during logout");
//     } finally {
//       setShowLogoutConfirmation(false);
//     }
//   };

//   if (isLoading) {
//     return <DashboardSkeleton />;
//   }

//   const components = getDashboardComponents(userRole);

//   return (
//     <DashboardLayout
//       userRole={userRole}
//       activeComponent={activeComponent}
//       handleComponentChange={handleComponentChange}
//       handleLogout={handleLogout}
//     >
//       {components[activeComponent]}
//       {showLogoutConfirmation && (
//         <LogoutConfirmationModal
//           onClose={() => setShowLogoutConfirmation(false)}
//           onConfirm={confirmLogout}
//           message="Are you sure you want to log out?"
//         />
//       )}
//     </DashboardLayout>
//   );
// }


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
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false);

  const { user, logout, loading, authChecked, isAuthenticated } = useAuth();

  console.log("User in Dashboard:", user);
  console.log("Auth state:", { loading, authChecked, isAuthenticated });

  // Convert role_id to number for compatibility
  const userRole: number | undefined = user?.role_id ? parseInt(user.role_id) : undefined;
  console.log("User Role in Dashboard:", userRole);

  // Load saved active component from localStorage
  useEffect(() => {
    const storedComponent = localStorage.getItem("activeComponent");
    if (storedComponent) {
      setActiveComponent(storedComponent);
    }
  }, []);

  // Handle loading state based on auth status
  useEffect(() => {
    if (authChecked && !loading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [authChecked, loading]);

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
        localStorage.removeItem("activeComponent");
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
    } finally {
      setShowLogoutConfirmation(false);
    }
  };

  // Show loading skeleton while auth is being checked or user data is loading
  if (isLoading || loading || !authChecked || !user || userRole === undefined) {
    return <DashboardSkeleton />;
  }

  // Redirect to login if not authenticated (this should be handled by AuthContext, but as fallback)
  if (!isAuthenticated) {
    return <DashboardSkeleton />;
  }

  const components = getDashboardComponents(userRole as 1 | 2 | 3 | 4);

  return (
    <DashboardLayout
      userRole={userRole as 1 | 2 | 3 | 4}
      activeComponent={activeComponent}
      handleComponentChange={handleComponentChange}
      handleLogout={handleLogout}
    >
      {components[activeComponent] || components.dashboard}
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
