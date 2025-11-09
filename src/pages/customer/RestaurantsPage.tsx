import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { restaurantApi } from '@/entities/restaurant/api/restaurantApi';
import { Restaurant } from '@/entities/restaurant/model/types';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

export const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await restaurantApi.getRestaurants({ page: 1, pageSize: 20 });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Restaurantes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            to={`/customer/restaurants/${restaurant.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {restaurant.imageUrl && (
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
              <p className="text-sm text-gray-600 mt-2">{restaurant.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="ml-1 text-sm">{restaurant.rating.toFixed(1)}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {restaurant.isOpen ? 'Aberto' : 'Fechado'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
