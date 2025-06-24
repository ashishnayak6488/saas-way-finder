// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Label } from "@/components/ui/Label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/Card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/Select";
// import { Badge } from "@/components/ui/Badge";
// import { MapPin, Circle, Square, Edit2, Trash2, Upload } from "lucide-react";
// import Image from "next/image";

// // Update the TaggedLocation interface
// export interface TaggedLocation {
//   id: string; // This will map to location_id from API
//   name: string;
//   category: string;
//   floorId: string; // This will map to floor_id from API
//   shape: "circle" | "rectangle";
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   radius?: number;
//   logoUrl?: string; // This will map to logo_url from API
//   color?: string;
//   textColor?: string; // This will map to text_color from API
//   isPublished?: boolean; // This will map to is_published from API
//   description?: string;
// }


// // Add this near the top of the file
// const LOCATION_CATEGORIES = [
//   { value: 'room', label: 'Room' },
//   { value: 'facility', label: 'Facility' },
//   { value: 'office', label: 'Office' },
//   { value: 'meeting', label: 'Meeting Room' },
//   { value: 'dining', label: 'Dining' },
//   { value: 'study', label: 'Study Area' },
//   { value: 'entrance', label: 'Entrance' }
// ];

// interface LocationTaggerProps {
//   isTagMode: boolean;
//   selectedShapeType: "circle" | "rectangle";
//   onShapeTypeChange: (shapeType: "circle" | "rectangle") => void;
//   tags: TaggedLocation[];
//   onEditTag?: (tag: TaggedLocation) => void;
//   onDeleteTag?: (tagId: string) => void;
//   currentFloorId?: string; // Add currentFloorId prop to filter tags
// }

// export const LocationTagger: React.FC<LocationTaggerProps> = ({
//   isTagMode,
//   selectedShapeType,
//   onShapeTypeChange,
//   tags,
//   onEditTag,
//   onDeleteTag,
//   currentFloorId,
// }) => {
//   const [editingTag, setEditingTag] = useState<TaggedLocation | null>(null);
//   const [editForm, setEditForm] = useState({
//     name: "",
//     category: "",
//     logoUrl: "",
//   });

//   // Filter tags by current floor and ensure they have valid IDs
//   const currentFloorTags = currentFloorId
//     ? tags.filter((tag) => 
//         tag && 
//         tag.id && 
//         (tag.floorId === currentFloorId || !tag.floorId)
//       )
//     : tags.filter((tag) => tag && tag.id);

//   // Debug logging (moved outside JSX)
//   useEffect(() => {
//     console.log("Current floor tags:", currentFloorTags);
//     currentFloorTags.forEach((tag, index) => {
//       console.log(`Tag ${index}:`, tag);
//       if (!tag.id) {
//         console.error(`Tag at index ${index} has no ID:`, tag);
//       }
//     });
//   }, [currentFloorTags]);

//   const handleEditStart = (tag: TaggedLocation) => {
//     if (!tag || !tag.id) {
//       console.error("Cannot edit tag: invalid tag data", tag);
//       return;
//     }
    
//     setEditingTag(tag);
//     setEditForm({
//       name: tag.name || "",
//       category: tag.category || "",
//       logoUrl: tag.logoUrl || "",
//     });
//   };

//   // const handleEditSave = () => {
//   //   if (editingTag && onEditTag && editingTag.id) {
//   //     const updatedTag = {
//   //       ...editingTag,
//   //       name: editForm.name,
//   //       category: editForm.category,
//   //       logoUrl: editForm.logoUrl || undefined,
//   //     };
//   //     onEditTag(updatedTag);
//   //     setEditingTag(null);
//   //     setEditForm({ name: "", category: "", logoUrl: "" });
//   //   }
//   // };

//   // Update the editing form to include category selection

// const handleEditSave = async () => {
//   if (editingTag && onEditTag) {
//     const updatedTag = {
//       ...editingTag,
//       name: editForm.name,
//       category: editForm.category, // Make sure this is included
//       logoUrl: editForm.logoUrl,
//       // description: editForm.description,
//       // color: editForm.color,
//       // textColor: editForm.textColor,
//       // isPublished: editForm.isPublished,
//     };
    
