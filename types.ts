export interface Project {
  id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  imageUrl: string;
  treesPlanted: number;
  treesGoal: number;
  co2PerTree: number; // kg
  costPerTree: number; // USD
  treeTypes: string[];
  status: 'active' | 'completed';
}

export interface ProjectFilters {
  regions: string[];
  treeTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}
