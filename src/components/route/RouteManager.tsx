// "use client";

// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Input } from '@/components/ui/Input';
// import { Button } from '@/components/ui/Button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
// import { Badge } from '@/components/ui/Badge';
// import {
//   Search,
//   Filter,
//   Building,
//   Route,
//   Globe,
//   Clock,
//   Layers,
//   MapPin,
//   RefreshCw,
//   AlertCircle,
//   X
// } from 'lucide-react';
// import { RouteCard } from './RouteCard';
// import { Building as BuildingType, Floor } from '@/types/building';
// import { loadBuildingsFromAPI } from '@/lib/buildingData';
// import { getPathsByFloorId } from '@/lib/pathData';
// import { getLocationsByFloorId } from '@/lib/locationData';
// import { getVerticalConnectorsByFloorId } from '@/lib/verticalConnectorData';
// import toast from 'react-hot-toast';

// interface PathSegment {
//   id: string;
//   floorId: string;
//   points: { x: number; y: number }[];
//   connectorId?: string;
// }

// interface Path {
//   id: string;
//   name: string;
//   source: string;
//   destination: string;
//   points: { x: number; y: number }[];
//   isPublished: boolean;
//   sourceTagId?: string;
//   destinationTagId?: string;
//   floorId?: string;
//   color?: string;
//   isMultiFloor?: boolean;
//   segments?: PathSegment[];
//   sourceFloorId?: string;
//   destinationFloorId?: string;
// }

// interface TaggedLocation {
//   id: string;
//   name: string;
//   category: string;
//   floorId: string;
//   shape: 'circle' | 'rectangle';
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   radius?: number;
//   logoUrl?: string;
//   color?: string;
//   textColor?: string;
//   isPublished?: boolean;
//   description?: string;
// }

// interface VerticalConnector {
//   id: string;
//   name: string;
//   type: string;
//   sharedId: string;
//   floorId: string;
//   shape: 'circle' | 'rectangle';
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   radius?: number;
//   color?: string;
//   createdAt: string;
// }

// interface RouteData {
//   path: Path;
//   building: BuildingType;
//   floor: Floor;
//   tags: TaggedLocation[];
//   connectors: VerticalConnector[];
// }

// interface RouteManagerProps {
//   onEditRoute: (path: Path, building: BuildingType, floor: Floor) => void;
//   onPreviewRoute: (path: Path, building: BuildingType, floor: Floor) => void;
// }

// export const RouteManager: React.FC<RouteManagerProps> = ({
//   onEditRoute,
//   onPreviewRoute
// }) => {
//   const [routes, setRoutes] = useState<RouteData[]>([]);
//   const [filteredRoutes, setFilteredRoutes] = useState<RouteData[]>([]);
//   const [buildings, setBuildings] = useState<BuildingType[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
//   const [selectedFloor, setSelectedFloor] = useState<string>('all');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [typeFilter, setTypeFilter] = useState<string>('all');


//     // Load all routes data
//     const loadRoutesData = async () => {
//         setIsLoading(true);
//         try {
//           // Load buildings
//           const buildingsData = await loadBuildingsFromAPI();
//           setBuildings(buildingsData);
    
//           const allRoutes: RouteData[] = [];
    
//           // Load paths, tags, and connectors for each floor
//           for (const building of buildingsData) {
//             for (const floor of building.floors) {
//               try {
//                 // Load paths for this floor
//                 const pathsData = await getPathsByFloorId(floor.floor_id);
                
//                 // Load tags for this floor
//                 const tagsData = await getLocationsByFloorId(floor.floor_id);
                
//                 // Load vertical connectors for this floor
//                 const connectorsData = await getVerticalConnectorsByFloorId(floor.floor_id);
    
//                 // Convert and combine data
//                 const convertedPaths = pathsData.map(pathData => ({
//                   id: pathData.path_id || '',
//                   name: pathData.name || '',
//                   source: pathData.source || '',
//                   destination: pathData.destination || '',
//                   points: pathData.points || [],
//                   isPublished: pathData.is_published || false,
//                   sourceTagId: pathData.source_tag_id,
//                   destinationTagId: pathData.destination_tag_id,
//                   floorId: pathData.floor_id,
//                   color: pathData.color,
//                   isMultiFloor: false, // TODO: Handle multi-floor paths
//                   segments: undefined,
//                   sourceFloorId: pathData.floor_id,
//                   destinationFloorId: pathData.floor_id,
//                 }));
    