//     await onEditTag(updatedTag);
//     setEditingTag(null);
//     setEditForm({
//       name: '',
//       category: '',
//       logoUrl: '',
//       // description: '',
//       // color: '#f59e0b',
//       // textColor: '#000000',
//       // isPublished: true,
//     });
//   }
// };


//   const handleEditCancel = () => {
//     setEditingTag(null);
//     setEditForm({ name: "", category: "", logoUrl: "" });
//   };

//   const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const logoUrl = e.target?.result as string;
//         setEditForm((prev) => ({ ...prev, logoUrl }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const getCategoryColor = (category: string) => {
//     const colors: { [key: string]: string } = {
//       restaurant: "bg-orange-100 text-orange-800",
//       restroom: "bg-blue-100 text-blue-800",
//       store: "bg-green-100 text-green-800",
//       office: "bg-purple-100 text-purple-800",
//       meeting: "bg-indigo-100 text-indigo-800",
//       parking: "bg-gray-100 text-gray-800",
//       entrance: "bg-red-100 text-red-800",
//       exit: "bg-yellow-100 text-yellow-800",
//     };

//     return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-800";
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MapPin className="h-5 w-5" />
//           Location Tagger
//         </CardTitle>
//         <CardDescription>
//           Tag important locations on your map
//           {currentFloorId && (
//             <span className="block text-xs text-blue-600 mt-1">
//               Current floor tags only
//             </span>
//           )}
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {isTagMode && (
//           <div>
//             <Label>Shape Type</Label>
//             <Select value={selectedShapeType} onValueChange={onShapeTypeChange}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="circle">
//                   <div className="flex items-center gap-2">
//                     <Circle className="h-4 w-4" />
//                     Circle
//                   </div>
//                 </SelectItem>
//                 <SelectItem value="rectangle">
//                   <div className="flex items-center gap-2">
//                     <Square className="h-4 w-4" />
//                     Rectangle
//                   </div>
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         )}

//         {editingTag && (
//           <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
//             <h4 className="font-medium text-sm">Edit Tag</h4>
//             <div>
//               <Label htmlFor="edit-name">Name</Label>
//               <Input
//                 id="edit-name"
//                 value={editForm.name}
//                 onChange={(e) =>
//                   setEditForm((prev) => ({ ...prev, name: e.target.value }))
//                 }
//                 placeholder="Location name"
//               />
//             </div>


//             {/* <div>
//               <Label htmlFor="edit-category">Category</Label>
//               <Select
//                 value={editForm.category}
//                 onValueChange={(value) =>
//                   setEditForm((prev) => ({ ...prev, category: value }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="restaurant">Restaurant</SelectItem>
//                   <SelectItem value="restroom">Restroom</SelectItem>
//                   <SelectItem value="store">Store</SelectItem>
//                   <SelectItem value="office">Office</SelectItem>
//                   <SelectItem value="meeting">Meeting Room</SelectItem>
//                   <SelectItem value="parking">Parking</SelectItem>
//                   <SelectItem value="entrance">Entrance</SelectItem>
//                   <SelectItem value="exit">Exit</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div> */}


//             <div>
//               <Label htmlFor="edit-category">Category</Label>
//               <Select value={editForm.category} onValueChange={(value) => setEditForm({...editForm, category: value})}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {LOCATION_CATEGORIES.map((cat) => (
//                     <SelectItem key={cat.value} value={cat.value}>
//                       {cat.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>


//             <div>
//               <Label htmlFor="edit-logo">Logo (Optional)</Label>
//               <div className="flex gap-2">
//                 <Input
//                   id="edit-logo"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleLogoUpload}
//                   className="flex-1"
//                 />
//                 <Button variant="outline" size="sm">
//                   <Upload className="h-4 w-4" />
//                 </Button>
//               </div>
//               {editForm.logoUrl && (
//                 <div className="mt-2">
//                   <Image
//                     src={editForm.logoUrl}
//                     alt="Logo preview"
//                     width={48}
//                     height={48}
//                     className="w-12 h-12 object-cover rounded border"
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <Button size="sm" onClick={handleEditSave}>
//                 Save
//               </Button>
//               <Button size="sm" variant="outline" onClick={handleEditCancel}>
//                 Cancel
//               </Button>
//             </div>
//           </div>
//         )}

