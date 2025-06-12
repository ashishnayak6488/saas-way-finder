"use client";

import React, { useState } from "react";
import {
  Plus,
  Building as BuildingIcon,
  Upload,
  Trash2,
  GripVertical,
  AlertTriangle,
  MapPin,
  ChevronDown,
  ChevronRight,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import ConfirmationModal from "@/components/ConfirmationModal";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Building, Floor } from "@/types/building";

interface BuildingManagerProps {
  buildings: Building[];
  selectedBuilding: Building | null;
  onBuildingSelect: (building: Building) => void;
  onBuildingCreate: (name: string, address: string, description: string) => void; // Updated signature
  onBuildingUpdate: (buildingId: string, updates: { name?: string; address?: string; description?: string }) => void;
  onBuildingDelete: (buildingId: string) => void;
  onFloorAdd: (
    buildingId: string,
    floor: Omit<Floor, "floor_id" | "datetime" | "status" | "building_id">
  ) => void;
  onFloorUpdate: (
    buildingId: string,
    floorId: string,
    updates: { label?: string; order?: number; imageUrl?: string }
  ) => void;
  onFloorDelete: (buildingId: string, floorId: string) => void;
  onFloorReorder: (buildingId: string, floors: Floor[]) => void;
  onExit: () => void;
}

// Update all references from .id to .building_id and .floor_id throughout the component


