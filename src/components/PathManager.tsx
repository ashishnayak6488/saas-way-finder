"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Route, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  MapPin, 
  ArrowRight,
  Building,
  Globe,
  Clock,
  Layers,
  Navigation,
  Timer,
  User,
  Calendar,
  ChevronDown,
  ChevronRight,
  Info,
  Zap,
  Target
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/Collapsible';

interface PathSegment {
  id: string;
  floorId: string;
  points: { x: number; y: number }[];
  connectorId?: string;
}

interface VerticalTransition {
  from_floor_id: string;
  to_floor_id: string;
  connector_id: string;
  connector_type: string;
  connector_name?: string;
  instruction?: string;
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
  buildingId?: string;
  totalFloors?: number;
  verticalTransitions?: VerticalTransition[];
  estimatedTime?: number;
  createdBy?: string;
  datetime?: number;
  updatedBy?: string;
  updateOn?: number;
  status?: string;
  metadata?: Record<string, any>;
}

interface PathManagerProps {
  paths: Path[];
  onEditPath: (path: Path) => void;
  onDeletePath: (pathId: string) => void;
  onTogglePublish?: (pathId: string, isPublished: boolean) => void;
  onPreviewPath?: (path: Path) => void;
  buildingName?: string;
  floorName?: string;
}

