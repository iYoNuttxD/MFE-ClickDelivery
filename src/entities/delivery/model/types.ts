export type DeliveryStatus = 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';

export interface Delivery {
  id: string;
  orderId: string;
  courierId: string;
  status: DeliveryStatus;
  pickupAddress: string;
  deliveryAddress: string;
  pickupTime?: string;
  deliveryTime?: string;
  distance?: number;
  earnings?: number;
  createdAt: string;
  updatedAt: string;
}
