// // import toast from "react-hot-toast";

// // export interface PathPoint {
// //   x: number;
// //   y: number;
// // }

// // export interface PathSegment {
// //   id: string;
// //   floorId: string;
// //   points: PathPoint[];
// //   connectorId?: string;
// // }

// // export interface FloorSegment {
// //   floor_id: string;
// //   points: PathPoint[];
// //   entry_connector_id?: string;
// //   exit_connector_id?: string;
// //   source?: string;
// //   destination?: string;
// //   source_tag_id?: string;
// //   destination_tag_id?: string;
// //   segment_index: number;
// // }


// // export interface VerticalTransition {
// //   from_floor_id: string;
// //   to_floor_id: string;
// //   connector_id: string;
// //   connector_type: string;
// //   connector_name?: string;
// //   instruction?: string;
// // }

// // // export interface PathData {
// // //   path_id: string;
// // //   name: string;
// // //   floor_id: string;
// // //   source: string;
// // //   destination: string;
// // //   source_tag_id?: string;
// // //   destination_tag_id?: string;
// // //   points: Array<{ x: number; y: number }>;
// // //   shape: string;
// // //   width?: number;
// // //   height?: number;
// // //   radius?: number;
// // //   color: string;
// // //   is_published: boolean;
// // //   created_by?: string;
// // //   datetime: number;
// // //   updated_by?: string;
// // //   update_on?: number;
// // //   status: string;
// // //   metadata?: any;
// // // }


// // export interface PathData {
// //   path_id: string;
// //   name: string;
// //   is_multi_floor: boolean;
// //   building_id?: string;
// //   floor_id?: string;
// //   source_floor_id?: string;
// //   destination_floor_id?: string;
// //   source: string;
// //   destination: string;
// //   source_tag_id?: string;
// //   destination_tag_id?: string;
// //   points?: PathPoint[];
// //   floor_segments?: FloorSegment[];
// //   vertical_transitions?: VerticalTransition[];
// //   total_floors?: number;
// //   shape: string;
// //   width?: number;
// //   height?: number;
// //   radius?: number;
// //   color: string;
// //   is_published: boolean;
// //   created_by?: string;
// //   datetime: number;
// //   updated_by?: string;
// //   update_on?: number;
// //   status: string;
// //   estimated_time?: number;
// //   metadata?: any;
// // }

// // // export interface CreatePathRequest {
// // //   name: string;
// // //   floor_id: string;
// // //   source: string;
// // //   destination: string;
// // //   source_tag_id?: string;
// // //   destination_tag_id?: string;
// // //   points: PathPoint[];
// // //   shape: "circle" | "rectangle";
// // //   width?: number;
// // //   height?: number;
// // //   radius?: number;
// // //   color: string;
// // //   is_published: boolean;
// // //   created_by?: string;
// // // }


// // export interface CreatePathRequest {
// //   name: string;
// //   is_multi_floor: boolean;
// //   building_id?: string;
// //   floor_id?: string;
// //   points?: PathPoint[];
// //   floor_segments?: {
// //     floor_id: string;
// //     points: PathPoint[];
// //     entry_connector_id?: string;
// //     exit_connector_id?: string;
// //   }[];
// //   vertical_transitions?: {
// //     from_floor_id: string;
// //     to_floor_id: string;
// //     connector_id: string;
// //     connector_type: string;
// //     instruction?: string;
// //   }[];
// //   source: string;
// //   destination: string;
// //   source_tag_id?: string;
// //   destination_tag_id?: string;
// //   shape: string;
// //   width?: number;
// //   height?: number;
// //   radius?: number;
// //   color: string;
// //   is_published: boolean;
// //   created_by?: string;
// //   estimated_time?: number;
// // }

// // export interface UpdatePathRequest {
// //   name?: string;
// //   source?: string;
// //   destination?: string;
// //   source_tag_id?: string;
// //   destination_tag_id?: string;
// //   points?: PathPoint[];
// //   shape?: "circle" | "rectangle";
// //   width?: number;
// //   height?: number;
// //   radius?: number;
// //   color?: string;
// //   is_published?: boolean;
// //   updated_by?: string;
// // }

// // // Frontend Path interface (for compatibility with existing components)
// // export interface Path {
// //   id: string;
// //   name: string;
// //   source: string;
// //   destination: string;
// //   points: PathPoint[];
// //   isPublished: boolean;
// //   sourceTagId?: string;
// //   destinationTagId?: string;
// //   floorId?: string;
// //   color?: string;
// //   isMultiFloor?: boolean;
// //   segments?: PathSegment[];
// //   sourceFloorId?: string;
// //   destinationFloorId?: string;
// // }

