import toast from "react-hot-toast";

// Types matching your backend
export interface VerticalConnectorData {
  connector_id: string;
  name: string;
  shared_id: string;
  connector_type: "elevator" | "stairs" | "escalator" | "emergency_exit";
  floor_id: string;
  shape: "circle" | "rectangle";
  x: number;
  y: number;
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
  metadata?: Record<string, any>;
}

export interface CreateVerticalConnectorRequest {
  name: string;
  shared_id: string;
  connector_type: "elevator" | "stairs" | "escalator" | "emergency_exit";
  floor_id: string;
  shape: "circle" | "rectangle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  is_published?: boolean;
  created_by?: string;
}

export interface UpdateVerticalConnectorRequest {
  name?: string;
  shared_id?: string;
  connector_type?: "elevator" | "stairs" | "escalator" | "emergency_exit";
  shape?: "circle" | "rectangle";
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  is_published?: boolean;
  updated_by?: string;
}

// Create vertical connector
export const createVerticalConnector = async (
  connectorData: CreateVerticalConnectorRequest
): Promise<VerticalConnectorData | null> => {
  try {
    
    const response = await fetch('/api/verticalConnector/createVerticalConnector', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(connectorData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Failed to create vertical connector:', errorData.detail || errorData.error);
        toast.error(errorData.detail || errorData.error || 'Failed to create vertical connector');
      } catch (e) {
        console.error('Failed to create vertical connector:', responseText);
        toast.error('Failed to create vertical connector');
      }
      return null;
    }

    const result = JSON.parse(responseText);
    toast.success('Vertical connector created successfully');
    return result.data;
  } catch (error) {
    toast.error('Failed to create vertical connector');
    return null;
  }
};

// Get vertical connectors by floor ID
export const getVerticalConnectorsByFloorId = async (
  floorId: string
): Promise<VerticalConnectorData[]> => {
  try {
    
    const response = await fetch(`/api/verticalConnector/getVerticalConnector?floor_id=${floorId}`, {
      method: 'GET',
      credentials: 'include',
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        toast.error('Failed to fetch vertical connectors');
      }
      return [];
    }

    const result = JSON.parse(responseText);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching vertical connectors:', error);
    return [];
  }
};

// Get vertical connectors by building ID
export const getVerticalConnectorsByBuildingId = async (
  buildingId: string
): Promise<VerticalConnectorData[]> => {
  try {
    
    const response = await fetch(`/api/verticalConnector/getVerticalConnectorByBuildingId?building_id=${buildingId}`, {
      method: 'GET',
      credentials: 'include',
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Failed to fetch building vertical connectors:', errorData.detail || errorData.error);
      } catch (e) {
        console.error('Failed to fetch building vertical connectors:', responseText);
      }
      return [];
    }

    const result = JSON.parse(responseText);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching building vertical connectors:', error);
    return [];
  }
};

// Get vertical connectors by shared ID
export const getVerticalConnectorsBySharedId = async (
  sharedId: string
): Promise<VerticalConnectorData[]> => {
  try {
    
    const response = await fetch(`/api/verticalConnector/getVerticalConnectorByShareId?shared_id=${sharedId}`, {
      method: 'GET',
      credentials: 'include',
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Failed to fetch shared vertical connectors:', errorData.detail || errorData.error);
      } catch (e) {
        console.error('Failed to fetch shared vertical connectors:', responseText);
      }
      return [];
    }

    const result = JSON.parse(responseText);
    return result.data || [];
  } catch (error) {
    console.error('Error fetching shared vertical connectors:', error);
    return [];
  }
};

