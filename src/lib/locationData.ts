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
  category: string; // This should match the backend enum values
  floor_id: string;
  shape: 'circle' | 'rectangle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  logoUrl?: string; // Note: frontend uses logoUrl, backend expects logo_url
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
// export const createLocation = async (locationData: CreateLocationRequest): Promise<LocationData | null> => {
//   try {
//     // Validate required fields
//     if (!locationData.name || !locationData.category || !locationData.floor_id) {
//       toast.error("Missing required fields: name, category, or floor_id");
//       return null;
//     }

//     // Validate shape-specific requirements
//     if (locationData.shape === 'circle' && !locationData.radius) {
//       toast.error("Radius is required for circle shape");
//       return null;
//     }

//     if (locationData.shape === 'rectangle' && (!locationData.width || !locationData.height)) {
//       toast.error("Width and height are required for rectangle shape");
//       return null;
//     }
    
//     const response = await fetch("/api/location/createLocation", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(locationData),
//       credentials: "include",
//     });

//     const responseText = await response.text();

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = JSON.parse(responseText);
//         console.error('API Error Details:', errorData);
        
//         if (errorData.details && Array.isArray(errorData.details)) {
//           const errorMessages = errorData.details.map((err: any) => 
//             `${err.loc?.join('.')} - ${err.msg}`
//           ).join(', ');
//           toast.error(`Validation Error: ${errorMessages}`);
//         } else {
//           toast.error(errorData.error || "Failed to create location");
//         }
//       } catch (e) {
//         toast.error(`Server Error: ${responseText}`);
//       }
//       return null;
//     }

//     const data = JSON.parse(responseText);
//     toast.success("Location created successfully");
//     return data.data;
//   } catch (error) {
//     console.error("Error creating location:", error);
//     toast.error("Failed to create location");
//     return null;
//   }
// };  

export const createLocation = async (locationData: CreateLocationRequest): Promise<LocationData | null> => {
  try {
    // Validate required fields
    if (!locationData.name || !locationData.category || !locationData.floor_id) {
      toast.error("Missing required fields: name, category, or floor_id");
      return null;
    }

    // Validate category against allowed values
    const allowedCategories = ['room', 'facility', 'office', 'meeting', 'dining', 'study', 'entrance'];
    if (!allowedCategories.includes(locationData.category)) {
      toast.error("Invalid category selected");
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
    
    const response = await fetch("/api/location/createLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...locationData,
        // Map frontend field names to backend field names
        logo_url: locationData.logoUrl, // Convert logoUrl to logo_url
        logoUrl: undefined, // Remove the frontend field
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.detail || "Failed to create location");
      return null;
    }

    const result = await response.json();
    toast.success("Location created successfully");
    return result.data;
  } catch (error) {
    console.error("Error creating location:", error);
    toast.error("Failed to create location");
    return null;
  }
};



export const updateLocation = async (
  locationId: string, 
  updates: UpdateLocationRequest
): Promise<LocationData | null> => {
  try {
    
    // Validate shape-specific requirements
    if (updates.shape === 'circle' && updates.radius === undefined) {
      toast.error("Radius is required for circle shape");
      return null;
    }

    if (updates.shape === 'rectangle' && (updates.width === undefined || updates.height === undefined)) {
      toast.error("Width and height are required for rectangle shape");
      return null;
    }
    // Use query parameter instead of path parameter
    const response = await fetch(`/api/location/updateLocation?locationId=${locationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
      credentials: "include",
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
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
        const errorText = await response.text();
        toast.error(`Server Error: ${errorText}`);
      }
      return null;
    }

    const responseData = await response.json();
    // Extract the location data from the structured response
    if (responseData && responseData.status === "success" && responseData.data) {
      const locationData = responseData.data;      
      // Convert the response to match our LocationData interface
      const convertedLocationData: LocationData = {
        location_id: locationData.location_id,
        name: locationData.name,
        category: locationData.category,
        floor_id: locationData.floor_id,
        shape: locationData.shape as 'circle' | 'rectangle',
        x: locationData.x,
        y: locationData.y,
        width: locationData.width,
        height: locationData.height,
        radius: locationData.radius,
        logo_url: locationData.logo_url,
        color: locationData.color,
        text_color: locationData.text_color,
        is_published: locationData.is_published,
        description: locationData.description,
        created_by: locationData.created_by,
        datetime: locationData.datetime,
        status: locationData.status
      };

      toast.success("Location updated successfully!");
      return convertedLocationData;
    } else {
      console.error("Invalid response structure:", responseData);
      toast.error("Invalid response from server");
      return null;
    }

  } catch (error) {
    console.error('Error updating location:', error);
    toast.error("Failed to update location");
    return null;
  }
};
export const deleteLocation = async (locationId: string): Promise<boolean> => {
  try {
    
    const response = await fetch(`/api/location/deleteLocation?locationId=${locationId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('Delete API Error Details:', errorData);
        toast.error(errorData.error || "Failed to delete location");
      } catch (e) {
        const errorText = await response.text();
        console.error('Delete API Error Text:', errorText);
        toast.error(`Server Error: ${errorText}`);
      }
      return false;
    }

    // Handle successful deletion
    const responseData = await response.json();

    // Check if the response indicates success
    if (responseData && (responseData.status === 'success' || responseData.deleted_id)) {
      toast.success("Location deleted successfully");
      return true;
    } else {
      console.error('Unexpected delete response format:', responseData);
      toast.error("Location deletion status unclear");
      return false;
    }
  } catch (error) {
    console.error("Error deleting location:", error);
    toast.error("Failed to delete location");
    return false;
  }
};



export const getLocationsByFloorId = async (floorId: string): Promise<LocationData[]> => {
    try {
      
      const response = await fetch(`/api/location/getLocation?floor_id=${floorId}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
  
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
      return data.data || [];
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  };
  
  // Get locations by building ID
  export const getLocationsByBuildingId = async (buildingId: string): Promise<LocationData[]> => {
    try {
      
      const response = await fetch(`/api/location?building_id=${buildingId}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
  
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
  
  
      const response = await fetch(`/api/location?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
  
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
      return data.data || [];
    } catch (error) {
      console.error("Error fetching published locations:", error);
      return [];
    }
  };
  
  // Get single location by ID
  export const getLocationById = async (locationId: string): Promise<LocationData | null> => {
    try {
      
      const response = await fetch(`/api/location/${locationId}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
  
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
  
  
      const response = await fetch(`/api/location?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      });
  
      const responseText = await response.text();
  
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