// // // // Convert backend PathData to frontend Path
// // // export const convertPathDataToFrontend = (pathData: PathData): Path => {
// // //   return {
// // //     id: pathData.path_id,
// // //     name: pathData.name,
// // //     source: pathData.source,
// // //     destination: pathData.destination,
// // //     points: pathData.points,
// // //     isPublished: pathData.is_published,
// // //     sourceTagId: pathData.source_tag_id,
// // //     destinationTagId: pathData.destination_tag_id,
// // //     floorId: pathData.floor_id,
// // //     color: pathData.color,
// // //     // Multi-floor properties will be handled separately
// // //     isMultiFloor: false,
// // //     segments: undefined,
// // //     sourceFloorId: pathData.floor_id,
// // //     destinationFloorId: pathData.floor_id,
// // //   };
// // // };

// // // // Convert frontend Path to backend CreatePathRequest
// // // export const convertPathToBackend = (path: Path, floorId: string): CreatePathRequest => {
// // //   return {
// // //     name: path.name,
// // //     floor_id: floorId,
// // //     source: path.source,
// // //     destination: path.destination,
// // //     source_tag_id: path.sourceTagId,
// // //     destination_tag_id: path.destinationTagId,
// // //     points: path.points,
// // //     shape: "circle", // Default shape, can be customized
// // //     color: path.color || "#3b82f6",
// // //     is_published: path.isPublished,
// // //     created_by: "user", // This should come from auth context
// // //   };
// // // };



// // // Update the conversion functions to match the new structure
// // // export const convertPathDataToFrontend = (pathData: PathData): Path => {
// // //   return {
// // //     id: pathData.path_id,
// // //     name: pathData.name,
// // //     source: pathData.source,
// // //     destination: pathData.destination,
// // //     points: pathData.points,
// // //     isPublished: pathData.is_published,
// // //     sourceTagId: pathData.source_tag_id,
// // //     destinationTagId: pathData.destination_tag_id,
// // //     floorId: pathData.floor_id,
// // //     color: pathData.color,
// // //     // Add other properties as needed
// // //   };
// // // };


// // export const convertPathDataToFrontend = (pathData: PathData): Path => {
// //   const basePath: Path = {
// //     id: pathData.path_id,
// //     name: pathData.name,
// //     source: pathData.source,
// //     destination: pathData.destination,
// //     points: pathData.points || [],
// //     isPublished: pathData.is_published,
// //     sourceTagId: pathData.source_tag_id,
// //     destinationTagId: pathData.destination_tag_id,
// //     floorId: pathData.floor_id,
// //     color: pathData.color,
// //     isMultiFloor: pathData.is_multi_floor,
// //   };

// //   // Add multi-floor specific fields
// //   if (pathData.is_multi_floor && pathData.floor_segments) {
// //     basePath.segments = pathData.floor_segments.map(segment => ({
// //       id: `${pathData.path_id}-${segment.segment_index}`,
// //       floorId: segment.floor_id,
// //       points: segment.points,
// //       connectorId: segment.exit_connector_id,
// //     }));
// //     basePath.sourceFloorId = pathData.source_floor_id;
// //     basePath.destinationFloorId = pathData.destination_floor_id;
// //   }

// //   return basePath;
// // };


// // export const convertPathToBackend = (path: Path): Partial<PathData> => {
// //   return {
// //     path_id: path.id,
// //     name: path.name,
// //     source: path.source,
// //     destination: path.destination,
// //     points: path.points,
// //     is_published: path.isPublished,
// //     source_tag_id: path.sourceTagId,
// //     destination_tag_id: path.destinationTagId,
// //     floor_id: path.floorId,
// //     color: path.color || '#3b82f6',
// //     shape: 'circle', // Default shape
// //     status: 'active', // Default status
// //   };
// // };

// // // Create a new path
// // export const createPath = async (pathData: CreatePathRequest): Promise<PathData | null> => {
// //   try {
// //     const response = await fetch('/api/path/createPath', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(pathData),
// //     });

// //     const result = await response.json();

// //     if (!response.ok) {
// //       console.error('Failed to create path:', result.error);
// //       toast.error(result.error || 'Failed to create path');
// //       return null;
// //     }

// //     if (result.status === 'success' && result.data) {
// //       toast.success('Path created successfully');
// //       return result.data;
// //     }

// //     return null;
// //   } catch (error) {
// //     console.error('Error creating path:', error);
// //     toast.error('Failed to create path');
// //     return null;
// //   }
// // };

// // // // Get paths by floor ID
// // // export const getPathsByFloorId = async (floorId: string): Promise<PathData[]> => {
// // //   try {
// // //     const response = await fetch(`/api/path/getPath/${floorId}`, {
// // //       method: 'GET',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //     });

// // //     const result = await response.json();

// // //     if (!response.ok) {
// // //       console.error('Failed to fetch paths:', result.error);
// // //       return [];
// // //     }

// // //     if (result.status === 'success' && result.data) {
// // //       return Array.isArray(result.data) ? result.data : [result.data];
// // //     }

// // //     return [];
// // //   } catch (error) {
// // //     console.error('Error fetching paths:', error);
// // //     return [];
// // //   }
// // // };

