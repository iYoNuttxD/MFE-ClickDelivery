export type VehicleType = 'bike' | 'motorcycle' | 'car';
export type VehicleStatus = 'available' | 'rented' | 'maintenance';

export interface Vehicle {
  id: string;
  ownerId: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  status: VehicleStatus;
  pricePerDay: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
