"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Navigation,
  MapPin,
  Route,
  Building as BuildingIcon,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Users,
  List,
  Grid,
} from "lucide-react";
import { getStoredMaps, SavedMap } from "@/lib/data";
import { loadBuildingsFromAPI } from "@/lib/buildingData";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Building } from "@/types/building";
import MapCreator from "@/components/MapCreator";
import { RouteManager } from "@/components/route/RouteManager";
import { RoutePreview } from '@/components/route/RoutePreview';

interface MapEditorPageProps {}

// Add these interfaces for the route data
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

interface Floor {
  floor_id: string;
  label: string;
  imageUrl: string;
  order: number;
}

const MapEditorPage: React.FC<MapEditorPageProps> = () => {
  const [savedMaps, setSavedMaps] = useState<SavedMap[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMapCreator, setShowMapCreator] = useState(false);
  const [selectedMap, setSelectedMap] = useState<SavedMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewingRoute, setPreviewingRoute] = useState<{
    path: any;
    building: any;
    floor: any;
  } | null>(null);
  
  // New state for route management
  const [currentView, setCurrentView] = useState<'legacy' | 'routes' | 'creator'>('routes');
  const [selectedRouteForEdit, setSelectedRouteForEdit] = useState<{
    path: Path;
    building: Building;
    floor: Floor;
  } | null>(null);

  // Load saved maps and buildings on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load saved maps from localStorage (legacy)
      const maps = getStoredMaps();
      setSavedMaps(maps);

      // Load buildings from API
      const buildingsData = await loadBuildingsFromAPI();
      setBuildings(buildingsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMap = () => {
    setSelectedMap(null);
    setSelectedRouteForEdit(null);
    setCurrentView('creator');
  };

  const handleEditMap = (map: SavedMap) => {
    setSelectedMap(map);
    setSelectedRouteForEdit(null);
    setCurrentView('creator');
  };

  const handleMapCreatorClose = () => {
    setCurrentView('routes');
    setSelectedMap(null);
    setSelectedRouteForEdit(null);
    loadData(); // Refresh data after closing creator
  };

  // New handlers for route management
  const handleEditRoute = (path: Path, building: Building, floor: Floor) => {
    setSelectedRouteForEdit({ path, building, floor });
    setSelectedMap(null);
    setCurrentView('creator');
  };

  // const handlePreviewRoute = (path: Path, building: Building, floor: Floor) => {
  //   // For now, we'll redirect to edit mode with preview enabled
  //   // You can enhance this later with a dedicated preview mode
  //   setSelectedRouteForEdit({ path, building, floor });
  //   setSelectedMap(null);
  //   setCurrentView('creator');
  // };

  // Add this function to handle route preview
const handlePreviewRoute = (path: any, building: any, floor: any) => {
  setPreviewingRoute({ path, building, floor });
};



  const filteredMaps = savedMaps.filter(map =>
    map.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    map.paths.some(path => 
      path.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const getMapTypeIcon = (map: SavedMap) => {
    const isBuilding = buildings.some(building => 
      building.building_id === map.id || 
      building.floors.some(floor => floor.imageUrl === map.imageUrl)
    );
    
    return isBuilding ? <BuildingIcon className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const getMapStats = (map: SavedMap) => {
    const pathCount = map.paths.length;
    const locationCount = new Set([
      ...map.paths.map(p => p.source),
      ...map.paths.map(p => p.destination)
    ]).size;
    
    return { pathCount, locationCount };
  };

  // Show MapCreator if in creator mode
  if (currentView === 'creator') {
    return (
      <MapCreator
        selectedMap={selectedMap}
        selectedRoute={selectedRouteForEdit}
        onClose={handleMapCreatorClose}
      />
    );
  }


  // Add this before the return statement to show preview modal
if (previewingRoute) {
  return (
    <RoutePreview
      path={previewingRoute.path}
      building={previewingRoute.building}
      floor={previewingRoute.floor}
      onClose={() => setPreviewingRoute(null)}
      onEdit={() => {
        handleEditRoute(previewingRoute.path, previewingRoute.building, previewingRoute.floor);
        setPreviewingRoute(null);
      }}
    />
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Link href="/dashboard" passHref>
                  <Navigation className="h-6 w-6 text-white" />
                </Link>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Map Editor</h1>
                <p className="text-sm text-gray-500">
                  {currentView === 'routes' 
                    ? "Manage your wayfinding routes and maps" 
                    : "Manage your legacy maps"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={currentView === 'routes' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView('routes')}
                  className="h-8"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Routes
                </Button>
                <Button
                  variant={currentView === 'legacy' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView('legacy')}
                  className="h-8"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Legacy
                </Button>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {currentView === 'routes' 
                    ? `${buildings.length} buildings` 
                    : `${savedMaps.length} maps • ${buildings.length} buildings`
                  }
                </span>
              </div>
              <Button onClick={handleCreateMap} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Map
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Routes View */}
        {currentView === 'routes' && (
          <RouteManager
            onEditRoute={handleEditRoute}
            onPreviewRoute={handlePreviewRoute}
          />
        )}

        {/* Legacy Maps View */}
        {currentView === 'legacy' && (
          <>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search maps, locations, or routes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Link href="/buildings">
                  <Button variant="outline">
                    <BuildingIcon className="h-4 w-4 mr-2" />
                    Manage Buildings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading maps...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && savedMaps.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Route className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Legacy Maps Found
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Legacy maps from local storage will appear here. Use the Routes view to manage your current navigation routes.
                </p>
                <Button onClick={() => setCurrentView('routes')} className="bg-blue-600 hover:bg-blue-700">
                  <Route className="h-4 w-4 mr-2" />
                  View Routes
                </Button>
              </div>
            )}

            {/* Legacy Maps Grid */}
            {!isLoading && filteredMaps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaps.map((map) => {
                  const stats = getMapStats(map);
                  return (
                    <Card key={map.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getMapTypeIcon(map)}
                            <CardTitle className="text-lg truncate">{map.name}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-1">
                            {map.isPublished && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Published
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-orange-600">
                              Legacy
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="flex items-center space-x-4 text-xs">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(map.createdAt).toLocaleDateString()}</span>
                          </span>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Map Preview */}
                        <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                          {map.imageUrl ? (
                            <img
                              src={map.imageUrl}
                              alt={map.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Map Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{stats.pathCount}</div>
                            <div className="text-xs text-gray-500">Routes</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{stats.locationCount}</div>
                            <div className="text-xs text-gray-500">Locations</div>
                          </div>
                        </div>

                        {/* Recent Routes */}
                        {map.paths.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Routes</h4>
                            <div className="space-y-1">
                              {map.paths.slice(0, 2).map((path, index) => (
                                <div key={index} className="text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                                  {path.source} → {path.destination}
                                </div>
                              ))}
                              {map.paths.length > 2 && (
                                <div className="text-xs text-gray-500">
                                  +{map.paths.length - 2} more routes
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMap(map)}
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Link href={`/map-viewer/${map.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* No Search Results */}
            {!isLoading && savedMaps.length > 0 && filteredMaps.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No maps found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or create a new map.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MapEditorPage;


