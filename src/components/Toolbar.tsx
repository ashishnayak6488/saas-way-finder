// "use client";

// import React, { useState } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
// import { 
//   Pencil, 
//   Undo, 
//   Redo, 
//   Trash2, 
//   Save, 
//   Eye, 
//   MapPin, 
//   Tags,
//   Globe,
//   AlertTriangle,
//   Building
// } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/Dialog';

// interface Path {
//   id: string;
//   name: string;
//   source: string;
//   destination: string;
//   points: { x: number; y: number }[];
//   isPublished: boolean;
//   sourceTagId?: string;
//   destinationTagId?: string;
// }

// interface ToolbarProps {
//   isDesignMode: boolean;
//   isEditMode: boolean;
//   isPreviewMode: boolean;
//   isTagMode: boolean;
//   isVerticalTagMode?: boolean;
//   isPublished: boolean;
//   onToggleDesignMode: () => void;
//   onToggleTagMode: () => void;
//   onToggleVerticalTagMode?: () => void;
//   onTogglePreviewMode: () => void;
//   onViewPublishedMap: () => void;
//   onUndo: () => void;
//   onRedo: () => void;
//   onClearPath: () => void;
//   onSavePath: (source: string, destination: string) => void;
//   onPublishMap: () => void;
//   canUndo: boolean;
//   hasCurrentPath: boolean;
//   availableLocations: string[];
//   selectedPath?: Path | null;
//   isBulkEditMode?: boolean;
//   selectedTagsCount?: number;

//   isCreatingMultiFloorPath?: boolean;
//   multiFloorSegmentCount?: number;
// }

// export const Toolbar: React.FC<ToolbarProps> = ({
//   isDesignMode,
//   isEditMode,
//   isPreviewMode,
//   isTagMode,
//   isVerticalTagMode = false,
//   isPublished,
//   onToggleDesignMode,
//   onToggleTagMode,
//   onToggleVerticalTagMode,
//   onTogglePreviewMode,
//   onViewPublishedMap,
//   onUndo,
//   onRedo,
//   onClearPath,
//   onSavePath,
//   onPublishMap,
//   canUndo,
//   hasCurrentPath,
//   availableLocations,
//   selectedPath,
//   isBulkEditMode = false,
//   selectedTagsCount = 0,
//   isCreatingMultiFloorPath = false,
//   multiFloorSegmentCount = 0,

// }) => {
//   const [source, setSource] = useState('');
//   const [destination, setDestination] = useState('');
//   const [showPublishDialog, setShowPublishDialog] = useState(false);

//   // Initialize source and destination when editing a path
//   React.useEffect(() => {
//     if (isEditMode && selectedPath) {
//       setSource(selectedPath.source);
//       setDestination(selectedPath.destination);
//     } else if (!isEditMode) {
//       setSource('');
//       setDestination('');
//     }
//   }, [isEditMode, selectedPath]);

//   const handleSave = () => {
//     onSavePath(source, destination);
//     if (!isEditMode) {
//       setSource('');
//       setDestination('');
//     }
//   };

//   const handlePublishConfirm = () => {
//     onPublishMap();
//     setShowPublishDialog(false);
//   };

// // Fix the getActiveMode function
// const getActiveMode = () => {
//   if (isPreviewMode) return "Preview Mode";
//   if (isVerticalTagMode) return "Vertical Connector Tagging";
//   if (isTagMode) {
//     if (isBulkEditMode && selectedTagsCount && selectedTagsCount > 0) {
//       return `Bulk Edit Mode (${selectedTagsCount} selected)`;
//     }
//     return "Location Tagging";
//   }
//   if (isEditMode) return "Edit Path";
//   if (isDesignMode) {
//     // Add multi-floor indicator
//     if (isCreatingMultiFloorPath) {
//       return `Design Mode (Multi-Floor - Segment ${multiFloorSegmentCount || 1})`;
//     }
//     return "Design Mode";
//   }
//   return "View Mode";
// };
  

//   const getModeColor = () => {
//     if (isPreviewMode) return "text-purple-600";
//     if (isVerticalTagMode) return "text-indigo-600";
//     if (isTagMode) {
//       if (isBulkEditMode) return "text-orange-600";
//       return "text-orange-600";
//     }
//     if (isEditMode) return "text-green-600";
//     if (isDesignMode) return "text-blue-600";
//     return "text-gray-600";
//   };
//   return (
//     <>
//       <div className="p-4 border-b bg-gray-50">
//         {/* Mode Indicator */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-2">
//             <div className={`text-sm font-medium ${getModeColor()}`}>
//               {getActiveMode()}
//             </div>
//             {isEditMode && selectedPath && (
//               <div className="text-xs text-gray-500">
//                 Editing: {selectedPath.name}
//               </div>
//             )}
//           </div>
//           {isPublished && (
//             <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//               Published
//             </div>
//           )}
//         </div>