// // // Change the URL to match your actual route file location
// // export const getPathsByFloorId = async (
// //   floorId: string, 
// //   isPublished?: boolean,
// //   statusFilter: string = 'active'
// // ): Promise<PathData[]> => {
// //   try {
// //     const queryParams = new URLSearchParams();
// //     queryParams.append('floorId', floorId); // Add floorId as query param
// //     if (isPublished !== undefined) {
// //       queryParams.append('is_published', isPublished.toString());
// //     }
// //     queryParams.append('status_filter', statusFilter);
    
// //     const queryString = queryParams.toString();
// //     const url = `/api/path/getPath?${queryString}`; // Use your existing route
    
// //     const response = await fetch(url);
    
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.error || 'Failed to fetch paths');
// //     }
    
// //     const result = await response.json();
    
// //     // The FastAPI returns data in this structure: { status, message, data: { paths: [...] } }
// //     if (result.status === 'success' && result.data && result.data.paths) {
// //       return result.data.paths;
// //     }
    
// //     return [];
// //   } catch (error) {
// //     console.error('Error fetching paths by floor ID:', error);
// //     throw error;
// //   }
// // };


// // // Update a path
// // // export const updatePath = async (pathId: string, updateData: UpdatePathRequest): Promise<PathData | null> => {
// // //   try {
// // //     const response = await fetch(`/api/path/updatePath/${pathId}`, {
// // //       method: 'PUT',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //       body: JSON.stringify(updateData),
// // //     });

// // //     const result = await response.json();

// // //     if (!response.ok) {
// // //       console.error('Failed to update path:', result.error);
// // //       toast.error(result.error || 'Failed to update path');
// // //       return null;
// // //     }

// // //     if (result.status === 'success' && result.data) {
// // //       toast.success('Path updated successfully');
// // //       return result.data;
// // //     }

// // //     return null;
// // //   } catch (error) {
// // //     console.error('Error updating path:', error);
// // //     toast.error('Failed to update path');
// // //     return null;
// // //   }
// // // };


// // export const updatePath = async (pathId: string, updateData: UpdatePathRequest): Promise<PathData | null> => {
// //   try {
// //     const response = await fetch(`/api/path/updatePath?pathId=${pathId}`, {
// //       method: 'PUT',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify(updateData),
// //     });

// //     const result = await response.json();

// //     if (!response.ok) {
// //       console.error('Failed to update path:', result.error);
// //       toast.error(result.error || 'Failed to update path');
// //       return null;
// //     }

// //     if (result.status === 'success' && result.data) {
// //       toast.success('Path updated successfully');
// //       return result.data;
// //     }

// //     return null;
// //   } catch (error) {
// //     console.error('Error updating path:', error);
// //     toast.error('Failed to update path');
// //     return null;
// //   }
// // };


// // // Delete a path
// // export const deletePath = async (pathId: string): Promise<boolean> => {
// //   try {
// //     const response = await fetch(`/api/path/deletePath?pathId=${pathId}`, {
// //       method: 'DELETE',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     const result = await response.json();

// //     if (!response.ok) {
// //       console.error('Failed to delete path:', result.error);
// //       toast.error(result.error || 'Failed to delete path');
// //       return false;
// //     }

// //     if (result.status === 'success') {
// //       toast.success('Path deleted successfully');
// //       return true;
// //     }

// //     return false;
// //   } catch (error) {
// //     console.error('Error deleting path:', error);
// //     toast.error('Failed to delete path');
// //     return false;
// //   }
// // };

// // // Publish/unpublish a path
// // export const togglePathPublishStatus = async (pathId: string, isPublished: boolean): Promise<PathData | null> => {
// //   return updatePath(pathId, { is_published: isPublished });
// // };




// export interface PathPoint {
//   x: number;
//   y: number;
// }


// export interface PathSegment {
//   id: string;
//   floorId: string;
//   points: PathPoint[];
//   connectorId?: string;
// }

// export interface FloorSegment {
//   floor_id: string;
//   points: PathPoint[];
//   entry_connector_id?: string;
//   exit_connector_id?: string;
//   source?: string;
//   destination?: string;
//   source_tag_id?: string;
//   destination_tag_id?: string;
//   segment_index?: number;
// }

// export interface VerticalTransition {
//   from_floor_id: string;
//   to_floor_id: string;
//   connector_id: string;
//   connector_type: string;
//   connector_name?: string;
//   instruction?: string;
// }

// // export interface PathData {
// //   path_id: string;
// //   name: string;
// //   is_multi_floor: boolean;
// //   building_id?: string;
// //   floor_id?: string;
// //   source: string;
// //   destination: string;
// //   source_tag_id?: string;
// //   destination_tag_id?: string;
  
// //   // Single-floor fields
// //   points?: PathPoint[];
  
// //   // Multi-floor fields
// //   floor_segments?: FloorSegment[];
// //   vertical_transitions?: VerticalTransition[];
// //   total_floors?: number;
// //   source_floor_id?: string;
// //   destination_floor_id?: string;
// //   floors_involved?: string[];
  
// //   // Common fields
// //   shape: string;
// //   width?: number;
// //   height?: number;
// //   radius?: number;
// //   color: string;
// //   is_published: boolean;
// //   created_by?: string;
// //   datetime: number;
// //   updated_by?: string;
// //   update_on?: number;
// //   status: string;
// //   estimated_time?: number;
// //   metadata?: Record<string, any>;
// // }


