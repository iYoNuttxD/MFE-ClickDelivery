import React from 'react';
import { CartView } from '@/features/cart/components/CartView';

export const CartPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meu Carrinho</h1>
      <CartView />
    </div>
  );
};