export const updateVerticalConnector = async (
  connectorId: string,
  updateData: UpdateVerticalConnectorRequest
): Promise<VerticalConnectorData | null> => {
  try {
    
    // Change from path parameter to query parameter
    const response = await fetch(`/api/verticalConnector/updateVerticalConnector?connectorId=${connectorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Failed to update vertical connector:', errorData.detail || errorData.error);
        toast.error(errorData.detail || errorData.error || 'Failed to update vertical connector');
      } catch (e) {
        console.error('Failed to update vertical connector:', responseText);
        toast.error('Failed to update vertical connector');
      }
      return null;
    }

    const result = JSON.parse(responseText);
    toast.success('Vertical connector updated successfully');
    return result.data;
  } catch (error) {
    console.error('Error updating vertical connector:', error);
    toast.error('Failed to update vertical connector');
    return null;
  }
};


export const deleteVerticalConnector = async (connectorId: string): Promise<boolean> => {
  try {
    
    // Change from path parameter to query parameter
    const response = await fetch(`/api/verticalConnector/deleteVerticalConnector?connectorId=${connectorId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Failed to delete vertical connector:', errorData.detail || errorData.error);
        toast.error(errorData.detail || errorData.error || 'Failed to delete vertical connector');
      } catch (e) {
        console.error('Failed to delete vertical connector:', responseText);
        toast.error('Failed to delete vertical connector');
      }
      return false;
    }

    const result = JSON.parse(responseText);
    toast.success('Vertical connector deleted successfully');
    return true;
  } catch (error) {
    toast.error('Failed to delete vertical connector');
    return false;
  }
};


// Bulk delete vertical connectors
export const bulkDeleteVerticalConnectors = async (connectorIds: string[]): Promise<boolean> => {
  try {
    
    const deletePromises = connectorIds.map(id => deleteVerticalConnector(id));
    const results = await Promise.all(deletePromises);
    
    const successCount = results.filter(result => result === true).length;
    const failCount = results.length - successCount;
    
    if (failCount > 0) {
      toast.error(`Deleted ${successCount} connectors, ${failCount} failed`);
      return false;
    } else {
      toast.success(`Successfully deleted ${successCount} connectors`);
      return true;
    }
  } catch (error) {
    console.error('Error in bulk delete:', error);
    toast.error('Failed to bulk delete vertical connectors');
    return false;
  }
};

// Search vertical connectors
export const searchVerticalConnectors = async (
  query: string,
  floorId?: string,
  connectorType?: string
): Promise<VerticalConnectorData[]> => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (floorId) params.append('floor_id', floorId);
    if (connectorType) params.append('connector_type', connectorType);


    const response = await fetch(`/api/verticalConnector/SearchVerticalConnector?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        toast.error('Failed to search vertical connectors');
      }
      return [];
    }

    const result = JSON.parse(responseText);
    return result.data || [];
  } catch (error) {
    console.error('Error searching vertical connectors:', error);
    return [];
  }
};

// Convert backend data to frontend format
export const convertVerticalConnectorDataToFrontend = (backendData: VerticalConnectorData) => {
  return {
    id: backendData.connector_id,
    name: backendData.name,
    type: backendData.connector_type,
    sharedId: backendData.shared_id,
    shape: backendData.shape,
    x: backendData.x,
    y: backendData.y,
    width: backendData.width,
    height: backendData.height,
    radius: backendData.radius,
    color: backendData.color,
    floorId: backendData.floor_id,
    createdAt: new Date(backendData.datetime * 1000).toISOString(),
  };
};

// Convert frontend data to backend format
export const convertVerticalConnectorDataToBackend = (frontendData: any): CreateVerticalConnectorRequest => {
  return {
    name: frontendData.name,
    shared_id: frontendData.sharedId,
    connector_type: frontendData.type,
    floor_id: frontendData.floorId,
    shape: frontendData.shape,
    x: frontendData.x,
    y: frontendData.y,
    width: frontendData.width,
    height: frontendData.height,
    radius: frontendData.radius,
    color: frontendData.color || "#8b5cf6",
    is_published: frontendData.isPublished ?? true,
    created_by: frontendData.createdBy,
  };
};

  