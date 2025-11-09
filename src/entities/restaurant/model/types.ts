export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  address: string;
  phone: string;
  rating: number;
  imageUrl?: string;
  isOpen: boolean;
  deliveryTime?: string;
  deliveryFee?: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
}
