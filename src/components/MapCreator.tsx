"use client";
import React, { useState, useEffect } from "react";
import { MapCanvas } from "@/components/MapCanvas";
import { Toolbar } from "@/components/Toolbar";
import { PathManager } from "@/components/PathManager";
import { RouteSearch } from "@/components/RouteSearch";
import { LocationTagger, TaggedLocation } from "@/components/LocationTagger";
import { TagCreationDialog } from "@/components/TagCreationDialog";
import { ColorCustomizer } from "@/components/ColorCustomizer";
import {
  Navigation,
  MapPin,
  Route,
  Building as BuildingIcon,
  ArrowLeft,
  X,
} from "lucide-react";
// import { saveMapToStorage, SavedMap } from "@/lib/data";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { BuildingManager } from "@/components/BuildingManager";
import { FloorSelector } from "@/components/FloorSelector";
import { Building, Floor } from "@/types/building";
import {
  loadBuildingsFromAPI,
  saveBuildingsToStorage,
  createBuilding,
  addFloorToBuilding,
  removeFloorFromBuilding,
  reorderFloorsInBuilding,
  deleteBuilding,
} from "@/lib/buildingData";
import {
  VerticalConnectorTagger,
  VerticalConnector,
} from "@/components/VerticalConnectorTagger";
import { VerticalConnectorCreationDialog } from "@/components/VerticalConnectorCreationDialog";
import {
  loadVerticalConnectorsFromStorage,
  saveVerticalConnectorsToStorage,
  addVerticalConnector,
  // updateVerticalConnector,
  removeVerticalConnector,
  getConnectorsByFloor,
} from "@/lib/buildingData";

import {
  createLocation,
  CreateLocationRequest,
  getLocationsByFloorId,
  updateLocation,
  deleteLocation,
  LocationData,
  bulkUpdateLocations,
  BulkLocationUpdateData 
} from "@/lib/locationData";

import {
  createPath,
  getPathsByFloorId,
  updatePath,
  deletePath,
  togglePathPublishStatus,
  convertPathDataToFrontend,
  convertPathToBackend,
  PathData,
  CreatePathRequest,
  UpdatePathRequest,
} from "@/lib/pathData";

// Import the new backend API functions
import {
  createVerticalConnector,
  getVerticalConnectorsByFloorId,
  getVerticalConnectorsByBuildingId,
  getVerticalConnectorsBySharedId,
  updateVerticalConnector,
  deleteVerticalConnector,
  convertVerticalConnectorDataToFrontend,
  convertVerticalConnectorDataToBackend,
  VerticalConnectorData,
} from "@/lib/verticalConnectorData";

// import { bulkUpdateLocations, BulkLocationUpdateData } from "@/lib/locationData";

import toast from "react-hot-toast";

interface MapCreatorProps {
  selectedMap?: any | null;
  selectedRoute?: {
    path: Path;
    building: Building;
    floor: Floor;
  } | null;
  onClose: () => void;
}

interface PathSegment {
  id: string;
  floorId: string;
  points: { x: number; y: number }[];
  connectorId?: string;
}

interface Path {
  id: string;
  name: string;
  source: string;
  destination: string;
  points: { x: number; y: number }[];
  isPublished: boolean;
  sourceTagId?: string;
  destinationTagId?: string;
  floorId?: string;
  color?: string;
  isMultiFloor?: boolean;
  segments?: PathSegment[];
  sourceFloorId?: string;
  destinationFloorId?: string;
}

// Standardized map container dimensions
const MAP_CONTAINER_CONFIG = {
  aspectRatio: 16 / 9,
  maxWidth: 1200,
  maxHeight: 675,
  minWidth: 800,
  minHeight: 450,
};

const MapCreator: React.FC<MapCreatorProps> = ({ 
  selectedMap, 
  selectedRoute,
  onClose 
}) => {
  // Core state
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [mapName, setMapName] = useState<string>("");
  const [currentMapId, setCurrentMapId] = useState<string | null>(null);

  // Building and floor selection state
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");
  const [selectedFloorId, setSelectedFloorId] = useState<string>("");
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null
  );
  const [selectedFloor, setSelectedFloor] = useState<Floor | null>(null);

  // Path and editing state
  const [paths, setPaths] = useState<Path[]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    []
  );
  const [undoStack, setUndoStack] = useState<{ x: number; y: number }[][]>([]);
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isTagMode, setIsTagMode] = useState(false);
  const [selectedShapeType, setSelectedShapeType] = useState<
    "circle" | "rectangle"
  >("circle");
  const [isPublished, setIsPublished] = useState(false);
  const [selectedPath, setSelectedPath] = useState<Path | null>(null);
  const [animatedPath, setAnimatedPath] = useState<
    { x: number; y: number }[] | null
  >(null);

  // Tags and connectors
  const [tags, setTags] = useState<TaggedLocation[]>([]);
  const [pendingShape, setPendingShape] = useState<Omit<
    TaggedLocation,
    "id" | "name" | "category" | "floorId"
  > | null>(null);
  const [showTagDialog, setShowTagDialog] = useState(false);
  const [selectedPathForAnimation, setSelectedPathForAnimation] =
    useState<Path | null>(null);
  const [verticalConnectors, setVerticalConnectors] = useState<
    VerticalConnector[]
  >([]);
  const [isVerticalTagMode, setIsVerticalTagMode] = useState(false);
  const [pendingVerticalShape, setPendingVerticalShape] = useState<Omit<
    VerticalConnector,
    "id" | "name" | "type" | "sharedId" | "createdAt"
  > | null>(null);
  const [showVerticalConnectorDialog, setShowVerticalConnectorDialog] =
    useState(false);

  // Multi-floor path state
  const [isCreatingMultiFloorPath, setIsCreatingMultiFloorPath] =
    useState(false);
  const [multiFloorPathSegments, setMultiFloorPathSegments] = useState<
    PathSegment[]
  >([]);
  const [currentSegmentFloorId, setCurrentSegmentFloorId] = useState<
    string | null
  >(null);
  const [pendingConnectorSelection, setPendingConnectorSelection] =
    useState<VerticalConnector | null>(null);
  const [multiFloorPathSource, setMultiFloorPathSource] = useState<string>("");
  const [multiFloorPathDestination, setMultiFloorPathDestination] =
    useState<string>("");
  const [lastConnectorInteraction, setLastConnectorInteraction] = useState<
    string | null
  >(null);
  const [isConnectorPromptActive, setIsConnectorPromptActive] = useState(false);

  // Add these new state variables
  const [showFloorSelectionDialog, setShowFloorSelectionDialog] =
    useState(false);
  const [availableFloorsForTransition, setAvailableFloorsForTransition] =
    useState<Floor[]>([]);
  const [selectedConnectorForTransition, setSelectedConnectorForTransition] =
    useState<VerticalConnector | null>(null);

  // Building management
  const [isBuildingMode, setIsBuildingMode] = useState(false);



const [isBulkEditMode, setIsBulkEditMode] = useState(false);
const [selectedTagsForBulkEdit, setSelectedTagsForBulkEdit] = useState<Set<string>>(new Set());
const [pendingBulkUpdates, setPendingBulkUpdates] = useState<Map<string, Partial<TaggedLocation>>>(new Map());

  // Load buildings on component mount
  // Load buildings on component mount
  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const savedBuildings = await loadBuildingsFromAPI();
        setBuildings(savedBuildings);
      } catch (error) {
        console.error("Error loading buildings:", error);
        setBuildings([]);
      }
    };

    loadBuildings();
  }, []);

  // Save buildings whenever they change
  useEffect(() => {
    saveBuildingsToStorage(buildings);
  }, [buildings]);

  // Load vertical connectors on component mount
  useEffect(() => {
    const savedConnectors = loadVerticalConnectorsFromStorage();
    setVerticalConnectors(savedConnectors);
  }, []);

  // Save vertical connectors whenever they change
  useEffect(() => {
    saveVerticalConnectorsToStorage(verticalConnectors);
  }, [verticalConnectors]);

  // Load vertical connectors when floor changes (REPLACE the existing useEffect)
  useEffect(() => {
    const loadVerticalConnectorsForFloor = async () => {
      if (selectedFloor?.floor_id) {
        try {
          const connectorsData = await getVerticalConnectorsByFloorId(
            selectedFloor.floor_id
          );
          const convertedConnectors = connectorsData.map(
            convertVerticalConnectorDataToFrontend
          );
          setVerticalConnectors(convertedConnectors);
        } catch (error) {
          console.error("Error loading vertical connectors for floor:", error);
          setVerticalConnectors([]);
        }
      } else {
        setVerticalConnectors([]);
      }
    };

    loadVerticalConnectorsForFloor();
  }, [selectedFloor]);

  // Initialize with selected map data if editingl
  // useEffect(() => {
  //   if (selectedMap) {
  //     setMapName(selectedMap.name);
  //     setCurrentMapId(selectedMap.id);
  //     setIsPublished(selectedMap.isPublished || false);

  //     // Convert saved map paths to current format
  //     const convertedPaths: Path[] = selectedMap.paths.map((path) => ({
  //       ...path,
  //       isPublished: path.isPublished || false,
  //     }));
  //     setPaths(convertedPaths);
  //   } else {
  //     // Generate new map ID for new maps
  //     setCurrentMapId(Date.now().toString());
  //   }
  // }, [selectedMap]);


  // useEffect(() => {
  //   const loadPathsForFloor = async () => {
  //     if (selectedFloor?.floor_id) {
  //       try {
  //         const pathsData = await getPathsByFloorId(selectedFloor.floor_id);
  //         const convertedPaths = pathsData.map(convertPathDataToFrontend);
  //         setPaths(convertedPaths);
  //       } catch (error) {
  //         console.error("Error loading paths for floor:", error);
  //         setPaths([]);
  //       }
  //     } else {
  //       setPaths([]);
  //     }
  //   };
  
  //   loadPathsForFloor();
  // }, [selectedFloor]);


  // Update the useEffect for loading paths when floor changes
