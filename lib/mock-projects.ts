import { Project } from '@/types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Kenya Forest Restoration',
    location: 'Aberdare Range, Kenya',
    country: 'Kenya',
    description: 'Restoring indigenous forests in the Aberdare mountain range to protect water sources and wildlife habitats.',
    imageUrl: '/images/kenya-forest.jpg',
    treesPlanted: 45000,
    treesGoal: 100000,
    co2PerTree: 22,
    costPerTree: 0.5,
    treeTypes: ['Cedar', 'Olive', 'Podocarpus'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Amazon Rainforest Recovery',
    location: 'Acre, Brazil',
    country: 'Brazil',
    description: 'Rebuilding degraded rainforest areas with native species to combat deforestation and restore biodiversity.',
    imageUrl: '/images/amazon-brazil.jpg',
    treesPlanted: 120000,
    treesGoal: 200000,
    co2PerTree: 35,
    costPerTree: 1.2,
    treeTypes: ['Mahogany', 'Brazil Nut', 'Rubber Tree'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Mangrove Protection Indonesia',
    location: 'Sumatra, Indonesia',
    country: 'Indonesia',
    description: 'Planting mangroves along coastal areas to protect communities from erosion and provide marine habitats.',
    imageUrl: '/images/mangrove-indonesia.jpg',
    treesPlanted: 80000,
    treesGoal: 80000,
    co2PerTree: 25,
    costPerTree: 0.8,
    treeTypes: ['Red Mangrove', 'Black Mangrove'],
    status: 'completed',
  },
  {
    id: '4',
    name: 'Himalayan Reforestation',
    location: 'Uttarakhand, India',
    country: 'India',
    description: 'Planting native trees in the Himalayan foothills to prevent soil erosion and support local communities.',
    imageUrl: '/images/himalayan-india.jpg',
    treesPlanted: 25000,
    treesGoal: 150000,
    co2PerTree: 18,
    costPerTree: 0.4,
    treeTypes: ['Deodar', 'Oak', 'Pine'],
    status: 'active',
  },
  {
    id: '5',
    name: 'Sahel Green Belt',
    location: 'Tillabéri, Niger',
    country: 'Niger',
    description: 'Creating a green barrier against desertification in the Sahel region through drought-resistant tree planting.',
    imageUrl: '/images/sahel-niger.jpg',
    treesPlanted: 60000,
    treesGoal: 120000,
    co2PerTree: 15,
    costPerTree: 0.3,
    treeTypes: ['Acacia', 'Baobab', 'Moringa'],
    status: 'active',
  },
  {
    id: '6',
    name: 'Atlantic Forest Revival',
    location: 'São Paulo, Brazil',
    country: 'Brazil',
    description: 'Restoring the critically endangered Atlantic Forest ecosystem with diverse native species.',
    imageUrl: '/images/atlantic-forest.jpg',
    treesPlanted: 95000,
    treesGoal: 100000,
    co2PerTree: 30,
    costPerTree: 1.5,
    treeTypes: ['Jatoba', 'Ipê', 'Brazilwood'],
    status: 'active',
  },
  {
    id: '7',
    name: 'Southeast Asian Fruit Forest',
    location: 'Luzon, Philippines',
    country: 'Philippines',
    description: 'Planting fruit-bearing trees to provide food security and income for local farming communities.',
    imageUrl: '/images/fruit-forest-philippines.jpg',
    treesPlanted: 30000,
    treesGoal: 75000,
    co2PerTree: 20,
    costPerTree: 0.6,
    treeTypes: ['Mango', 'Coconut', 'Cacao'],
    status: 'active',
  },
  {
    id: '8',
    name: 'Madagascar Dry Forest',
    location: 'Menabe, Madagascar',
    country: 'Madagascar',
    description: 'Protecting and expanding the unique dry deciduous forests home to endemic species like lemurs.',
    imageUrl: '/images/madagascar-forest.jpg',
    treesPlanted: 15000,
    treesGoal: 50000,
    co2PerTree: 12,
    costPerTree: 0.7,
    treeTypes: ['Baobab', 'Tamarind', 'Pachypodium'],
    status: 'active',
  },
  {
    id: '9',
    name: 'Urban Forest Mexico City',
    location: 'Mexico City, Mexico',
    country: 'Mexico',
    description: 'Creating green spaces and urban forests to improve air quality and reduce heat islands in the city.',
    imageUrl: '/images/urban-mexico.jpg',
    treesPlanted: 50000,
    treesGoal: 50000,
    co2PerTree: 16,
    costPerTree: 2.0,
    treeTypes: ['Jacaranda', 'Ahuehuete', 'Mexican Ash'],
    status: 'completed',
  },
  {
    id: '10',
    name: 'Australian Bushland Recovery',
    location: 'New South Wales, Australia',
    country: 'Australia',
    description: 'Restoring native bushland devastated by wildfires with climate-resilient native species.',
    imageUrl: '/images/bushland-australia.jpg',
    treesPlanted: 35000,
    treesGoal: 200000,
    co2PerTree: 19,
    costPerTree: 1.8,
    treeTypes: ['Eucalyptus', 'Wattle', 'Banksia'],
    status: 'active',
  },
];

// Helper function to get unique countries for filtering
export const getUniqueCountries = (): string[] => {
  return Array.from(new Set(mockProjects.map(p => p.country))).sort();
};

// Helper function to get unique tree types for filtering
export const getUniqueTreeTypes = (): string[] => {
  const allTypes = mockProjects.flatMap(p => p.treeTypes);
  return Array.from(new Set(allTypes)).sort();
};

// Helper function to get price range
export const getPriceRange = (): { min: number; max: number } => {
  const prices = mockProjects.map(p => p.costPerTree);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