//                 const convertedTags = tagsData.map(tagData => ({
//                   id: tagData.location_id || '',
//                   name: tagData.name || '',
//                   category: tagData.category || '',
//                   floorId: tagData.floor_id || '',
//                   shape: (tagData.shape as 'circle' | 'rectangle') || 'circle',
//                   x: tagData.x || 0,
//                   y: tagData.y || 0,
//                   width: tagData.width,
//                   height: tagData.height,
//                   radius: tagData.radius,
//                   logoUrl: tagData.logo_url,
//                   color: tagData.color,
//                   textColor: tagData.text_color,
//                   isPublished: tagData.is_published,
//                   description: tagData.description,
//                 }));
    
//                 const convertedConnectors = connectorsData.map(connectorData => ({
//                   id: connectorData.connector_id || '',
//                   name: connectorData.name || '',
//                   type: connectorData.connector_type || '',
//                   sharedId: connectorData.shared_id || '',
//                   floorId: connectorData.floor_id || '',
//                   shape: (connectorData.shape as 'circle' | 'rectangle') || 'circle',
//                   x: connectorData.x || 0,
//                   y: connectorData.y || 0,
//                   width: connectorData.width,
//                   height: connectorData.height,
//                   radius: connectorData.radius,
//                   color: connectorData.color,
//                   createdAt: connectorData?.created_at || new Date().toISOString(),
//                 }));
    
//                 // Add routes for this floor
//                 convertedPaths.forEach(path => {
//                   allRoutes.push({
//                     path,
//                     building,
//                     floor,
//                     tags: convertedTags,
//                     connectors: convertedConnectors,
//                   });
//                 });
//               } catch (error) {
//                 console.error(`Error loading data for floor ${floor.label}:`, error);
//               }
//             }
//           }
    
//           setRoutes(allRoutes);
//           setFilteredRoutes(allRoutes);
//         } catch (error) {
//           console.error('Error loading routes data:', error);
//           toast.error('Failed to load routes data');
//         } finally {
//           setIsLoading(false);
//         }
//       };
    
//       // Initial load
//       useEffect(() => {
//         loadRoutesData();
//       }, []);
    
//       // Filter routes based on search and filters
//       useEffect(() => {
//         let filtered = [...routes];
    
//         // Search filter
//         if (searchTerm) {
//           filtered = filtered.filter(route =>
//             route.path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             route.path.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             route.path.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             route.building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             route.floor.label.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//         }
    
//         // Building filter
//         if (selectedBuilding !== 'all') {
//           filtered = filtered.filter(route => route.building.building_id === selectedBuilding);
//         }
    
//         // Floor filter
//         if (selectedFloor !== 'all') {
//           filtered = filtered.filter(route => route.floor.floor_id === selectedFloor);
//         }
    
//         // Status filter
//         if (statusFilter !== 'all') {
//           filtered = filtered.filter(route => 
//             statusFilter === 'published' ? route.path.isPublished : !route.path.isPublished
//           );
//         }
    
//         // Type filter
//         if (typeFilter !== 'all') {
//           filtered = filtered.filter(route => 
//             typeFilter === 'multi-floor' ? route.path.isMultiFloor : !route.path.isMultiFloor
//           );
//         }
    
//         setFilteredRoutes(filtered);
//       }, [routes, searchTerm, selectedBuilding, selectedFloor, statusFilter, typeFilter]);
    

//         // Get available floors for selected building
//   const getAvailableFloors = () => {
//     if (selectedBuilding === 'all') {
//       return buildings.flatMap(building => building.floors);
//     }
//     const building = buildings.find(b => b.building_id === selectedBuilding);
//     return building ? building.floors : [];
//   };

//   // Statistics
//   const stats = {
//     total: routes.length,
//     published: routes.filter(r => r.path.isPublished).length,
//     draft: routes.filter(r => !r.path.isPublished).length,
//     multiFloor: routes.filter(r => r.path.isMultiFloor).length,
//     buildings: buildings.length,
//     floors: buildings.reduce((sum, b) => sum + b.floors.length, 0),
//   };

