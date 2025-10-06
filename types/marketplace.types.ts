export interface MarketplaceItem {
  id: string;
  title: string;
  location: string;
  treesPlanted: number;
  co2Offset: number;
  price: number;
  currency?: string;
  imageUrl: string;
  imageAlt?: string;
}

export interface MarketplaceCardProps extends MarketplaceItem {
  onRetire?: (id: string) => void;
}