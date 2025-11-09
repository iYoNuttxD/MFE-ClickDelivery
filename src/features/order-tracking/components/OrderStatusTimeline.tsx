import React from 'react';
import { OrderStatus } from '@/entities/order/model/types';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

const statusSteps: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Pendente' },
  { status: 'confirmed', label: 'Confirmado' },
  { status: 'preparing', label: 'Preparando' },
  { status: 'ready', label: 'Pronto' },
  { status: 'out_for_delivery', label: 'Em entrega' },
  { status: 'delivered', label: 'Entregue' },
];

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ currentStatus }) => {
  const currentIndex = statusSteps.findIndex((step) => step.status === currentStatus);

  return (
    <div className="flex items-center justify-between">
      {statusSteps.map((step, index) => {
        const isActive = index <= currentIndex;
        const isLast = index === statusSteps.length - 1;

        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className={`mt-2 text-xs ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-1 mx-2 ${isActive ? 'bg-primary-500' : 'bg-gray-300'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