//         {/* Main Controls */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <Button
//             onClick={onToggleDesignMode}
//             variant={isDesignMode ? "default" : "outline"}
//             size="sm"
//             disabled={isPreviewMode || isTagMode || isVerticalTagMode || isEditMode}
//           >
//             <Pencil className="h-4 w-4 mr-2" />
//             Design
//           </Button>

//           <Button
//             onClick={onToggleTagMode}
//             variant={isTagMode ? "default" : "outline"}
//             size="sm"
//             disabled={isPreviewMode || isDesignMode || isVerticalTagMode || isEditMode}
//           >
//             <Tags className="h-4 w-4 mr-2" />
//             Tag Locations
//           </Button>

//           {onToggleVerticalTagMode && (
//             <Button
//               onClick={onToggleVerticalTagMode}
//               variant={isVerticalTagMode ? "default" : "outline"}
//               size="sm"
//               disabled={isPreviewMode || isDesignMode || isTagMode || isEditMode}
//             >
//               <Building className="h-4 w-4 mr-2" />
//               Vertical Tags
//             </Button>
//           )}

//           <Button
//             onClick={onTogglePreviewMode}
//             variant={isPreviewMode ? "default" : "outline"}
//             size="sm"
//             disabled={isDesignMode || isTagMode || isVerticalTagMode || isEditMode}
//           >
//             <Eye className="h-4 w-4 mr-2" />
//             Preview
//           </Button>

//           {isPublished && (
//             <Button
//               onClick={onViewPublishedMap}
//               variant="outline"
//               size="sm"
//               className="text-green-600 border-green-300"
//             >
//               <Globe className="h-4 w-4 mr-2" />
//               View Published
//             </Button>
//           )}
//         </div>

//         {/* Path Design Controls */}
//         {(isDesignMode || isEditMode) && (
//           <div className="space-y-3">
//             <div className="flex gap-2">
//               <Button
//                 onClick={onUndo}
//                 disabled={!canUndo}
//                 variant="outline"
//                 size="sm"
//               >
//                 <Undo className="h-4 w-4 mr-2" />
//                 Undo
//               </Button>

//               <Button
//                 onClick={onClearPath}
//                 disabled={!hasCurrentPath}
//                 variant="outline"
//                 size="sm"
//               >
//                 <Trash2 className="h-4 w-4 mr-2" />
//                 Clear
//               </Button>
//             </div>

//             {hasCurrentPath && (
//               <div className="space-y-2">
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       From
//                     </label>
//                     {availableLocations.length > 0 ? (
//                       <Select value={source} onValueChange={setSource}>
//                         <SelectTrigger className="h-8 text-xs">
//                           <SelectValue placeholder="Select source" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {availableLocations.map((location) => (
//                             <SelectItem key={location} value={location}>
//                               {location}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     ) : (
//                       <Input
//                         placeholder="Source location"
//                         value={source}
//                         onChange={(e) => setSource(e.target.value)}
//                         className="h-8 text-xs"
//                       />
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       To
//                     </label>
//                     {availableLocations.length > 0 ? (
//                       <Select value={destination} onValueChange={setDestination}>
//                         <SelectTrigger className="h-8 text-xs">
//                           <SelectValue placeholder="Select destination" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {availableLocations.map((location) => (
//                             <SelectItem key={location} value={location}>
//                               {location}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     ) : (
//                       <Input
//                         placeholder="Destination"
//                         value={destination}
//                         onChange={(e) => setDestination(e.target.value)}
//                         className="h-8 text-xs"
//                       />
//                     )}
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handleSave}
//                   disabled={!source.trim() || !destination.trim()}
//                   className="w-full"
//                   size="sm"
//                 >
//                   <Save className="h-4 w-4 mr-2" />
//                   {isEditMode ? 'Update Path' : 'Save Path'}
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Publish Control - Show when not in special modes and there are paths to publish */}
//         {!isPreviewMode && !isTagMode && !isDesignMode && !isEditMode && !isVerticalTagMode && (
//           <div className="mt-4">
//             <Button
//               onClick={() => setShowPublishDialog(true)}
//               className="w-full bg-green-600 hover:bg-green-700"
//               size="sm"
//             >
//               <Globe className="h-4 w-4 mr-2" />
//               Publish Map
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Publish Confirmation Dialog */}
//       <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <Globe className="h-5 w-5" />
//               Publish Map
//             </DialogTitle>
//             <DialogDescription>
//               This will make your map and all its paths available for public use. 
//               Users will be able to search for routes between the locations youv&apos;e defined.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="py-4">
//             <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
//               <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
//               <div className="text-sm">
//                 <p className="text-amber-800 font-medium mb-1">
//                   Make sure your map is ready:
//                 </p>
//                 <ul className="text-amber-700 text-xs space-y-1">
//                   <li>• All paths are properly defined with clear source and destination points</li>
//                   <li>• Location tags are accurately placed and named</li>
//                   <li>• You&apos;ve tested the routes in preview mode</li>
//                 </ul>
//               </div>
//             </div>
//           </div>

