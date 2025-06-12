// "use client";

// import React, { useState, useEffect } from "react";
// import { BuildingManager } from "@/components/BuildingManager";
// import { Building, Floor } from "@/types/building";
// import {
//   loadBuildingsFromStorage,
//   saveBuildingsToStorage,
//   createBuilding,
//   addFloorToBuilding,
//   removeFloorFromBuilding,
//   reorderFloorsInBuilding,
//   deleteBuilding,
//   updateBuilding,
//   updateFloorInBuilding,
// } from "@/lib/buildingData";
// import { Building as BuildingIcon } from "lucide-react";
// import { Button } from "@/components/ui/Button";

// const Buildings: React.FC = () => {
//   const [buildings, setBuildings] = useState<Building[]>([]);
//   const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

//   // Load buildings on component mount
//   useEffect(() => {
//     const savedBuildings = loadBuildingsFromStorage();
//     setBuildings(savedBuildings);
//   }, []);

//   // Save buildings whenever they change
//   useEffect(() => {
//     if (buildings.length > 0) {
//       saveBuildingsToStorage(buildings);
//     }
//   }, [buildings]);

//   const handleBuildingCreate = (name: string, address: string, description: string) => {
//     const newBuilding = createBuilding(name, address, description);
//     setBuildings([...buildings, newBuilding]);
//     setSelectedBuilding(newBuilding);
//   };

//   const handleBuildingSelect = (building: Building) => {
//     setSelectedBuilding(building);
//   };

//   const handleBuildingDelete = (buildingId: string) => {
//     const updatedBuildings = deleteBuilding(buildings, buildingId);
//     setBuildings(updatedBuildings);
//     if (selectedBuilding?.id === buildingId) {
//       setSelectedBuilding(null);
//     }
//   };

//   // Add these handler functions
//     const handleBuildingUpdate = (buildingId: string, updates: { name?: string; address?: string; description?: string }) => {
//         const updatedBuildings = updateBuilding(buildings, buildingId, updates);
//         setBuildings(updatedBuildings);
        
//         const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
//         if (updatedBuilding && selectedBuilding?.id === buildingId) {
//         setSelectedBuilding(updatedBuilding);
//         }
//     };
  
//   const handleFloorUpdate = (buildingId: string, floorId: string, updates: { label?: string; order?: number; imageUrl?: string }) => {
//     const updatedBuildings = updateFloorInBuilding(buildings, buildingId, floorId, updates);
//     setBuildings(updatedBuildings);
    
//     const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
//     if (updatedBuilding && selectedBuilding?.id === buildingId) {
//       setSelectedBuilding(updatedBuilding);
//     }
//   };

//   const handleFloorAdd = (
//     buildingId: string,
//     floor: Omit<Floor, "id" | "createdAt">
//   ) => {
//     const updatedBuildings = addFloorToBuilding(buildings, buildingId, floor);
//     setBuildings(updatedBuildings);

//     const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
//     if (updatedBuilding) {
//       setSelectedBuilding(updatedBuilding);
//     }
//   };

//   const handleFloorDelete = (buildingId: string, floorId: string) => {
//     const updatedBuildings = removeFloorFromBuilding(
//       buildings,
//       buildingId,
//       floorId
//     );
//     setBuildings(updatedBuildings);

//     const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
//     if (updatedBuilding) {
//       setSelectedBuilding(updatedBuilding);
//     }
//   };

//   const handleFloorReorder = (buildingId: string, reorderedFloors: Floor[]) => {
//     const updatedBuildings = reorderFloorsInBuilding(
//       buildings,
//       buildingId,
//       reorderedFloors
//     );
//     setBuildings(updatedBuildings);

//     const updatedBuilding = updatedBuildings.find((b) => b.id === buildingId);
//     if (updatedBuilding) {
//       setSelectedBuilding(updatedBuilding);
//     }
//   };

//   return (
//     <div className="h-full space-y-6">
//       {/* Building Manager Component */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <BuildingManager
//           buildings={buildings}
//           selectedBuilding={selectedBuilding}
//           onBuildingSelect={handleBuildingSelect}
//           onBuildingCreate={handleBuildingCreate}
//           onBuildingDelete={handleBuildingDelete}
//           onBuildingUpdate={handleBuildingUpdate}
//           onFloorUpdate={handleFloorUpdate}
//           onFloorAdd={handleFloorAdd}
//           onFloorDelete={handleFloorDelete}
//           onFloorReorder={handleFloorReorder}
//           onExit={() => {}} // Not needed since we have the sidebar navigation
//         />
//       </div>