//         {currentFloorTags.length > 0 && (
//           <div>
//             <h4 className="font-medium text-sm mb-2">
//               Tagged Locations ({currentFloorTags.length})
//             </h4>
//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {currentFloorTags.map((tag, index) => {
//                 // Ensure we have a valid key
//                 const tagKey = tag?.id || `tag-${index}-${tag?.name || 'unknown'}`;
                
//                 if (!tag) {
//                   console.error(`Invalid tag at index ${index}:`, tag);
//                   return null;
//                 }

//                 return (
//                   <div
//                     key={tagKey}
//                     className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
//                   >
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       {tag.logoUrl ? (
//                         <Image
//                           src={tag.logoUrl}
//                           alt={tag.name || 'Location'}
//                           width={24}
//                           height={24}
//                           className="w-6 h-6 object-cover rounded"
//                         />
//                       ) : tag.shape === "circle" ? (
//                         <Circle className="h-4 w-4 text-gray-500" />
//                       ) : (
//                         <Square className="h-4 w-4 text-gray-500" />
//                       )}
//                       <div className="flex-1 min-w-0">
//                         <div className="font-medium text-sm truncate">
//                           {tag.name || 'Unnamed Location'}
//                         </div>
//                         <Badge
//                           variant="secondary"
//                           className={`text-xs ${getCategoryColor(tag.category || 'unknown')}`}
//                         >
//                           {tag.category || 'Unknown'}
//                         </Badge>
//                       </div>
//                       {tag.color && (
//                         <div
//                           className="w-4 h-4 rounded-full border border-gray-300"
//                           style={{ backgroundColor: tag.color }}
//                           title={`Tag color: ${tag.color}`}
//                         />
//                       )}
//                     </div>
//                     <div className="flex gap-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleEditStart(tag)}
//                         className="h-7 w-7 p-0"
//                         disabled={!tag.id}
//                       >
//                         <Edit2 className="h-3 w-3" />
//                       </Button>
//                       {onDeleteTag && tag.id && (
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => onDeleteTag(tag.id)}
//                           className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
//                         >
//                           <Trash2 className="h-3 w-3" />
//                         </Button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {!isTagMode && currentFloorTags.length === 0 && (
//           <div className="text-center text-gray-500 text-sm py-4">
//             Enable Tag Mode to start adding location tags
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };



"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Circle, Square, Edit2, Trash2, Upload, Save, X, Palette, CheckSquare } from "lucide-react";
import Image from "next/image";
import { bulkUpdateLocations, BulkLocationUpdateData } from "@/lib/locationData";

