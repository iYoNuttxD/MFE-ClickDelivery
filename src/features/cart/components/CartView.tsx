import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export const CartView: React.FC = () => {
  const navigate = useNavigate();
  const { items, restaurantName, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600">Seu carrinho está vazio</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Carrinho - {restaurantName}</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.menuItemId} className="flex items-center justify-between border-b pb-4">
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.menuItemId, parseInt(e.target.value) || 1)}
                className="w-16 border rounded px-2 py-1"
              />
              <button
                onClick={() => removeItem(item.menuItemId)}
                className="text-red-600 hover:text-red-800"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>R$ {getTotal().toFixed(2)}</span>
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => navigate('/customer/checkout')}
            className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600"
          >
            Finalizar Pedido
          </button>
          <button
            onClick={clearCart}
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-100"
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};