//       {/* Quick Actions */}
//       <div className="bg-white rounded-xl shadow-sm p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 border rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
//             <p className="text-sm text-gray-600 mb-3">
//               Export all building data as backup
//             </p>
//             <Button 
//               variant="outline" 
//               size="sm"
//               onClick={() => {
//                 const dataStr = JSON.stringify(buildings, null, 2);
//                 const dataBlob = new Blob([dataStr], { type: 'application/json' });
//                 const url = URL.createObjectURL(dataBlob);
//                 const link = document.createElement('a');
//                 link.href = url;
//                 link.download = 'buildings-backup.json';
//                 link.click();
//                 URL.revokeObjectURL(url);
//               }}
//             >
//               Export JSON
//             </Button>
//           </div>
          
//           <div className="p-4 border rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">Import Building</h4>
//             <p className="text-sm text-gray-600 mb-3">
//               Import building data from a file
//             </p>
//             <Button variant="outline" size="sm" disabled>
//               Coming Soon
//             </Button>
//           </div>
          
//           <div className="p-4 border rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-2">Statistics</h4>
//             <p className="text-sm text-gray-600 mb-3">
//               View building and floor statistics
//             </p>
//             <div className="text-sm text-gray-700">
//               <div>Buildings: {buildings.length}</div>
//               <div>Total Floors: {buildings.reduce((acc, b) => acc + b.floors.length, 0)}</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Buildings;





"use client";

