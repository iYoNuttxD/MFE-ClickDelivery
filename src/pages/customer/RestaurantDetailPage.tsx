import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantApi } from '@/entities/restaurant/api/restaurantApi';
import { Restaurant, MenuItem } from '@/entities/restaurant/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';
import { useCartStore } from '@/features/cart/store/cartStore';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [restaurantData, menuData] = await Promise.all([
          restaurantApi.getRestaurantById(id),
          restaurantApi.getMenuItems(id),
        ]);
        setRestaurant(restaurantData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Failed to fetch restaurant data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = (item: MenuItem) => {
    if (restaurant) {
      addItem(
        {
          menuItemId: item.id,
          name: item.name,
          quantity: 1,
          price: item.price,
        },
        restaurant.id,
        restaurant.name
      );
      alert('Item adicionado ao carrinho!');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!restaurant) return <div>Restaurante não encontrado</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {restaurant.imageUrl && (
          <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600 mt-2">{restaurant.description}</p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-yellow-500">★ {restaurant.rating.toFixed(1)}</span>
            <span className="text-gray-600">{restaurant.cuisine}</span>
            <span
              className={`px-2 py-1 rounded text-xs ${
                restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {restaurant.isOpen ? 'Aberto' : 'Fechado'}
            </span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold">Cardápio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <p className="text-lg font-bold mt-2 text-primary-600">
                  R$ {item.price.toFixed(2)}
                </p>
              </div>
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded ml-4" />
              )}
            </div>
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!item.available}
              className={`mt-4 w-full py-2 rounded ${
                item.available
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {item.available ? 'Adicionar ao Carrinho' : 'Indisponível'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