export const PathManager: React.FC<PathManagerProps> = ({ 
  paths, 
  onEditPath, 
  onDeletePath,
  onTogglePublish,
  onPreviewPath,
  buildingName,
  floorName
}) => {
  const [deleteConfirmPath, setDeleteConfirmPath] = useState<Path | null>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [showDetails, setShowDetails] = useState<Set<string>>(new Set());

  const handleDeleteConfirm = () => {
    if (deleteConfirmPath) {
      onDeletePath(deleteConfirmPath.id);
      setDeleteConfirmPath(null);
    }
  };

  const handleTogglePublish = (path: Path) => {
    if (onTogglePublish) {
      onTogglePublish(path.id, !path.isPublished);
    }
  };

  const togglePathExpansion = (pathId: string) => {
    const newExpanded = new Set(expandedPaths);
    if (newExpanded.has(pathId)) {
      newExpanded.delete(pathId);
    } else {
      newExpanded.add(pathId);
    }
    setExpandedPaths(newExpanded);
  };

  const togglePathDetails = (pathId: string) => {
    const newDetails = new Set(showDetails);
    if (newDetails.has(pathId)) {
      newDetails.delete(pathId);
    } else {
      newDetails.add(pathId);
    }
    setShowDetails(newDetails);
  };

  const getPathStats = (path: Path) => {
    if (path.isMultiFloor && path.segments) {
      const totalPoints = path.segments.reduce((sum, segment) => sum + segment.points.length, 0);
      return {
        type: 'Multi-floor',
        pointCount: totalPoints,
        segmentCount: path.segments.length,
        floorCount: path.totalFloors || path.segments.length,
        transitionCount: path.verticalTransitions?.length || 0
      };
    }
    return {
      type: 'Single-floor',
      pointCount: path.points.length,
      segmentCount: 1,
      floorCount: 1,
      transitionCount: 0
    };
  };

  const formatPathName = (path: Path) => {
    if (path.name.includes(' to ')) {
      return path.name;
    }
    return `${path.source} → ${path.destination}`;
  };

  const formatDateTime = (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatEstimatedTime = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const publishedPaths = paths.filter(p => p.isPublished);
  const unpublishedPaths = paths.filter(p => !p.isPublished);
  const multiFloorPaths = paths.filter(p => p.isMultiFloor);
  const singleFloorPaths = paths.filter(p => !p.isMultiFloor);


    // Render individual path item
  const renderPathItem = (path: Path, bgColorClass: string, borderColorClass: string) => {
    const stats = getPathStats(path);
    const isExpanded = expandedPaths.has(path.id);
    const showPathDetails = showDetails.has(path.id);

    return (
      <div
        key={path.id}
        className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors ${bgColorClass} ${borderColorClass}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Path Header */}
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-sm text-gray-900 truncate">
                {formatPathName(path)}
              </h4>
              
              {/* Status Badges */}
              <Badge 
                variant="secondary" 
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
                <Badge variant="outline" className="text-blue-600 border-blue-300">
                  <Building className="h-3 w-3 mr-1" />
                  Multi-floor
                </Badge>
              )}

              {path.estimatedTime && (
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  <Timer className="h-3 w-3 mr-1" />
                  {formatEstimatedTime(path.estimatedTime)}
                </Badge>
              )}
            </div>
            
            {/* Path Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{stats.pointCount} points</span>
              </div>
              
              {stats.floorCount > 1 && (
                <div className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>{stats.floorCount} floors</span>
                </div>
              )}
              
              {stats.transitionCount > 0 && (
                <div className="flex items-center gap-1">
                  <Navigation className="h-3 w-3" />
                  <span>{stats.transitionCount} transitions</span>
                </div>
              )}
              
              {path.color && (
                <div className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: path.color }}
                  />
                  <span>Styled</span>
                </div>
              )}
            </div>

            {/* Source to Destination */}
            <div className="text-xs text-gray-500 mb-3">
              <span className="font-medium">{path.source}</span>
              <ArrowRight className="h-3 w-3 inline mx-1" />
              <span className="font-medium">{path.destination}</span>
              {path.isMultiFloor && path.sourceFloorId && path.destinationFloorId && (
                <span className="ml-2 text-gray-400">
                  (Floor {path.sourceFloorId} → Floor {path.destinationFloorId})
                </span>
              )}
            </div>

            {/* Multi-floor Path Details */}
            {path.isMultiFloor && (isExpanded || showPathDetails) && (
              <Collapsible open={isExpanded} onOpenChange={() => togglePathExpansion(path.id)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    <span className="ml-1">
                      {isExpanded ? 'Hide' : 'Show'} Multi-floor Details
                    </span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  {path.segments && path.segments.length > 0 && (
                    <div className="bg-gray-50 rounded-md p-3 mb-2">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Floor Segments:</h5>
                      <div className="space-y-1">
                        {path.segments.map((segment, index) => (
                          <div key={segment.id} className="text-xs text-gray-600 flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                              {index + 1}
                            </span>
                            <span>Floor {segment.floorId}</span>
                            <span>({segment.points.length} points)</span>
                            {segment.connectorId && (
                              <span className="text-purple-600">→ Connector</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {path.verticalTransitions && path.verticalTransitions.length > 0 && (
                    <div className="bg-purple-50 rounded-md p-3">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Vertical Transitions:</h5>
                      <div className="space-y-1">
                        {path.verticalTransitions.map((transition, index) => (
                          <div key={index} className="text-xs text-gray-600 flex items-center gap-2">
                            <Zap className="h-3 w-3 text-purple-600" />
                            <span>Floor {transition.from_floor_id} → Floor {transition.to_floor_id}</span>
                            <span className="text-purple-600">via {transition.connector_type}</span>
                            {transition.connector_name && (
                              <span className="text-gray-500">({transition.connector_name})</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Additional Details Toggle */}
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePathDetails(path.id)}
                className="h-6 px-2 text-xs text-gray-500"
              >
                <Info className="h-3 w-3 mr-1" />
                {showPathDetails ? 'Hide' : 'Show'} Details
              </Button>
            </div>


              {/* Detailed Information */}
              {showPathDetails && (
                <div className="mt-3 p-3 bg-gray-50 rounded-md text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Created by: {path.createdBy || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {formatDateTime(path.datetime)}</span>
                  </div>
                  {path.updatedBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <span>Updated by: {path.updatedBy}</span>
                    </div>
                  )}
                  {path.updateOn && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>Updated: {formatDateTime(path.updateOn)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    <span>Status: {path.status || 'active'}</span>
                  </div>
                  {path.buildingId && (
                    <div className="flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      <span>Building ID: {path.buildingId}</span>
                    </div>
                  )}
                  {path.floorId && (
                    <div className="flex items-center gap-2">
                      <Layers className="h-3 w-3" />
                      <span>Floor ID: {path.floorId}</span>
                    </div>
                  )}
                  {path.sourceTagId && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>Source Tag ID: {path.sourceTagId}</span>
                    </div>
                  )}
                  {path.destinationTagId && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>Destination Tag ID: {path.destinationTagId}</span>
                    </div>
                  )}
                  {path.metadata && Object.keys(path.metadata).length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Metadata:</span>
                      <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(path.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
  
            {/* Action Buttons */}
            <div className="flex items-center gap-1 ml-2">
              {onPreviewPath && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreviewPath(path)}
                  className="h-8 w-8 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                  title="Preview path"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              
              {onTogglePublish && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePublish(path)}
                  className={`h-8 w-8 p-0 ${
                    path.isPublished 
                      ? "text-orange-600 hover:text-orange-700 hover:bg-orange-50" 
                      : "text-green-600 hover:text-green-700 hover:bg-green-50"
                  }`}
                  title={path.isPublished ? "Unpublish path" : "Publish path"}
                >
                  {path.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPath(path)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                title="Edit path"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteConfirmPath(path)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete path"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      );
    };
  
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Path Manager
              {buildingName && (
                <span className="text-sm font-normal text-gray-500">
                  - {buildingName}
                  {floorName && ` (${floorName})`}
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Manage navigation paths ({paths.length} total, {publishedPaths.length} published, {multiFloorPaths.length} multi-floor)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {paths.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No paths created yet</p>
                <p className="text-xs mt-1">Use Design mode to create navigation paths</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{paths.length}</div>
                    <div className="text-xs text-gray-500">Total Paths</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{publishedPaths.length}</div>
                    <div className="text-xs text-gray-500">Published</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{multiFloorPaths.length}</div>
                    <div className="text-xs text-gray-500">Multi-floor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{unpublishedPaths.length}</div>
                    <div className="text-xs text-gray-500">Drafts</div>
                  </div>
                </div>
  
                {/* Published Paths Section */}
                {publishedPaths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-4 w-4 text-green-600" />
                      <h3 className="text-sm font-medium text-green-800">
                        Published Paths ({publishedPaths.length})
                      </h3>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {publishedPaths.map((path) => 
                        renderPathItem(path, "bg-green-50", "border-green-200")
                      )}
                    </div>
                  </div>
                )}
  
                {/* Unpublished Paths Section */}
                {unpublishedPaths.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <h3 className="text-sm font-medium text-orange-800">
                        Draft Paths ({unpublishedPaths.length})
                      </h3>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {unpublishedPaths.map((path) => 
                        renderPathItem(path, "bg-orange-50", "border-orange-200")
                      )}
                    </div>
                  </div>
                )}
  
                {/* Multi-floor vs Single-floor Summary */}
                {multiFloorPaths.length > 0 && singleFloorPaths.length > 0 && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Path Types:</span>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3 text-purple-600" />
                          {multiFloorPaths.length} multi-floor
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3 text-blue-600" />
                          {singleFloorPaths.length} single-floor
                        </span>
                      </div>
                    </div>
                  </div>
                )}
  
                {/* Overall Summary */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Total: {paths.length} paths</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {publishedPaths.length} published
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        {unpublishedPaths.length} drafts
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
  

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmPath} onOpenChange={() => setDeleteConfirmPath(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete Path
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this navigation path? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteConfirmPath && (
            <div className="py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-medium text-red-900 mb-2">
                  {formatPathName(deleteConfirmPath)}
                </div>
                <div className="text-sm text-red-700 mb-2">
                  {deleteConfirmPath.source} → {deleteConfirmPath.destination}
                </div>
                
                {/* Path Details in Delete Dialog */}
                <div className="text-xs text-red-600 space-y-1">
                  <div className="flex items-center gap-4">
                    <span>{getPathStats(deleteConfirmPath).pointCount} waypoints</span>
                    <span>{deleteConfirmPath.isPublished ? 'Published' : 'Draft'}</span>
                    {deleteConfirmPath.isMultiFloor && (
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        Multi-floor ({deleteConfirmPath.totalFloors} floors)
                      </span>
                    )}
                  </div>
                  
                  {deleteConfirmPath.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      <span>Estimated time: {formatEstimatedTime(deleteConfirmPath.estimatedTime)}</span>
                    </div>
                  )}
                  
                  {deleteConfirmPath.createdBy && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Created by: {deleteConfirmPath.createdBy}</span>
                    </div>
                  )}
                  
                  {deleteConfirmPath.datetime && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {formatDateTime(deleteConfirmPath.datetime)}</span>
                    </div>
                  )}
                </div>

                {/* Multi-floor Path Warning */}
                {deleteConfirmPath.isMultiFloor && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800">
                    <div className="flex items-center gap-1 font-medium">
                      <Building className="h-3 w-3" />
                      Multi-floor Path Warning
                    </div>
                    <div className="mt-1">
                      This path spans {deleteConfirmPath.totalFloors} floors with {deleteConfirmPath.verticalTransitions?.length || 0} vertical transitions. 
                      Deleting this path will remove all floor segments and transition data.
                    </div>
                  </div>
                )}

                {/* Published Path Warning */}
                {deleteConfirmPath.isPublished && (
                  <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                    <div className="flex items-center gap-1 font-medium">
                      <Globe className="h-3 w-3" />
                      Published Path Warning
                    </div>
                    <div className="mt-1">
                      This path is currently published and may be in use by visitors. Consider unpublishing it first.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmPath(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Path
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Actions Dialog (Future Enhancement) */}
      {/* This can be added later for bulk operations */}
      
      {/* Path Statistics Modal (Future Enhancement) */}
      {/* This can be added later for detailed analytics */}
    </>
  );
};

// Export additional utility functions that might be useful
export const PathManagerUtils = {
  formatPathName: (path: Path) => {
    if (path.name.includes(' to ')) {
      return path.name;
    }
    return `${path.source} → ${path.destination}`;
  },

  getPathStats: (path: Path) => {
    if (path.isMultiFloor && path.segments) {
      const totalPoints = path.segments.reduce((sum, segment) => sum + segment.points.length, 0);
      return {
        type: 'Multi-floor',
        pointCount: totalPoints,
        segmentCount: path.segments.length,
        floorCount: path.totalFloors || path.segments.length,
        transitionCount: path.verticalTransitions?.length || 0
      };
    }
    return {
      type: 'Single-floor',
      pointCount: path.points.length,
      segmentCount: 1,
      floorCount: 1,
      transitionCount: 0
    };
  },

  formatEstimatedTime: (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  },

  formatDateTime: (timestamp?: number) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp * 1000).toLocaleString();
  },

  groupPathsByType: (paths: Path[]) => {
    return {
      published: paths.filter(p => p.isPublished),
      unpublished: paths.filter(p => !p.isPublished),
      multiFloor: paths.filter(p => p.isMultiFloor),
      singleFloor: paths.filter(p => !p.isMultiFloor)
    };
  },

  calculatePathComplexity: (path: Path) => {
    const stats = PathManagerUtils.getPathStats(path);
    let complexity = 'Simple';
    
    if (path.isMultiFloor) {
      complexity = 'Complex';
    } else if (stats.pointCount > 10) {
      complexity = 'Moderate';
    }
    
    return complexity;
  },

  validatePath: (path: Path) => {
    const errors: string[] = [];
    
    if (!path.name || path.name.trim().length === 0) {
      errors.push('Path name is required');
    }
    
    if (!path.source || path.source.trim().length === 0) {
      errors.push('Source location is required');
    }
    
    if (!path.destination || path.destination.trim().length === 0) {
      errors.push('Destination location is required');
    }
    
    if (path.isMultiFloor) {
      if (!path.segments || path.segments.length < 2) {
        errors.push('Multi-floor paths must have at least 2 segments');
      }
      
      if (!path.verticalTransitions || path.verticalTransitions.length === 0) {
        errors.push('Multi-floor paths must have vertical transitions');
      }
    } else {
      if (!path.points || path.points.length < 2) {
        errors.push('Single-floor paths must have at least 2 points');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Export types for external use
export type { Path, PathSegment, VerticalTransition, PathManagerProps };
