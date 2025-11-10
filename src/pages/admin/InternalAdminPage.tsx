import React, { useState } from 'react';
import { config } from '@/shared/config/env';
import { Card } from '@/shared/ui/components/Card';
import {
  internalAuthService,
  internalRestaurantService,
  internalOrderService,
  internalDeliveryService,
  internalVehicleService,
  internalRentalService,
  clearAllInternalStorage,
} from '@/shared/internal-mode';

type TabType = 'users' | 'restaurants' | 'menu-items' | 'orders' | 'deliveries' | 'vehicles' | 'rentals';

export const InternalAdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [refreshKey, setRefreshKey] = useState(0);

  // Redirect if not in internal mode
  if (!config.useInternalMode) {
    return (
      <div className="p-8">
        <Card>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              This page is only available in Internal Mode.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Set VITE_USE_INTERNAL_MODE=true to enable.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all internal mode data? This action cannot be undone.')) {
      clearAllInternalStorage();
      setRefreshKey(prev => prev + 1);
      alert('All internal mode data has been cleared. The page will reload.');
      window.location.reload();
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'users', label: 'Users' },
    { id: 'restaurants', label: 'Restaurants' },
    { id: 'menu-items', label: 'Menu Items' },
    { id: 'orders', label: 'Orders' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'vehicles', label: 'Vehicles' },
    { id: 'rentals', label: 'Rentals' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Internal Mode Admin</h1>
          <p className="mt-2 text-gray-600">
            Manage mock data for internal simulation mode
          </p>
        </div>
        <button
          onClick={handleClearAllData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Clear All Data
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div key={refreshKey}>
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'restaurants' && <RestaurantsTab />}
        {activeTab === 'menu-items' && <MenuItemsTab />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'deliveries' && <DeliveriesTab />}
        {activeTab === 'vehicles' && <VehiclesTab />}
        {activeTab === 'rentals' && <RentalsTab />}
      </div>
    </div>
  );
};

// Users Tab
const UsersTab: React.FC = () => {
  const users = internalAuthService.getAllUsers();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roles</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.roles.map(role => (
                    <span key={role} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 mr-1">
                      {role}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Restaurants Tab
const RestaurantsTab: React.FC = () => {
  const restaurants = internalRestaurantService.getAllRestaurants();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Restaurants ({restaurants.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cuisine</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {restaurants.map(restaurant => (
              <tr key={restaurant.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{restaurant.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{restaurant.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{restaurant.cuisine}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">⭐ {restaurant.rating}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Menu Items Tab
const MenuItemsTab: React.FC = () => {
  const menuItems = internalRestaurantService.getAllMenuItems();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Menu Items ({menuItems.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {menuItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{item.restaurantId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Orders Tab
const OrdersTab: React.FC = () => {
  const orders = internalOrderService.getAllOrders();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Orders ({orders.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{order.customerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.restaurantName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Deliveries Tab
const DeliveriesTab: React.FC = () => {
  const deliveries = internalDeliveryService.getAllDeliveries();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Deliveries ({deliveries.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courier ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Distance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earnings</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{delivery.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{delivery.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{delivery.courierId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {delivery.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {delivery.distance ? `${delivery.distance.toFixed(1)} km` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {delivery.earnings ? `$${delivery.earnings.toFixed(2)}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Vehicles Tab
const VehiclesTab: React.FC = () => {
  const vehicles = internalVehicleService.getAllVehicles();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Vehicles ({vehicles.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand/Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">License Plate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Day</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map(vehicle => (
              <tr key={vehicle.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{vehicle.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{vehicle.ownerId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vehicle.brand} {vehicle.model}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{vehicle.licensePlate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                    vehicle.status === 'rented' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vehicle.pricePerDay.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Rentals Tab
const RentalsTab: React.FC = () => {
  const rentals = internalRentalService.getAllRentals();

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Rentals ({rentals.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courier ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rentals.map(rental => (
              <tr key={rental.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{rental.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{rental.vehicleId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{rental.courierId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rental.status === 'active' ? 'bg-green-100 text-green-800' :
                    rental.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    rental.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rental.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.totalDays}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${rental.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
