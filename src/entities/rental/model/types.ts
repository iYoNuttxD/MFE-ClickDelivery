export type RentalStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export interface Rental {
  id: string;
  vehicleId: string;
  courierId: string;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
