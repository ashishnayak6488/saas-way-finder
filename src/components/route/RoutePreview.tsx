"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ArrowLeft,
  MapPin,
  Route,
  Building,
  Globe,
  Clock,
  Layers,
  Navigation,
  Target,
  Ruler,
  Eye,
  Edit,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
} from "lucide-react";
import { Building as BuildingType, Floor } from "@/types/building";
import { getLocationsByFloorId } from "@/lib/locationData";
import { getVerticalConnectorsByFloorId } from "@/lib/verticalConnectorData";
import toast from "react-hot-toast";

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

interface TaggedLocation {
  id: string;
  name: string;
  category: string;
  floorId: string;
  shape: "circle" | "rectangle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  logoUrl?: string;
  color?: string;
  textColor?: string;
  isPublished?: boolean;
  description?: string;
}

interface VerticalConnector {
  id: string;
  name: string;
  type: string;
  sharedId: string;
  floorId: string;
  shape: "circle" | "rectangle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  createdAt: string;
}

interface RoutePreviewProps {
  path: Path;
  building: BuildingType;
  floor: Floor;
  onClose: () => void;
  onEdit: () => void;
}

export const RoutePreview: React.FC<RoutePreviewProps> = ({
  path,
  building,
  floor,
  onClose,
  onEdit,
}) => {
  const [tags, setTags] = useState<TaggedLocation[]>([]);
  const [connectors, setConnectors] = useState<VerticalConnector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFloor, setCurrentFloor] = useState<Floor>(floor);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mapScale, setMapScale] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [showDetails, setShowDetails] = useState(true);

  // Add this after the other state declarations and before the useEffect hooks:
  const currentPoints = useMemo(() => {
    if (path.isMultiFloor && path.segments && path.segments.length > 0) {
      return path.segments[currentSegmentIndex]?.points || [];
    }
    return path.points || [];
  }, [path, currentSegmentIndex]);

  // Load tags and connectors for current floor
  useEffect(() => {
    const loadFloorData = async () => {
      setIsLoading(true);
      try {
        const [tagsData, connectorsData] = await Promise.all([
          getLocationsByFloorId(currentFloor.floor_id),
          getVerticalConnectorsByFloorId(currentFloor.floor_id),
        ]);

        const convertedTags = tagsData.map((tagData) => ({
          id: tagData.location_id || "",
          name: tagData.name || "",
          category: tagData.category || "",
          floorId: tagData.floor_id || "",
          shape: (tagData.shape as "circle" | "rectangle") || "circle",
          x: tagData.x || 0,
          y: tagData.y || 0,
          width: tagData.width,
          height: tagData.height,
          radius: tagData.radius,
          logoUrl: tagData.logo_url,
          color: tagData.color,
          textColor: tagData.text_color,
          isPublished: tagData.is_published,
          description: tagData.description,
        }));

        const convertedConnectors = connectorsData.map((connectorData) => ({
          id: connectorData.connector_id || "",
          name: connectorData.name || "",
          type: connectorData.connector_type || "",
          sharedId: connectorData.shared_id || "",
          floorId: connectorData.floor_id || "",
          shape: (connectorData.shape as "circle" | "rectangle") || "circle",
          x: connectorData.x || 0,
          y: connectorData.y || 0,
          width: connectorData.width,
          height: connectorData.height,
          radius: connectorData.radius,
          color: connectorData.color,
          createdAt: connectorData.created_at || new Date().toISOString(),
        }));

        setTags(convertedTags);
        setConnectors(convertedConnectors);
      } catch (error) {
        console.error("Error loading floor data:", error);
        toast.error("Failed to load floor data");
      } finally {
        setIsLoading(false);
      }
    };

    loadFloorData();
  }, [currentFloor]);

  // Calculate path statistics
  const getPathStats = () => {
    if (path.isMultiFloor && path.segments) {
      const totalPoints = path.segments.reduce(
        (sum, segment) => sum + segment.points.length,
        0
      );
      const totalDistance = path.segments.reduce((sum, segment) => {
        return sum + calculateDistance(segment.points);
      }, 0);

      return {
        type: "Multi-floor",
        pointCount: totalPoints,
        segmentCount: path.segments.length,
        distance: totalDistance.toFixed(2),
        floors: path.segments.length,
      };
    }

    return {
      type: "Single-floor",
      pointCount: path.points.length,
      segmentCount: 1,
      distance: calculateDistance(path.points).toFixed(2),
      floors: 1,
    };
  };

  const calculateDistance = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return 0;

    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      distance += Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
    }
    return distance;
  };

  // Get source and destination tags
  const getSourceTag = () => {
    return tags.find(
      (tag) =>
        tag.id === path.sourceTagId ||
        tag.name.toLowerCase() === path.source.toLowerCase()
    );
  };

  const getDestinationTag = () => {
    return tags.find(
      (tag) =>
        tag.id === path.destinationTagId ||
        tag.name.toLowerCase() === path.destination.toLowerCase()
    );
  };

  // Handle floor switching for multi-floor paths
  const switchToFloor = (floorId: string, segmentIndex: number) => {
    const targetFloor = building.floors.find((f) => f.floor_id === floorId);
    if (targetFloor) {
      setCurrentFloor(targetFloor);
      setCurrentSegmentIndex(segmentIndex);
    }
  };

  // Animation controls
  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationProgress(0);

    const duration = 3000; // 3 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimationProgress(progress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const resetView = () => {
    setMapScale(1);
    setMapOffset({ x: 0, y: 0 });
    setAnimationProgress(0);
    setIsAnimating(false);
  };

  const stats = getPathStats();

  // const stats = useMemo(() => {
  //   const points = currentPoints;
  //   let distance = 0;

  //   if (points.length > 1) {
  //     for (let i = 1; i < points.length; i++) {
  //       const prev = points[i - 1];
  //       const curr = points[i];
  //       distance += Math.sqrt(
  //         Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
  //       );
  //     }
  //   }

  //   return {
  //     waypoints: points.length,
  //     distance: distance.toFixed(2),
  //     segments: path.isMultiFloor ? (path.segments?.length || 1) : 1
  //   };
  // }, [currentPoints, path]);

  const sourceTag = getSourceTag();
  const destinationTag = getDestinationTag();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex">
        {/* Sidebar with Route Details */}
        <div
          className={`${
            showDetails ? "w-80" : "w-12"
          } transition-all duration-300 border-r bg-gray-50 flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              {showDetails && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    Route Preview
                  </h2>
                  <p className="text-sm text-gray-500">
                    {building.name} • {currentFloor.label}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="p-2"
              >
                {showDetails ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Route Details */}
          {showDetails && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Basic Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Route Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500">
                      Route Name
                    </label>
                    <p className="text-sm font-medium">{path.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        From
                      </label>
                      <p className="text-sm font-medium text-green-600">
                        {path.source}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500">
                        To
                      </label>
                      <p className="text-sm font-medium text-red-600">
                        {path.destination}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Badge
                      variant={path.isPublished ? "default" : "secondary"}
                      className={
                        path.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {path.isPublished ? (
                        <>
                          <Globe className="h-3 w-3 mr-1" />
                          Published
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Draft
                        </>
                      )}
                    </Badge>
                    {path.isMultiFloor && (
                      <Badge
                        variant="outline"
                        className="text-purple-600 border-purple-300"
                      >
                        <Layers className="h-3 w-3 mr-1" />
                        Multi-floor
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {stats.pointCount}
                      </div>
                      <div className="text-xs text-gray-500">Waypoints</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {stats.floors}
                      </div>
                      <div className="text-xs text-gray-500">
                        Floor{stats.floors > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Path Length</span>
                      <span className="text-sm font-medium">
                        {stats.distance} units
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Complexity</span>
                      <span className="text-sm font-medium">
                        {stats.pointCount > 10
                          ? "Complex"
                          : stats.pointCount > 5
                          ? "Medium"
                          : "Simple"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Details */}
              {(sourceTag || destinationTag) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sourceTag && (
                      <div className="p-2 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: sourceTag.color || "#10b981",
                            }}
                          />
                          <span className="text-sm font-medium text-green-800">
                            {sourceTag.name}
                          </span>
                        </div>
                        <p className="text-xs text-green-600">
                          {sourceTag.category} • Starting Point
                        </p>
                        {sourceTag.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {sourceTag.description}
                          </p>
                        )}
                      </div>
                    )}

                    {destinationTag && (
                      <div className="p-2 bg-red-50 rounded border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                destinationTag.color || "#ef4444",
                            }}
                          />
                          <span className="text-sm font-medium text-red-800">
                            {destinationTag.name}
                          </span>
                        </div>
                        <p className="text-xs text-red-600">
                          {destinationTag.category} • Destination
                        </p>
                        {destinationTag.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {destinationTag.description}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Multi-floor Navigation */}
              {path.isMultiFloor && path.segments && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Floor Navigation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {path.segments.map((segment, index) => {
                      const segmentFloor = building.floors.find(
                        (f) => f.floor_id === segment.floorId
                      );
                      const isCurrentSegment = index === currentSegmentIndex;

                      return (
                        <Button
                          key={segment.id}
                          variant={isCurrentSegment ? "default" : "outline"}
                          size="sm"
                          onClick={() => switchToFloor(segment.floorId, index)}
                          className="w-full justify-start"
                        >
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3" />
                            <span>
                              {segmentFloor?.label || `Floor ${index + 1}`}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({segment.points.length} points)
                            </span>
                          </div>
                        </Button>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Animation Controls */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Path Animation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={startAnimation}
                    disabled={isAnimating}
                    className="w-full"
                    size="sm"
                  >
                    {isAnimating ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                        Animating...
                      </>
                    ) : (
                      <>
                        <Navigation className="h-3 w-3 mr-2" />
                        Start Animation
                      </>
                    )}
                  </Button>

                  {animationProgress > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-100"
                        style={{ width: `${animationProgress * 100}%` }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 border-t bg-white">
            {showDetails ? (
              <div className="space-y-2">
                <Button onClick={onEdit} className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Route
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Routes
                </Button>
              </div>
            ) : (
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {/* Main Map Display */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {/* Map Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {path.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {building.name} • {currentFloor.label}
                  {path.isMultiFloor &&
                    ` (Segment ${currentSegmentIndex + 1} of ${
                      path.segments?.length
                    })`}
                </p>
              </div>

              {/* Map Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapScale(Math.min(mapScale * 1.2, 3))}
                  disabled={mapScale >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMapScale(Math.max(mapScale / 1.2, 0.5))}
                  disabled={mapScale <= 0.5}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={resetView}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <span className="text-xs text-gray-500 px-2">
                  {Math.round(mapScale * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Map Canvas */}
          <div className="flex-1 overflow-hidden relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading map...</p>
                </div>
              </div>
            ) : (
              <div
                className="w-full h-full flex items-center justify-center overflow-auto"
                style={{
                  transform: `scale(${mapScale}) translate(${mapOffset.x}px, ${mapOffset.y}px)`,
                  transformOrigin: "center center",
                }}
              >
                <div className="relative max-w-full max-h-full">
                  {/* Floor Plan Image */}
                  <img
                    src={currentFloor.imageUrl}
                    alt={`${building.name} - ${currentFloor.label}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    style={{ maxWidth: "1200px", maxHeight: "800px" }}
                  />

                  {/* SVG Overlay for Path and Locations */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 1200 800"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Render Tags */}
                    {tags.map((tag) => (
                      <g key={tag.id}>
                        {tag.shape === "circle" ? (
                          <circle
                            cx={tag.x * 1200}
                            cy={tag.y * 800}
                            r={tag.radius ? tag.radius * 1200 : 15}
                            fill={tag.color || "#f59e0b"}
                            stroke="#fff"
                            strokeWidth="2"
                            opacity="0.8"
                          />
                        ) : (
                          <rect
                            x={(tag.x - (tag.width || 0.02) / 2) * 1200}
                            y={(tag.y - (tag.height || 0.02) / 2) * 800}
                            width={(tag.width || 0.02) * 1200}
                            height={(tag.height || 0.02) * 800}
                            fill={tag.color || "#f59e0b"}
                            stroke="#fff"
                            strokeWidth="2"
                            opacity="0.8"
                            rx="4"
                          />
                        )}

                        {/* Tag Label */}
                        <text
                          x={tag.x * 1200}
                          y={tag.y * 800 + 25}
                          textAnchor="middle"
                          className="text-xs font-medium"
                          fill={tag.textColor || "#000"}
                          style={{ fontSize: "12px" }}
                        >
                          {tag.name}
                        </text>
                      </g>
                    ))}

                    {/* Render Vertical Connectors */}
                    {connectors.map((connector) => (
                      <g key={connector.id}>
                        {connector.shape === "circle" ? (
                          <circle
                            cx={connector.x * 1200}
                            cy={connector.y * 800}
                            r={connector.radius ? connector.radius * 1200 : 12}
                            fill={connector.color || "#8b5cf6"}
                            stroke="#fff"
                            strokeWidth="2"
                            opacity="0.9"
                          />
                        ) : (
                          <rect
                            x={
                              (connector.x - (connector.width || 0.02) / 2) *
                              1200
                            }
                            y={
                              (connector.y - (connector.height || 0.02) / 2) *
                              800
                            }
                            width={(connector.width || 0.02) * 1200}
                            height={(connector.height || 0.02) * 800}
                            fill={connector.color || "#8b5cf6"}
                            stroke="#fff"
                            strokeWidth="2"
                            opacity="0.9"
                            rx="4"
                          />
                        )}

                        {/* Connector Label */}
                        <text
                          x={connector.x * 1200}
                          y={connector.y * 800 + 20}
                          textAnchor="middle"
                          className="text-xs font-medium"
                          fill="#8b5cf6"
                          style={{ fontSize: "10px" }}
                        >
                          {connector.name}
                        </text>
                      </g>
                    ))}

                    {/* Render Path */}
                    {(() => {
                      const currentPoints =
                        path.isMultiFloor && path.segments
                          ? path.segments[currentSegmentIndex]?.points || []
                          : path.points;

                      if (currentPoints.length < 2) return null;

                      // Calculate animated path based on progress
                      const getAnimatedPoints = () => {
                        if (!isAnimating || animationProgress === 0) {
                          return currentPoints;
                        }

                        const totalSegments = currentPoints.length - 1;
                        const targetSegment = Math.floor(
                          animationProgress * totalSegments
                        );
                        const segmentProgress =
                          animationProgress * totalSegments - targetSegment;

                        return currentPoints.slice(0, targetSegment + 2);
                      };

                      const displayPoints = getAnimatedPoints();
                      const pathString = displayPoints
                        .map(
                          (point, index) =>
                            `${index === 0 ? "M" : "L"} ${point.x * 1200} ${
                              point.y * 800
                            }`
                        )
                        .join(" ");

                      return (
                        <g>
                          {/* Path Shadow */}
                          <path
                            d={pathString}
                            stroke="rgba(0,0,0,0.2)"
                            strokeWidth="6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            transform="translate(2,2)"
                          />

                          {/* Main Path */}
                          <path
                            d={pathString}
                            stroke={path.color || "#3b82f6"}
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                          />

                          {/* Animated Path Overlay */}
                          {isAnimating && (
                            <path
                              d={pathString}
                              stroke={path.color || "#3b82f6"}
                              strokeWidth="6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              opacity="0.6"
                              strokeDasharray="10,5"
                              strokeDashoffset={-animationProgress * 100}
                              className="animate-pulse"
                            />
                          )}

                          {/* Waypoints */}
                          {displayPoints.map((point, index) => (
                            <g key={index}>
                              <circle
                                cx={point.x * 1200}
                                cy={point.y * 800}
                                r="4"
                                fill="#fff"
                                stroke={path.color || "#3b82f6"}
                                strokeWidth="2"
                              />

                              {/* Start Point */}
                              {index === 0 && (
                                <circle
                                  cx={point.x * 1200}
                                  cy={point.y * 800}
                                  r="8"
                                  fill="#10b981"
                                  stroke="#fff"
                                  strokeWidth="2"
                                />
                              )}

                              {/* End Point */}
                              {index === displayPoints.length - 1 &&
                                index > 0 && (
                                  <circle
                                    cx={point.x * 1200}
                                    cy={point.y * 800}
                                    r="8"
                                    fill="#ef4444"
                                    stroke="#fff"
                                    strokeWidth="2"
                                  />
                                )}
                            </g>
                          ))}

                          {/* Animated Dot */}
                          {isAnimating &&
                            animationProgress > 0 &&
                            (() => {
                              const totalSegments = currentPoints.length - 1;
                              const targetSegment = Math.floor(
                                animationProgress * totalSegments
                              );
                              const segmentProgress =
                                animationProgress * totalSegments -
                                targetSegment;

                              if (targetSegment < currentPoints.length - 1) {
                                const startPoint = currentPoints[targetSegment];
                                const endPoint =
                                  currentPoints[targetSegment + 1];
                                const animatedX =
                                  startPoint.x +
                                  (endPoint.x - startPoint.x) * segmentProgress;
                                const animatedY =
                                  startPoint.y +
                                  (endPoint.y - startPoint.y) * segmentProgress;

                                return (
                                  <circle
                                    cx={animatedX * 1200}
                                    cy={animatedY * 800}
                                    r="6"
                                    fill="#fbbf24"
                                    stroke="#fff"
                                    strokeWidth="2"
                                    className="animate-pulse"
                                  />
                                );
                              }
                              return null;
                            })()}
                        </g>
                      );
                    })()}

                    {/* Direction Arrows */}
                    {(() => {
                      const currentPoints =
                        path.isMultiFloor && path.segments
                          ? path.segments[currentSegmentIndex]?.points || []
                          : path.points;

                      if (currentPoints.length < 2) return null;

                      return currentPoints.slice(0, -1).map((point, index) => {
                        const nextPoint = currentPoints[index + 1];
                        const angle = Math.atan2(
                          (nextPoint.y - point.y) * 800,
                          (nextPoint.x - point.x) * 1200
                        );

                        const midX = ((point.x + nextPoint.x) / 2) * 1200;
                        const midY = ((point.y + nextPoint.y) / 2) * 800;

                        return (
                          <g key={`arrow-${index}`}>
                            <polygon
                              points="0,-4 8,0 0,4"
                              fill={path.color || "#3b82f6"}
                              transform={`translate(${midX},${midY}) rotate(${
                                (angle * 180) / Math.PI
                              })`}
                              opacity="0.7"
                            />
                          </g>
                        );
                      });
                    })()}
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Map Footer with Legend */}
          {/* <div className="p-3 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Start</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>End</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Waypoints</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Connectors</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Locations</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {currentPoints.length} waypoints • {stats.distance} units
              </div>
            </div>
          </div> */}

          <div className="p-3 border-t bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Start</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>End</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Waypoints</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Connectors</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Locations</span>
                </div>
              </div>

              <div className="text-xs text-gray-500">
                {/* {stats.waypoints} waypoints • {stats.distance} units */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