// export interface PathData {
//   path_id: string;
//   name: string;
//   source: string;
//   destination: string;
//   points?: PathPoint[];
//   is_published: boolean;
//   source_tag_id?: string;
//   destination_tag_id?: string;
//   floor_id?: string;
//   color?: string;
//   is_multi_floor?: boolean;
//   segments?: PathSegment[];
//   source_floor_id?: string;
//   destination_floor_id?: string;
//   building_id?: string;
//   total_floors?: number;
//   vertical_transitions?: VerticalTransition[];
//   estimated_time?: number;
//   created_by?: string;
//   datetime?: number;
//   updated_by?: string;
//   update_on?: number;
//   status?: string;
//   metadata?: Record<string, any>;
// }


// export interface CreatePathRequest {
//   name: string;
//   is_multi_floor: boolean;
//   building_id?: string;
  
//   // Single-floor fields
//   floor_id?: string;
//   points?: PathPoint[];
  
//   // Multi-floor fields
//   floor_segments?: {
//     floor_id: string;
//     points: PathPoint[];
//     entry_connector_id?: string;
//     exit_connector_id?: string;
//   }[];
//   vertical_transitions?: {
//     from_floor_id: string;
//     to_floor_id: string;
//     connector_id: string;
//     connector_type: string;
//     instruction?: string;
//   }[];
  
//   // Common fields
//   source: string;
//   destination: string;
//   source_tag_id?: string;
//   destination_tag_id?: string;
//   shape: string;
//   width?: number;
//   height?: number;
//   radius?: number;
//   color: string;
//   is_published: boolean;
//   created_by?: string;
//   estimated_time?: number;
// }

// export interface UpdatePathRequest {
//   name?: string;
//   source?: string;
//   destination?: string;
//   source_tag_id?: string;
//   destination_tag_id?: string;
//   points?: PathPoint[];
//   color?: string;
//   is_published?: boolean;
//   updated_by?: string;
//   estimated_time?: number;
// }

// // API Functions
// export const createPath = async (pathData: CreatePathRequest): Promise<PathData | null> => {
//   try {
//     const response = await fetch('/api/path/createPath', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(pathData),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to create path');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error creating path:', error);
//     throw error;
//   }
// };

// export const getPathsByFloorId = async (
//   floorId: string,
//   isPublished?: boolean,
//   statusFilter: string = 'active'
// ): Promise<PathData[]> => {
//   try {
//     const params = new URLSearchParams();
//     params.append('floorId', floorId);
//     if (isPublished !== undefined) {
//       params.append('is_published', isPublished.toString());
//     }
//     params.append('status_filter', statusFilter);

//     const response = await fetch(`/api/path/getPath?${params.toString()}`);
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch paths');
//     }

//     const result = await response.json();
//     return result.data || [];
//   } catch (error) {
//     console.error('Error fetching paths:', error);
//     throw error;
//   }
// };

// export const getPathsByBuildingId = async (
//   buildingId: string,
//   isPublished?: boolean,
//   pathType?: 'single' | 'multi',
//   limit?: number,
//   skip?: number
// ): Promise<{
//   building_id: string;
//   building_name?: string;
//   total_paths: number;
//   single_floor_paths: number;
//   multi_floor_paths: number;
//   paths: PathData[];
// }> => {
//   try {
//     const params = new URLSearchParams();
//     if (isPublished !== undefined) {
//       params.append('is_published', isPublished.toString());
//     }
//     if (pathType) {
//       params.append('path_type', pathType);
//     }
//     if (limit) {
//       params.append('limit', limit.toString());
//     }
//     if (skip) {
//       params.append('skip', skip.toString());
//     }

//     const response = await fetch(`/api/path/getPathsByBuilding/${buildingId}?${params.toString()}`);
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch building paths');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error fetching building paths:', error);
//     throw error;
//   }
// };

// export const getPathById = async (pathId: string): Promise<PathData | null> => {
//   try {
//     const response = await fetch(`/api/path/getPathById/${pathId}`);
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch path');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error fetching path:', error);
//     throw error;
//   }
// };

// export const updatePath = async (pathId: string, updateData: UpdatePathRequest): Promise<PathData | null> => {
//   try {
//     const response = await fetch(`/api/path/updatePath/${pathId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updateData),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to update path');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error updating path:', error);
//     throw error;
//   }
// };

// export const deletePath = async (pathId: string): Promise<boolean> => {
//   try {
//     const response = await fetch(`/api/path/deletePath/${pathId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to delete path');
//     }

//     return true;
//   } catch (error) {
//     console.error('Error deleting path:', error);
//     throw error;
//   }
// };

// export const togglePathPublishStatus = async (pathId: string, isPublished: boolean): Promise<PathData | null> => {
//   try {
//     const response = await fetch(`/api/path/togglePublish/${pathId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ is_published: isPublished }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to toggle path publish status');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error toggling path publish status:', error);
//     throw error;
//   }
// };

