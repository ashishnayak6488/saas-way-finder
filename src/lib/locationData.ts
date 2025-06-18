// import { toast } from "react-hot-toast";

// export interface LocationData {
//   location_id: string;
//   name: string;
//   category: string;
//   floor_id: string;
//   shape: 'circle' | 'rectangle';
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   radius?: number;
//   logo_url?: string;
//   color: string;
//   text_color: string;
//   is_published: boolean;
//   description?: string;
//   created_by?: string;
//   datetime: number;
//   status: string;
// }

// export interface CreateLocationRequest {
//   name: string;
//   category: string;
//   floor_id: string;
//   shape: 'circle' | 'rectangle';
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   radius?: number;
//   logoUrl?: string;
//   color?: string;
//   text_color?: string;
//   is_published?: boolean;
//   description?: string;
// }

// // Create a new location
// export const createLocation = async (locationData: CreateLocationRequest): Promise<LocationData | null> => {
//   try {
//     const response = await fetch("/api/location/createLocation", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(locationData),
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       toast.error(data.error || "Failed to create location");
//       return null;
//     }

//     toast.success("Location created successfully");
//     return data.data;
//   } catch (error) {
//     console.error("Error creating location:", error);
//     toast.error("Failed to create location");
//     return null;
//   }
// };

// // Get locations by floor ID
// export const getLocationsByFloorId = async (floorId: string): Promise<LocationData[]> => {
//   try {
//     const response = await fetch(`/api/location/getLocation?floor_id=${floorId}`, {
//       method: "GET",
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Failed to fetch locations:", data.error);
//       return [];
//     }

//     return data.data || [];
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return [];
//   }
// };

// // Get locations by building ID
// export const getLocationsByBuildingId = async (buildingId: string): Promise<LocationData[]> => {
//   try {
//     const response = await fetch(`/api/location?building_id=${buildingId}`, {
//       method: "GET",
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Failed to fetch locations:", data.error);
//       return [];
//     }

//     return data.data || [];
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return [];
//   }
// };

// // Get published locations only
// export const getPublishedLocations = async (floorId?: string): Promise<LocationData[]> => {
//   try {
//     const params = new URLSearchParams();
//     params.append('is_published', 'true');
//     if (floorId) params.append('floor_id', floorId);

//     const response = await fetch(`/api/location?${params.toString()}`, {
//       method: "GET",
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Failed to fetch published locations:", data.error);
//       return [];
//     }

//     return data.data || [];
//   } catch (error) {
//     console.error("Error fetching published locations:", error);
//     return [];
//   }
// };

// // Update location
// export const updateLocation = async (
//   locationId: string, 
//   updates: Partial<CreateLocationRequest>
// ): Promise<LocationData | null> => {
//   try {
//     const response = await fetch(`/api/location/${locationId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updates),
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       toast.error(data.error || "Failed to update location");
//       return null;
//     }

//     toast.success("Location updated successfully");
//     return data.data;
//   } catch (error) {
//     console.error("Error updating location:", error);
//     toast.error("Failed to update location");
//     return null;
//   }
// };

// // Delete location
// export const deleteLocation = async (locationId: string): Promise<boolean> => {
//   try {
//     const response = await fetch(`/api/location/${locationId}`, {
//       method: "DELETE",
//       credentials: "include",
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       toast.error(data.error || "Failed to delete location");
//       return false;
//     }

//     toast.success("Location deleted successfully");
//     return true;
//   } catch (error) {
//     console.error("Error deleting location:", error);
//     toast.error("Failed to delete location");
//     return false;
//   }
// };








import { toast } from "react-hot-toast";

export interface LocationData {
  location_id: string;
  name: string;
  category: string;
  floor_id: string;
  shape: 'circle' | 'rectangle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  logo_url?: string;
  color: string;
  text_color: string;
  is_published: boolean;
  description?: string;
  created_by?: string;
  datetime: number;
  status: string;
}

export interface CreateLocationRequest {
  name: string;
  category: string;
  floor_id: string;
  shape: 'circle' | 'rectangle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  logoUrl?: string;
  color?: string;
  text_color?: string;
  is_published?: boolean;
  description?: string;
}

