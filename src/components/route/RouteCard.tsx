// "use client";

// import React, { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
// import {
//   Building,
//   MapPin,
//   Route,
//   Eye,
//   Edit3,
//   Globe,
//   Clock,
//   ArrowRight,
//   ChevronDown,
//   ChevronUp,
//   Layers,
//   Navigation
// } from 'lucide-react';
// import { Building as BuildingType, Floor } from '@/types/building';

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

// interface RouteCardProps {
//   path: Path;
//   building: BuildingType;
//   floor: Floor;
//   relatedTags: TaggedLocation[];
//   verticalConnectors: VerticalConnector[];
//   onEdit: (path: Path) => void;
//   onPreview: (path: Path) => void;
// }

// export const RouteCard: React.FC<RouteCardProps> = ({
//   path,
//   building,
//   floor,
//   relatedTags,
//   verticalConnectors,
//   onEdit,
//   onPreview
// }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const getPathStats = () => {
//     if (path.isMultiFloor && path.segments) {
//       const totalPoints = path.segments.reduce((sum, segment) => sum + segment.points.length, 0);
//       return {
//         type: 'Multi-floor',
//         pointCount: totalPoints,
//         segmentCount: path.segments.length
//       };
//     }
//     return {
//       type: 'Single-floor',
//       pointCount: path.points.length,
//       segmentCount: 1
//     };
//   };

//   const formatPathName = () => {
//     if (path.name.includes(' to ')) {
//       return path.name;
//     }
//     return `${path.source} → ${path.destination}`;
//   };

//   const getRelatedTags = () => {
//     return relatedTags.filter(tag => 
//       tag.id === path.sourceTagId || 
//       tag.id === path.destinationTagId ||
//       tag.name.toLowerCase() === path.source.toLowerCase() ||
//       tag.name.toLowerCase() === path.destination.toLowerCase()
//     );
//   };

//   const getConnectorsForPath = () => {
//     if (!path.isMultiFloor || !path.segments) return [];
    
//     return verticalConnectors.filter(connector =>
//       path.segments?.some(segment => segment.connectorId === connector.id)
//     );
//   };

//   const stats = getPathStats();
//   const pathTags = getRelatedTags();
//   const pathConnectors = getConnectorsForPath();

//   return (
//     <Card className="hover:shadow-lg transition-all duration-200">
//       <CardHeader className="pb-3">
//         <div className="flex items-start justify-between">
//           <div className="flex-1 min-w-0">
//             <div className="flex items-center gap-2 mb-2">
//               <CardTitle className="text-lg truncate">
//                 {formatPathName()}
//               </CardTitle>
//               <Badge 
//                 variant={path.isPublished ? "default" : "secondary"}
//                 className={path.isPublished ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
//               >
//                 {path.isPublished ? (
//                   <>
//                     <Globe className="h-3 w-3 mr-1" />
//                     Published
//                   </>
//                 ) : (
//                   <>
//                     <Clock className="h-3 w-3 mr-1" />
//                     Draft
//                   </>
//                 )}
//               </Badge>
//               {path.isMultiFloor && (
//                 <Badge variant="outline" className="text-blue-600 border-blue-300">
//                   <Layers className="h-3 w-3 mr-1" />
//                   Multi-floor
//                 </Badge>
//               )}
//             </div>
            
//             {/* Building and Floor Info */}
//             <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
//               <div className="flex items-center gap-1">
//                 <Building className="h-4 w-4" />
//                 <span>{building.name}</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <MapPin className="h-4 w-4" />
//                 <span>{floor.label}</span>
//               </div>
//             </div>

//             {/* Route Info */}
//             <div className="text-sm text-gray-700 mb-3">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">{path.source}</span>
//                 <ArrowRight className="h-4 w-4 text-gray-400" />
//                 <span className="font-medium">{path.destination}</span>
//               </div>
//             </div>