//   const handleEditRoute = (route: RouteData) => {
//     onEditRoute(route.path, route.building, route.floor);
//   };

//   const handlePreviewRoute = (route: RouteData) => {
//     onPreviewRoute(route.path, route.building, route.floor);
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setSelectedBuilding('all');
//     setSelectedFloor('all');
//     setStatusFilter('all');
//     setTypeFilter('all');
//   };

//   const hasActiveFilters = searchTerm || selectedBuilding !== 'all' || selectedFloor !== 'all' || 
//                           statusFilter !== 'all' || typeFilter !== 'all';

//   return (
//     <div className="space-y-6">
//       {/* Header with Statistics */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 <Route className="h-5 w-5" />
//                 Route Manager
//               </CardTitle>
//               <p className="text-sm text-gray-500 mt-1">
//                 Manage all navigation routes across buildings and floors
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={loadRoutesData}
//               disabled={isLoading}
//             >
//               <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//               Refresh
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {/* Statistics */}
//           <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
//             <div className="text-center">
//               <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
//               <div className="text-xs text-gray-500">Total Routes</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-green-600">{stats.published}</div>
//               <div className="text-xs text-gray-500">Published</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
//               <div className="text-xs text-gray-500">Drafts</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-purple-600">{stats.multiFloor}</div>
//               <div className="text-xs text-gray-500">Multi-floor</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-indigo-600">{stats.buildings}</div>
//               <div className="text-xs text-gray-500">Buildings</div>
//             </div>
//             <div className="text-center">
//               <div className="text-2xl font-bold text-teal-600">{stats.floors}</div>
//               <div className="text-xs text-gray-500">Floors</div>
//             </div>
//           </div>

//           {/* Search and Filters */}
//           <div className="space-y-4">
//             {/* Search */}
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 placeholder="Search routes, buildings, floors, or locations..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Filters */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All Buildings" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Buildings</SelectItem>
//                   {buildings.map((building) => (
//                     <SelectItem key={building.building_id} value={building.building_id}>
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4" />
//                         {building.name}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={selectedFloor} onValueChange={setSelectedFloor}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All Floors" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Floors</SelectItem>
//                   {getAvailableFloors().map((floor) => (
//                     <SelectItem key={floor.floor_id} value={floor.floor_id}>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="h-4 w-4" />
//                         {floor.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>