// // // Helper functions for frontend components
// // export const convertPathDataToFrontend = (pathData: PathData): any => {
// //   return {
// //     id: pathData.path_id,
// //     name: pathData.name,
// //     source: pathData.source,
// //     destination: pathData.destination,
// //     points: pathData.points || [],
// //     isPublished: pathData.is_published,
// //     sourceTagId: pathData.source_tag_id,
// //     destinationTagId: pathData.destination_tag_id,
// //     floorId: pathData.floor_id,
// //     color: pathData.color,
// //     isMultiFloor: pathData.is_multi_floor,
// //     segments: pathData.floor_segments?.map(segment => ({
// //       id: `${pathData.path_id}-${segment.segment_index || 0}`,
// //       floorId: segment.floor_id,
// //       points: segment.points,
// //       connectorId: segment.exit_connector_id,
// //     })),
// //     sourceFloorId: pathData.source_floor_id,
// //     destinationFloorId: pathData.destination_floor_id,
// //     buildingId: pathData.building_id,
// //     totalFloors: pathData.total_floors,
// //     verticalTransitions: pathData.vertical_transitions,
// //     estimatedTime: pathData.estimated_time,
// //     createdBy: pathData.created_by,
// //     datetime: pathData.datetime,
// //     updatedBy: pathData.updated_by,
// //     updateOn: pathData.update_on,
// //     status: pathData.status,
// //     metadata: pathData.metadata,
// //   };
// // };

// // export const convertPathToBackend = (frontendPath: any): CreatePathRequest => {
// //   return {
// //     name: frontendPath.name,
// //     is_multi_floor: frontendPath.isMultiFloor || false,
// //     building_id: frontendPath.buildingId,
// //     floor_id: frontendPath.floorId,
// //     points: frontendPath.points,
// //     floor_segments: frontendPath.segments?.map((segment: any, index: number) => ({
// //       floor_id: segment.floorId,
// //       points: segment.points,
// //       entry_connector_id: index > 0 ? segment.connectorId : undefined,
// //       exit_connector_id: segment.connectorId,
// //     })),
// //     vertical_transitions: frontendPath.verticalTransitions,
// //     source: frontendPath.source,
// //     destination: frontendPath.destination,
// //     source_tag_id: frontendPath.sourceTagId,
// //     destination_tag_id: frontendPath.destinationTagId,
// //     shape: 'circle',
// //     radius: 0.01,
// //     color: frontendPath.color || '#3b82f6',
// //     is_published: frontendPath.isPublished || false,
// //     created_by: frontendPath.createdBy || 'user',
// //     estimated_time: frontendPath.estimatedTime,
// //   };
// // };



// export const convertPathDataToFrontend = (pathData: PathData): Path => {
//   return {
//     id: pathData.path_id,
//     name: pathData.name,
//     source: pathData.source,
//     destination: pathData.destination,
//     points: pathData.points || [],
//     isPublished: pathData.is_published,
//     sourceTagId: pathData.source_tag_id,
//     destinationTagId: pathData.destination_tag_id,
//     floorId: pathData.floor_id,
//     color: pathData.color,
//     isMultiFloor: pathData.is_multi_floor,
//     segments: pathData.segments,
//     sourceFloorId: pathData.source_floor_id,
//     destinationFloorId: pathData.destination_floor_id,
//     buildingId: pathData.building_id,
//     totalFloors: pathData.total_floors,
//     verticalTransitions: pathData.vertical_transitions,
//     estimatedTime: pathData.estimated_time,
//     createdBy: pathData.created_by,
//     datetime: pathData.datetime,
//     updatedBy: pathData.updated_by,
//     updateOn: pathData.update_on,
//     status: pathData.status,
//     metadata: pathData.metadata,
//   };
// };

// export const convertPathToBackend = (path: Partial<Path>): Partial<PathData> => {
//   return {
//     path_id: path.id,
//     name: path.name,
//     source: path.source,
//     destination: path.destination,
//     points: path.points,
//     is_published: path.isPublished,
//     source_tag_id: path.sourceTagId,
//     destination_tag_id: path.destinationTagId,
//     floor_id: path.floorId,
//     color: path.color,
//     is_multi_floor: path.isMultiFloor,
//     segments: path.segments,
//     source_floor_id: path.sourceFloorId,
//     destination_floor_id: path.destinationFloorId,
//     building_id: path.buildingId,
//     total_floors: path.totalFloors,
//     vertical_transitions: path.verticalTransitions,
//     estimated_time: path.estimatedTime,
//     created_by: path.createdBy,
//     datetime: path.datetime,
//     updated_by: path.updatedBy,
//     update_on: path.updateOn,
//     status: path.status,
//     metadata: path.metadata,
//   };
// };



export interface PathPoint {
  x: number;
  y: number;
}

export interface PathSegment {
  id: string;
  floorId: string;
  points: PathPoint[];
  connectorId?: string;
}