//             {/* Quick Stats */}
//             <div className="flex items-center gap-4 text-xs text-gray-500">
//               <div className="flex items-center gap-1">
//                 <Route className="h-3 w-3" />
//                 <span>{stats.pointCount} waypoints</span>
//               </div>
//               {stats.segmentCount > 1 && (
//                 <div className="flex items-center gap-1">
//                   <Layers className="h-3 w-3" />
//                   <span>{stats.segmentCount} segments</span>
//                 </div>
//               )}
//               {pathTags.length > 0 && (
//                 <div className="flex items-center gap-1">
//                   <MapPin className="h-3 w-3" />
//                   <span>{pathTags.length} locations</span>
//                 </div>
//               )}
//               {pathConnectors.length > 0 && (
//                 <div className="flex items-center gap-1">
//                   <Navigation className="h-3 w-3" />
//                   <span>{pathConnectors.length} connectors</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Path Color Indicator */}
//           {path.color && (
//             <div 
//               className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0"
//               style={{ backgroundColor: path.color }}
//               title={`Path color: ${path.color}`}
//             />
//           )}
//         </div>
//       </CardHeader>

//       <CardContent className="pt-0">
//         {/* Floor Map Preview */}
//         <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
//           {floor.imageUrl ? (
//             <img
//               src={floor.imageUrl}
//               alt={`${building.name} - ${floor.label}`}
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center">
//               <MapPin className="h-8 w-8 text-gray-400" />
//             </div>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               // onClick={() => onPreview(path)}
//               onClick={onPreview}
//               className="flex-1"
//             >
//               <Eye className="h-3 w-3 mr-1" />
//               Preview
//             </Button>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => onEdit(path)}
//               className="flex-1"
//             >
//               <Edit3 className="h-3 w-3 mr-1" />
//               Edit
//             </Button>
//           </div>
          
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsExpanded(!isExpanded)}
//             className="p-2"
//           >
//             {isExpanded ? (
//               <ChevronUp className="h-4 w-4" />
//             ) : (
//               <ChevronDown className="h-4 w-4" />
//             )}
//           </Button>
//         </div>

//         {/* Expanded Details */}
//         {isExpanded && (
//           <div className="space-y-4 pt-3 border-t">
//             {/* Related Location Tags */}
//             {pathTags.length > 0 && (
//               <div>
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">Related Locations</h4>
//                 <div className="grid grid-cols-1 gap-2">
//                   {pathTags.map((tag) => (
//                     <div key={tag.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
//                       <div 
//                         className="w-3 h-3 rounded-full"
//                         style={{ backgroundColor: tag.color || '#3b82f6' }}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-medium truncate">{tag.name}</div>
//                         <div className="text-xs text-gray-500">{tag.category}</div>
//                       </div>
//                       {tag.isPublished && (
//                         <Badge variant="secondary" className="text-xs">
//                           Published
//                         </Badge>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Vertical Connectors */}
//             {pathConnectors.length > 0 && (
//               <div>
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">Vertical Connectors</h4>
//                 <div className="grid grid-cols-1 gap-2">
//                   {pathConnectors.map((connector) => (
//                     <div key={connector.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
//                       <Navigation className="h-4 w-4 text-blue-600" />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-medium truncate">{connector.name}</div>
//                         <div className="text-xs text-gray-500">{connector.type}</div>
//                       </div>
//                       <Badge variant="outline" className="text-xs">
//                         {connector.sharedId}
//                       </Badge>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Path Segments (for multi-floor paths) */}
//             {path.isMultiFloor && path.segments && (
//               <div>
//                 <h4 className="text-sm font-medium text-gray-700 mb-2">Path Segments</h4>
//                 <div className="space-y-2">
//                   {path.segments.map((segment, index) => (
//                     <div key={segment.id} className="flex items-center gap-2 p-2 bg-purple-50 rounded">
//                       <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
//                         {index + 1}
//                       </div>
//                       <div className="flex-1">
//                         <div className="text-sm">Segment {index + 1}</div>
//                         <div className="text-xs text-gray-500">
//                           {segment.points.length} waypoints
//                           {segment.connectorId && " • Connected via vertical connector"}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Technical Details */}
//             <div>
//               <h4 className="text-sm font-medium text-gray-700 mb-2">Technical Details</h4>
//               <div className="grid grid-cols-2 gap-4 text-xs">
//                 <div>
//                   <span className="text-gray-500">Path ID:</span>
//                   <div className="font-mono text-gray-700 truncate">{path.id}</div>
//                 </div>
//                 <div>
//                   <span className="text-gray-500">Floor ID:</span>
//                   <div className="font-mono text-gray-700 truncate">{path.floorId}</div>
//                 </div>
//                 {path.sourceTagId && (
//                   <div>
//                     <span className="text-gray-500">Source Tag ID:</span>
//                     <div className="font-mono text-gray-700 truncate">{path.sourceTagId}</div>
//                   </div>
//                 )}
//                 {path.destinationTagId && (
//                   <div>
//                     <span className="text-gray-500">Destination Tag ID:</span>
//                     <div className="font-mono text-gray-700 truncate">{path.destinationTagId}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };




