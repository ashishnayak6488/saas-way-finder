export interface Floor {
  floor_id: string; // Changed from 'id' to match backend
  label: string;
  order: number;
  imageUrl: string;
  building_id: string; // Reference to parent building
  datetime: number; // Unix timestamp
  status: string;
}

export interface Building {
  building_id: string; // Changed from 'id' to match backend
  name: string;
  address: string;
  description: string;
  floors: Floor[];
  created_by?: string;
  datetime: number; // Unix timestamp
  status: string;
}

export interface NewFloorData {
  label: string;
  order: number;
  imageUrl: string;
}


