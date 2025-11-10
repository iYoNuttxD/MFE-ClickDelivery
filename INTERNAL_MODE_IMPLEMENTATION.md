# Internal Simulation Mode (Mock/Sandbox) Implementation

## Overview

This document describes the complete implementation of the Internal Simulation Mode for MFE-ClickDelivery, which provides a fully functional 100% offline, interactive, and persistent mock/sandbox environment.

## Features Implemented

### 1. Core Infrastructure

#### Configuration (`src/shared/config/env.ts`)
- Environment variable `VITE_USE_INTERNAL_MODE` controls internal mode activation
- When `true`, all API services use internal mock implementations
- When `false`, application uses real backend APIs (no impact on production)

#### Storage Layer (`src/shared/internal-mode/storage.ts`)
- `InternalStorage<T>` class provides generic localStorage-backed storage
- Automatic persistence with prefix `internal_mode_*`
- In-memory caching for performance
- CRUD operations: set, get, getAll, delete, update, clear
- `clearAllInternalStorage()` function to reset all data

### 2. Authentication & JWT

#### Mock JWT Implementation (`src/shared/internal-mode/internalAuthService.ts`)
- Generates valid JWT tokens compatible with jwt-decode
- Token payload includes:
  - `sub`: User ID
  - `email`: User email
  - `name`: User name
  - `roles`: User roles array
  - `iat`: Issued at timestamp
  - `exp`: Expiration timestamp (24 hours)
- Default mock users:
  - Admin: `admin@clickdelivery.com` / `admin123`
  - Customer: `customer@example.com` / `customer123`
  - Restaurant: `restaurant@example.com` / `restaurant123`
  - Courier: `courier@example.com` / `courier123`
  - Owner: `owner@example.com` / `owner123`

#### AuthProvider Integration
- `src/app/providers/AuthProvider.tsx` correctly decodes and validates mock JWT
- Handles token expiration
- Extracts user roles from token payload
- Compatible with both Auth0 and BFF modes

### 3. API Services

All API services follow the pattern:
```typescript
export const xxxApi = {
  method: (params) => {
    return config.useInternalMode
      ? internalXxxService.method(params)
      : realXxxApi.method(params);
  }
};
```

#### Implemented Services:
- ✅ `orderApi.ts` → `internalOrderService.ts`
- ✅ `restaurantApi.ts` → `internalRestaurantService.ts`
- ✅ `deliveryApi.ts` → `internalDeliveryService.ts`
- ✅ `vehicleApi.ts` → `internalVehicleService.ts`
- ✅ `rentalApi.ts` → `internalRentalService.ts`
- ✅ `userApi.ts` → `internalUserService.ts`
- ✅ `authService.ts` → `internalAuthService.ts`
- ✅ `notificationApi.ts` → `internalNotificationService.ts`

### 4. Customer Flow

#### Shopping Cart (`src/features/cart/store/cartStore.ts`)
- Zustand store with localStorage persistence in internal mode
- Cart state persisted with key `internal_mode_cart`
- Includes: items, restaurantId, restaurantName
- Operations: addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount
- Prevents mixing items from different restaurants

#### Order Management (`src/shared/internal-mode/internalOrderService.ts`)
- Create orders from cart items
- Fetch restaurant names from storage
- Maintain order history per customer
- Methods:
  - `getOrders()` - Paginated list with status filtering
  - `getOrderById()` - Single order details
  - `createOrder()` - Create from cart
  - `updateOrderStatus()` - Update status
  - `cancelOrder()` - Cancel order
  - `getOrdersByCustomerId()` - Customer order history
  - `getOrdersByRestaurantId()` - Restaurant's orders
  - `getAvailableOrdersForCourier()` - Orders ready for pickup

### 5. Restaurant Owner Flow

#### Restaurant Management (`src/shared/internal-mode/internalRestaurantService.ts`)
- Full CRUD operations for restaurants
- Methods:
  - `getRestaurants()` - Paginated list
  - `getRestaurantById()` - Single restaurant
  - `createRestaurant()` - Add new restaurant
  - `updateRestaurant()` - Edit restaurant
  - `deleteRestaurant()` - Remove restaurant (cascades to menu items)