//           <DialogFooter>
//             <Button 
//               variant="outline" 
//               onClick={() => setShowPublishDialog(false)}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handlePublishConfirm}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               <Globe className="h-4 w-4 mr-2" />
//               Publish Map
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };




"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Pencil, 
  Undo, 
  Redo, 
  Trash2, 
  Save, 
  Eye, 
  MapPin, 
  Tags,
  Globe,
  AlertTriangle,
  Building
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';



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

// interface Path {
//   id: string;
//   name: string;
//   source: string;
//   destination: string;
//   points: { x: number; y: number }[];
//   isPublished: boolean;
//   sourceTagId?: string;
//   destinationTagId?: string;
// }

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


interface PathLocation {
  name: string;
  floorId: string;
  point: { x: number; y: number };
}

interface ToolbarProps {
  isDesignMode: boolean;
  isEditMode: boolean;
  isPreviewMode: boolean;
  isTagMode: boolean;
  isVerticalTagMode?: boolean;
  isPublished: boolean;
  onToggleDesignMode: () => void;
  onToggleTagMode: () => void;
  onToggleVerticalTagMode?: () => void;
  onTogglePreviewMode: () => void;
  onViewPublishedMap: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearPath: () => void;
  onSavePath: (source: string, destination: string) => void;
  onPublishMap: () => void;
  canUndo: boolean;
  hasCurrentPath: boolean;
  availableLocations: string[];
  selectedPath?: Path | null;
  isBulkEditMode?: boolean;
  selectedTagsCount?: number;
  isCreatingMultiFloorPath?: boolean;
  multiFloorSegmentCount?: number;
  // New props for auto-detected locations
  pathStartLocation?: PathLocation | null;
  pathEndLocation?: PathLocation | null;
  onAutoSavePath?: () => void;
  onDetectEndLocation?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isDesignMode,
  isEditMode,
  isPreviewMode,
  isTagMode,
  isVerticalTagMode = false,
  isPublished,
  onToggleDesignMode,
  onToggleTagMode,
  onToggleVerticalTagMode,
  onTogglePreviewMode,
  onViewPublishedMap,
  onUndo,
  onRedo,
  onClearPath,
  onSavePath,
  onPublishMap,
  canUndo,
  hasCurrentPath,
  availableLocations,
  selectedPath,
  isBulkEditMode = false,
  selectedTagsCount = 0,
  isCreatingMultiFloorPath = false,
  multiFloorSegmentCount = 0,
  pathStartLocation = null,
  pathEndLocation = null,
  onAutoSavePath,
  onDetectEndLocation,
}) => {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);



    // Helper functions
    const handleAutoSave = () => {
      if (pathStartLocation && pathEndLocation) {
        // Auto-save with detected locations
        onSavePath(pathStartLocation.name, pathEndLocation.name);
      } else if (pathStartLocation) {
        // Try to detect end location first
        if (onDetectEndLocation) {
          onDetectEndLocation();
        }
        // Show confirmation dialog to set destination
        setShowSaveConfirmDialog(true);
      } else {
        // No locations detected, use callback if available
        if (onAutoSavePath) {
          onAutoSavePath();
        } else {
          // Fallback: save with generic names
          onSavePath("Start Point", "End Point");
        }
      }
    };
  
    const handleSaveConfirm = () => {
      if (pathStartLocation) {
        const destination = pathEndLocation?.name || `End Point`;
        onSavePath(pathStartLocation.name, destination);
      } else {
        // Fallback save
        onSavePath("Start Point", "End Point");
      }
      setShowSaveConfirmDialog(false);
    };
  
    const handlePublishConfirm = () => {
      onPublishMap();
      setShowPublishDialog(false);
    };
  
    const getActiveMode = () => {
      if (isPreviewMode) return "Preview Mode";
      if (isVerticalTagMode) return "Vertical Connector Tagging";
      if (isTagMode) {
        if (isBulkEditMode && selectedTagsCount && selectedTagsCount > 0) {
          return `Bulk Edit Mode (${selectedTagsCount} selected)`;
        }
        return "Location Tagging";
      }
      if (isEditMode) return "Edit Path";
      if (isDesignMode) {
        if (isCreatingMultiFloorPath) {
          return `Design Mode (Multi-Floor - Segment ${multiFloorSegmentCount})`;
        }
        return "Design Mode";
      }
      return "View Mode";
    };
  
    const getModeColor = () => {
      if (isPreviewMode) return "text-purple-600";
      if (isVerticalTagMode) return "text-indigo-600";
      if (isTagMode) {
        if (isBulkEditMode) return "text-orange-600";
        return "text-orange-600";
      }
      if (isEditMode) return "text-green-600";
      if (isDesignMode) return "text-blue-600";
      return "text-gray-600";
    };
  
    const canSavePath = () => {
      return hasCurrentPath;
    };
  
    const getPathSummary = () => {
      const source = pathStartLocation?.name || "Start Point";
      const destination = pathEndLocation?.name || "End Point";
      return `${source} → ${destination}`;
    };
  


    return (
      <>
        <div className="p-4 border-b bg-gray-50">
          {/* Mode Indicator */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className={`text-sm font-medium ${getModeColor()}`}>
                {getActiveMode()}
              </div>
              {isEditMode && selectedPath && (
                <div className="text-xs text-gray-500">
                  Editing: {selectedPath.name}
                </div>
              )}
            </div>
            {isPublished && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Published
              </div>
            )}
          </div>
  
          {/* Main Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={onToggleDesignMode}
              variant={isDesignMode ? "default" : "outline"}
              size="sm"
              disabled={isPreviewMode || isTagMode || isVerticalTagMode || isEditMode}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Design
            </Button>
  
            <Button
              onClick={onToggleTagMode}
              variant={isTagMode ? "default" : "outline"}
              size="sm"
              disabled={isPreviewMode || isDesignMode || isVerticalTagMode || isEditMode}
            >
              <Tags className="h-4 w-4 mr-2" />
              Tag Locations
            </Button>
  
            {onToggleVerticalTagMode && (
              <Button
                onClick={onToggleVerticalTagMode}
                variant={isVerticalTagMode ? "default" : "outline"}
                size="sm"
                disabled={isPreviewMode || isDesignMode || isTagMode || isEditMode}
              >
                <Building className="h-4 w-4 mr-2" />
                Vertical Tags
              </Button>
            )}
  
            <Button
              onClick={onTogglePreviewMode}
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              disabled={isDesignMode || isTagMode || isVerticalTagMode || isEditMode}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
  
            {isPublished && (
              <Button
                onClick={onViewPublishedMap}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-300"
              >
                <Globe className="h-4 w-4 mr-2" />
                View Published
              </Button>
            )}
          </div>
  

          {/* Path Design Controls */}
          {(isDesignMode || isEditMode) && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={onUndo}
                disabled={!canUndo}
                variant="outline"
                size="sm"
              >
                <Undo className="h-4 w-4 mr-2" />
                Undo
              </Button>

              <Button
                onClick={onClearPath}
                disabled={!hasCurrentPath}
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>

            {/* Auto-detected Path Information */}
            {hasCurrentPath && (
              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Path Information
                  </h4>
                  
                  {pathStartLocation ? (
                    <div className="text-xs text-blue-700 mb-1">
                      <span className="font-medium">From:</span> {pathStartLocation.name}
                      <span className="text-blue-600 ml-1">
                        (Floor: {pathStartLocation.floorId})
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 mb-1">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      <span className="font-medium">From:</span> Start Point (no location detected)
                    </div>
                  )}
                  
                  {pathEndLocation ? (
                    <div className="text-xs text-blue-700 mb-1">
                      <span className="font-medium">To:</span> {pathEndLocation.name}
                      <span className="text-blue-600 ml-1">
                        (Floor: {pathEndLocation.floorId})
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-amber-700 mb-1">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      <span className="font-medium">To:</span> End Point (no location detected)
                    </div>
                  )}

                  {isCreatingMultiFloorPath && (
                    <div className="text-xs text-purple-700 mb-1">
                      <span className="font-medium">Multi-Floor Path:</span> Segment {multiFloorSegmentCount}
                    </div>
                  )}

                  {!pathStartLocation && !pathEndLocation && (
                    <div className="text-xs text-amber-700 mt-2 p-2 bg-amber-100 rounded">
                      <AlertTriangle className="h-3 w-3 inline mr-1" />
                      <strong>Tip:</strong> Draw your path near tagged locations to auto-detect source and destination
                    </div>
                  )}
                </div>

                {/* Auto-Save Button */}
                <Button
                  onClick={handleAutoSave}
                  disabled={!canSavePath()}
                  className="w-full"
                  size="sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Path' : 'Save Path'}
                  <span className="ml-1 text-xs opacity-75">
                    ({getPathSummary()})
                  </span>
                </Button>

                {/* Path Status Indicator */}
                <div className="text-xs text-center">
                  {pathStartLocation && pathEndLocation ? (
                    <span className="text-green-600">
                      ✓ Both locations detected - ready to save
                    </span>
                  ) : pathStartLocation || pathEndLocation ? (
                    <span className="text-amber-600">
                      ⚠ One location detected - will use default for missing location
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      Path will be saved with default names
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Publish Control */}
        {!isPreviewMode && !isTagMode && !isDesignMode && !isEditMode && !isVerticalTagMode && (
          <div className="mt-4">
            <Button
              onClick={() => setShowPublishDialog(true)}
              className="w-full bg-green-600 hover:bg-green-700"
              size="sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              Publish Map
            </Button>
          </div>
        )}
      </div>


      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Save Path
            </DialogTitle>
            <DialogDescription>
              {pathStartLocation ? (
                <>
                  Path starts from <strong>{pathStartLocation.name}</strong>.
                  {pathEndLocation ? (
                    <>
                      {' '}Path ends at <strong>{pathEndLocation.name}</strong>.
                    </>
                  ) : (
                    ' The end location will be set as "End Point" since no location was detected at the end.'
                  )}
                </>
              ) : (
                'No start location detected. The path will be saved with default names.'
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-gray-50 border rounded-lg p-3">
              <div className="text-sm">
                <div className="mb-2">
                  <span className="font-medium">Path Summary:</span>
                </div>
                <div className="text-gray-700 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-green-600" />
                    <span>From: {pathStartLocation?.name || 'Start Point'}</span>
                    {pathStartLocation && (
                      <span className="text-xs text-gray-500">
                        ({pathStartLocation.floorId})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-red-600" />
                    <span>To: {pathEndLocation?.name || 'End Point'}</span>
                    {pathEndLocation && (
                      <span className="text-xs text-gray-500">
                        ({pathEndLocation.floorId})
                      </span>
                    )}
                  </div>
                  {isCreatingMultiFloorPath && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                      <Building className="h-3 w-3 text-purple-600" />
                      <span className="text-purple-600">
                        Multi-floor path with {multiFloorSegmentCount} segments
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Warning for missing locations */}
            {(!pathStartLocation || !pathEndLocation) && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Location Detection Notice</p>
                    <p className="text-xs">
                      {!pathStartLocation && !pathEndLocation 
                        ? "Neither start nor end locations were detected. The path will be saved with generic names."
                        : !pathStartLocation 
                        ? "Start location not detected. It will be saved as 'Start Point'."
                        : "End location not detected. It will be saved as 'End Point'."
                      }
                    </p>
                    <p className="text-xs mt-1 text-amber-700">
                      <strong>Tip:</strong> Draw your path closer to tagged locations for automatic detection.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowSaveConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveConfirm}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Path
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Confirmation Dialog */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Publish Map
            </DialogTitle>
            <DialogDescription>
              This will make your map and all its paths available for public use. 
              Users will be able to search for routes between the locations you&apos;ve defined.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-amber-800 font-medium mb-1">
                  Make sure your map is ready:
                </p>
                <ul className="text-amber-700 text-xs space-y-1">
                  <li>• All paths are properly defined with clear source and destination points</li>
                  <li>• Location tags are accurately placed and named</li>
                  <li>• You&apos;ve tested the routes in preview mode</li>
                  <li>• Multi-floor paths have proper vertical connectors</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowPublishDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePublishConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              <Globe className="h-4 w-4 mr-2" />
              Publish Map
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