import React, { useState, useEffect } from "react";
import { BuildingManager } from "@/components/BuildingManager";
import { Building, Floor } from "@/types/building";
import {
  loadBuildingsFromAPI,
  createBuilding,
  addFloorToBuilding,
  removeFloorFromBuilding,
  reorderFloorsInBuilding,
  deleteBuilding,
  updateBuilding,
  updateFloorInBuilding,
  getFloorsByBuildingId,
} from "@/lib/buildingData";
import { Building as BuildingIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "react-hot-toast";

const Buildings: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load buildings on component mount
  // useEffect(() => {
  //   const fetchBuildings = async () => {
  //     setIsLoading(true);
  //     try {
  //       const fetchedBuildings = await loadBuildingsFromAPI();
  //       setBuildings(fetchedBuildings);
  //     } catch (error) {
  //       console.error("Error loading buildings:", error);
  //       toast.error("Failed to load buildings");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchBuildings();
  // }, []);

  // Update the useEffect in Buildings component
  useEffect(() => {
    const fetchBuildings = async () => {
      setIsLoading(true);
      try {
        // Fetch buildings with their floors
        const fetchedBuildings = await loadBuildingsFromAPI('active', 0);
        setBuildings(fetchedBuildings);
      } catch (error) {
        console.error("Error loading buildings:", error);
        toast.error("Failed to load buildings");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBuildings();
  }, []);

    // You can also add a refresh function if needed
    const refreshBuildings = async () => {
      try {
        const fetchedBuildings = await loadBuildingsFromAPI('active', 0);
        setBuildings(fetchedBuildings);
      } catch (error) {
        console.error("Error refreshing buildings:", error);
        toast.error("Failed to refresh buildings");
      }
    };


    // Add a function to refresh floors for a specific building
const refreshBuildingFloors = async (buildingId: string) => {
  try {
    const floors = await getFloorsByBuildingId(buildingId);
    setBuildings(prev => prev.map(building => 
      building.building_id === buildingId 
        ? { ...building, floors }
        : building
    ));
  } catch (error) {
    console.error("Error refreshing floors:", error);
    toast.error("Failed to refresh floors");
  }
};


  const handleBuildingCreate = async (name: string, address: string, description: string) => {
    const newBuilding = await createBuilding(name, address, description);
    if (newBuilding) {
      setBuildings(prev => [...prev, newBuilding]);
      setSelectedBuilding(newBuilding);
    }
  };

  const handleBuildingSelect = (building: Building) => {
    setSelectedBuilding(building);
  };

  const handleBuildingUpdate = async (buildingId: string, updates: { name?: string; address?: string; description?: string }) => {
    const updatedBuilding = await updateBuilding(buildingId, updates);
    if (updatedBuilding) {
      setBuildings(prev => prev.map(b => b.building_id === buildingId ? updatedBuilding : b));
      if (selectedBuilding?.building_id === buildingId) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  };

  const handleBuildingDelete = async (buildingId: string) => {
    const success = await deleteBuilding(buildingId);
    if (success) {
      setBuildings(prev => prev.filter(b => b.building_id !== buildingId));
      if (selectedBuilding?.building_id === buildingId) {
        setSelectedBuilding(null);
      }
    }
  };

  const handleFloorAdd = async (
    buildingId: string,
    floor: Omit<Floor, "floor_id" | "datetime" | "status" | "building_id">
  ) => {
    const newFloor = await addFloorToBuilding(buildingId, floor);
    if (newFloor) {
      // Refresh buildings to get updated data
      const updatedBuildings = await loadBuildingsFromAPI();
      setBuildings(updatedBuildings);
      
      const updatedBuilding = updatedBuildings.find(b => b.building_id === buildingId);
      if (updatedBuilding) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  };

  const handleFloorUpdate = async (
    buildingId: string,
    floorId: string,
    updates: { label?: string; order?: number; imageUrl?: string }
  ) => {
    const updatedFloor = await updateFloorInBuilding(buildingId, floorId, updates);
    if (updatedFloor) {
      // Refresh buildings to get updated data
      const updatedBuildings = await loadBuildingsFromAPI();
      setBuildings(updatedBuildings);
      
      const updatedBuilding = updatedBuildings.find(b => b.building_id === buildingId);
      if (updatedBuilding) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  };

  const handleFloorDelete = async (buildingId: string, floorId: string) => {
    const success = await removeFloorFromBuilding(buildingId, floorId);
    if (success) {
      // Refresh buildings to get updated data
      const updatedBuildings = await loadBuildingsFromAPI();
      setBuildings(updatedBuildings);
      
      const updatedBuilding = updatedBuildings.find(b => b.building_id === buildingId);
      if (updatedBuilding) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  };

  const handleFloorReorder = async (buildingId: string, reorderedFloors: Floor[]) => {
    const updatedFloors = await reorderFloorsInBuilding(buildingId, reorderedFloors);
    if (updatedFloors) {
      // Refresh buildings to get updated data
      const updatedBuildings = await loadBuildingsFromAPI();
      setBuildings(updatedBuildings);
      
      const updatedBuilding = updatedBuildings.find(b => b.building_id === buildingId);
      if (updatedBuilding) {
        setSelectedBuilding(updatedBuilding);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buildings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <BuildingIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Building Management</h1>
            <p className="text-sm text-gray-500">
              Manage buildings and floors for your wayfinding system
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BuildingIcon className="h-4 w-4" />
          <span>{buildings.length} buildings</span>
        </div>
      </div>

      {/* Building Manager Component */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <BuildingManager
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          onBuildingSelect={handleBuildingSelect}
          onBuildingCreate={handleBuildingCreate}
          onBuildingUpdate={handleBuildingUpdate}
          onBuildingDelete={handleBuildingDelete}
          onFloorAdd={handleFloorAdd}
          onFloorUpdate={handleFloorUpdate}
          onFloorDelete={handleFloorDelete}
          onFloorReorder={handleFloorReorder}
          onExit={() => {}} // Not needed since we have the sidebar navigation
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Create Building</h4>
            <p className="text-sm text-gray-600 mb-3">
              Add a new building to your wayfinding system
            </p>
            <Button 
              onClick={() => {
                const name = prompt("Enter building name:");
                if (name?.trim()) {
                  const address = prompt("Enter building address (optional):") || "";
                  const description = prompt("Enter building description (optional):") || "";
                  handleBuildingCreate(name.trim(), address, description);
                }
              }}
              size="sm"
            >
              Create Building
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Import Building</h4>
            <p className="text-sm text-gray-600 mb-3">
              Import building data from a file
            </p>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-600 mb-3">
              Export all building data as backup
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const dataStr = JSON.stringify(buildings, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'buildings-backup.json';
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buildings;