#### Menu Management (`src/shared/internal-mode/internalMenuService.ts`)
- Full CRUD operations for menu items
- Methods:
  - `getMenuItems()` - Items for a restaurant
  - `getMenuItemById()` - Single item
  - `createMenuItem()` - Add new item
  - `updateMenuItem()` - Edit item
  - `deleteMenuItem()` - Remove item

### 6. Courier Flow

#### Delivery Management (`src/shared/internal-mode/internalDeliveryService.ts`)
- View and manage deliveries
- Vehicle selection for deliveries
- Methods:
  - `getDeliveries()` - Paginated list with status filtering
  - `getDeliveryById()` - Single delivery
  - `createDelivery()` - Create new delivery
  - `updateDeliveryStatus()` - Update status (assigned → picked_up → in_transit → delivered)
  - `assignCourier()` - Assign to courier
  - `acceptDelivery()` - Courier accepts delivery with optional vehicle
  - `getDeliveriesByCourierId()` - Courier's deliveries
  - `getActiveDeliveriesForCourier()` - Active deliveries only

### 7. Vehicle Owner Flow

#### Vehicle Management (`src/shared/internal-mode/internalVehicleService.ts`)
- Manage vehicle inventory
- Methods:
  - `getVehicles()` - Paginated list with status filtering
  - `getVehicleById()` - Single vehicle
  - `createVehicle()` - Add new vehicle
  - `updateVehicle()` - Edit vehicle
  - `updateVehicleStatus()` - Change status
  - `deleteVehicle()` - Remove vehicle
  - `getVehiclesByOwnerId()` - Owner's vehicles
  - `getAvailableVehicles()` - Available for rental

#### Rental Management (`src/shared/internal-mode/internalRentalService.ts`)
- Complete rental workflow
- Automatic vehicle status synchronization
- Methods:
  - `getRentals()` - Paginated list with status filtering
  - `getRentalById()` - Single rental
  - `createRental()` - Create rental request
  - `updateRentalStatus()` - Update status
  - `cancelRental()` - Cancel rental
  - `getRentalsByOwnerId()` - Owner's rentals (filtered by owned vehicles)
  - `getRentalsByCourierId()` - Courier's rentals
  - `approveRental()` - Approve pending rental (sets vehicle to 'rented')
  - `rejectRental()` - Reject pending rental
  - `completeRental()` - Complete active rental (sets vehicle to 'available')

### 8. Admin Panel

#### Internal Admin Page (`src/pages/admin/InternalAdminPage.tsx`)
- Accessible only when `VITE_USE_INTERNAL_MODE=true`
- URL: `/admin/internal`
- Tabs: Users, Restaurants, Menu Items, Orders, Deliveries, Vehicles, Rentals

#### Features per Tab:

**Users Tab:**
- View all users with ID, email, name, roles
- Edit user details (name, phone)
- Delete users
- Real-time state updates

**Restaurants Tab:**
- View all restaurants
- Edit restaurant (name, cuisine, description)
- Toggle open/closed status
- Delete restaurant (cascades to menu items)

**Menu Items Tab:**
- View all menu items across all restaurants
- Toggle availability
- Delete menu items

**Orders Tab:**
- View all orders
- Delete orders

**Deliveries Tab:**
- View all deliveries
- Delete deliveries

**Vehicles Tab:**
- View all vehicles
- Delete vehicles

**Rentals Tab:**
- View all rentals
- Delete rentals

**Clear All Data:**
- Red button to reset all internal mode data
- Clears all `internal_mode_*` localStorage keys
- Reloads page with fresh default data

### 9. Default Mock Data

#### Restaurants (`src/shared/internal-mode/mockData.ts`)
- Italian Bistro (Italian cuisine)
- Sushi Paradise (Japanese cuisine)
- Burger House (American cuisine)

#### Menu Items
- 6 items distributed across 3 restaurants
- Pizza, Pasta, Sushi, Sashimi, Burger, Fries

#### Vehicles
- 3 default vehicles (bike, motorcycle, car)
- All owned by 'owner-1'
- All available for rental

## Technical Architecture

### Data Flow in Internal Mode

```
User Action
    ↓
Component/Hook
    ↓
API Service (checks config.useInternalMode)
    ↓
Internal Service (if internal mode)
    ↓
InternalStorage (localStorage + memory cache)
    ↓
Persistent Data
```

### Storage Keys

