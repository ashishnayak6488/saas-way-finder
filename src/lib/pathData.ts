import toast from "react-hot-toast";

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

export interface PathData {
  path_id: string;
  name: string;
  floor_id: string;
  source: string;
  destination: string;
  source_tag_id?: string;
  destination_tag_id?: string;
  points: Array<{ x: number; y: number }>;
  shape: string;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  is_published: boolean;
  created_by?: string;
  datetime: number;
  updated_by?: string;
  update_on?: number;
  status: string;
  metadata?: any;
}

export interface CreatePathRequest {
  name: string;
  floor_id: string;
  source: string;
  destination: string;
  source_tag_id?: string;
  destination_tag_id?: string;
  points: PathPoint[];
  shape: "circle" | "rectangle";
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  is_published: boolean;
  created_by?: string;
}

export interface UpdatePathRequest {
  name?: string;
  source?: string;
  destination?: string;
  source_tag_id?: string;
  destination_tag_id?: string;
  points?: PathPoint[];
  shape?: "circle" | "rectangle";
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  is_published?: boolean;
  updated_by?: string;
}

// Frontend Path interface (for compatibility with existing components)
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
}

// // Convert backend PathData to frontend Path
// export const convertPathDataToFrontend = (pathData: PathData): Path => {
//   return {
//     id: pathData.path_id,
//     name: pathData.name,
//     source: pathData.source,
//     destination: pathData.destination,
//     points: pathData.points,
//     isPublished: pathData.is_published,
//     sourceTagId: pathData.source_tag_id,
//     destinationTagId: pathData.destination_tag_id,
//     floorId: pathData.floor_id,
//     color: pathData.color,
//     // Multi-floor properties will be handled separately
//     isMultiFloor: false,
//     segments: undefined,
//     sourceFloorId: pathData.floor_id,
//     destinationFloorId: pathData.floor_id,
//   };
// };

// // Convert frontend Path to backend CreatePathRequest
// export const convertPathToBackend = (path: Path, floorId: string): CreatePathRequest => {
//   return {
//     name: path.name,
//     floor_id: floorId,
//     source: path.source,
//     destination: path.destination,
//     source_tag_id: path.sourceTagId,
//     destination_tag_id: path.destinationTagId,
//     points: path.points,
//     shape: "circle", // Default shape, can be customized
//     color: path.color || "#3b82f6",
//     is_published: path.isPublished,
//     created_by: "user", // This should come from auth context
//   };
// };



// Update the conversion functions to match the new structure
export const convertPathDataToFrontend = (pathData: PathData): Path => {
  return {
    id: pathData.path_id,
    name: pathData.name,
    source: pathData.source,
    destination: pathData.destination,
    points: pathData.points,
    isPublished: pathData.is_published,
    sourceTagId: pathData.source_tag_id,
    destinationTagId: pathData.destination_tag_id,
    floorId: pathData.floor_id,
    color: pathData.color,
    // Add other properties as needed
  };
};

export const convertPathToBackend = (path: Path): Partial<PathData> => {
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
    color: path.color || '#3b82f6',
    shape: 'circle', // Default shape
    status: 'active', // Default status
  };
};

// Create a new path
export const createPath = async (pathData: CreatePathRequest): Promise<PathData | null> => {
  try {
    const response = await fetch('/api/path/createPath', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pathData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to create path:', result.error);
      toast.error(result.error || 'Failed to create path');
      return null;
    }

    if (result.status === 'success' && result.data) {
      toast.success('Path created successfully');
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error creating path:', error);
    toast.error('Failed to create path');
    return null;
  }
};

// // Get paths by floor ID
// export const getPathsByFloorId = async (floorId: string): Promise<PathData[]> => {
//   try {
//     const response = await fetch(`/api/path/getPath/${floorId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       console.error('Failed to fetch paths:', result.error);
//       return [];
//     }

//     if (result.status === 'success' && result.data) {
//       return Array.isArray(result.data) ? result.data : [result.data];
//     }

//     return [];
//   } catch (error) {
//     console.error('Error fetching paths:', error);
//     return [];
//   }
// };

// Change the URL to match your actual route file location
export const getPathsByFloorId = async (
  floorId: string, 
  isPublished?: boolean,
  statusFilter: string = 'active'
): Promise<PathData[]> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('floorId', floorId); // Add floorId as query param
    if (isPublished !== undefined) {
      queryParams.append('is_published', isPublished.toString());
    }
    queryParams.append('status_filter', statusFilter);
    
    const queryString = queryParams.toString();
    const url = `/api/path/getPath?${queryString}`; // Use your existing route
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch paths');
    }
    
    const result = await response.json();
    
    // The FastAPI returns data in this structure: { status, message, data: { paths: [...] } }
    if (result.status === 'success' && result.data && result.data.paths) {
      return result.data.paths;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching paths by floor ID:', error);
    throw error;
  }
};


// Update a path
// export const updatePath = async (pathId: string, updateData: UpdatePathRequest): Promise<PathData | null> => {
//   try {
//     const response = await fetch(`/api/path/updatePath/${pathId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updateData),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       console.error('Failed to update path:', result.error);
//       toast.error(result.error || 'Failed to update path');
//       return null;
//     }

//     if (result.status === 'success' && result.data) {
//       toast.success('Path updated successfully');
//       return result.data;
//     }

//     return null;
//   } catch (error) {
//     console.error('Error updating path:', error);
//     toast.error('Failed to update path');
//     return null;
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

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to update path:', result.error);
      toast.error(result.error || 'Failed to update path');
      return null;
    }

    if (result.status === 'success' && result.data) {
      toast.success('Path updated successfully');
      return result.data;
    }

    return null;
  } catch (error) {
    console.error('Error updating path:', error);
    toast.error('Failed to update path');
    return null;
  }
};


// Delete a path
export const deletePath = async (pathId: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/path/deletePath?pathId=${pathId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to delete path:', result.error);
      toast.error(result.error || 'Failed to delete path');
      return false;
    }

    if (result.status === 'success') {
      toast.success('Path deleted successfully');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error deleting path:', error);
    toast.error('Failed to delete path');
    return false;
  }
};

// Publish/unpublish a path
export const togglePathPublishStatus = async (pathId: string, isPublished: boolean): Promise<PathData | null> => {
  return updatePath(pathId, { is_published: isPublished });
};