export interface FloorSegment {
  floor_id: string;
  points: PathPoint[];
  entry_connector_id?: string;
  exit_connector_id?: string;
  source?: string;
  destination?: string;
  source_tag_id?: string;
  destination_tag_id?: string;
  segment_index?: number;
}

export interface VerticalTransition {
  from_floor_id: string;
  to_floor_id: string;
  connector_id: string;
  connector_type: string;
  connector_name?: string;
  instruction?: string;
}

// Backend PathData interface (matches API response)
export interface PathData {
  path_id: string;
  name: string;
  source: string;
  destination: string;
  points?: PathPoint[];
  is_published: boolean;
  source_tag_id?: string;
  destination_tag_id?: string;
  floor_id?: string;
  color?: string;
  is_multi_floor?: boolean;
  floor_segments?: FloorSegment[];
  source_floor_id?: string;
  destination_floor_id?: string;
  building_id?: string;
  total_floors?: number;
  vertical_transitions?: VerticalTransition[];
  estimated_time?: number;
  created_by?: string;
  datetime?: number;
  updated_by?: string;
  update_on?: number;
  status?: string;
  metadata?: Record<string, any>;
  shape?: string;
  width?: number;
  height?: number;
  radius?: number;
}

// Frontend Path interface (used in components)
export interface Path {
  id: string;
  name: string;
  source: string;
  destination: string;
  points: PathPoint[];
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

export interface CreatePathRequest {
  name: string;
  is_multi_floor: boolean;
  building_id?: string;
  
  // Single-floor fields
  floor_id?: string;
  points?: PathPoint[];
  
  // Multi-floor fields
  floor_segments?: {
    floor_id: string;
    points: PathPoint[];
    entry_connector_id?: string;
    exit_connector_id?: string;
  }[];
  vertical_transitions?: {
    from_floor_id: string;
    to_floor_id: string;
    connector_id: string;
    connector_type: string;
    instruction?: string;
  }[];
  