"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Building,
  MapPin,
  Route,
  Globe,
  Clock,
  Layers,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Target,
  Navigation
} from 'lucide-react';
import { Building as BuildingType, Floor } from '@/types/building';

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

interface RouteCardProps {
  path: Path;
  building: BuildingType;
  floor: Floor;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  viewMode: 'grid' | 'list';
}

export const RouteCard: React.FC<RouteCardProps> = ({
  path,
  building,
  floor,
  onPreview,
  onEdit,
  onDelete,
  viewMode
}) => {
  const getPathStats = () => {
    if (path.isMultiFloor && path.segments) {
      const totalPoints = path.segments.reduce((sum, segment) => sum + segment.points.length, 0);
      return {
        type: 'Multi-floor',
        pointCount: totalPoints,
        segmentCount: path.segments.length
      };
    }
    return {
      type: 'Single-floor',
      pointCount: path.points.length,
      segmentCount: 1
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

  const getPathDistance = () => {
    if (path.isMultiFloor && path.segments) {
      const totalDistance = path.segments.reduce((sum, segment) => {
        return sum + calculateDistance(segment.points);
      }, 0);
      return totalDistance.toFixed(2);
    }
    return calculateDistance(path.points).toFixed(2);
  };

  const stats = getPathStats();
  const distance = getPathDistance();

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete the route "${path.name}"? This action cannot be undone.`)) {
      onDelete();
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-blue-600" />
                  <h3 className="font-medium text-gray-900 truncate">
                    {path.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={path.isPublished ? "default" : "secondary"}
                    className={path.isPublished ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
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
                    <Badge variant="outline" className="text-purple-600 border-purple-300">
                      <Layers className="h-3 w-3 mr-1" />
                      Multi-floor
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{building.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{floor.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>{stats.pointCount} points</span>
                </div>
                <div className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  <span>{distance} units</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span className="font-medium">{path.source}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium">{path.destination}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onPreview}
                className="text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="text-green-600 hover:text-green-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base truncate flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-600" />
              {path.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant={path.isPublished ? "default" : "secondary"}
                className={path.isPublished ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
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
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  <Layers className="h-3 w-3 mr-1" />
                  Multi-floor
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Location Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="h-3 w-3" />
            <span>{building.name}</span>
            <span className="text-gray-400">•</span>
            <MapPin className="h-3 w-3" />
            <span>{floor.label}</span>
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="font-medium text-green-600">{path.source}</span>
            <ArrowRight className="h-3 w-3 inline mx-2" />
            <span className="font-medium text-red-600">{path.destination}</span>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{stats.pointCount}</div>
            <div className="text-xs text-gray-500">Waypoints</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{distance}</div>
            <div className="text-xs text-gray-500">Units</div>
          </div>
        </div>

        {/* Path Preview */}
        <div className="mb-4 p-2 bg-gray-50 rounded border">
          <div className="text-xs text-gray-500 mb-1">Path Preview:</div>
          <div className="h-8 relative bg-white rounded border overflow-hidden">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 100 20"
              preserveAspectRatio="xMidYMid meet"
            >
              {path.points.length > 1 && (
                <>
                  {/* Path line */}
                  <polyline
                    points={path.points.map((point, index) => 
                      `${(index / (path.points.length - 1)) * 90 + 5},10`
                    ).join(' ')}
                    fill="none"
                    stroke={path.color || "#3b82f6"}
                    strokeWidth="1"
                    className="opacity-70"
                  />
                  {/* Start point */}
                  <circle cx="5" cy="10" r="1.5" fill="#10b981" />
                  {/* End point */}
                  <circle cx="95" cy="10" r="1.5" fill="#ef4444" />
                  {/* Waypoints */}
                  {path.points.slice(1, -1).map((_, index) => (
                    <circle
                      key={index}
                      cx={((index + 1) / (path.points.length - 1)) * 90 + 5}
                      cy="10"
                      r="0.8"
                      fill={path.color || "#3b82f6"}
                    />
                  ))}
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex-1 text-blue-600 hover:text-blue-700"
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 text-green-600 hover:text-green-700"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
