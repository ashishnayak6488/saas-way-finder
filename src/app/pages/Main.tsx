"use client";
import { useState, useEffect } from "react";
import { Search, Route as RouteIcon, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import {
  locations,
  floors,
  events,
  getLocationGif,
  getFloorGif,
  searchMapPaths,
  getAllAvailableRoutes,
} from "@/lib/data";
import { MapCanvas } from "@/components/MapCanvas";

// Custom type definitions to avoid conflicts with browser APIs
interface AppLocation {
  id: string;
  name: string;
  floor: number;
}

interface AppEvent {
  id: number;
  title: string;
  type: string;
  date: string;
  image: string;
  description: string;
}

interface AppFloor {
  number: number;
  name: string;
}

// Standardized map container dimensions
const MAP_CONTAINER_CONFIG = {
  aspectRatio: 16 / 9,
  maxWidth: 1200,
  maxHeight: 675, // 1200 * (9/16)
  minWidth: 800,
  minHeight: 450, // 800 * (9/16)
};

export default function Main() {
  //   const navigate = useNavigate();
  const router = useRouter();
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceLocation, setSourceLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [searchResults, setSearchResults] = useState<AppLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<AppLocation | null>(
    null
  );
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [currentGif, setCurrentGif] = useState("/gifs/floor-0.jpeg");
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isRouteMode, setIsRouteMode] = useState(false);
  const [routeSearchResults, setRouteSearchResults] = useState<any>(null);
  const [availableRoutes, setAvailableRoutes] = useState<any[]>([]);

  // Load available routes on component mount
  useEffect(() => {
    const routes = getAllAvailableRoutes();
    setAvailableRoutes(routes);
  }, []);

  // Handle search input effect for location search
  useEffect(() => {
    if (searchQuery.trim() === "" || isRouteMode) {
      setSearchResults([]);
      return;
    }

    const filteredLocations = locations.filter((location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredLocations);
  }, [searchQuery, isRouteMode]);

  // Cycle through events effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) =>
        prevIndex === events.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle location selection
  const handleLocationSelect = (location: AppLocation) => {
    setSelectedLocation(location);
    setCurrentGif(getLocationGif(location.id));
    setSearchQuery("");
    setSearchResults([]);
    setIsRouteMode(false);
    setRouteSearchResults(null);
  };

  // Handle floor selection
  const handleFloorSelect = (floor: number) => {
    setSelectedFloor(floor);
    setCurrentGif(getFloorGif(floor));
    setSelectedLocation(null);
    setIsRouteMode(false);
    setRouteSearchResults(null);
  };

  // Handle facility icon click
  const handleFacilityClick = (facilityId: string) => {
    const facility = locations.find((loc) => loc.id === facilityId);
    if (facility) {
      setSelectedLocation(facility);
      setCurrentGif(getLocationGif(facilityId));
      setIsRouteMode(false);
      setRouteSearchResults(null);
    }
  };

  // Handle route search functionality
  const handleRouteSearch = () => {
    if (!sourceLocation.trim() || !destinationLocation.trim()) {
      alert("Please enter both source and destination locations");
      return;
    }

    const result = searchMapPaths(sourceLocation, destinationLocation);

    if (result) {
      setRouteSearchResults(result);
      setCurrentGif(result.map.imageUrl);
      setIsRouteMode(true);
      setSelectedLocation(null);
    } else {
      alert("No route found between these locations");
      setRouteSearchResults(null);
    }
  };

  // Handle search functionality (legacy)
  const handleSearch = () => {
    if (searchResults.length > 0) {
      handleLocationSelect(searchResults[0]);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isRouteMode) {
        handleRouteSearch();
      } else {
        handleSearch();
      }
    }
  };

  // Navigate to map editor
  const handleAddMaps = () => {
    // navigate("/map-editor");
    router.push("/map-editor");
  };

  // Handle event navigation
  const handlePreviousEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Toggle between search modes
  const toggleSearchMode = () => {
    setIsRouteMode(!isRouteMode);
    setSearchQuery("");
    setSourceLocation("");
    setDestinationLocation("");
    setSearchResults([]);
    setRouteSearchResults(null);
  };

  // Clear route search
  const clearRouteSearch = () => {
    setSourceLocation("");
    setDestinationLocation("");
    setRouteSearchResults(null);
    setIsRouteMode(false);
    setCurrentGif("/gifs/floor-0.jpeg");
  };

  // Facility data
  const facilities = [
    { id: "washrooms", name: "Wash Rooms", icon: "/icons/washroom.jpeg" },
    {
      id: "lost-found",
      name: "Lost and Found",
      icon: "/icons/lostandfound.jpeg",
    },
    { id: "pantry", name: "Pantry", icon: "/icons/pantry.jpeg" },
    { id: "cafeteria", name: "Cafeteria", icon: "/icons/cafeteria.jpeg" },
    { id: "store", name: "Store", icon: "/icons/store.jpeg" },
  ];

  return (
    <main className="h-screen w-screen overflow-hidden bg-white flex flex-col">
      <div className="flex-1 flex flex-col p-2 sm:p-4 max-h-screen">
        {/* Header with Titan Logo, Title, and Search Bar - Fixed height */}
        <div className="relative flex items-center justify-between mb-2 sm:mb-4 h-16 sm:h-20 flex-shrink-0">
          {/* Titan Logo - Left side */}
          <div className="flex-shrink-0">
            <img
              src="/images/titan-logo-1.png"
              alt="Titan Logo"
              className="w-15 h-15 sm:w-20 sm:h-20"
            />
          </div>

          {/* Centered Title */}
          <div className="flex-1 flex justify-center">
            <span className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800 inline-block rounded-2xl shadow-[0_4px_6px_-1px_rgba(101,235,235,0.5),_-4px_0_6px_-1px_rgba(101,235,235,0.5),_4px_0_6px_-1px_rgba(101,235,235,0.5)] p-2 sm:p-4">
              Welcome To Titan Integrity Campus
            </span>
          </div>

          {/* Search Bar and Add Maps Button - Right side */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {/* Add Maps Button */}
            <Button
              onClick={handleAddMaps}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200"
            >
              Add Maps
            </Button>

            {/* Search Mode Toggle */}
            <Button
              onClick={toggleSearchMode}
              variant="outline"
              className="px-3 py-2"
            >
              <RouteIcon className="h-4 w-4 mr-2" />
              {isRouteMode ? "Location Search" : "Route Search"}
            </Button>

            {/* Search Bar */}
            <div className="w-64 sm:w-80 relative">
              {!isRouteMode ? (
                // Single location search
                <div className="relative flex items-center">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Type where you want to go..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-10 pl-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 shadow-[0_0_12px_rgba(101,235,235,0.5)]"
                    />
                    <Button
                      onClick={handleSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 p-0 bg-cyan-500 hover:bg-cyan-600 rounded-md shadow-sm transition-all duration-200"
                    >
                      <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Route search (source to destination)
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="From..."
                      value={sourceLocation}
                      onChange={(e) => setSourceLocation(e.target.value)}
                      className="flex-1 text-sm border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                    />
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="To..."
                      value={destinationLocation}
                      onChange={(e) => setDestinationLocation(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 text-sm border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 transition-all duration-200"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleRouteSearch}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white text-sm py-1"
                    >
                      Find Route
                    </Button>
                    <Button
                      onClick={clearRouteSearch}
                      variant="outline"
                      className="text-sm py-1"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Search Results Dropdown for location search */}
              {searchResults.length > 0 && !isRouteMode && (
                <div className="absolute z-20 w-full mt-2 bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] border border-gray-100 max-h-32 sm:max-h-40 overflow-y-auto">
                  <ul className="py-1">
                    {searchResults.map((location, index) => (
                      <li
                        key={location.id}
                        onClick={() => handleLocationSelect(location)}
                        className={`px-3 py-2 hover:bg-cyan-50 cursor-pointer transition-colors duration-150 ${
                          index === 0 ? "bg-cyan-25" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <Search className="h-3 w-3 text-gray-400 mr-2" />
                          <span className="text-gray-700 text-sm">
                            {location.name}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Search hint */}
              {searchQuery.length === 0 && !isRouteMode && (
                <div className="absolute mt-1 text-xs text-gray-400 flex items-center">
                  <Search className="h-3 w-3 mr-1" />
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Main Content - Flexible height */}
        <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 flex-1 min-h-0">
          {/* Left Side - 75% width */}
          <div className="w-full lg:w-3/4 flex flex-col min-h-0">
            {/* Main Display - Takes remaining space with standardized dimensions */}
            <div
              className="relative rounded-lg overflow-hidden flex-1 min-h-0 flex items-center justify-center"
              style={{
                minHeight: `${MAP_CONTAINER_CONFIG.minHeight}px`,
                maxHeight: `${MAP_CONTAINER_CONFIG.maxHeight}px`,
              }}
            >
              {routeSearchResults ? (
                // Show map with route - standardized container
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    maxWidth: `${MAP_CONTAINER_CONFIG.maxWidth}px`,
                    aspectRatio: `${MAP_CONTAINER_CONFIG.aspectRatio}`,
                  }}
                >
                  <MapCanvas
                    imageUrl={routeSearchResults.map.imageUrl}
                    currentPath={[]}
                    isDesignMode={false}
                    isEditMode={false}
                    isPreviewMode={true}
                    isTagMode={false}
                    isVerticalTagMode={false}
                    selectedShapeType="circle"
                    onCanvasClick={() => {}}
                    onDotDrag={() => {}}
                    onShapeDrawn={() => {}}
                    onVerticalShapeDrawn={() => {}}
                    paths={[routeSearchResults.path]}
                    animatedPath={routeSearchResults.path.points}
                    tags={[]}
                    verticalConnectors={[]}
                  />
                </div>
              ) : (
                // Show GIF with standardized dimensions
                <div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    maxWidth: `${MAP_CONTAINER_CONFIG.maxWidth}px`,
                    aspectRatio: `${MAP_CONTAINER_CONFIG.aspectRatio}`,
                  }}
                >
                  <img
                    src={currentGif}
                    alt="Campus View"
                    className="w-full h-full object-cover rounded-lg"
                    style={{
                      maxWidth: `${MAP_CONTAINER_CONFIG.maxWidth}px`,
                      maxHeight: `${MAP_CONTAINER_CONFIG.maxHeight}px`,
                    }}
                  />

                  {/* Floor Selector */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1 sm:gap-2 bg-white/80 p-1 sm:p-2 rounded-lg shadow-[0_0_8px_rgba(101,235,235,0.5)]">
                    {floors.map((floor) => (
                      <button
                        key={floor.number}
                        onClick={() => handleFloorSelect(floor.number)}
                        className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${
                          selectedFloor === floor.number
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {floor.number}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Facility Icons - Fixed height */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2 lg:gap-4 mt-2 sm:mt-4 h-16 sm:h-20 lg:h-24 flex-shrink-0">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  onClick={() => handleFacilityClick(facility.id)}
                  className="bg-white rounded-lg shadow-[0_0_8px_rgba(101,235,235,0.4)] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:shadow-[0_0_12px_rgba(101,235,235,0.6)] transition-all p-1 h-full"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 relative mb-1">
                    <img
                      src={facility.icon}
                      alt={facility.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-gray-600 text-xs sm:text-sm text-center font-medium leading-tight">
                    {facility.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - 25% width */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2 sm:gap-4 min-h-0">
            {/* Location Suggestions Card - Fixed height */}
            <Card className="shadow-[0_0_12px_rgba(101,235,235,0.5)] flex-shrink-0">
              <CardContent className="p-2 sm:p-4">
                <h3 className="text-gray-500 mb-2 font-medium text-sm">
                  {availableRoutes.length > 0
                    ? "Available Routes"
                    : "Popular Locations"}
                </h3>
                <div className="space-y-1">
                  {availableRoutes.length > 0
                    ? availableRoutes.slice(0, 3).map((route, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            setSourceLocation(route.source);
                            setDestinationLocation(route.destination);
                            setIsRouteMode(true);
                          }}
                          className="p-2 cursor-pointer rounded-lg transition-all duration-200 hover:bg-gray-50 border border-transparent hover:border-cyan-200"
                        >
                          <div className="text-xs text-gray-600 mb-1">
                            {route.mapName}
                          </div>
                          <div className="text-sm text-gray-700">
                            {route.source} → {route.destination}
                          </div>
                        </div>
                      ))
                    : locations.slice(0, 3).map((location) => (
                        <div
                          key={location.id}
                          onClick={() => handleLocationSelect(location)}
                          className={`p-2 cursor-pointer rounded-lg transition-all duration-200 ${
                            selectedLocation?.id === location.id
                              ? "bg-cyan-100 border border-cyan-200"
                              : "hover:bg-gray-50 border border-transparent"
                          }`}
                        >
                          <span className="text-gray-700 text-sm">
                            {location.name}
                          </span>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>

            {/* Events Section Card - Flexible height */}
            <Card className="shadow-[0_0_12px_rgba(101,235,235,0.5)] flex-1 min-h-0">
              <CardContent className="h-full flex flex-col p-2 sm:p-4">
                <h3 className="text-gray-500 mb-2 text-center font-medium text-sm">
                  Recent Events
                </h3>
                <div className="relative flex-1 min-h-0">
                  <Card className="h-full shadow-[0_0_12px_rgba(101,235,235,0.5)]">
                    <CardContent className="h-full flex flex-col p-2 sm:p-4">
                      <div className="text-xs text-green-500">
                        {events[currentEventIndex].type}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold mb-2">
                        {events[currentEventIndex].title}
                      </h4>
                      <div className="flex-1 relative min-h-0 mb-2">
                        <img
                          src={events[currentEventIndex].image}
                          alt={events[currentEventIndex].title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {events[currentEventIndex].date}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Navigation */}
                  <button
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-1 sm:p-2 shadow-[0_0_6px_rgba(101,235,235,0.5)] hover:shadow-[0_0_8px_rgba(101,235,235,0.7)] transition-all"
                    onClick={handlePreviousEvent}
                  >
                    <span className="text-gray-500 text-sm">←</span>
                  </button>
                  <button
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-1 sm:p-2 shadow-[0_0_6px_rgba(101,235,235,0.5)] hover:shadow-[0_0_8px_rgba(101,235,235,0.7)] transition-all"
                    onClick={handleNextEvent}
                  >
                    <span className="text-gray-500 text-sm">→</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