  // Common fields
  source: string;
  destination: string;
  source_tag_id?: string;
  destination_tag_id?: string;
  shape: string;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  is_published: boolean;
  created_by?: string;
  estimated_time?: number;
}

export interface UpdatePathRequest {
  name?: string;
  source?: string;
  destination?: string;
  source_tag_id?: string;
  destination_tag_id?: string;
  points?: PathPoint[];
  color?: string;
  is_published?: boolean;
  updated_by?: string;
  estimated_time?: number;
}

// Conversion Functions
// export const convertPathDataToFrontend = (pathData: PathData): Path => {
//   // Convert floor_segments to segments if they exist
//   let segments: PathSegment[] | undefined;
//   if (pathData.floor_segments && pathData.floor_segments.length > 0) {
//     segments = pathData.floor_segments.map((floorSegment, index) => ({
//       id: `${pathData.path_id}-segment-${index}`,
//       floorId: floorSegment.floor_id,
//       points: floorSegment.points,
//       connectorId: floorSegment.exit_connector_id,
//     }));
//   }

//   return {
//     id: pathData.path_id,
//     name: pathData.name,
//     source: pathData.source,
//     destination: pathData.destination,
//     points: pathData.points || [],
//     isPublished: pathData.is_published,
//     sourceTagId: pathData.source_tag_id,
//     destinationTagId: pathData.destination_tag_id,
//     floorId: pathData.floor_id,
//     color: pathData.color,
//     isMultiFloor: pathData.is_multi_floor,
//     segments: segments,
//     sourceFloorId: pathData.source_floor_id,
//     destinationFloorId: pathData.destination_floor_id,
//     buildingId: pathData.building_id,
//     totalFloors: pathData.total_floors,
//     verticalTransitions: pathData.vertical_transitions,
//     estimatedTime: pathData.estimated_time,
//     createdBy: pathData.created_by,
//     datetime: pathData.datetime,
//     updatedBy: pathData.updated_by,
//     updateOn: pathData.update_on,
//     status: pathData.status,
//     metadata: pathData.metadata,
//   };
// };


// Update the convertPathDataToFrontend function to handle the FastAPI response structure
export const convertPathDataToFrontend = (pathData: any): Path => {
  // Handle the FastAPI response structure
  const apiPath = pathData;
  
  // Convert floor_segments to segments if they exist
  let segments: PathSegment[] | undefined;
  if (apiPath.floor_segments && Array.isArray(apiPath.floor_segments)) {
    segments = apiPath.floor_segments.map((floorSegment: any, index: number) => ({
      id: `${apiPath.path_id}-segment-${index}`,
      floorId: floorSegment.floor_id,
      points: floorSegment.points || [],
      connectorId: floorSegment.exit_connector_id,
    }));
  }

  return {
    id: apiPath.path_id,
    name: apiPath.name,
    source: apiPath.source,
    destination: apiPath.destination,
    points: apiPath.points || [],
    isPublished: apiPath.is_published,
    sourceTagId: apiPath.source_tag_id,
    destinationTagId: apiPath.destination_tag_id,
    floorId: apiPath.floor_id,
    color: apiPath.color,
    isMultiFloor: apiPath.is_multi_floor || false,
    segments: segments,
    sourceFloorId: apiPath.source_floor_id,
    destinationFloorId: apiPath.destination_floor_id,
    buildingId: apiPath.building_id,
    totalFloors: apiPath.total_floors,
    verticalTransitions: apiPath.vertical_transitions,
    estimatedTime: apiPath.estimated_time,
    createdBy: apiPath.created_by,
    datetime: apiPath.datetime,
    updatedBy: apiPath.updated_by,
    updateOn: apiPath.update_on,
    status: apiPath.status,
    metadata: apiPath.metadata,
  };
};


export const convertPathToBackend = (path: Partial<Path>): Partial<PathData> => {
  // Convert segments to floor_segments if they exist
  let floor_segments: FloorSegment[] | undefined;
  if (path.segments && path.segments.length > 0) {
    floor_segments = path.segments.map((segment, index) => ({
      floor_id: segment.floorId,
      points: segment.points,
      entry_connector_id: index > 0 ? segment.connectorId : undefined,
      exit_connector_id: segment.connectorId,
      segment_index: index,
    }));
  }

  return {
    path_id: path.id,
    name: path.name,
    source: path.source,
    destination: path.destination,
    points: path.points,
    is_published: path.isPublished,
    source_tag_id: path.sourceTagId,
    destination_tag_id: path.destinationTagId,
    floor_id: path.floorId,
    color: path.color,
    is_multi_floor: path.isMultiFloor,
    floor_segments: floor_segments,
    source_floor_id: path.sourceFloorId,
    destination_floor_id: path.destinationFloorId,
    building_id: path.buildingId,
    total_floors: path.totalFloors,
    vertical_transitions: path.verticalTransitions,
    estimated_time: path.estimatedTime,
    created_by: path.createdBy,
    datetime: path.datetime,
    updated_by: path.updatedBy,
    update_on: path.updateOn,
    status: path.status,
    metadata: path.metadata,
    shape: 'circle', // Default shape
    radius: 0.01, // Default radius
  };
};

// API Functions
export const createPath = async (pathData: CreatePathRequest): Promise<PathData | null> => {
  try {
    const response = await fetch('/api/path/createPath', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pathData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create path');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating path:', error);
    throw error;
  }
};

// export const getPathsByFloorId = async (
//   floorId: string,
//   isPublished?: boolean,
//   statusFilter: string = 'active'
// ): Promise<PathData[]> => {
//   try {
//     const params = new URLSearchParams();
//     params.append('floorId', floorId);
//     if (isPublished !== undefined) {
//       params.append('is_published', isPublished.toString());
//     }
//     params.append('status_filter', statusFilter);

//     const response = await fetch(`/api/path/getPath?${params.toString()}`);
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch paths');
//     }

//     const result = await response.json();
//     return result.data?.paths || result.data || [];
//   } catch (error) {
//     console.error('Error fetching paths:', error);
//     throw error;
//   }
// };

// export const getPathsByBuildingId = async (
//   buildingId: string,
//   isPublished?: boolean,
//   pathType?: 'single' | 'multi',
//   limit?: number,
//   skip?: number
// ): Promise<{
//   building_id: string;
//   building_name?: string;
//   total_paths: number;
//   single_floor_paths: number;
//   multi_floor_paths: number;
//   paths: PathData[];
// }> => {
//   try {
//     const params = new URLSearchParams();
//     if (isPublished !== undefined) {
//       params.append('is_published', isPublished.toString());
//     }
//     if (pathType) {
//       params.append('path_type', pathType);
//     }
//     if (limit) {
//       params.append('limit', limit.toString());
//     }
//     if (skip) {
//       params.append('skip', skip.toString());
//     }

//     const response = await fetch(`/api/path/getPathsByBuilding/${buildingId}?${params.toString()}`);
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch building paths');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error fetching building paths:', error);
//     throw error;
//   }
// };


