import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/features/cart/store/cartStore';
import { orderApi } from '@/entities/order/api/orderApi';
import { useToast } from '@/shared/ui/components/Toast';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, restaurantId, restaurantName, getTotal, clearCart } = useCartStore();
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurantId) return;

    setLoading(true);
    try {
      const order = await orderApi.createOrder({
        restaurantId,
        items,
        deliveryAddress,
        notes,
      });
      clearCart();
      toast.success('Pedido realizado com sucesso!');
      navigate(`/customer/orders/${order.id}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Erro ao criar pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
        <button
          onClick={() => navigate('/customer/restaurants')}
          className="bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600"
        >
          Explorar Restaurantes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Finalizar Pedido</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
          <p className="text-gray-600 mb-4">{restaurantName}</p>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>R$ {getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informações de Entrega</h2>
          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Endereço de Entrega</label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Rua, número, bairro, cidade..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Observações</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Observações adicionais..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded hover:bg-primary-600 disabled:bg-gray-400"
            >
              {loading ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