export interface UpdateLocationRequest {
  name?: string;
  category?: string;
  floor_id?: string;
  shape?: 'circle' | 'rectangle';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  logoUrl?: string;
  color?: string;
  text_color?: string;
  is_published?: boolean;
  description?: string;
}

// Create a new location
export const createLocation = async (locationData: CreateLocationRequest): Promise<LocationData | null> => {
  try {
    // Validate required fields
    if (!locationData.name || !locationData.category || !locationData.floor_id) {
      toast.error("Missing required fields: name, category, or floor_id");
      return null;
    }

    // Validate shape-specific requirements
    if (locationData.shape === 'circle' && !locationData.radius) {
      toast.error("Radius is required for circle shape");
      return null;
    }

    if (locationData.shape === 'rectangle' && (!locationData.width || !locationData.height)) {
      toast.error("Width and height are required for rectangle shape");
      return null;
    }

    console.log('Creating location with validated data:', JSON.stringify(locationData, null, 2));
    
    const response = await fetch("/api/location/createLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(locationData),
      credentials: "include",
    });

    const responseText = await response.text();
    console.log('API Response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('API Error Details:', errorData);
        
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details.map((err: any) => 
            `${err.loc?.join('.')} - ${err.msg}`
          ).join(', ');
          toast.error(`Validation Error: ${errorMessages}`);
        } else {
          toast.error(errorData.error || "Failed to create location");
        }
      } catch (e) {
        toast.error(`Server Error: ${responseText}`);
      }
      return null;
    }

    const data = JSON.parse(responseText);
    toast.success("Location created successfully");
    return data.data;
  } catch (error) {
    console.error("Error creating location:", error);
    toast.error("Failed to create location");
    return null;
  }
};

// Update location
export const updateLocation = async (
  locationId: string, 
  updates: UpdateLocationRequest
): Promise<LocationData | null> => {
  try {
    console.log('Updating location:', locationId, 'with data:', JSON.stringify(updates, null, 2));
    
    // Validate shape-specific requirements if shape is being updated
    if (updates.shape === 'circle' && updates.radius === undefined) {
      toast.error("Radius is required for circle shape");
      return null;
    }

    if (updates.shape === 'rectangle' && (updates.width === undefined || updates.height === undefined)) {
      toast.error("Width and height are required for rectangle shape");
      return null;
    }

    const response = await fetch(`/api/location/updateLocation/${locationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
      credentials: "include",
    });

    const responseText = await response.text();
    console.log('Update API Response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Update API Error Details:', errorData);
        
        if (errorData.details && Array.isArray(errorData.details)) {
          const errorMessages = errorData.details.map((err: any) => 
            `${err.loc?.join('.')} - ${err.msg}`
          ).join(', ');
          toast.error(`Validation Error: ${errorMessages}`);
        } else {
          toast.error(errorData.error || "Failed to update location");
        }
      } catch (e) {
        toast.error(`Server Error: ${responseText}`);
      }
      return null;
    }

    const data = JSON.parse(responseText);
    toast.success("Location updated successfully");
    return data.data;
  } catch (error) {
    console.error("Error updating location:", error);
    toast.error("Failed to update location");
    return null;
  }
};

// Delete location
export const deleteLocation = async (locationId: string): Promise<boolean> => {
  try {
    console.log('Deleting location:', locationId);
    
    const response = await fetch(`/api/location/deleteLocation/${locationId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const responseText = await response.text();
    console.log('Delete API Response:', responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Delete API Error Details:', errorData);
        toast.error(errorData.error || "Failed to delete location");
      } catch (e) {
        toast.error(`Server Error: ${responseText}`);
      }
      return false;
    }

    // Handle successful deletion
    let data = {};
    if (responseText.trim()) {
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // If response is not JSON, assume success
        console.log('Delete successful - non-JSON response');
      }
    }

    toast.success("Location deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting location:", error);
    toast.error("Failed to delete location");
    return false;
  }
};