export const getPathsByBuildingId = async (
  buildingId: string,
  isPublished?: boolean,
  pathType?: 'single' | 'multi',
  limit?: number,
  skip?: number
): Promise<{
  building_id: string;
  building_name?: string;
  total_paths: number;
  single_floor_paths: number;
  multi_floor_paths: number;
  published_paths: number;
  unpublished_paths: number;
  paths: PathData[];
}> => {
  try {
    debugger; // Debugging point to inspect the function call
    const params = new URLSearchParams();
    if (isPublished !== undefined) {
      params.append('is_published', isPublished.toString());
    }
    if (pathType) {
      params.append('path_type', pathType);
    }
    if (limit) {
      params.append('limit', limit.toString());
    }
    if (skip !== undefined) {
      params.append('skip', skip.toString());
    }

    console.log('Fetching building paths with URL:', `/api/path/getPathsByBuilding/${buildingId}?${params.toString()}`);

    const response = await fetch(`/api/path/getPathsByBuilding/${buildingId}?${params.toString()}`);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      
      let errorMessage = 'Failed to fetch building paths';
      try {
        const error = await response.json();
        errorMessage = error.error || error.message || error.detail || errorMessage;
      } catch (e) {
        console.error('Could not parse error response');
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('API response for building paths:', result);
    
    // Handle the FastAPI response structure
    if (result.status === 'success' && result.data) {
      const apiData = result.data;
      
      // Calculate published/unpublished counts
      const publishedCount = apiData.paths ? apiData.paths.filter((p: any) => p.is_published).length : 0;
      const unpublishedCount = (apiData.total_paths || 0) - publishedCount;
      
      return {
        building_id: apiData.building_id,
        building_name: apiData.building_name,
        total_paths: apiData.total_paths || 0,
        single_floor_paths: apiData.single_floor_paths || 0,
        multi_floor_paths: apiData.multi_floor_paths || 0,
        published_paths: publishedCount,
        unpublished_paths: unpublishedCount,
        paths: apiData.paths || []
      };
    } else {
      console.warn('Unexpected API response structure:', result);
      throw new Error('Invalid response structure from API');
    }
  } catch (error) {
    console.error('Error fetching building paths:', error);
    throw error;
  }
};


// export const getPathsByBuildingId = async (
//   buildingId: string,
//   isPublished?: boolean,
//   pathType?: 'single' | 'multi',
//   limit?: number,
//   skip?: number
// ): Promise<{
//   building_id: string;
//   building_name?: string;
//   total_paths: number;
//   single_floor_paths: number;
//   multi_floor_paths: number;
//   published_paths: number;
//   unpublished_paths: number;
//   paths: PathData[];
// }> => {
//   try {
//     const params = new URLSearchParams();
//     if (isPublished !== undefined) {
//       params.append('is_published', isPublished.toString());
//     }
//     if (pathType) {
//       params.append('path_type', pathType);
//     }
//     if (limit) {
//       params.append('limit', limit.toString());
//     }
//     if (skip) {
//       params.append('skip', skip.toString());
//     }
//     params.append('include_stats', 'true');

//     const response = await fetch(`/api/path/getPathsByBuilding/${buildingId}?${params.toString()}`);
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to fetch building paths');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error fetching building paths:', error);
//     throw error;
//   }
// };

// Keep the floor-based function for backward compatibility but mark as deprecated
export const getPathsByFloorId = async (
  floorId: string,
  isPublished?: boolean,
  statusFilter: string = 'active'
): Promise<PathData[]> => {
  console.warn('getPathsByFloorId is deprecated. Use getPathsByBuildingId instead.');
  
  try {
    const params = new URLSearchParams();
    params.append('floorId', floorId);
    if (isPublished !== undefined) {
      params.append('is_published', isPublished.toString());
    }
    params.append('status_filter', statusFilter);

    const response = await fetch(`/api/path/getPath?${params.toString()}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch paths');
    }

    const result = await response.json();
    return result.data?.paths || result.data || [];
  } catch (error) {
    console.error('Error fetching paths:', error);
    throw error;
  }
};

export const getPathById = async (pathId: string): Promise<PathData | null> => {
  try {
    const response = await fetch(`/api/path/getPathById/${pathId}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch path');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching path:', error);
    throw error;
  }
};

// export const updatePath = async (pathId: string, updateData: UpdatePathRequest): Promise<PathData | null> => {
//   try {
//     const response = await fetch(`/api/path/updatePath/${pathId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updateData),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to update path');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error updating path:', error);
//     throw error;
//   }
// };

// export const deletePath = async (pathId: string): Promise<boolean> => {
//   try {
//     const response = await fetch(`/api/path/deletePath/${pathId}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to delete path');
//     }

//     return true;
//   } catch (error) {
//     console.error('Error deleting path:', error);
//     throw error;
//   }
// };

// export const togglePathPublishStatus = async (pathId: string, isPublished: boolean): Promise<PathData | null> => {
//   try {
//     const response = await fetch(`/api/path/togglePublish/${pathId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ is_published: isPublished }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.error || 'Failed to toggle path publish status');
//     }

//     const result = await response.json();
//     return result.data;
//   } catch (error) {
//     console.error('Error toggling path publish status:', error);
//     throw error;
//   }
// };




export const updatePath = async (pathId: string, updateData: UpdatePathRequest): Promise<PathData | null> => {
  try {
    const response = await fetch(`/api/path/updatePath?pathId=${pathId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update path');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating path:', error);
    throw error;
  }
};

export const deletePath = async (pathId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/path/deletePath?pathId=${pathId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete path');
    }

    return true;
  } catch (error) {
    console.error('Error deleting path:', error);
    throw error;
  }
};

export const togglePathPublishStatus = async (pathId: string, isPublished: boolean): Promise<PathData | null> => {
  try {
    const response = await fetch(`/api/path/togglePublish/${pathId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        is_published: isPublished,
        updated_by: 'user' // TODO: Get from auth context
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to toggle path publish status');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error toggling path publish status:', error);
    throw error;
  }
};


// // // // Publish/unpublish a path
// export const togglePathPublishStatus = async (pathId: string, isPublished: boolean): Promise<PathData | null> => {
//   return updatePath(pathId, { is_published: isPublished });
// };