export interface TaggedLocation {
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

const LOCATION_CATEGORIES = [
  { value: 'room', label: 'Room' },
  { value: 'facility', label: 'Facility' },
  { value: 'office', label: 'Office' },
  { value: 'meeting', label: 'Meeting Room' },
  { value: 'dining', label: 'Dining' },
  { value: 'study', label: 'Study Area' },
  { value: 'entrance', label: 'Entrance' }
];

interface LocationTaggerProps {
  isTagMode: boolean;
  selectedShapeType: "circle" | "rectangle";
  onShapeTypeChange: (shapeType: "circle" | "rectangle") => void;
  tags: TaggedLocation[];
  onEditTag?: (tag: TaggedLocation) => void;
  onDeleteTag?: (tagId: string) => void;
  onBulkUpdateTags?: (tags: TaggedLocation[]) => void;
  currentFloorId?: string;
}

export const LocationTagger: React.FC<LocationTaggerProps> = ({
  isTagMode,
  selectedShapeType,
  onShapeTypeChange,
  tags,
  onEditTag,
  onDeleteTag,
  onBulkUpdateTags,
  currentFloorId,
}) => {
  const [editingTag, setEditingTag] = useState<TaggedLocation | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    logoUrl: "",
    color: "",
    textColor: "",
    description: "",
  });

  // Bulk editing state
  const [isBulkEditMode, setIsBulkEditMode] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, Partial<TaggedLocation>>>(new Map());
  const [isSaving, setIsSaving] = useState(false);
  const [bulkEditForm, setBulkEditForm] = useState({
    category: "",
    color: "",
    textColor: "",
    isPublished: undefined as boolean | undefined,
  });

  const currentFloorTags = currentFloorId
    ? tags.filter((tag) => 
        tag && 
        tag.id && 
        (tag.floorId === currentFloorId || !tag.floorId)
      )
    : tags.filter((tag) => tag && tag.id);

  // Debug logging
  useEffect(() => {
    currentFloorTags.forEach((tag, index) => {
      if (!tag.id) {
        console.error(`Tag at index ${index} has no ID:`, tag);
      }
    });
  }, [currentFloorTags]);

  // Handle tag selection for bulk edit
  const handleTagSelection = (tagId: string, selected: boolean) => {
    const newSelected = new Set(selectedTags);
    if (selected) {
      newSelected.add(tagId);
    } else {
      newSelected.delete(tagId);
      // Remove from pending updates if deselected
      const newPending = new Map(pendingUpdates);
      newPending.delete(tagId);
      setPendingUpdates(newPending);
    }
    setSelectedTags(newSelected);
  };

  // Select all tags
  const handleSelectAll = () => {
    if (selectedTags.size === currentFloorTags.length) {
      setSelectedTags(new Set());
      setPendingUpdates(new Map());
    } else {
      setSelectedTags(new Set(currentFloorTags.map(tag => tag.id)));
    }
  };

  // Handle bulk property changes
  const handleBulkPropertyChange = (property: string, value: any) => {
    const newPending = new Map(pendingUpdates);
    
    selectedTags.forEach(tagId => {
      const existing = newPending.get(tagId) || {};
      newPending.set(tagId, { ...existing, [property]: value });
    });
    
    setPendingUpdates(newPending);
  };

  // Save bulk updates
  const handleBulkSave = async () => {
    if (pendingUpdates.size === 0) return;

    setIsSaving(true);
    try {
      const bulkUpdateData: BulkLocationUpdateData[] = [];
      
      pendingUpdates.forEach((updates, tagId) => {
        const originalTag = tags.find(t => t.id === tagId);
        if (originalTag) {
          const updateData: BulkLocationUpdateData = {
            location_id: tagId,
          };

          // Only include fields that have been changed
          if (updates.category !== undefined) updateData.category = updates.category;
          if (updates.color !== undefined) updateData.color = updates.color;
          if (updates.textColor !== undefined) updateData.text_color = updates.textColor;
          if (updates.isPublished !== undefined) updateData.is_published = updates.isPublished;
          if (updates.logoUrl !== undefined) updateData.logoUrl = updates.logoUrl;
          if (updates.description !== undefined) updateData.description = updates.description;
          
          bulkUpdateData.push(updateData);
        }
      });

      const result = await bulkUpdateLocations({
        locations: bulkUpdateData,
        updated_by: "current_user", // You can get this from auth context
      });

      if (result && result.successful_updates > 0) {
        // Update local state with successful updates
        const updatedTags = tags.map(tag => {
          const updates = pendingUpdates.get(tag.id);
          if (updates && result.results.find(r => r.location_id === tag.id && r.status === 'success')) {
            return { ...tag, ...updates };
          }
          return tag;
        });

        if (onBulkUpdateTags) {
          onBulkUpdateTags(updatedTags);
        }

        // Reset bulk edit state
        setIsBulkEditMode(false);
        setSelectedTags(new Set());
        setPendingUpdates(new Map());
        setBulkEditForm({
          category: "",
          color: "",
          textColor: "",
          isPublished: undefined,
        });
      }
    } catch (error) {
      console.error("Bulk update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel bulk edit
  const handleBulkCancel = () => {
    setIsBulkEditMode(false);
    setSelectedTags(new Set());
    setPendingUpdates(new Map());
    setBulkEditForm({
      category: "",
      color: "",
      textColor: "",
      isPublished: undefined,
    });
  };


    // Single edit functions
    const handleEditStart = (tag: TaggedLocation) => {
      if (!tag || !tag.id) {
        console.error("Cannot edit tag: invalid tag data", tag);
        return;
      }
      
      setEditingTag(tag);
      setEditForm({
        name: tag.name || "",
        category: tag.category || "",
        logoUrl: tag.logoUrl || "",
        color: tag.color || "",
        textColor: tag.textColor || "",
        description: tag.description || "",
      });
    };
  
    const handleEditSave = async () => {
      if (editingTag && onEditTag) {
        const updatedTag = {
          ...editingTag,
          name: editForm.name,
          category: editForm.category,
          logoUrl: editForm.logoUrl,
          color: editForm.color,
          textColor: editForm.textColor,
          description: editForm.description,
        };
        
        await onEditTag(updatedTag);
        setEditingTag(null);
        setEditForm({
          name: '',
          category: '',
          logoUrl: '',
          color: '',
          textColor: '',
          description: '',
        });
      }
    };
  
    const handleEditCancel = () => {
      setEditingTag(null);
      setEditForm({ name: "", category: "", logoUrl: "", color: "", textColor: "", description: "" });
    };
  
    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const logoUrl = e.target?.result as string;
          if (isBulkEditMode) {
            handleBulkPropertyChange('logoUrl', logoUrl);
          } else {
            setEditForm((prev) => ({ ...prev, logoUrl }));
          }
        };
        reader.readAsDataURL(file);
      }
    };
  
    const getCategoryColor = (category: string) => {
      const colors: { [key: string]: string } = {
        room: "bg-blue-100 text-blue-800",
        facility: "bg-green-100 text-green-800",
        office: "bg-purple-100 text-purple-800",
        meeting: "bg-indigo-100 text-indigo-800",
        dining: "bg-orange-100 text-orange-800",
        study: "bg-yellow-100 text-yellow-800",
        entrance: "bg-red-100 text-red-800",
      };
  
      return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-800";
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Tagger
          </CardTitle>
          <CardDescription>
            Tag important locations on your map
            {currentFloorId && (
              <span className="block text-xs text-blue-600 mt-1">
                Current floor tags only
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isTagMode && (
            <div>
              <Label>Shape Type</Label>
              <Select value={selectedShapeType} onValueChange={onShapeTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4" />
                      Circle
                    </div>
                  </SelectItem>
                  <SelectItem value="rectangle">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      Rectangle
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
  
          {/* Bulk Edit Controls */}
          {currentFloorTags.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant={isBulkEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsBulkEditMode(!isBulkEditMode)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  {isBulkEditMode ? "Exit Bulk Edit" : "Bulk Edit"}
                </Button>
                
                {isBulkEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    {selectedTags.size === currentFloorTags.length ? "Deselect All" : "Select All"}
                  </Button>
                )}
              </div>
  
              {/* Bulk Edit Form */}
              {isBulkEditMode && selectedTags.size > 0 && (
                <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
                  <h4 className="font-medium text-sm">
                    Bulk Edit {selectedTags.size} Selected Tags
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="bulk-category">Category</Label>
                      <Select
                        value={bulkEditForm.category}
                        onValueChange={(value) => {
                          setBulkEditForm(prev => ({ ...prev, category: value }));
                          handleBulkPropertyChange('category', value);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {LOCATION_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
  
                    <div>
                      <Label htmlFor="bulk-color">Tag Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="bulk-color"
                          type="color"
                          value={bulkEditForm.color}
                          onChange={(e) => {
                            setBulkEditForm(prev => ({ ...prev, color: e.target.value }));
                            handleBulkPropertyChange('color', e.target.value);
                          }}
                          className="w-16 h-8"
                        />
                                              <Input
                        type="text"
                        value={bulkEditForm.color}
                        onChange={(e) => {
                          setBulkEditForm(prev => ({ ...prev, color: e.target.value }));
                          handleBulkPropertyChange('color', e.target.value);
                        }}
                        placeholder="#3b82f6"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bulk-text-color">Text Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bulk-text-color"
                        type="color"
                        value={bulkEditForm.textColor}
                        onChange={(e) => {
                          setBulkEditForm(prev => ({ ...prev, textColor: e.target.value }));
                          handleBulkPropertyChange('textColor', e.target.value);
                        }}
                        className="w-16 h-8"
                      />
                      <Input
                        type="text"
                        value={bulkEditForm.textColor}
                        onChange={(e) => {
                          setBulkEditForm(prev => ({ ...prev, textColor: e.target.value }));
                          handleBulkPropertyChange('textColor', e.target.value);
                        }}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bulk-published">Published Status</Label>
                    <Select
                      value={bulkEditForm.isPublished?.toString() || ""}
                      onValueChange={(value) => {
                        const published = value === "true" ? true : value === "false" ? false : undefined;
                        setBulkEditForm(prev => ({ ...prev, isPublished: published }));
                        handleBulkPropertyChange('isPublished', published);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Published</SelectItem>
                        <SelectItem value="false">Unpublished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bulk-logo">Logo (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bulk-logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handleBulkSave}
                    disabled={isSaving || pendingUpdates.size === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : `Save ${selectedTags.size} Tags`}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>

                {pendingUpdates.size > 0 && (
                  <div className="text-xs text-blue-600">
                    {pendingUpdates.size} tag(s) have pending changes
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Single Tag Edit Form */}
        {editingTag && (
          <div className="p-4 border rounded-lg bg-blue-50 space-y-3">
            <h4 className="font-medium text-sm">Edit Tag</h4>
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Location name"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={editForm.category}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="edit-color">Tag Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-16 h-8"
                  />
                  <Input
                    type="text"
                    value={editForm.color}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, color: e.target.value }))
                    }
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-text-color">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-text-color"
                    type="color"
                    value={editForm.textColor}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, textColor: e.target.value }))
                    }
                    className="w-16 h-8"
                  />
                  <Input
                    type="text"
                    value={editForm.textColor}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, textColor: e.target.value }))
                    }
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Input
                id="edit-description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Location description"
              />
            </div>

            <div>
              <Label htmlFor="edit-logo">Logo (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {editForm.logoUrl && (
                <div className="mt-2">
                  <Image
                    src={editForm.logoUrl}
                    alt="Logo preview"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditSave}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleEditCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Tags List */}
        {currentFloorTags.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">
              Tagged Locations ({currentFloorTags.length})
              {isBulkEditMode && selectedTags.size > 0 && (
                <span className="ml-2 text-blue-600">
                  ({selectedTags.size} selected)
                </span>
              )}
            </h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentFloorTags.map((tag, index) => {
                const tagKey = tag?.id || `tag-${index}-${tag?.name || 'unknown'}`;
                
                if (!tag) {
                  console.error(`Invalid tag at index ${index}:`, tag);
                  return null;
                }

                const isSelected = selectedTags.has(tag.id);
                const hasPendingUpdates = pendingUpdates.has(tag.id);

                return (
                  <div
                    key={tagKey}
                    className={`flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 ${
                      isSelected ? 'bg-blue-50 border-blue-300' : ''
                    } ${hasPendingUpdates ? 'border-orange-300 bg-orange-50' : ''}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isBulkEditMode && (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleTagSelection(tag.id, checked as boolean)
                          }
                        />
                      )}
                      
                      {tag.logoUrl ? (
                        <Image
                          src={tag.logoUrl}
                          alt={tag.name || 'Location'}
                          width={24}
                          height={24}
                          className="w-6 h-6 object-cover rounded"
                        />
                      ) : tag.shape === "circle" ? (
                        <Circle className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-500" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {tag.name || 'Unnamed Location'}
                          {hasPendingUpdates && (
                            <span className="ml-1 text-xs text-orange-600">*</span>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(tag.category || 'unknown')}`}
                        >
                          {tag.category || 'Unknown'}
                        </Badge>
                      </div>
                      
                      {tag.color && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: tag.color }}
                          title={`Tag color: ${tag.color}`}
                        />
                      )}
                    </div>
                    
                    {!isBulkEditMode && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditStart(tag)}
                          className="h-7 w-7 p-0"
                          disabled={!tag.id}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        {onDeleteTag && tag.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteTag(tag.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isTagMode && currentFloorTags.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            Enable Tag Mode to start adding location tags
          </div>
        )}
      </CardContent>
    </Card>
  );
};

  