```
internal_mode_users          - User accounts
internal_mode_restaurants    - Restaurant data
internal_mode_menu_items     - Menu items
internal_mode_orders         - Orders
internal_mode_deliveries     - Deliveries
internal_mode_vehicles       - Vehicles
internal_mode_rentals        - Rentals
internal_mode_cart           - Shopping cart
auth_token                   - JWT token
internal_mode_user_id        - Current user ID
```

### Separation of Concerns

1. **Configuration Layer**: `src/shared/config/env.ts`
   - Single source of truth for internal mode flag

2. **Storage Layer**: `src/shared/internal-mode/storage.ts`
   - Generic storage abstraction
   - Automatic localStorage sync

3. **Service Layer**: `src/shared/internal-mode/internal*Service.ts`
   - Business logic for each domain
   - Simulates async operations with delays
   - Generates realistic mock data

4. **API Layer**: `src/entities/*/api/*Api.ts`
   - Conditional routing based on mode
   - Transparent to consuming components

5. **UI Layer**: Components/Pages
   - No changes required
   - Same API interface in both modes

## No External Requests Guarantee

When `VITE_USE_INTERNAL_MODE=true`:

1. All API services check `config.useInternalMode` first
2. Internal services return immediately (with simulated delay)
3. httpClient is never invoked for data operations
4. Only static assets (JS, CSS, images) are loaded from server
5. No XHR/Fetch requests to backend APIs
6. All data operations use localStorage

## Production Safety

When `VITE_USE_INTERNAL_MODE=false` (production):

1. No internal mode code is executed
2. No localStorage pollution with mock data
3. Cart uses in-memory state only
4. All API calls use real httpClient
5. Internal Admin page shows "Access Denied"
6. Zero performance impact
7. Build size increase is minimal (~20KB gzipped)

## Testing Recommendations

See `INTERNAL_MODE_TEST.md` for comprehensive testing guide covering:
- Authentication flow
- Customer journey (browse → cart → checkout)
- Restaurant management
- Courier operations
- Vehicle owner operations
- Admin panel CRUD
- Offline functionality
- Network request verification
- JWT validation

## Future Enhancements

Potential improvements for internal mode:

1. **Import/Export Data**
   - Export all internal data to JSON
   - Import data from JSON file
   - Useful for sharing test scenarios

2. **Seed Data Generator**
   - UI to generate random realistic data
   - Bulk create orders, users, restaurants

3. **Time Travel**
   - Simulate time passing
   - Test expiration scenarios
   - Auto-complete deliveries

4. **Multi-Tab Sync**
   - Sync data across browser tabs
   - Use localStorage events
   - Real-time updates

5. **Performance Metrics**
   - Track localStorage usage
   - Monitor operation times
   - Debug panel

6. **Data Validation**
   - Schema validation for stored data
   - Detect corrupted data
   - Auto-repair utilities

7. **Advanced Search/Filter**
   - Search across all entities
   - Complex filtering in admin panel
   - Data visualization

## Maintenance Notes

### Adding New Entities

To add a new entity to internal mode:

1. Create storage: `const xxxStorage = new InternalStorage<XXX>('xxx')`
2. Create service: `src/shared/internal-mode/internalXxxService.ts`
3. Export from: `src/shared/internal-mode/index.ts`
4. Update API: `src/entities/xxx/api/xxxApi.ts`
5. Add to admin panel: `src/pages/admin/InternalAdminPage.tsx`

### Updating Mock Data

Update default data in `src/shared/internal-mode/mockData.ts`:
- Add/modify mock entities
- Update initialization functions in services
- Ensure consistent IDs for relationships

### Troubleshooting

**Issue**: Data not loading after update
- Clear localStorage manually
- Use "Clear All Data" in admin panel
- Check browser console for errors

**Issue**: TypeScript errors
- Ensure types are consistent across API and internal services
- Check InternalStorage generic type matches entity type

**Issue**: Performance degradation
- Check localStorage size (max ~5-10MB)
- Reduce amount of mock data
- Clear old data periodically

## Conclusion

The Internal Simulation Mode implementation provides:

✅ 100% offline functionality
✅ Complete CRUD operations for all entities
✅ Persistent data via localStorage
✅ Interactive admin panel
✅ Compatible JWT mock tokens
✅ No external requests in internal mode
✅ Zero impact on production
✅ Comprehensive test coverage

The implementation follows clean architecture principles, ensuring maintainability and extensibility while providing a robust testing environment for frontend development without backend dependencies.