useEffect(() => {
  const loadPathsForFloor = async () => {
    if (selectedFloor?.floor_id) {
      try {
        // Load all paths (both published and unpublished) for editing
        const pathsData = await getPathsByFloorId(
          selectedFloor.floor_id, 
          undefined, // Don't filter by published status
          'active'   // Only get active paths
        );
        const convertedPaths = pathsData.map(convertPathDataToFrontend);
        setPaths(convertedPaths);
      } catch (error) {
        console.error("Error loading paths for floor:", error);
        setPaths([]);
        toast.error("Failed to load paths for this floor");
      }
    } else {
      setPaths([]);
    }
  };

  loadPathsForFloor();
}, [selectedFloor]);


useEffect(() => {
  if (selectedRoute) {
    // Set building and floor from selectedRoute
    setSelectedBuildingId(selectedRoute.building.building_id);
    setSelectedBuilding(selectedRoute.building);
    setSelectedFloorId(selectedRoute.floor.floor_id);
    setSelectedFloor(selectedRoute.floor);
    setMapImage(selectedRoute.floor.imageUrl);
    
    // Set the path for editing
    const pathToEdit: Path = {
      id: selectedRoute.path.id,
      name: selectedRoute.path.name,
      source: selectedRoute.path.source,
      destination: selectedRoute.path.destination,
      points: selectedRoute.path.points,
      isPublished: selectedRoute.path.isPublished,
      sourceTagId: selectedRoute.path.sourceTagId,
      destinationTagId: selectedRoute.path.destinationTagId,
      floorId: selectedRoute.path.floorId,
      color: selectedRoute.path.color,
      isMultiFloor: selectedRoute.path.isMultiFloor,
      segments: selectedRoute.path.segments,
      sourceFloorId: selectedRoute.path.sourceFloorId,
      destinationFloorId: selectedRoute.path.destinationFloorId,
    };
    
    setSelectedPath(pathToEdit);
    setCurrentPath([...selectedRoute.path.points]);
    setIsEditMode(true);
    setIsDesignMode(false);
    
    // Set map name if not set
    if (!mapName) {
      setMapName(`${selectedRoute.building.name} - ${selectedRoute.floor.label}`);
    }
  }
}, [selectedRoute]);

  // Handle building selection
  useEffect(() => {
    if (selectedBuildingId) {
      const building = buildings.find(
        (b) => b.building_id === selectedBuildingId
      );
      setSelectedBuilding(building || null);

      // Reset floor selection when building changes
      setSelectedFloorId("");
      setSelectedFloor(null);
      setMapImage(null);
    } else {
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setMapImage(null);
    }
  }, [selectedBuildingId, buildings]);

  // Handle floor selection
  useEffect(() => {
    if (selectedFloorId && selectedBuilding) {
      const floor = selectedBuilding.floors.find(
        (f) => f.floor_id === selectedFloorId
      );
      setSelectedFloor(floor || null);

      if (floor) {
        setMapImage(floor.imageUrl);
        // Reset editing states when floor changes
        setIsDesignMode(false);
        setIsEditMode(false);
        setIsPreviewMode(false);
        setIsTagMode(false);
        setIsVerticalTagMode(false);
        setCurrentPath([]);
        setUndoStack([]);
        setSelectedPath(null);
        setAnimatedPath(null);
        setSelectedPathForAnimation(null);
      }
    } else {
      setSelectedFloor(null);
      setMapImage(null);
    }
  }, [selectedFloorId, selectedBuilding]);

  // Check if we can start editing (have building and floor selected)
  const canStartEditing = selectedBuilding && selectedFloor && mapImage;


  const convertTaggedLocationToLocationData = (
    tag: TaggedLocation
  ): CreateLocationRequest => {
    return {
      name: tag.name,
      category: tag.category, // This should now be one of the enum values
      floor_id: tag.floorId,
      shape: tag.shape,
      x: tag.x,
      y: tag.y,
      width: tag.width,
      height: tag.height,
      radius: tag.radius,
      logoUrl: tag.logoUrl,
      color: tag.color || "#3b82f6",
      text_color: tag.textColor || "#000000",
      is_published: tag.isPublished ?? true,
      description: tag.description,
    };
  };
  
  const convertLocationDataToTaggedLocation = (
    locationData: LocationData
  ): TaggedLocation => {
    return {
      id: locationData.location_id || "",
      name: locationData.name || "",
      category: locationData.category || "", // This will be the enum value
      floorId: locationData.floor_id || "",
      shape: locationData.shape || "circle",
      x: locationData.x || 0,
      y: locationData.y || 0,
      width: locationData.width,
      height: locationData.height,
      radius: locationData.radius,
      logoUrl: locationData.logo_url,
      color: locationData.color,
      textColor: locationData.text_color,
      isPublished: locationData.is_published ?? true,
      description: locationData.description,
    };
  };
  

  // Update the useEffect for loading locations when floor changes
  useEffect(() => {
    const loadLocationsForFloor = async () => {
      if (selectedFloor?.floor_id) {
        try {
          const locations = await getLocationsByFloorId(selectedFloor.floor_id);
          const convertedTags = locations.map(
            convertLocationDataToTaggedLocation
          );
          setTags(convertedTags);
        } catch (error) {
          console.error("Error loading locations for floor:", error);
          setTags([]);
        }
      } else {
        setTags([]);
      }
    };

    loadLocationsForFloor();
  }, [selectedFloor]);

  const handleCanvasClick = (x: number, y: number) => {
    if (!isDesignMode && !isEditMode) return;

    const newPoint = { x, y };
    setUndoStack([...undoStack, [...currentPath]]);
    setCurrentPath([...currentPath, newPoint]);

    // Enhanced strict connector detection for multi-floor paths
    if (
      (isDesignMode || isEditMode) &&
      selectedFloor &&
      selectedBuilding &&
      !isConnectorPromptActive
    ) {
      const floorConnectors = verticalConnectors.filter(
        (c) => c.floorId === selectedFloor.floor_id
      );
      const clickedConnector = floorConnectors.find((connector) => {
        const canvasSize = { width: 1200, height: 800 };
        const connectorCanvasX = connector.x * canvasSize.width;
        const connectorCanvasY = connector.y * canvasSize.height;
        const clickCanvasX = x * canvasSize.width;
        const clickCanvasY = y * canvasSize.height;

        const distance = Math.sqrt(
          Math.pow(connectorCanvasX - clickCanvasX, 2) +
            Math.pow(connectorCanvasY - clickCanvasY, 2)
        );

        let threshold = 15;

        if (connector.shape === "circle" && connector.radius) {
          threshold = Math.max(15, connector.radius * canvasSize.width * 0.8);
        } else if (
          connector.shape === "rectangle" &&
          connector.width &&
          connector.height
        ) {
          const avgSize =
            (connector.width * canvasSize.width +
              connector.height * canvasSize.height) /
            2;
          threshold = Math.max(15, avgSize * 0.4);
        }

        return distance <= threshold;
      });

      if (
        clickedConnector &&
        clickedConnector.id !== lastConnectorInteraction
      ) {
        setIsConnectorPromptActive(true);
        handleConnectorClick(clickedConnector);
      }
    }
  };


  const handleBulkUpdateTags = async (updatedTags: TaggedLocation[]) => {
    // Update the local tags state with the bulk updated tags
    setTags(updatedTags);
    
    // Optionally reload tags from API to ensure consistency
    if (selectedFloor?.floor_id) {
      try {
        const locations = await getLocationsByFloorId(selectedFloor.floor_id);
        const convertedTags = locations.map(convertLocationDataToTaggedLocation);
        setTags(convertedTags);
      } catch (error) {
        console.error("Error reloading locations after bulk update:", error);
      }
    }
  };


  const handleConnectorClick = async (connector: VerticalConnector) => {
    if (!selectedFloor || !selectedBuilding) return;

    try {
      // Get all connectors with the same shared ID from backend
      const matchingConnectors = await getVerticalConnectorsBySharedId(
        connector.sharedId
      );
      const otherFloorConnectors = matchingConnectors.filter(
        (c) => c.floor_id !== selectedFloor.floor_id
      );

      if (otherFloorConnectors.length === 0) {
        setIsConnectorPromptActive(false);
        alert(
          `No matching connector "${connector.name}" found on other floors. Please ensure the connector exists on multiple floors with the same Shared ID.`
        );
        return;
      }

      const availableFloors = selectedBuilding.floors.filter((floor) =>
        otherFloorConnectors.some((c) => c.floor_id === floor.floor_id)
      );

      if (availableFloors.length === 0) {
        setIsConnectorPromptActive(false);
        alert("No other floors available for this connector.");
        return;
      }

      const shouldSwitch = confirm(
        `You've reached "${connector.name}". Do you want to continue this path on another floor?\n\nClick OK to switch floors, or Cancel to continue on the current floor.`
      );

      if (!shouldSwitch) {
        setIsConnectorPromptActive(false);
        setLastConnectorInteraction(connector.id);
        return;
      }

      let selectedFloorLabel: string | null = null;

      if (availableFloors.length === 1) {
        selectedFloorLabel = availableFloors[0].label;
      } else {
        const floorOptions = availableFloors.map((f) => f.label).join("\n");
        selectedFloorLabel = prompt(
          `Connect to which floor via "${connector.name}"?\n\nAvailable floors:\n${floorOptions}\n\nEnter the floor name:`
        );
      }

      if (selectedFloorLabel) {
        const targetFloor = availableFloors.find(
          (f) => f.label.toLowerCase() === selectedFloorLabel.toLowerCase()
        );

        if (targetFloor) {
          handleFloorTransition(targetFloor, connector);
        } else {
          setIsConnectorPromptActive(false);
          alert(`Floor "${selectedFloorLabel}" not found. Please try again.`);
        }
      } else {
        setIsConnectorPromptActive(false);
      }
    } catch (error) {
      console.error("Error handling connector click:", error);
      setIsConnectorPromptActive(false);
      toast.error("Failed to process connector interaction");
    }
  };

  // const handleFloorTransition = (
  //   targetFloor: Floor,
  //   sourceConnector: VerticalConnector
  // ) => {
  //   if (!selectedFloor) return;

  //   const pathWithConnector = [
  //     ...currentPath,
  //     { x: sourceConnector.x, y: sourceConnector.y },
  //   ];

  //   const currentSegment: PathSegment = {
  //     id: Date.now().toString(),
  //     floorId: selectedFloor.floor_id,
  //     points: pathWithConnector,
  //     connectorId: sourceConnector.id,
  //   };

  //   setMultiFloorPathSegments((prev) => [...prev, currentSegment]);
  //   setIsCreatingMultiFloorPath(true);

  //   setSelectedFloor(targetFloor);
  //   setMapImage(targetFloor.imageUrl);

  //   const targetConnector = verticalConnectors.find(
  //     (c) =>
  //       c.sharedId === sourceConnector.sharedId && c.floorId === targetFloor.floor_id
  //   );

  //   if (targetConnector) {
  //     setCurrentPath([{ x: targetConnector.x, y: targetConnector.y }]);
  //     setCurrentSegmentFloorId(targetFloor.floor_id);
  //     setLastConnectorInteraction(targetConnector.id);
  //     setIsConnectorPromptActive(false);

  //     setTimeout(() => {
  //       alert(
  //         `✅ Switched to ${targetFloor.label}.\n\nContinue your path from "${sourceConnector.name}" connector.\nYou can now place dots freely on this floor.`
  //       );
  //     }, 100);
  //   } else {
  //     setIsConnectorPromptActive(false);
  //     alert(`Error: Could not find matching connector on ${targetFloor.label}`);
  //   }
  // };

  const handleFloorTransition = async (
    targetFloor: Floor,
    sourceConnector: VerticalConnector
  ) => {
    if (!selectedFloor) return;

    try {
      const pathWithConnector = [
        ...currentPath,
        { x: sourceConnector.x, y: sourceConnector.y },
      ];

      const currentSegment: PathSegment = {
        id: Date.now().toString(),
        floorId: selectedFloor.floor_id,
        points: pathWithConnector,
        connectorId: sourceConnector.id,
      };

      setMultiFloorPathSegments((prev) => [...prev, currentSegment]);
      setIsCreatingMultiFloorPath(true);

      setSelectedFloor(targetFloor);
      setMapImage(targetFloor.imageUrl);

      // Load connectors for the target floor and find the matching one
      const targetFloorConnectors = await getVerticalConnectorsByFloorId(
        targetFloor.floor_id
      );
      const targetConnectorData = targetFloorConnectors.find(
        (c) => c.shared_id === sourceConnector.sharedId
      );

      if (targetConnectorData) {
        const targetConnector =
          convertVerticalConnectorDataToFrontend(targetConnectorData);
        setCurrentPath([{ x: targetConnector.x, y: targetConnector.y }]);
        setCurrentSegmentFloorId(targetFloor.floor_id);
        setLastConnectorInteraction(targetConnector.id);
        setIsConnectorPromptActive(false);

        setTimeout(() => {
          alert(
            `✅ Switched to ${targetFloor.label}.\n\nContinue your path from "${sourceConnector.name}" connector.\nYou can now place dots freely on this floor.`
          );
        }, 100);
      } else {
        setIsConnectorPromptActive(false);
        alert(
          `Error: Could not find matching connector on ${targetFloor.label}`
        );
      }
    } catch (error) {
      console.error("Error in floor transition:", error);
      setIsConnectorPromptActive(false);
      toast.error("Failed to transition between floors");
    }
  };

  const debugVerticalConnectors = () => {
    console.log("=== Vertical Connectors Debug ===");
    console.log("All connectors:", verticalConnectors);
    console.log("Current floor:", selectedFloor?.floor_id);
    console.log(
      "Connectors on current floor:",
      verticalConnectors.filter((c) => c.floorId === selectedFloor?.floor_id)
    );

    // Group by sharedId
    const grouped = verticalConnectors.reduce((acc, connector) => {
      if (!acc[connector.sharedId]) {
        acc[connector.sharedId] = [];
      }
      acc[connector.sharedId].push(connector);
      return acc;
    }, {} as Record<string, VerticalConnector[]>);
  };

  // Call this in useEffect to debug
  useEffect(() => {
    if (verticalConnectors.length > 0) {
      debugVerticalConnectors();
    }
  }, [verticalConnectors, selectedFloor]);

  // Add this function to handle floor selection
  const handleFloorSelectionForTransition = (selectedFloor: Floor) => {
    if (selectedConnectorForTransition) {
      handleFloorTransition(selectedFloor, selectedConnectorForTransition);
    }
    setShowFloorSelectionDialog(false);
    setAvailableFloorsForTransition([]);
    setSelectedConnectorForTransition(null);
  };

  // Add this JSX before the closing </div> of your component
  {
    /* Floor Selection Dialog for Multi-Floor Transitions */
  }
  {
    showFloorSelectionDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Select Target Floor</h3>
            <p className="text-gray-600 mb-4">
              The connector "{selectedConnectorForTransition?.name}" is
              available on multiple floors. Which floor would you like to
              continue your path on?
            </p>
            <div className="space-y-2">
              {availableFloorsForTransition.map((floor) => (
                <Button
                  key={floor.floor_id}
                  onClick={() => handleFloorSelectionForTransition(floor)}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    {floor.label}
                  </div>
                </Button>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => {
                  setShowFloorSelectionDialog(false);
                  setAvailableFloorsForTransition([]);
                  setSelectedConnectorForTransition(null);
                }}
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const handleDotDrag = (index: number, x: number, y: number) => {
    if (!isEditMode) return;

    const newPath = [...currentPath];
    newPath[index] = { x, y };
    setCurrentPath(newPath);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setCurrentPath(previousState);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const handleShapeDrawn = (
    shape: Omit<TaggedLocation, "id" | "name" | "category">
  ) => {
    setPendingShape(shape);
    setShowTagDialog(true);
  };

  // const handleCreateTag = (
  //   name: string,
  //   category: string,
  //   floorId?: string
  // ) => {
  //   if (pendingShape) {
  //     const newTag: TaggedLocation = {
  //       id: Date.now().toString(),
  //       name,
  //       category,
  //       floorId: floorId || selectedFloor?.floor_id || "",
  //       ...pendingShape,
  //     };
  //     setTags([...tags, newTag]);
  //     setPendingShape(null);
  //   }
  // };

  // Update the handleCreateTag function
  // const handleCreateTag = async (
  //   name: string,
  //   category: string,
  //   floorId?: string
  // ) => {

    
  //   if (pendingShape && selectedFloor) {
  //     console.log("Creating tag with name:", name);
  //     console.log("Category:", category);
  //     console.log("Pending Shape:", pendingShape);
  //     console.log("Selected Floor:", selectedFloor);
  //     console.log("Floor ID:", floorId);

  //     const locationData = convertTaggedLocationToLocationData({
  //       id: "", // Will be generated by API
  //       name,
  //       category,
  //       floorId: floorId || selectedFloor?.floor_id,
  //       ...pendingShape,
  //     });

  //     console.log("Location Data:", locationData);

  //     const createdLocation = await createLocation(locationData);

  //     if (createdLocation) {
  //       const newTag = convertLocationDataToTaggedLocation(createdLocation);
  //       setTags([...tags, newTag]);
  //       setPendingShape(null);
  //     }
  //   }
  // };


  const handleCreateTag = async (
    name: string,
    category: string,
    floorId?: string
  ) => {
    if (!pendingShape) {
      toast.error("No shape data available");
      return;
    }
  
    if (!selectedFloor?.floor_id) {
      toast.error("No floor selected");
      return;
    }
  
    const targetFloorId = floorId || selectedFloor.floor_id;
  
    if (!targetFloorId) {
      toast.error("Floor ID is required");
      return;
    }
  
    const locationData: CreateLocationRequest = {
      name,
      category,
      floor_id: targetFloorId, // Directly assign the floor_id
      shape: pendingShape.shape,
      x: pendingShape.x,
      y: pendingShape.y,
      width: pendingShape.width,
      height: pendingShape.height,
      radius: pendingShape.radius,
      logoUrl: pendingShape.logoUrl,
      color: pendingShape.color || "#3b82f6",
      text_color: pendingShape.textColor || "#000000",
      is_published: pendingShape.isPublished ?? true,
      description: pendingShape.description,
    };
  
    // console.log("Location Data to be sent:", locationData);
  
    try {
      const createdLocation = await createLocation(locationData);
  
      if (createdLocation) {
        const newTag = convertLocationDataToTaggedLocation(createdLocation);
        setTags([...tags, newTag]);
        setPendingShape(null);
        toast.success("Location created successfully");
      }
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Failed to create location");
    }
  };
  

  const handleTagUpdate = (updatedTag: TaggedLocation) => {
    setTags(tags.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag)));
  };



  const handleEditTag = async (updatedTag: TaggedLocation) => {
    try {
      if (!updatedTag.id) {
        console.error("Cannot update tag: missing ID", updatedTag);
        toast.error("Cannot update location: missing ID");
        return;
      }

      const locationData = convertTaggedLocationToLocationData(updatedTag);

      const updated = await updateLocation(updatedTag.id, locationData);

      if (updated && updated.location_id) {
        const convertedTag = convertLocationDataToTaggedLocation(updated);

        // Update the tags in state
        setTags(
          tags.map((tag) => (tag.id === updatedTag.id ? convertedTag : tag))
        );
      } else {
        console.error(
          "Update operation failed or returned invalid data:",
          updated
        );
        toast.error("Failed to update location");
      }
    } catch (error) {
      console.error("Error in handleEditTag:", error);
      toast.error("Failed to update location");
    }
  };

  // const handleDeleteTag = async (tagId: string) => {
  //   const success = await deleteLocation(tagId);

  //   if (success) {
  //     setTags(tags.filter((tag) => tag.id !== tagId));
  //     setPaths(
  //       paths.map((path) => ({
  //         ...path,
  //         sourceTagId: path.sourceTagId === tagId ? undefined : path.sourceTagId,
  //         destinationTagId:
  //           path.destinationTagId === tagId ? undefined : path.destinationTagId,
  //       }))
  //     );
  //   }
  // };

  const handleDeleteTag = async (tagId: string) => {
    if (!tagId) {
      console.error("Cannot delete tag: missing ID");
      toast.error("Cannot delete location: missing ID");
      return;
    }

    const success = await deleteLocation(tagId);

    if (success) {
      setTags(tags.filter((tag) => tag.id !== tagId));
      setPaths(
        paths.map((path) => ({
          ...path,
          sourceTagId:
            path.sourceTagId === tagId ? undefined : path.sourceTagId,
          destinationTagId:
            path.destinationTagId === tagId ? undefined : path.destinationTagId,
        }))
      );
    } else {
      console.error("Failed to delete tag");
    }
  };

  // const handleSavePath = (source: string, destination: string) => {
  //   if (currentPath.length === 0 && multiFloorPathSegments.length === 0) return;

  //   // Find matching tags for source and destination
  //   const sourceTag = tags.find(
  //     (tag) => tag.name.toLowerCase() === source.toLowerCase()
  //   );
  //   const destinationTag = tags.find(
  //     (tag) => tag.name.toLowerCase() === destination.toLowerCase()
  //   );

  //   const pathId = selectedPath?.id || Date.now().toString();

  //   // Handle multi-floor path
  //   if (isCreatingMultiFloorPath && multiFloorPathSegments.length > 0) {
  //     // Add final segment
  //     const finalSegment: PathSegment = {
  //       id: Date.now().toString(),
  //       floorId: selectedFloor?.floor_id || "",
  //       points: [...currentPath],
  //     };

  //     const allSegments = [...multiFloorPathSegments, finalSegment];

  //     const newPath: Path = {
  //       id: pathId,
  //       name: `${source} to ${destination}`,
  //       source,
  //       destination,
  //       points: [], // Empty for multi-floor paths
  //       isPublished: selectedPath?.isPublished || false,
  //       sourceTagId: sourceTag?.id,
  //       destinationTagId: destinationTag?.id,
  //       floorId: selectedFloor?.floor_id,
  //       color: selectedPath?.color,
  //       isMultiFloor: true,
  //       segments: allSegments,
  //       sourceFloorId: allSegments[0]?.floorId,
  //       destinationFloorId: allSegments[allSegments.length - 1]?.floorId,
  //     };

  //     if (selectedPath) {
  //       setPaths(paths.map((p) => (p.id === pathId ? newPath : p)));
  //     } else {
  //       setPaths([...paths, newPath]);
  //     }

  //     // Reset multi-floor state
  //     setIsCreatingMultiFloorPath(false);
  //     setMultiFloorPathSegments([]);
  //     setCurrentSegmentFloorId(null);
  //     setMultiFloorPathSource("");
  //     setMultiFloorPathDestination("");
  //   } else {
  //     // Handle single-floor path
  //     const newPath: Path = {
  //       id: pathId,
  //       name: `${source} to ${destination}`,
  //       source,
  //       destination,
  //       points: [...currentPath],
  //       isPublished: selectedPath?.isPublished || false,
  //       sourceTagId: sourceTag?.id,
  //       destinationTagId: destinationTag?.id,
  //       floorId: selectedFloor?.floor_id,
  //       color: selectedPath?.color,
  //     };

  //     if (selectedPath) {
  //       const updatedPath = {
  //         ...newPath,
  //         source: source || selectedPath.source,
  //         destination: destination || selectedPath.destination,
  //         name:
  //           source && destination
  //             ? `${source} to ${destination}`
  //             : selectedPath.name,
  //       };

  //       setPaths(paths.map((p) => (p.id === pathId ? updatedPath : p)));
  //     } else {
  //       setPaths([...paths, newPath]);
  //     }
  //   }

  //   setCurrentPath([]);
  //   setUndoStack([]);
  //   setIsDesignMode(false);
  //   setIsEditMode(false);
  //   setSelectedPath(null);
  // };



  // Update the handleSavePath function



const handleSavePath = async (source: string, destination: string) => {
  if (currentPath.length === 0 && multiFloorPathSegments.length === 0) return;

  if (!selectedFloor?.floor_id) {
    toast.error("No floor selected");
    return;
  }

  // Find matching tags for source and destination
  const sourceTag = tags.find(
    (tag) => tag.name.toLowerCase() === source.toLowerCase()
  );
  const destinationTag = tags.find(
    (tag) => tag.name.toLowerCase() === destination.toLowerCase()
  );

  try {
    // Handle multi-floor path (for now, we'll save each segment separately)
    if (isCreatingMultiFloorPath && multiFloorPathSegments.length > 0) {
      // Add final segment
      const finalSegment: PathSegment = {
        id: Date.now().toString(),
        floorId: selectedFloor.floor_id,
        points: [...currentPath],
      };

      const allSegments = [...multiFloorPathSegments, finalSegment];

      // For now, save each segment as a separate path
      // TODO: Implement multi-floor path support in backend
      for (let i = 0; i < allSegments.length; i++) {
        const segment = allSegments[i];
        const segmentName = `${source} to ${destination} (Segment ${i + 1})`;
        
        const pathData: CreatePathRequest = {
          name: segmentName,
          floor_id: segment.floorId,
          source: i === 0 ? source : "Connector",
          destination: i === allSegments.length - 1 ? destination : "Connector",
          source_tag_id: i === 0 ? sourceTag?.id : undefined,
          destination_tag_id: i === allSegments.length - 1 ? destinationTag?.id : undefined,
          points: segment.points,
          shape: "circle",
          color: selectedPath?.color || "#3b82f6",
          is_published: selectedPath?.isPublished || false,
          created_by: "user", // TODO: Get from auth context
        };

        const createdPath = await createPath(pathData);
        if (!createdPath) {
          toast.error(`Failed to create segment ${i + 1}`);
          return;
        }
      }

      // Reset multi-floor state
      setIsCreatingMultiFloorPath(false);
      setMultiFloorPathSegments([]);
      setCurrentSegmentFloorId(null);
      setMultiFloorPathSource("");
      setMultiFloorPathDestination("");
      
      // Reload paths
      const pathsData = await getPathsByFloorId(selectedFloor.floor_id);
      const convertedPaths = pathsData.map(convertPathDataToFrontend);
      setPaths(convertedPaths);
    } else {
      // Handle single-floor path
      if (selectedPath) {
        // Update existing path
        const updateData: UpdatePathRequest = {
          name: `${source} to ${destination}`,
          source: source,
          destination: destination,
          source_tag_id: sourceTag?.id,
          destination_tag_id: destinationTag?.id,
          points: currentPath,
          color: selectedPath.color,
          is_published: selectedPath.isPublished,
          updated_by: "user", // TODO: Get from auth context
        };

        const updatedPath = await updatePath(selectedPath.id, updateData);
        if (updatedPath) {
          // Update local state
          const convertedPath = convertPathDataToFrontend(updatedPath);
          setPaths(paths.map((p) => (p.id === selectedPath.id ? convertedPath : p)));
        }
      } else {
        // Create new path
        const pathData: CreatePathRequest = {
          name: `${source} to ${destination}`,
          floor_id: selectedFloor.floor_id,
          source: source,
          destination: destination,
          source_tag_id: sourceTag?.id,
          destination_tag_id: destinationTag?.id,
          points: currentPath,
          shape: "circle",
          color: "#3b82f6",
          is_published: false,
          created_by: "user", // TODO: Get from auth context
        };

        const createdPath = await createPath(pathData);
        if (createdPath) {
          const convertedPath = convertPathDataToFrontend(createdPath);
          setPaths([...paths, convertedPath]);
        }
      }
    }

    setCurrentPath([]);
    setUndoStack([]);
    setIsDesignMode(false);
    setIsEditMode(false);
    setSelectedPath(null);
  } catch (error) {
    console.error("Error saving path:", error);
    toast.error("Failed to save path");
  }
};
  const handleClearPath = () => {
    setCurrentPath([]);
    setUndoStack([]);

    if (isCreatingMultiFloorPath) {
      setIsCreatingMultiFloorPath(false);
      setMultiFloorPathSegments([]);
      setCurrentSegmentFloorId(null);
      setMultiFloorPathSource("");
      setMultiFloorPathDestination("");
    }

    // Reset connector interaction tracking
    setLastConnectorInteraction(null);
    setIsConnectorPromptActive(false);
  };

  const handleEditPath = (path: Path) => {
    setSelectedPath(path);

    if (path.isMultiFloor && path.segments) {
      // Handle multi-floor path editing
      setIsCreatingMultiFloorPath(true);
      setMultiFloorPathSegments(path.segments.slice(0, -1)); // All but last segment
      setCurrentPath([...path.segments[path.segments.length - 1].points]); // Last segment

      // Switch to the floor of the last segment
      const lastSegment = path.segments[path.segments.length - 1];
      const targetFloor = selectedBuilding?.floors.find(
        (f) => f.floor_id === lastSegment.floorId
      );
      if (targetFloor) {
        setSelectedFloor(targetFloor);
        setSelectedFloorId(targetFloor.floor_id);
        setMapImage(targetFloor.imageUrl);
      }
    } else {
      // Handle single-floor path editing
      setCurrentPath([...path.points]);

      // Switch to the path's floor if needed
      if (path.floorId && selectedFloor?.floor_id !== path.floorId) {
        const targetFloor = selectedBuilding?.floors.find(
          (f) => f.floor_id === path.floorId
        );
        if (targetFloor) {
          setSelectedFloor(targetFloor);
          setSelectedFloorId(targetFloor.floor_id);
          setMapImage(targetFloor.imageUrl);
        }
      }
    }

    setIsDesignMode(false);
    setIsEditMode(true);
    setIsPreviewMode(false);
    setUndoStack([]);
  };

  // const handleDeletePath = (pathId: string) => {
  //   setPaths(paths.filter((p) => p.id !== pathId));
  // };

  // Update the handleDeletePath function
const handleDeletePath = async (pathId: string) => {
  try {
    const success = await deletePath(pathId);
    if (success) {
      setPaths(paths.filter((p) => p.id !== pathId));
    }
  } catch (error) {
    console.error("Error deleting path:", error);
    toast.error("Failed to delete path");
  }
};

  // const handlePublishMap = () => {
  //   // For building mode, check if we have a building and floors
  //   if (selectedBuilding) {
  //     if (selectedBuilding.floors.length === 0) {
  //       alert(
  //         "Please add at least one floor to the building before publishing"
  //       );
  //       return;
  //     }

  //     if (paths.length === 0) {
  //       alert("Please create at least one path before publishing");
  //       return;
  //     }

  //     // Create a saved map for the building
  //     const savedMap: SavedMap = {
  //       id: selectedBuilding.building_id,
  //       name: selectedBuilding.name,
  //       imageUrl: selectedBuilding.floors[0]?.imageUrl || "",
  //       paths: paths.map((path) => ({
  //         id: path.id,
  //         name: path.name,
  //         source: path.source,
  //         destination: path.destination,
  //         points: path.points,
  //         isPublished: true,
  //         color: path.color,
  //       })),
  //       createdAt: new Date().toISOString(),
  //       isPublished: true,
  //     };

  //     saveMapToStorage(savedMap);

  //     // Update all paths to published status
  //     setPaths(paths.map((path) => ({ ...path, isPublished: true })));

  //     // Only set isPublished to true if ALL paths are now published
  //     const allPathsPublished = paths.every((path) => path.isPublished);
  //     if (allPathsPublished) {
  //       setIsPublished(true);
  //     }

  //     alert(
  //       `Building "${selectedBuilding.name}" has been published successfully!`
  //     );
  //     return;
  //   }

  //   // For single map mode
  //   if (!mapImage || !currentMapId) {
  //     alert("Please select a building and floor first");
  //     return;
  //   }

  //   if (!mapName.trim()) {
  //     alert("Please provide a map name before publishing");
  //     return;
  //   }

  //   if (paths.length === 0) {
  //     alert("Please create at least one path before publishing");
  //     return;
  //   }

  //   const savedMap: SavedMap = {
  //     id: currentMapId,
  //     name: mapName.trim(),
  //     imageUrl: mapImage,
  //     paths: paths.map((path) => ({
  //       id: path.id,
  //       name: path.name,
  //       source: path.source,
  //       destination: path.destination,
  //       points: path.points,
  //       isPublished: true,
  //       color: path.color,
  //     })),
  //     createdAt: new Date().toISOString(),
  //     isPublished: true,
  //   };

  //   saveMapToStorage(savedMap);

  //   // Update all paths to published status
  //   setPaths(paths.map((path) => ({ ...path, isPublished: true })));

  //   // Only set isPublished to true if ALL paths are now published
  //   const allPathsPublished = paths.every((path) => path.isPublished);
  //   if (allPathsPublished) {
  //     setIsPublished(true);
  //   }

  //   alert(`Map "${mapName}" has been published successfully!`);
  // };



  // Update the handlePublishMap function

  const handlePublishMap = async () => {
  // For building mode, check if we have a building and floors
  if (selectedBuilding) {
    if (selectedBuilding.floors.length === 0) {
      alert("Please add at least one floor to the building before publishing");
      return;
    }

    if (paths.length === 0) {
      alert("Please create at least one path before publishing");
      return;
    }

    try {
      // Publish all unpublished paths
      const unpublishedPaths = paths.filter(path => !path.isPublished);
      
      for (const path of unpublishedPaths) {
        await togglePathPublishStatus(path.id, true);
      }

      // Update local state
      setPaths(paths.map((path) => ({ ...path, isPublished: true })));
      setIsPublished(true);

      alert(`Building "${selectedBuilding.name}" has been published successfully!`);
    } catch (error) {
      console.error("Error publishing paths:", error);
      toast.error("Failed to publish some paths");
    }
    return;
  }

  // For single map mode
  if (!selectedFloor?.floor_id) {
    alert("Please select a building and floor first");
    return;
  }

  if (!mapName.trim()) {
    alert("Please provide a map name before publishing");
    return;
  }

  if (paths.length === 0) {
    alert("Please create at least one path before publishing");
    return;
  }

  try {
    // Publish all unpublished paths
    const unpublishedPaths = paths.filter(path => !path.isPublished);
    
    for (const path of unpublishedPaths) {
      await togglePathPublishStatus(path.id, true);
    }

    // Update local state
    setPaths(paths.map((path) => ({ ...path, isPublished: true })));
    setIsPublished(true);

    alert(`Map "${mapName}" has been published successfully!`);
  } catch (error) {
    console.error("Error publishing paths:", error);
    toast.error("Failed to publish some paths");
  }
};


  const toggleDesignMode = () => {
    if (isPreviewMode || isTagMode) return;

    const newDesignMode = !isDesignMode && !isEditMode;
    setIsDesignMode(newDesignMode);
    setIsEditMode(false);

    if (!newDesignMode) {
      setCurrentPath([]);
      setUndoStack([]);
      setSelectedPath(null);

      // Reset multi-floor path state
      if (isCreatingMultiFloorPath) {
        setIsCreatingMultiFloorPath(false);
        setMultiFloorPathSegments([]);
        setCurrentSegmentFloorId(null);
      }

      // Reset connector interaction tracking
      setLastConnectorInteraction(null);
      setIsConnectorPromptActive(false);
    } else {
      // When entering design mode, always reset connector interaction tracking
      setLastConnectorInteraction(null);
      setIsConnectorPromptActive(false);
    }
  };

  const startMultiFloorPath = () => {
    setIsCreatingMultiFloorPath(true);
    setMultiFloorPathSegments([]);
    setCurrentSegmentFloorId(selectedFloor?.floor_id || null);
    setIsDesignMode(true);
    setIsEditMode(false);
    // Reset connector interaction tracking for multi-floor paths
    setLastConnectorInteraction(null);
    setIsConnectorPromptActive(false);
    alert(
      "Multi-floor path mode activated.\n\n• Place dots freely on the current floor\n• Click directly on vertical connectors (elevators, stairs) to switch floors\n• You will only be prompted when clicking on a connector"
    );
  };

  const toggleTagMode = () => {
    setIsTagMode(!isTagMode);
    setIsDesignMode(false);
    setIsEditMode(false);
    setIsPreviewMode(false);
    setCurrentPath([]);
    setUndoStack([]);
    setSelectedPath(null);
    setAnimatedPath(null);
    setSelectedPathForAnimation(null);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
    setIsDesignMode(false);
    setIsEditMode(false);
    setCurrentPath([]);
    setUndoStack([]);
    setSelectedPath(null);
    setAnimatedPath(null);
    setSelectedPathForAnimation(null);
  };

  const handleViewPublishedMap = () => {
    setIsPreviewMode(true);
    setIsDesignMode(false);
    setIsEditMode(false);
    setCurrentPath([]);
    setSelectedPath(null);
    setSelectedPathForAnimation(null);
  };

  const handleFloorSelect = (floor: Floor) => {
    setSelectedFloor(floor);
    setSelectedFloorId(floor.floor_id);
    setMapImage(floor.imageUrl);
    setIsDesignMode(false);
    setIsEditMode(false);
    setIsPreviewMode(false);
    setIsTagMode(false);
    setIsVerticalTagMode(false);
    setCurrentPath([]);
    setUndoStack([]);
    setSelectedPath(null);
    setAnimatedPath(null);
    setSelectedPathForAnimation(null);
  };

  const toggleBuildingMode = () => {
    setIsBuildingMode(!isBuildingMode);
    setIsDesignMode(false);
    setIsEditMode(false);
    setIsPreviewMode(false);
    setIsTagMode(false);
    setIsVerticalTagMode(false);
  };

  const handleBuildingManagerExit = () => {
    setIsBuildingMode(false);
  };


  const handleVerticalShapeDrawn = (
    shape: Omit<
      VerticalConnector,
      "id" | "name" | "type" | "sharedId" | "createdAt"
    >
  ) => {
    setPendingVerticalShape(shape);
    setShowVerticalConnectorDialog(true);
  };

  const handleCreateVerticalConnector = async (
    name: string,
    type: any,
    sharedId: string
  ) => {
    if (pendingVerticalShape && selectedFloor) {
      try {
        const connectorData = convertVerticalConnectorDataToBackend({
          ...pendingVerticalShape,
          name,
          type,
          sharedId,
          floorId: selectedFloor.floor_id,
        });

        const createdConnector = await createVerticalConnector(connectorData);

        if (createdConnector) {
          const newConnector =
            convertVerticalConnectorDataToFrontend(createdConnector);
          setVerticalConnectors((prev) => [...prev, newConnector]);
          setPendingVerticalShape(null);
          toast.success("Vertical connector created successfully");
        }
      } catch (error) {
        console.error("Error creating vertical connector:", error);
        toast.error("Failed to create vertical connector");
      }
    }
  };

  const handleEditVerticalConnector = async (
    updatedConnector: VerticalConnector
  ) => {
    try {
      if (!updatedConnector.id) {
        console.error("Cannot update connector: missing ID", updatedConnector);
        toast.error("Cannot update connector: missing ID");
        return;
      }

      const updateData = {
        name: updatedConnector.name,
        shared_id: updatedConnector.sharedId,
        connector_type: updatedConnector.type,
        shape: updatedConnector.shape,
        x: updatedConnector.x,
        y: updatedConnector.y,
        width: updatedConnector.width,
        height: updatedConnector.height,
        radius: updatedConnector.radius,
        color: updatedConnector.color,
      };

      const updated = await updateVerticalConnector(
        updatedConnector.id,
        updateData
      );

      if (updated) {
        const convertedConnector =
          convertVerticalConnectorDataToFrontend(updated);
        setVerticalConnectors((prev) =>
          prev.map((connector) =>
            connector.id === updatedConnector.id
              ? convertedConnector
              : connector
          )
        );
      }
    } catch (error) {
      console.error("Error in handleEditVerticalConnector:", error);
      toast.error("Failed to update vertical connector");
    }
  };

  const handleDeleteVerticalConnector = async (connectorId: string) => {
    if (!connectorId) {
      console.error("Cannot delete connector: missing ID");
      toast.error("Cannot delete connector: missing ID");
      return;
    }

    try {
      const success = await deleteVerticalConnector(connectorId);

      if (success) {
        setVerticalConnectors((prev) =>
          prev.filter((connector) => connector.id !== connectorId)
        );
      }
    } catch (error) {
      console.error("Failed to delete connector:", error);
    }
  };

  const handleRouteSelect = (path: Path | null, segmentIndex?: number) => {
    if (!path) {
      setAnimatedPath(null);
      setSelectedPathForAnimation(null);
      return;
    }

    setSelectedPathForAnimation(path);

    if (
      path.isMultiFloor &&
      path.segments &&
      typeof segmentIndex === "number"
    ) {
      // Handle multi-floor path with specific segment
      const targetSegment = path.segments[segmentIndex];
      if (!targetSegment) return;

      // Switch to the segment's floor if different from current
      if (selectedFloor?.floor_id !== targetSegment.floorId) {
        const targetFloor = selectedBuilding?.floors.find(
          (f) => f.floor_id === targetSegment.floorId
        );
        if (targetFloor) {
          setSelectedFloor(targetFloor);
          setSelectedFloorId(targetFloor.floor_id);
          setMapImage(targetFloor.imageUrl);
        }
      }

      // Show the specific segment
      setAnimatedPath(targetSegment.points);

      // Log navigation info
      const isFirst = segmentIndex === 0;
      const isLast = segmentIndex === path.segments.length - 1;

      if (isFirst) {
        console.log(
          `Showing first segment: ${path.source} to vertical connector`
        );
      } else if (isLast) {
        console.log(
          `Showing final segment: vertical connector to ${path.destination}`
        );
      } else {
        console.log(`Showing intermediate segment ${segmentIndex + 1}`);
      }
    } else if (path.isMultiFloor && path.segments) {
      // Handle multi-floor path - start with first segment
      const firstSegment = path.segments[0];
      if (firstSegment && selectedFloor?.floor_id !== firstSegment.floorId) {
        // Switch to the starting floor
        const startFloor = selectedBuilding?.floors.find(
          (f) => f.floor_id === firstSegment.floorId
        );
        if (startFloor) {
          setSelectedFloor(startFloor);
          setSelectedFloorId(startFloor.floor_id);
          setMapImage(startFloor.imageUrl);
        }
      }

      // Show first segment
      setAnimatedPath(firstSegment ? firstSegment.points : null);
    } else {
      // Handle single-floor path
      if (path.floorId && selectedFloor?.floor_id !== path.floorId) {
        // Switch to the path's floor
        const pathFloor = selectedBuilding?.floors.find(
          (f) => f.floor_id === path.floorId
        );
        if (pathFloor) {
          setSelectedFloor(pathFloor);
          setSelectedFloorId(pathFloor.floor_id);
          setMapImage(pathFloor.imageUrl);
        }
      }

      setAnimatedPath(path.points);
    }
  };

  const getAvailableLocations = () => {
    if (selectedBuilding) {
      // In building mode, get locations from all floors
      return [
        ...new Set([
          ...tags.map((tag) => tag.name),
          ...paths.flatMap((path) => [path.source, path.destination]),
        ]),
      ];
    } else {
      // In single map mode, filter by current floor
      const currentFloorTags = selectedFloor?.floor_id
        ? tags.filter(
            (tag) => tag.floorId === selectedFloor.floor_id || !tag.floorId
          )
        : tags;

      const tagLocations = currentFloorTags.map((tag) => tag.name);
      const pathLocations = paths.flatMap((path) => [
        path.source,
        path.destination,
      ]);
      return [...new Set([...tagLocations, ...pathLocations])];
    }
  };

  const handleTagColorChange = (tagId: string, color: string) => {
    setTags(tags.map((tag) => (tag.id === tagId ? { ...tag, color } : tag)));
  };

  // const handlePathColorChange = (pathId: string, color: string) => {
  //   setPaths(
  //     paths.map((path) => (path.id === pathId ? { ...path, color } : path))
  //   );
  // };

  const handlePathColorChange = async (pathId: string, color: string) => {
    try {
      const updatedPath = await updatePath(pathId, { color, updated_by: "user" });
      if (updatedPath) {
        const convertedPath = convertPathDataToFrontend(updatedPath);
        setPaths(paths.map((path) => (path.id === pathId ? convertedPath : path)));
      }
    } catch (error) {
      console.error("Error updating path color:", error);
      toast.error("Failed to update path color");
    }
  };

  // Add a function to toggle path publish status
const handleTogglePathPublish = async (pathId: string, isPublished: boolean) => {
  try {
    const updatedPath = await togglePathPublishStatus(pathId, isPublished);
    if (updatedPath) {
      const convertedPath = convertPathDataToFrontend(updatedPath);
      setPaths(paths.map((path) => (path.id === pathId ? convertedPath : path)));
    }
  } catch (error) {
    console.error("Error toggling path publish status:", error);
    toast.error("Failed to update path status");
  }
};


// Update the component to check published status from database
useEffect(() => {
  // Check if all paths are published
  const allPathsPublished = paths.length > 0 && paths.every((path) => path.isPublished);
  setIsPublished(allPathsPublished);
}, [paths]);
  

  const toggleVerticalTagMode = () => {
    setIsVerticalTagMode(!isVerticalTagMode);
    setIsDesignMode(false);
    setIsEditMode(false);
    setIsPreviewMode(false);
    setIsTagMode(false);
    setCurrentPath([]);
    setUndoStack([]);
    setSelectedPath(null);
    setAnimatedPath(null);
    setSelectedPathForAnimation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Map Creator</h1>
                <p className="text-sm text-gray-500">
                  {selectedMap ? "Edit Map" : "Create New Map"}
                  {isPublished && " (Published)"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>
                {selectedBuilding ? `${selectedBuilding.name} • ` : ""}
                {selectedFloor ? `${selectedFloor.label} • ` : ""}
                {paths.length} paths • {tags.length} tags •{" "}
                {
                  verticalConnectors.filter(
                    (c) => c.floorId === selectedFloor?.floor_id
                  ).length
                }{" "}
                vertical connectors
              </span>
              {isPublished && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Published
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Building and Floor Selection Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Map Name */}
            <div>
              <Label
                htmlFor="map-name"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Map Name
              </Label>
              <Input
                id="map-name"
                placeholder="Enter map name"
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Building Selection */}
            <div>
              <Label
                htmlFor="building-select"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Select Building
              </Label>
              <Select
                value={selectedBuildingId}
                onValueChange={setSelectedBuildingId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a building" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.length === 0 ? (
                    <SelectItem value="no-buildings" disabled>
                      No buildings available
                    </SelectItem>
                  ) : (
                    buildings.map((building) => (
                      <SelectItem
                        key={building.building_id}
                        value={building.building_id}
                      >
                        <div className="flex items-center gap-2">
                          <BuildingIcon className="h-4 w-4" />
                          {building.name}
                          <span className="text-xs text-gray-500">
                            ({building.floors.length} floors)
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Floor Selection */}
            <div>
              <Label
                htmlFor="floor-select"
                className="text-sm font-medium text-gray-700 mb-2 block"
              >
                Select Floor
              </Label>
              <Select
                value={selectedFloorId}
                onValueChange={setSelectedFloorId}
                disabled={!selectedBuilding}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a floor" />
                </SelectTrigger>
                <SelectContent>
                  {!selectedBuilding ? (
                    <SelectItem value="no-building" disabled>
                      Select a building first
                    </SelectItem>
                  ) : selectedBuilding.floors.length === 0 ? (
                    <SelectItem value="no-floors" disabled>
                      No floors available
                    </SelectItem>
                  ) : (
                    selectedBuilding.floors.map((floor) => (
                      <SelectItem key={floor.floor_id} value={floor.floor_id}>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          {floor.label}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button onClick={toggleBuildingMode} variant="outline" size="sm">
                <BuildingIcon className="h-4 w-4 mr-2" />
                Manage Buildings
              </Button>
              {buildings.length === 0 && (
                <p className="text-sm text-amber-600">
                  ⚠️ Create a building first to start designing maps
                </p>
              )}
            </div>

            {canStartEditing && (
              <div className="flex items-center space-x-2">
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Ready to edit
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Building Manager Modal */}
        {/* {isBuildingMode && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Building Management</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBuildingManagerExit}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <BuildingManager
                      buildings={buildings}
                      onBuildingsChange={setBuildings}
                      onClose={handleBuildingManagerExit}
                    />
                  </div>
                </div>
              </div>
            )} */}

        {/* Main Content - Only show if building and floor are selected */}
        {canStartEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Canvas Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Floor Info Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {selectedBuilding.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Current floor: {selectedFloor.label}
                      </p>
                      {isCreatingMultiFloorPath && (
                        <p className="text-sm text-blue-600 font-medium">
                          Multi-floor path mode active • Click near connectors
                          to switch floors
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {selectedBuilding.floors.length > 1 &&
                        !isCreatingMultiFloorPath &&
                        (isDesignMode || isEditMode) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={startMultiFloorPath}
                          >
                            Multi-Floor Path
                          </Button>
                        )}
                      <div className="w-48">
                        <FloorSelector
                          floors={selectedBuilding.floors}
                          selectedFloor={selectedFloor}
                          onFloorSelect={handleFloorSelect}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Toolbar */}
                <Toolbar
                  isDesignMode={isDesignMode}
                  isEditMode={isEditMode}
                  isPreviewMode={isPreviewMode}
                  isTagMode={isTagMode}
                  isVerticalTagMode={isVerticalTagMode}
                  isPublished={isPublished}
                  onToggleDesignMode={toggleDesignMode}
                  onToggleTagMode={toggleTagMode}
                  onToggleVerticalTagMode={toggleVerticalTagMode}
                  onTogglePreviewMode={togglePreviewMode}
                  onViewPublishedMap={handleViewPublishedMap}
                  onUndo={handleUndo}
                  onRedo={() => {}}
                  onClearPath={handleClearPath}
                  onSavePath={handleSavePath}
                  onPublishMap={handlePublishMap}
                  canUndo={undoStack.length > 0}
                  hasCurrentPath={currentPath.length > 0}
                  availableLocations={getAvailableLocations()}
                  selectedPath={selectedPath}
                  isBulkEditMode={isBulkEditMode} // Add this
                  selectedTagsCount={selectedTagsForBulkEdit.size} // Add this
                />

                {/* Map Canvas Container */}
                <div
                  className="flex items-center justify-center p-4 bg-gray-50"
                  style={{
                    minHeight: `${MAP_CONTAINER_CONFIG.minHeight + 32}px`,
                    maxHeight: `${MAP_CONTAINER_CONFIG.maxHeight + 32}px`,
                  }}
                >
                  <div
                    className="w-full flex items-center justify-center"
                    style={{
                      maxWidth: `${MAP_CONTAINER_CONFIG.maxWidth}px`,
                      aspectRatio: `${MAP_CONTAINER_CONFIG.aspectRatio}`,
                    }}
                  >
                    <MapCanvas
                      imageUrl={mapImage}
                      currentPath={currentPath}
                      isDesignMode={isDesignMode}
                      isEditMode={isEditMode}
                      isPreviewMode={isPreviewMode}
                      isTagMode={isTagMode}
                      isVerticalTagMode={isVerticalTagMode}
                      selectedShapeType={selectedShapeType}
                      onCanvasClick={handleCanvasClick}
                      onDotDrag={handleDotDrag}
                      onShapeDrawn={handleShapeDrawn}
                      onVerticalShapeDrawn={handleVerticalShapeDrawn}
                      paths={(() => {
                        // Filter paths based on current floor
                        const floorFilteredPaths = paths.filter((path) => {
                          if (path.isMultiFloor && path.segments) {
                            return path.segments.some(
                              (segment) =>
                                segment.floorId === selectedFloor?.floor_id
                            );
                          }
                          return (
                            !selectedFloor?.floor_id ||
                            path.floorId === selectedFloor.floor_id ||
                            !path.floorId
                          );
                        });

                        // In design/edit mode: show ALL paths (published and unpublished)
                        if (isDesignMode || isEditMode) {
                          return floorFilteredPaths;
                        }

                        // In preview mode: show only selected/animated path, and only if it's published
                        if (isPreviewMode) {
                          if (selectedPathForAnimation && animatedPath) {
                            return floorFilteredPaths.filter(
                              (path) =>
                                path.id === selectedPathForAnimation.id &&
                                path.isPublished
                            );
                          }
                          return []; // Show no paths if nothing is selected in preview
                        }

                        // Default: show published paths only
                        return floorFilteredPaths.filter(
                          (path) => path.isPublished
                        );
                      })()}
                      animatedPath={animatedPath}
                      tags={tags.filter(
                        (tag) =>
                          !selectedFloor?.floor_id ||
                          tag.floorId === selectedFloor.floor_id ||
                          !tag.floorId
                      )}
                      verticalConnectors={verticalConnectors.filter(
                        (c) => c.floorId === selectedFloor?.floor_id
                      )}
                      onTagUpdate={handleTagUpdate}
                      selectedPathForAnimation={selectedPathForAnimation}
                      selectedTagsForBulkEdit={selectedTagsForBulkEdit} // Add this
                      isBulkEditMode={isBulkEditMode} // Add this
                      pendingBulkUpdates={pendingBulkUpdates} // Add this
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {isPreviewMode ? (
                <RouteSearch
                  paths={paths.filter((p) => p.isPublished)}
                  onRouteSelect={handleRouteSelect}
                  availableLocations={getAvailableLocations()}
                />
              ) : isTagMode ? (
                <>
                  <LocationTagger
                    isTagMode={isTagMode}
                    selectedShapeType={selectedShapeType}
                    onShapeTypeChange={setSelectedShapeType}
                    tags={tags}
                    onEditTag={handleEditTag}
                    onDeleteTag={handleDeleteTag}
                    onBulkUpdateTags={handleBulkUpdateTags} // Add this line
                    currentFloorId={selectedFloor?.floor_id || ""}
                  />
                  {tags.filter(
                    (tag) =>
                      !selectedFloor?.floor_id ||
                      tag.floorId === selectedFloor.floor_id ||
                      !tag.floorId
                  ).length > 0 && (
                    <ColorCustomizer
                      tags={tags.filter(
                        (tag) =>
                          !selectedFloor?.floor_id ||
                          tag.floorId === selectedFloor.floor_id ||
                          !tag.floorId
                      )}
                      paths={[]}
                      onTagColorChange={handleTagColorChange}
                      onPathColorChange={handlePathColorChange}
                    />
                  )}
                </>
              ) : isVerticalTagMode ? (
                <>
                  <VerticalConnectorTagger
                    isVerticalTagMode={isVerticalTagMode}
                    selectedShapeType={selectedShapeType}
                    onShapeTypeChange={setSelectedShapeType}
                    connectors={verticalConnectors}
                    onEditConnector={handleEditVerticalConnector}
                    onDeleteConnector={handleDeleteVerticalConnector}
                    currentFloorId={selectedFloor?.floor_id || ""}
                  />
                </>
              ) : (
                <>
                  <PathManager
                    paths={paths}
                    onEditPath={handleEditPath}
                    onDeletePath={handleDeletePath}
                    onTogglePublish={handleTogglePathPublish} // Add this line
                  />
                  {(tags.filter(
                    (tag) =>
                      !selectedFloor?.floor_id ||
                      tag.floorId === selectedFloor.floor_id ||
                      !tag.floorId
                  ).length > 0 ||
                    paths.length > 0) && (
                    <ColorCustomizer
                      tags={tags.filter(
                        (tag) =>
                          !selectedFloor?.floor_id ||
                          tag.floorId === selectedFloor.floor_id ||
                          !tag.floorId
                      )}
                      paths={paths}
                      onTagColorChange={handleTagColorChange}
                      onPathColorChange={handlePathColorChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* No Building/Floor Selected State */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Route className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Create Your Map
              </h2>
              <p className="text-gray-600 mb-8">
                {buildings.length === 0
                  ? "Create a building and add floors to start designing your wayfinding map"
                  : selectedBuildingId
                  ? "Select a floor from the building to begin editing"
                  : "Select a building and floor to start creating paths and adding location tags"}
              </p>

              {buildings.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <BuildingIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-medium text-amber-800 mb-1">
                        Getting Started
                      </h3>
                      <ol className="text-sm text-amber-700 space-y-1">
                        <li>
                          1. Click "Manage Buildings" to create a new building
                        </li>
                        <li>2. Add floors with map images to your building</li>
                        <li>
                          3. Select the building and floor to start editing
                        </li>
                        <li>
                          4. Create paths, add location tags, and publish your
                          map
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-center space-x-4">
                <Button
                  onClick={toggleBuildingMode}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <BuildingIcon className="h-4 w-4 mr-2" />
                  {buildings.length === 0
                    ? "Create Building"
                    : "Manage Buildings"}
                </Button>

                {selectedMap && (
                  <Button onClick={onClose} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tag Creation Dialog */}
      <TagCreationDialog
        isOpen={showTagDialog}
        onClose={() => {
          setShowTagDialog(false);
          setPendingShape(null);
        }}
        onSave={handleCreateTag}
        currentFloorId={selectedFloor?.floor_id}
      />

      {/* Vertical Connector Creation Dialog */}
      <VerticalConnectorCreationDialog
        isOpen={showVerticalConnectorDialog}
        onClose={() => {
          setShowVerticalConnectorDialog(false);
          setPendingVerticalShape(null);
        }}
        onSave={handleCreateVerticalConnector}
      />
    </div>
  );
};

export default MapCreator;