// Get locations by floor ID
export const getLocationsByFloorId = async (floorId: string): Promise<LocationData[]> => {
    try {
      console.log('Fetching locations for floor:', floorId);
      
      const response = await fetch(`/api/location/getLocation?floor_id=${floorId}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
      console.log('Get locations API Response:', responseText);
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error("Failed to fetch locations:", errorData.error);
        } catch (e) {
          console.error("Failed to fetch locations:", responseText);
        }
        return [];
      }
  
      const data = JSON.parse(responseText);
      console.log(`Loaded ${data.data?.length || 0} locations for floor ${floorId}`);
      return data.data || [];
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };
  
  // Get locations by building ID
  export const getLocationsByBuildingId = async (buildingId: string): Promise<LocationData[]> => {
    try {
      console.log('Fetching locations for building:', buildingId);
      
      const response = await fetch(`/api/location?building_id=${buildingId}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
      console.log('Get building locations API Response:', responseText);
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error("Failed to fetch building locations:", errorData.error);
        } catch (e) {
          console.error("Failed to fetch building locations:", responseText);
        }
        return [];
      }
  
      const data = JSON.parse(responseText);
      console.log(`Loaded ${data.data?.length || 0} locations for building ${buildingId}`);
      return data.data || [];
    } catch (error) {
      console.error("Error fetching building locations:", error);
      return [];
    }
  };
  
  // Get published locations only
  export const getPublishedLocations = async (floorId?: string): Promise<LocationData[]> => {
    try {
      const params = new URLSearchParams();
      params.append('is_published', 'true');
      if (floorId) params.append('floor_id', floorId);
  
      console.log('Fetching published locations with params:', params.toString());
  
      const response = await fetch(`/api/location?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
      console.log('Get published locations API Response:', responseText);
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error("Failed to fetch published locations:", errorData.error);
        } catch (e) {
          console.error("Failed to fetch published locations:", responseText);
        }
        return [];
      }
  
      const data = JSON.parse(responseText);
      console.log(`Loaded ${data.data?.length || 0} published locations`);
      return data.data || [];
    } catch (error) {
      console.error("Error fetching published locations:", error);
      return [];
    }
  };
  
  // Get single location by ID
  export const getLocationById = async (locationId: string): Promise<LocationData | null> => {
    try {
      console.log('Fetching location by ID:', locationId);
      
      const response = await fetch(`/api/location/${locationId}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
      console.log('Get location by ID API Response:', responseText);
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error("Failed to fetch location:", errorData.error);
        } catch (e) {
          console.error("Failed to fetch location:", responseText);
        }
        return null;
      }
  
      const data = JSON.parse(responseText);
      console.log('Loaded location:', data.data);
      return data.data || null;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  };
  
  // Bulk update locations
  export const bulkUpdateLocations = async (
    locationIds: string[],
    updates: UpdateLocationRequest
  ): Promise<boolean> => {
    try {
      console.log('Bulk updating locations:', locationIds, 'with data:', updates);
      
      const updatePromises = locationIds.map(id => updateLocation(id, updates));
      const results = await Promise.all(updatePromises);
      
      const successCount = results.filter(result => result !== null).length;
      const failCount = results.length - successCount;
      
      if (failCount > 0) {
        toast.error(`Updated ${successCount} locations, ${failCount} failed`);
        return false;
      } else {
        toast.success(`Successfully updated ${successCount} locations`);
        return true;
      }
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Failed to bulk update locations");
      return false;
    }
  };
  
  // Bulk delete locations
  export const bulkDeleteLocations = async (locationIds: string[]): Promise<boolean> => {
    try {
      console.log('Bulk deleting locations:', locationIds);
      
      const deletePromises = locationIds.map(id => deleteLocation(id));
      const results = await Promise.all(deletePromises);
      
      const successCount = results.filter(result => result === true).length;
      const failCount = results.length - successCount;
      
      if (failCount > 0) {
        toast.error(`Deleted ${successCount} locations, ${failCount} failed`);
        return false;
      } else {
        toast.success(`Successfully deleted ${successCount} locations`);
        return true;
      }
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast.error("Failed to bulk delete locations");
      return false;
    }
  };
  




  // Search locations