export const BuildingManager: React.FC<BuildingManagerProps> = ({
  buildings,
  selectedBuilding,
  onBuildingSelect,
  onBuildingCreate,
  onBuildingDelete,
  onFloorAdd,
  onFloorDelete,
  onFloorReorder,
  onFloorUpdate,
  onBuildingUpdate,
  onExit,
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isFloorDialogOpen, setIsFloorDialogOpen] = useState<boolean>(false);
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(
    new Set()
  );
  const [newBuildingName, setNewBuildingName] = useState<string>("");
  const [newBuildingAddress, setNewBuildingAddress] = useState<string>("");
  const [newBuildingDescription, setNewBuildingDescription] =
    useState<string>("");
  const [newFloorLabel, setNewFloorLabel] = useState<string>("");
  const [newFloorOrder, setNewFloorOrder] = useState<number>(0);
  const [newFloorImage, setNewFloorImage] = useState<string | null>(null);
  const [currentBuildingForFloor, setCurrentBuildingForFloor] =
    useState<Building | null>(null);

  // Add these state variables after existing ones
  const [isEditBuildingDialogOpen, setIsEditBuildingDialogOpen] =
    useState<boolean>(false);
  const [isEditFloorDialogOpen, setIsEditFloorDialogOpen] =
    useState<boolean>(false);

  // Edit building states
  const [editBuildingData, setEditBuildingData] = useState<Building | null>(
    null
  );
  const [editBuildingName, setEditBuildingName] = useState<string>("");
  const [editBuildingAddress, setEditBuildingAddress] = useState<string>("");
  const [editBuildingDescription, setEditBuildingDescription] =
    useState<string>("");

  // Edit floor states
  const [editFloorData, setEditFloorData] = useState<Floor | null>(null);
  const [editFloorLabel, setEditFloorLabel] = useState<string>("");
  const [editFloorOrder, setEditFloorOrder] = useState<number>(1);
  const [editFloorImage, setEditFloorImage] = useState<string | null>(null);
  const [editFloorBuildingId, setEditFloorBuildingId] = useState<string>("");

  // Add state for confirmation modal in BuildingManager component
const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);
const [buildingToDelete, setBuildingToDelete] = useState<Building | null>(null);
// Add additional state for floor deletion confirmation
const [showFloorDeleteConfirmation, setShowFloorDeleteConfirmation] = useState<boolean>(false);
const [floorToDelete, setFloorToDelete] = useState<{ floor: Floor; buildingId: string } | null>(null);

  const handleCreateBuilding = () => {
    if (newBuildingName.trim()) {
      onBuildingCreate(
        newBuildingName.trim(),
        newBuildingAddress.trim(),
        newBuildingDescription.trim()
      );
      setNewBuildingName("");
      setNewBuildingAddress("");
      setNewBuildingDescription("");
      setIsCreateDialogOpen(false);
    }
  };

  // Add these handler functions
  const handleEditBuilding = (building: Building) => {
    setEditBuildingData(building);
    setEditBuildingName(building.name);
    setEditBuildingAddress(building.address);
    setEditBuildingDescription(building.description);
    setIsEditBuildingDialogOpen(true);
  };

  const handleUpdateBuilding = () => {
    if (editBuildingData && editBuildingName.trim()) {
      onBuildingUpdate(editBuildingData.building_id, {
        name: editBuildingName.trim(),
        address: editBuildingAddress.trim(),
        description: editBuildingDescription.trim(),
      });
      setIsEditBuildingDialogOpen(false);
      setEditBuildingData(null);
    }
  };

  const handleEditFloor = (building: Building, floor: Floor) => {
    setEditFloorData(floor);
    setEditFloorBuildingId(building.building_id);
    setEditFloorLabel(floor.label);
    setEditFloorOrder(floor.order);
    setEditFloorImage(floor.imageUrl);
    setIsEditFloorDialogOpen(true);
  };

  const handleUpdateFloor = () => {
    if (
      editFloorData &&
      editFloorBuildingId &&
      editFloorLabel.trim() &&
      editFloorImage
    ) {
      onFloorUpdate(editFloorBuildingId, editFloorData.floor_id, {
        label: editFloorLabel.trim(),
        order: editFloorOrder,
        imageUrl: editFloorImage,
      });
      setIsEditFloorDialogOpen(false);
      setEditFloorData(null);
      setEditFloorBuildingId("");
    }
  };

  // Update the existing handleImageUpload function
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (isEdit) {
          setEditFloorImage(e.target?.result as string);
        } else {
          setNewFloorImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFloor = () => {
    if (currentBuildingForFloor && newFloorLabel.trim() && newFloorImage) {
      onFloorAdd(currentBuildingForFloor.building_id, {
        label: newFloorLabel.trim(),
        order: newFloorOrder,
        imageUrl: newFloorImage,
      });
      setNewFloorLabel("");
      setNewFloorOrder(1);
      setNewFloorImage(null);
      setCurrentBuildingForFloor(null);
      setIsFloorDialogOpen(false);
    }
  };

  const toggleBuildingExpansion = (buildingId: string) => {
    const newExpanded = new Set(expandedBuildings);
    if (newExpanded.has(buildingId)) {
      newExpanded.delete(buildingId);
    } else {
      newExpanded.add(buildingId);
    }
    setExpandedBuildings(newExpanded);
  };

  const openFloorDialog = (building: Building) => {
    setCurrentBuildingForFloor(building);
    setNewFloorOrder(building.floors.length + 1);
    setIsFloorDialogOpen(true);
  };


  // Add confirmation handler function
const handleDeleteClick = (building: Building) => {
  setBuildingToDelete(building);
  setShowDeleteConfirmation(true);
};

const handleConfirmDelete = () => {
  if (buildingToDelete) {
    onBuildingDelete(buildingToDelete.building_id);
    setShowDeleteConfirmation(false);
    setBuildingToDelete(null);
  }
};

const handleCancelDelete = () => {
  setShowDeleteConfirmation(false);
  setBuildingToDelete(null);
};



// Add floor delete confirmation handlers
const handleFloorDeleteClick = (building: Building, floor: Floor) => {
  setFloorToDelete({ floor, buildingId: building.building_id });
  setShowFloorDeleteConfirmation(true);
};

const handleConfirmFloorDelete = () => {
  if (floorToDelete) {
    onFloorDelete(floorToDelete.buildingId, floorToDelete.floor.floor_id);
    setShowFloorDeleteConfirmation(false);
    setFloorToDelete(null);
  }
};

const handleCancelFloorDelete = () => {
  setShowFloorDeleteConfirmation(false);
  setFloorToDelete(null);
};



  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Buildings</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your buildings and floor plans
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>New Building</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Building</DialogTitle>
              <DialogDescription>
                Add a new building to your wayfinding system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="building-name"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Building Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="building-name"
                  placeholder="e.g., Main Office Building"
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="building-address"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Address
                </Label>
                <Input
                  id="building-address"
                  placeholder="e.g., 123 Main St, City, State"
                  value={newBuildingAddress}
                  onChange={(e) => setNewBuildingAddress(e.target.value)}
                />
              </div>
              <div>
                <Label
                  htmlFor="building-description"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Description
                </Label>
                <Input
                  id="building-description"
                  placeholder="Brief description of the building"
                  value={newBuildingDescription}
                  onChange={(e) => setNewBuildingDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBuilding}
                disabled={!newBuildingName.trim()}
              >
                Create Building
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Building Dialog */}
        <Dialog
          open={isEditBuildingDialogOpen}
          onOpenChange={setIsEditBuildingDialogOpen}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Building</DialogTitle>
              <DialogDescription>Update building information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-building-name">Building Name *</Label>
                <Input
                  id="edit-building-name"
                  value={editBuildingName}
                  onChange={(e) => setEditBuildingName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-building-address">Address</Label>
                <Input
                  id="edit-building-address"
                  value={editBuildingAddress}
                  onChange={(e) => setEditBuildingAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-building-description">Description</Label>
                <Input
                  id="edit-building-description"
                  value={editBuildingDescription}
                  onChange={(e) => setEditBuildingDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditBuildingDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateBuilding}
                disabled={!editBuildingName.trim()}
              >
                Update Building
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Buildings List */}
      {buildings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BuildingIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No buildings yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first building to get started with floor management.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Building
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {buildings.map((building) => (
            <Card key={building.building_id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center space-x-3 cursor-pointer flex-1"
                    onClick={() => toggleBuildingExpansion(building.building_id)}
                  >
                    {/* {expandedBuildings.has(building.building_id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )} */}
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BuildingIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {building.name}
                      </h3>
                      {building.address && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {building.address}
                        </div>
                      )}
                      {building.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {building.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{building.floors.length} floors</span>
                        <span>
                          Created{" "}
                          {new Date(building.datetime).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {expandedBuildings.has(building.building_id) && (
                      <Button
                        // size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFloorDialog(building);
                        }}
                        // className="text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Floor
                      </Button>
                    )}

                    <div className="flex">
                      <Button
                        variant="ghost"
                        // size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditBuilding(building);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit
                          size={24}
                          // className="h-6 w-6"
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        // size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // onBuildingDelete(building.building_id);
                          handleDeleteClick(building);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2
                          size={24}
                          // className="h-4 w-4"
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Floors Section - Only show when expanded */}
              {expandedBuildings.has(building.building_id) && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Floors ({building.floors.length})
                    </h4>
                    {building.floors.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        <div className="text-sm">No floors added yet</div>
                        <div className="text-xs mt-1">
                          Click "Add Floor" to get started
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {building.floors
                          .sort((a, b) => a.order - b.order)
                          .map((floor) => (
                            <div
                              key={floor.floor_id}
                              className="border rounded-lg p-3 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-sm">
                                    {floor.label}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleEditFloor(building, floor)
                                    }
                                    className="text-blue-600 hover:text-blue-700 h-6 w-6 p-0"
                                  >
                                    <Edit
                                      size={20}
                                      // className="h-3 w-3"
                                    />
                                  </Button>

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      // onFloorDelete(building.building_id, floor.floor_id)
                                      handleFloorDeleteClick(building, floor)
                                    }
                                    className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                                  >
                                    <Trash2
                                      size={20}
                                      // className="h-3 w-3"
                                    />
                                  </Button>
                                </div>
                              </div>
                              <div className="w-full h-40 rounded border overflow-hidden mb-2">
                                <img
                                  src={floor.imageUrl}
                                  alt={floor.label}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-xs text-gray-500">
                                Order: {floor.order}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Floor Dialog */}
      <Dialog open={isFloorDialogOpen} onOpenChange={setIsFloorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add Floor to {currentBuildingForFloor?.name}
            </DialogTitle>
            <DialogDescription>
              Upload a floor plan image and provide details for the new floor.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="floor-label"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Floor Label <span className="text-red-500">*</span>
              </Label>
              <Input
                id="floor-label"
                placeholder="e.g., Ground Floor, Floor 1, Basement"
                value={newFloorLabel}
                onChange={(e) => setNewFloorLabel(e.target.value)}
              />
            </div>
            <div>
              <Label
                htmlFor="floor-order"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Floor Order
              </Label>
              <Input
                id="floor-order"
                type="number"
                value={newFloorOrder}
                onChange={(e) =>
                  setNewFloorOrder(parseInt(e.target.value, 10) || 0)
                }
              />
            </div>
            <div>
              <Label
                htmlFor="floor-image"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Floor Plan Image <span className="text-red-500">*</span>
              </Label>
              <input
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-3 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 border border-gray-300
                focus:outline-none focus:ring-1 focus:ring-blue-500
                focus:border-blue-500 rounded-lg"
                id="floor-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {newFloorImage && (
                <div className="mt-2">
                  <img
                    src={newFloorImage}
                    alt="Floor preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFloorDialogOpen(false);
                setNewFloorLabel("");
                setNewFloorImage(null);
                setCurrentBuildingForFloor(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFloor}
              disabled={!newFloorLabel.trim() || !newFloorImage}
            >
              Add Floor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* // Add these dialogs before the closing </div> of the component */}

      {/* Edit Floor Dialog */}
      <Dialog
        open={isEditFloorDialogOpen}
        onOpenChange={setIsEditFloorDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Floor</DialogTitle>
            <DialogDescription>
              Update floor information and plan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-floor-label">Floor Label *</Label>
              <Input
                id="edit-floor-label"
                value={editFloorLabel}
                onChange={(e) => setEditFloorLabel(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-floor-order">Floor Order</Label>
              <Input
                id="edit-floor-order"
                type="number"
                value={editFloorOrder}
                onChange={(e) =>
                  setEditFloorOrder(parseInt(e.target.value, 10) || 1)
                }
              />
            </div>
            <div>
              <Label htmlFor="edit-floor-image">Floor Plan Image</Label>
              <input
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-3 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 border border-gray-300
          focus:outline-none focus:ring-1 focus:ring-blue-500
          focus:border-blue-500 rounded-lg"
                id="edit-floor-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, true)}
              />
              {editFloorImage && (
                <div className="mt-2">
                  <img
                    src={editFloorImage}
                    alt="Floor preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditFloorDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateFloor}
              disabled={!editFloorLabel.trim() || !editFloorImage}
            >
              Update Floor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {showDeleteConfirmation && buildingToDelete && (
        <ConfirmationModal
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete "${buildingToDelete.name}"? This action will also delete all floors associated with this building and cannot be undone.`}
        />
      )}

      {/* // Add the floor delete confirmation modal */}
      {showFloorDeleteConfirmation && floorToDelete && (
        <ConfirmationModal
          onClose={handleCancelFloorDelete}
          onConfirm={handleConfirmFloorDelete}
          message={`Are you sure you want to delete floor "${floorToDelete.floor.label}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
};