//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All Status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="published">
//                     <div className="flex items-center gap-2">
//                       <Globe className="h-4 w-4 text-green-600" />
//                       Published
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="draft">
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-orange-600" />
//                       Draft
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select value={typeFilter} onValueChange={setTypeFilter}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="All Types" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Types</SelectItem>
//                   <SelectItem value="single-floor">
//                     <div className="flex items-center gap-2">
//                       <MapPin className="h-4 w-4" />
//                       Single Floor
//                     </div>
//                   </SelectItem>
//                   <SelectItem value="multi-floor">
//                     <div className="flex items-center gap-2">
//                       <Layers className="h-4 w-4 text-purple-600" />
//                       Multi-floor
//                     </div>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Active Filters Display */}
//             {hasActiveFilters && (
//               <div className="flex items-center gap-2 flex-wrap">
//                 <span className="text-sm text-gray-600">Active filters:</span>
//                 {searchTerm && (
//                   <Badge variant="secondary" className="flex items-center gap-1">
//                     Search: "{searchTerm}"
//                     <X 
//                       className="h-3 w-3 cursor-pointer" 
//                       onClick={() => setSearchTerm('')}
//                     />
//                   </Badge>
//                 )}
//                 {selectedBuilding !== 'all' && (
//                   <Badge variant="secondary" className="flex items-center gap-1">
//                     Building: {buildings.find(b => b.building_id === selectedBuilding)?.name}
//                     <X 
//                       className="h-3 w-3 cursor-pointer" 
//                       onClick={() => setSelectedBuilding('all')}
//                     />
//                   </Badge>
//                 )}
//                 {selectedFloor !== 'all' && (
//                   <Badge variant="secondary" className="flex items-center gap-1">
//                     Floor: {getAvailableFloors().find(f => f.floor_id === selectedFloor)?.label}
//                     <X 
//                       className="h-3 w-3 cursor-pointer" 
//                       onClick={() => setSelectedFloor('all')}
//                     />
//                   </Badge>
//                 )}
//                 {statusFilter !== 'all' && (
//                   <Badge variant="secondary" className="flex items-center gap-1">
//                     Status: {statusFilter}
//                     <X 
//                       className="h-3 w-3 cursor-pointer" 
//                       onClick={() => setStatusFilter('all')}
//                     />
//                   </Badge>
//                 )}
//                 {typeFilter !== 'all' && (
//                   <Badge variant="secondary" className="flex items-center gap-1">
//                     Type: {typeFilter}
//                     <X 
//                       className="h-3 w-3 cursor-pointer" 
//                       onClick={() => setTypeFilter('all')}
//                     />
//                   </Badge>
//                 )}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={clearFilters}
//                   className="text-xs h-6"
//                 >
//                   Clear all
//                 </Button>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Routes Display */}
//       {isLoading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading routes...</p>
//         </div>
//       ) : filteredRoutes.length === 0 ? (
//         <Card>
//           <CardContent className="text-center py-12">
//             {routes.length === 0 ? (
//               <>
//                 <Route className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No Routes Found</h3>
//                 <p className="text-gray-600 mb-4">
//                   No navigation routes have been created yet.
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   Create routes using the Map Creator to see them here.
//                 </p>
//               </>
//             ) : (
//               <>
//                 <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Routes</h3>
//                 <p className="text-gray-600 mb-4">
//                   No routes match your current search and filter criteria.
//                 </p>
//                 <Button variant="outline" onClick={clearFilters}>
//                   Clear Filters
//                 </Button>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       ) : (
//         <>
//           {/* Results Summary */}
//           <div className="flex items-center justify-between">
//             <p className="text-sm text-gray-600">
//               Showing {filteredRoutes.length} of {routes.length} routes
//             </p>
//             <div className="flex items-center gap-2">
//               <Badge variant="outline" className="text-green-600">
//                 {filteredRoutes.filter(r => r.path.isPublished).length} Published
//               </Badge>
//               <Badge variant="outline" className="text-orange-600">
//                 {filteredRoutes.filter(r => !r.path.isPublished).length} Drafts
//               </Badge>
//             </div>
//           </div>

//           {/* Routes Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredRoutes.map((route) => (
//               <RouteCard
//                 key={`${route.path.id}-${route.building.building_id}-${route.floor.floor_id}`}
//                 path={route.path}
//                 building={route.building}
//                 floor={route.floor}
//                 relatedTags={route.tags}
//                 verticalConnectors={route.connectors}
//                 onEdit={() => handleEditRoute(route)}
//                 onPreview={() => handlePreviewRoute(route)}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };







"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Building,
  Search,
  Filter,
  Route,
  MapPin,
  Globe,
  Clock,
  Layers,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Grid,
  List
} from 'lucide-react';
import { RouteCard } from './RouteCard';
import { RoutePreview } from './RoutePreview';
import { loadBuildingsFromAPI } from '@/lib/buildingData';
import { getPathsByFloorId } from '@/lib/pathData';
import { Building as BuildingType, Floor } from '@/types/building';
import toast from 'react-hot-toast';

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

interface RouteManagerProps {
  onEditRoute: (path: Path, building: BuildingType, floor: Floor) => void;
  onPreviewRoute: (path: Path, building: BuildingType, floor: Floor) => void;
}

