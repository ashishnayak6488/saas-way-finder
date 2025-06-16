
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Added for navigation after logout
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "react-hot-toast"; // Added Toaster for notifications
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LogoutConfirmationModal from "@/components/LogoutConfirmationModal";
import { BuildingManager } from "@/components/BuildingManager";
import { Building, Floor } from "@/types/building";
import {
  loadBuildingsFromStorage,
  saveBuildingsToStorage,
  createBuilding,
  addFloorToBuilding,
  removeFloorFromBuilding,
  reorderFloorsInBuilding,
  deleteBuilding,
} from "@/lib/buildingData";

interface User {
  role_id: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<boolean>;
}

export default function BuildingsPage() {
  const router = useRouter(); // Added for navigation
  const [activeComponent, setActiveComponent] = useState<string>("buildings");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState<boolean>(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const { user, logout } = useAuth() as AuthContextType;
  const userRole = user?.role_id || "user";

  // Load buildings on component mount
  useEffect(() => {
    try {
      const savedBuildings = loadBuildingsFromStorage() || []; // Fallback to empty array
      setBuildings(savedBuildings);
      setActiveComponent("buildings");
      localStorage.setItem("activeComponent", "buildings");
    } catch (error) {
      console.error("Failed to load buildings:", error);
      toast.error("Failed to load buildings data");
      setBuildings([]); // Fallback to empty array on error
    } finally {
      const timer = setTimeout(() => setIsLoading(false), 300);
      return () => clearTimeout(timer);
    }
    // Added userRole to dependencies since it's used in the effect
  }, [userRole]);

  // Save buildings whenever they change
  useEffect(() => {
    try {
      saveBuildingsToStorage(buildings);
    } catch (error) {
      console.error("Failed to save buildings:", error);
      toast.error("Failed to save buildings data");
    }
  }, [buildings]);

  const handleComponentChange = (componentId: string) => {
    setActiveComponent(componentId);
    localStorage.setItem("activeComponent", componentId);
  };

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = async () => {
    const loadingToast = toast.loading("Logging out...");
    try {
      const success = await logout();
      if (success) {
        toast.success("Logged out successfully", { id: loadingToast });
        localStorage.clear(); // Clear all auth data
        document.cookie = "digital-signage=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Clear cookie
        localStorage.setItem("activeComponent", "dashboard");
        router.push("/login"); // Navigate to login page
      } else {
        toast.error("Failed to log out", { id: loadingToast });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred during logout";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setShowLogoutConfirmation(false);
    }
  };

  // Building management handlers
  const handleBuildingCreate = (name: string) => {
    if (!name.trim()) {
      toast.error("Building name is required");
      return;
    }
    try {
      const newBuilding = createBuilding(name);
      setBuildings((prev) => [...prev, newBuilding]);
      setSelectedBuilding(newBuilding);
      toast.success(`Building "${name}" created successfully`);
    } catch (error) {
      console.error("Failed to create building:", error);
      toast.error("Failed to create building");
    }
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
  };

  const handleBuildingDelete = (buildingId: string) => {
    try {
      const buildingToDelete = buildings.find((b) => b.id === buildingId);
      if (!buildingToDelete) {
        toast.error("Building not found");
        return;
      }
      const updatedBuildings = deleteBuilding(buildings, buildingId);
      setBuildings(updatedBuildings);
      if (selectedBuilding?.id === buildingId) {
        setSelectedBuilding(null);
      }
      toast.success(`Building "${buildingToDelete.name}" deleted successfully`);
    } catch (error) {
      console.error("Failed to delete building:", error);
      toast.error("Failed to delete building");
    }
  };

  const handleFloorAdd = (buildingId: string, floor: Floor) => {
    if (!floor.name.trim()) {
      toast.error("Floor name is required");
      return;
    }
    try {
      const updatedBuildings = addFloorToBuilding(buildings, buildingId, floor);
      setBuildings(updatedBuildings);
      toast.success(`Floor "${floor.name}" added to building "${selectedBuilding?.name}"`);
    } catch (error) {
      console.error("Failed to add floor:", error);
      toast.error("Failed to add floor");
    }
  };

  const handleFloorRemove = (buildingId: string, floorId: string) => {
    try {
      const updatedBuildings = removeFloorFromBuilding(buildings, buildingId, floorId);
      setBuildings(updatedBuildings);
      toast.success(`Floor removed from building "${selectedBuilding?.name}"`);
    } catch (error) {
      console.error("Failed to remove floor:", error);
      toast.error("Failed to remove floor");
    }
  };

  const handleFloorReorder = (buildingId: string, newOrder: string[]) => {
    try {
      const updatedBuildings = reorderFloorsInBuilding(buildings, buildingId, newOrder);
      setBuildings(updatedBuildings);
      toast.success(`Floors reordered in building "${selectedBuilding?.name}"`);
    } catch (error) {
      console.error("Failed to reorder floors:", error);
      toast.error("Failed to reorder floors");
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <Toaster position="top-right" /> {/* Added Toaster for notifications */}
      <DashboardLayout
        userRole={userRole}
        activeComponent={activeComponent}
        handleComponentChange={handleComponentChange}
        handleLogout={handleLogout}
      >
        {/* Buildings Content */}
        <div className="h-full">
          <BuildingManager
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            handleBuildingCreate={handleBuildingCreate}
            handleBuildingSelect={handleBuildingSelect}
            handleBuildingDelete={handleBuildingDelete}
            handleFloorAdd={handleFloorAdd}
            handleFloorRemove={handleFloorRemove}
            handleFloorReorder={handleFloorReorder}
          />
        </div>

        {showLogoutConfirmation && (
          <LogoutConfirmationModal
            onClose={() => setShowLogoutConfirmation(false)}
            onConfirm={confirmLogout}
            message="Are you sure you want to log out?"
          />
        )}
      </DashboardLayout>
    </>
  );
}
