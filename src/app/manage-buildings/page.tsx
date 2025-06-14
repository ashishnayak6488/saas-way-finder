"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
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

export default function ManageBuildingsPage() {
  const [activeComponent, setActiveComponent] =
    useState<string>("manage-buildings");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] =
    useState<boolean>(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );

  const { user, logout } = useAuth() as AuthContextType;
  const userRole = user?.role_id || "user";

  // Load buildings on component mount
  useEffect(() => {
    const savedBuildings = loadBuildingsFromStorage();
    setBuildings(savedBuildings);

    setActiveComponent("manage-buildings");
    localStorage.setItem("activeComponent", "manage-buildings");

    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Save buildings whenever they change
  useEffect(() => {
    saveBuildingsToStorage(buildings);
  }, [buildings]);

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

  // Building management handlers
  const handleBuildingCreate = (name: string) => {
    const newBuilding = createBuilding(name);
    setBuildings([...buildings, newBuilding]);
    setSelectedBuilding(newBuilding);
    toast.success(`Building "${name}" created successfully`);
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
  };

  const handleBuildingDelete = (buildingId: string) => {
    const buildingToDelete = buildings.find((b) => b.id === buildingId);
    const updatedBuildings = deleteBuilding(buildings, buildingId);
    setBuildings(updatedBuildings);

    if (selectedBuilding?.id === buildingId) {
      setSelectedBuilding(null);
    }

    toast.success(`Building "${buildingToDelete?.name}" deleted successfully`);
  };

  const handleFloorAdd = (
    buildingId: string,
    floor: Omit<Floor, "id" | "createdAt">
  ) => {
    const updatedBuildings = addFloorToBuilding(buildings, buildingId, floor);
    setBuildings(updatedBuildings);

    const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
    if (updatedBuilding) {
      setSelectedBuilding(updatedBuilding);
    }

    toast.success(`Floor "${floor.label}" added successfully`);
  };

  const handleFloorDelete = (buildingId: string, floorId: string) => {
    const building = buildings.find((b) => b.id === buildingId);
    const floor = building?.floors.find((f) => f.id === floorId);

    const updatedBuildings = removeFloorFromBuilding(
      buildings,
      buildingId,
      floorId
    );
    setBuildings(updatedBuildings);

    const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
    if (updatedBuilding) {
      setSelectedBuilding(updatedBuilding);
    }

    toast.success(`Floor "${floor?.label}" deleted successfully`);
  };

  const handleFloorReorder = (buildingId: string, reorderedFloors: Floor[]) => {
    const updatedBuildings = reorderFloorsInBuilding(
      buildings,
      buildingId,
      reorderedFloors
    );
    setBuildings(updatedBuildings);

    const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
    if (updatedBuilding) {
      setSelectedBuilding(updatedBuilding);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <DashboardLayout
      userRole={userRole}
      activeComponent={activeComponent}
      handleComponentChange={handleComponentChange}
      handleLogout={handleLogout}
    >
      <div className="h-full">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Building Management
            </h1>
            <p className="text-gray-600">
              Create and manage buildings with multiple floors for your
              wayfinding system.
            </p>
          </div>

          <BuildingManager
            buildings={buildings}
            selectedBuilding={selectedBuilding}
            onBuildingSelect={handleBuildingSelect}
            onBuildingCreate={handleBuildingCreate}
            onBuildingDelete={handleBuildingDelete}
            onFloorAdd={handleFloorAdd}
            onFloorDelete={handleFloorDelete}
            onFloorReorder={handleFloorReorder}
            onExit={() => {
              // Navigate back to dashboard
              window.location.href = "/dashboard";
            }}
          />
        </div>
      </div>

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