export const RouteManager: React.FC<RouteManagerProps> = ({
  onEditRoute,
  onPreviewRoute
}) => {
  // State management
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [allRoutes, setAllRoutes] = useState<Array<{
    path: Path;
    building: BuildingType;
    floor: Floor;
  }>>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Array<{
    path: Path;
    building: BuildingType;
    floor: Floor;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Preview state
  const [previewRoute, setPreviewRoute] = useState<{
    path: Path;
    building: BuildingType;
    floor: Floor;
  } | null>(null);

  // Load buildings and routes
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const buildingsData = await loadBuildingsFromAPI();
      setBuildings(buildingsData || []); // Add fallback to empty array
  
      // Load all routes from all buildings and floors
      const allRoutesData: Array<{
        path: Path;
        building: BuildingType;
        floor: Floor;
      }> = [];
  
      // Check if buildingsData exists and is an array
      if (buildingsData && Array.isArray(buildingsData)) {
        for (const building of buildingsData) {
          // Check if building.floors exists and is an array
          if (building.floors && Array.isArray(building.floors)) {
            for (const floor of building.floors) {
              try {
                const pathsData = await getPathsByFloorId(
                  floor.floor_id,
                  undefined, // Don't filter by published status
                  'active'   // Only get active paths
                );
  
                // Check if pathsData exists and is an array
                if (pathsData && Array.isArray(pathsData)) {
                  const convertedPaths = pathsData.map(pathData => ({
                    id: pathData.path_id || '',
                    name: pathData.name || '',
                    source: pathData.source || '',
                    destination: pathData.destination || '',
                    points: pathData.points || [],
                    isPublished: pathData.is_published || false,
                    sourceTagId: pathData.source_tag_id,
                    destinationTagId: pathData.destination_tag_id,
                    floorId: pathData.floor_id,
                    color: pathData.color,
                    isMultiFloor: false, // TODO: Handle multi-floor paths
                    segments: undefined,
                    sourceFloorId: pathData.floor_id,
                    destinationFloorId: pathData.floor_id,
                  }));
  
                  convertedPaths.forEach(path => {
                    allRoutesData.push({
                      path,
                      building,
                      floor
                    });
                  });
                }
              } catch (error) {
                console.error(`Error loading paths for floor ${floor.label}:`, error);
              }
            }
          }
        }
      }
  
      setAllRoutes(allRoutesData);
      setFilteredRoutes(allRoutesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load routes data');
      // Set empty arrays as fallback
      setBuildings([]);
      setAllRoutes([]);
      setFilteredRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // useEffect(() => {
  //   let filtered = [...allRoutes];

  //   // Search filter
  //   if (searchTerm) {
  //     filtered = filtered.filter(({ path, building, floor }) =>
  //       path.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       path.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       path.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       building.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       floor.label.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   // Building filter
  //   if (selectedBuildingId !== 'all') {
  //     filtered = filtered.filter(({ building }) => 
  //       building.building_id === selectedBuildingId
  //     );
  //   }

  //   // Status filter
  //   if (statusFilter !== 'all') {
  //     filtered = filtered.filter(({ path }) => {
  //       if (statusFilter === 'published') return path.isPublished;
  //       if (statusFilter === 'draft') return !path.isPublished;
  //       return true;
  //     });
  //   }

  //   // Type filter
  //   if (typeFilter !== 'all') {
  //     filtered = filtered.filter(({ path }) => {
  //       if (typeFilter === 'single') return !path.isMultiFloor;
  //       if (typeFilter === 'multi') return path.isMultiFloor;
  //       return true;
  //     });
  //   }

  //   setFilteredRoutes(filtered);
  // }, [allRoutes, searchTerm, selectedBuildingId, statusFilter, typeFilter]);

  // Handle preview
  
  
  useEffect(() => {
    let filtered = [...(allRoutes || [])]; // Add safety check
  
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(({ path, building, floor }) =>
        (path?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (path?.source || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (path?.destination || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (building?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (floor?.label || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // Building filter
    if (selectedBuildingId !== 'all') {
      filtered = filtered.filter(({ building }) => 
        building?.building_id === selectedBuildingId
      );
    }
  
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(({ path }) => {
        if (statusFilter === 'published') return path?.isPublished;
        if (statusFilter === 'draft') return !path?.isPublished;
        return true;
      });
    }
  
    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(({ path }) => {
        if (typeFilter === 'single') return !path?.isMultiFloor;
        if (typeFilter === 'multi') return path?.isMultiFloor;
        return true;
      });
    }
  
    setFilteredRoutes(filtered);
  }, [allRoutes, searchTerm, selectedBuildingId, statusFilter, typeFilter]);


  const handlePreview = (path: Path, building: BuildingType, floor: Floor) => {
    setPreviewRoute({ path, building, floor });
  };

  // Handle edit
  const handleEdit = (path: Path, building: BuildingType, floor: Floor) => {
    onEditRoute(path, building, floor);
  };

  // Handle delete
  const handleDelete = async (pathId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete path:', pathId);
    toast.success('Path deleted successfully');
    loadAllData(); // Reload data
  };

  // Statistics
  // const stats = {
  //   total: allRoutes.length,
  //   published: allRoutes.filter(({ path }) => path.isPublished).length,
  //   draft: allRoutes.filter(({ path }) => !path.isPublished).length,
  //   multiFloor: allRoutes.filter(({ path }) => path.isMultiFloor).length,
  //   buildings: buildings.length,
  //   floors: buildings.reduce((sum, building) => sum + building.floors.length, 0)
  // };


  const stats = {
    total: allRoutes?.length || 0,
    published: allRoutes?.filter(({ path }) => path?.isPublished).length || 0,
    draft: allRoutes?.filter(({ path }) => !path?.isPublished).length || 0,
    multiFloor: allRoutes?.filter(({ path }) => path?.isMultiFloor).length || 0,
    buildings: buildings?.length || 0,
    floors: buildings?.reduce((sum, building) => sum + (building?.floors?.length || 0), 0) || 0
  };

  // Show preview modal if route is selected
  if (previewRoute) {
    return (
      <RoutePreview
        path={previewRoute.path}
        building={previewRoute.building}
        floor={previewRoute.floor}
        onClose={() => setPreviewRoute(null)}
        onEdit={() => {
          handleEdit(previewRoute.path, previewRoute.building, previewRoute.floor);
          setPreviewRoute(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Route className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <Globe className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-orange-600">{stats.draft}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Buildings</p>
                <p className="text-2xl font-bold text-purple-600">{stats.buildings}</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Route Filters
              </CardTitle>
              <CardDescription>
                Search and filter your navigation routes
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAllData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Building Filter */}
            <Select value={selectedBuildingId} onValueChange={setSelectedBuildingId}>
              <SelectTrigger>
                <SelectValue placeholder="All Buildings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map((building) => (
                  <SelectItem key={building.building_id} value={building.building_id}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single Floor</SelectItem>
                <SelectItem value="multi">Multi Floor</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedBuildingId('all');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedBuildingId !== 'all' || statusFilter !== 'all' || typeFilter !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedBuildingId !== 'all' && (
                <Badge variant="secondary">
                  Building: {buildings.find(b => b.building_id === selectedBuildingId)?.name}
                </Badge>
              )}
              {statusFilter !== 'all' && (
                <Badge variant="secondary">
                  Status: {statusFilter}
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary">
                  Type: {typeFilter}
                  </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Routes Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                Routes ({filteredRoutes.length})
              </CardTitle>
              <CardDescription>
                {filteredRoutes.length === allRoutes.length 
                  ? `Showing all ${allRoutes.length} routes`
                  : `Showing ${filteredRoutes.length} of ${allRoutes.length} routes`
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading routes...</p>
              </div>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="text-center py-12">
              {allRoutes.length === 0 ? (
                <div>
                  <Route className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first navigation route to get started.
                  </p>
                  <Button onClick={loadAllData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No matching routes</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedBuildingId('all');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }>
              {filteredRoutes.map(({ path, building, floor }) => (
                <RouteCard
                  key={path.id}
                  path={path}
                  building={building}
                  floor={floor}
                  onPreview={() => handlePreview(path, building, floor)}
                  onEdit={() => handleEdit(path, building, floor)}
                  onDelete={() => handleDelete(path.id)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Footer */}
      {filteredRoutes.length > 0 && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {filteredRoutes.filter(({ path }) => path.isPublished).length} Published
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-orange-600" />
                  {filteredRoutes.filter(({ path }) => !path.isPublished).length} Drafts
                </span>
                <span className="flex items-center gap-1">
                  <Layers className="h-4 w-4 text-purple-600" />
                  {filteredRoutes.filter(({ path }) => path.isMultiFloor).length} Multi-floor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Total: {filteredRoutes.length} routes</span>
                {filteredRoutes.length !== allRoutes.length && (
                  <Badge variant="outline" className="text-xs">
                    Filtered
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