export const searchLocations = async (
    query: string,
    floorId?: string,
    category?: string
  ): Promise<LocationData[]> => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (floorId) params.append('floor_id', floorId);
      if (category) params.append('category', category);
  
      console.log('Searching locations with params:', params.toString());
  
      const response = await fetch(`/api/location?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
      console.log('Search locations API Response:', responseText);
  
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
          console.error("Failed to search locations:", errorData.error);
        } catch (e) {
          console.error("Failed to search locations:", responseText);
        }
        return [];
      }
  
      const data = JSON.parse(responseText);
      console.log(`Found ${data.data?.length || 0} locations matching search`);
      return data.data || [];
    } catch (error) {
      console.error("Error searching locations:", error);
      return [];
    }
  };
  
  // Toggle location published status
  export const toggleLocationPublished = async (
    locationId: string,
    isPublished: boolean
  ): Promise<LocationData | null> => {
    try {
      console.log(`Toggling location ${locationId} published status to:`, isPublished);
      
      return await updateLocation(locationId, { is_published: isPublished });
    } catch (error) {
      console.error("Error toggling location published status:", error);
      toast.error("Failed to update location status");
      return null;
    }
  };
  
  // Export helper function for data transformation
  export const transformLocationData = (apiLocation: any): LocationData => {
    return {
      location_id: apiLocation.location_id,
      name: apiLocation.name,
      category: apiLocation.category,
      floor_id: apiLocation.floor_id,
      shape: apiLocation.shape,
      x: apiLocation.x,
      y: apiLocation.y,
      width: apiLocation.width,
      height: apiLocation.height,
      radius: apiLocation.radius,
      logo_url: apiLocation.logo_url,
      color: apiLocation.color,
      text_color: apiLocation.text_color,
      is_published: apiLocation.is_published,
      description: apiLocation.description,
      created_by: apiLocation.created_by,
      datetime: apiLocation.datetime,
      status: apiLocation.status,
    };
  };
  
  // Transform LocationData to CreateLocationRequest format
  export const transformLocationToCreateRequest = (location: LocationData): CreateLocationRequest => {
    return {
      name: location.name,
      category: location.category,
      floor_id: location.floor_id,
      shape: location.shape,
      x: location.x,
      y: location.y,
      width: location.width,
      height: location.height,
      radius: location.radius,
      logoUrl: location.logo_url, // Note: API uses logoUrl, DB uses logo_url
      color: location.color,
      text_color: location.text_color,
      is_published: location.is_published,
      description: location.description,
    };
  };
  
  // Transform LocationData to UpdateLocationRequest format
  export const transformLocationToUpdateRequest = (location: Partial<LocationData>): UpdateLocationRequest => {
    const updateRequest: UpdateLocationRequest = {};
    
    if (location.name !== undefined) updateRequest.name = location.name;
    if (location.category !== undefined) updateRequest.category = location.category;
    if (location.floor_id !== undefined) updateRequest.floor_id = location.floor_id;
    if (location.shape !== undefined) updateRequest.shape = location.shape;
    if (location.x !== undefined) updateRequest.x = location.x;
    if (location.y !== undefined) updateRequest.y = location.y;
    if (location.width !== undefined) updateRequest.width = location.width;
    if (location.height !== undefined) updateRequest.height = location.height;
    if (location.radius !== undefined) updateRequest.radius = location.radius;
    if (location.logo_url !== undefined) updateRequest.logoUrl = location.logo_url;
    if (location.color !== undefined) updateRequest.color = location.color;
    if (location.text_color !== undefined) updateRequest.text_color = location.text_color;
    if (location.is_published !== undefined) updateRequest.is_published = location.is_published;
    if (location.description !== undefined) updateRequest.description = location.description;
  
    return updateRequest;
  };
  
  // Validate location data before API calls
  export const validateLocationData = (location: CreateLocationRequest | UpdateLocationRequest): string[] => {
    const errors: string[] = [];
  
    // Check required fields for create operations
    if ('name' in location && location.name !== undefined) {
      if (!location.name || location.name.trim().length === 0) {
        errors.push("Name is required");
      }
    }
  
    if ('category' in location && location.category !== undefined) {
      if (!location.category || location.category.trim().length === 0) {
        errors.push("Category is required");
      }
    }
  
    if ('floor_id' in location && location.floor_id !== undefined) {
      if (!location.floor_id || location.floor_id.trim().length === 0) {
        errors.push("Floor ID is required");
      }
    }
  
    // Validate coordinates
    if (location.x !== undefined) {
      if (location.x < 0 || location.x > 1) {
        errors.push("X coordinate must be between 0 and 1");
      }
    }
  
    if (location.y !== undefined) {
      if (location.y < 0 || location.y > 1) {
        errors.push("Y coordinate must be between 0 and 1");
      }
    }
  
    // Validate shape-specific properties
    if (location.shape === 'circle') {
      if (location.radius !== undefined && location.radius <= 0) {
        errors.push("Radius must be greater than 0 for circle shape");
      }
    }
  
    if (location.shape === 'rectangle') {
      if (location.width !== undefined && location.width <= 0) {
        errors.push("Width must be greater than 0 for rectangle shape");
      }
      if (location.height !== undefined && location.height <= 0) {
        errors.push("Height must be greater than 0 for rectangle shape");
      }
    }
  
    // Validate color format (basic hex color validation)
    if (location.color !== undefined) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(location.color)) {
        errors.push("Color must be a valid hex color (e.g., #FF0000)");
      }
    }
  
    if (location.text_color !== undefined) {
      const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      if (!hexColorRegex.test(location.text_color)) {
        errors.push("Text color must be a valid hex color (e.g., #000000)");
      }
    }
  
    return errors;
  };
  
  // Get location statistics
  export const getLocationStats = async (floorId?: string, buildingId?: string): Promise<{
    total: number;
    published: number;
    unpublished: number;
    byCategory: Record<string, number>;
  } | null> => {
    try {
      const params = new URLSearchParams();
      if (floorId) params.append('floor_id', floorId);
      if (buildingId) params.append('building_id', buildingId);
  
      const response = await fetch(`/api/location?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        console.error("Failed to fetch location stats");
        return null;
      }
  
      const data = await response.json();
      const locations: LocationData[] = data.data || [];
  
      const stats = {
        total: locations.length,
        published: locations.filter(loc => loc.is_published).length,
        unpublished: locations.filter(loc => !loc.is_published).length,
        byCategory: {} as Record<string, number>
      };
  
      // Count by category
      locations.forEach(location => {
        stats.byCategory[location.category] = (stats.byCategory[location.category] || 0) + 1;
      });
  
      return stats;
    } catch (error) {
      console.error("Error fetching location stats:", error);
      return null;
    }
  };
  
//   // Export all location management functions
//   export {
//     // Main CRUD operations
//     createLocation,
//     updateLocation,
//     deleteLocation,
//     getLocationById,
    
//     // Query operations
//     getLocationsByFloorId,
//     getLocationsByBuildingId,
//     getPublishedLocations,
//     searchLocations,
    
//     // Bulk operations
//     bulkUpdateLocations,
//     bulkDeleteLocations,
    
//     // Utility functions
//     toggleLocationPublished,
//     transformLocationData,
//     transformLocationToCreateRequest,
//     transformLocationToUpdateRequest,
//     validateLocationData,
//     getLocationStats,
//   };
  
  // Default export for convenience
//   export default {
//     create: createLocation,
//     update: updateLocation,
//     delete: deleteLocation,
//     getById: getLocationById,
//     getByFloorId: getLocationsByFloorId,
//     getByBuildingId: getLocationsByBuildingId,
//     getPublished: getPublishedLocations,
//     search: searchLocations,
//     bulkUpdate: bulkUpdateLocations,
//     bulkDelete: bulkDeleteLocations,
//     togglePublished: toggleLocationPublished,
//     validate: validateLocationData,
//     getStats: getLocationStats,
//     transform: transformLocationData,
//   };
  