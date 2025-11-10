# Internal Simulation Mode

This document describes the Internal Simulation Mode feature for the MFE-ClickDelivery application.

## Overview

The Internal Simulation Mode (also called Mock/Sandbox mode) allows the application to run completely offline without any backend dependencies. This is useful for:

- **Development**: Test UI flows without setting up backend services
- **Demos**: Showcase the application without infrastructure
- **Testing**: Validate frontend logic in isolation
- **Training**: Onboard new developers without access credentials

## Enabling Internal Mode

### 1. Environment Configuration

Create a `.env` file (or `.env.local`) in the project root with:

```env
VITE_USE_INTERNAL_MODE=true
```

### 2. Start the Development Server

```bash
npm run dev
```

The application will now use local mock data instead of making real API calls.

## Default Test Users

When internal mode is enabled, the following test users are automatically available:

| Role       | Email                        | Password      | Description                    |
|------------|------------------------------|---------------|--------------------------------|
| Admin      | admin@clickdelivery.com      | admin123      | Full system administration     |
| Customer   | customer@example.com         | customer123   | Can browse and order food      |
| Restaurant | restaurant@example.com       | restaurant123 | Can manage menu and orders     |
| Courier    | courier@example.com          | courier123    | Can manage deliveries          |
| Owner      | owner@example.com            | owner123      | Can manage vehicles and rentals|

## Internal Admin Panel

When internal mode is enabled, an additional "Internal Admin" link appears in the admin sidebar (only visible to users with admin role).

### Accessing the Panel

1. Log in with admin credentials (admin@clickdelivery.com / admin123)
2. Navigate to Admin section
3. Click on "🔧 Internal Admin" in the sidebar
4. URL: `/admin/internal`

### Available Features

The Internal Admin panel provides tabs for managing all mock data:

- **Users**: View all registered users and their roles
- **Restaurants**: View restaurant listings
- **Menu Items**: View all menu items across restaurants
- **Orders**: View order history and status
- **Deliveries**: View delivery assignments and tracking
- **Vehicles**: View available vehicles for rent
- **Rentals**: View vehicle rental records

### Data Management

- **Clear All Data**: Button to reset all mock data to defaults
- **Data Persistence**: All data is stored in localStorage and persists across sessions
- **Auto-initialization**: Default data (restaurants, menu items, test users) is automatically created on first use

## How It Works

### Architecture

The internal mode uses a wrapper pattern:

```
API Calls → Wrapper Function → Check Flag → Internal Service OR Real API
```

1. **Wrapper Functions**: All API modules (`restaurantApi`, `orderApi`, etc.) check the `config.useInternalMode` flag
2. **Conditional Routing**: If flag is `true`, calls are routed to internal services; otherwise, to real API
3. **No Code Changes**: Existing components continue to use the same API imports

### Data Storage

- **Storage Layer**: `InternalStorage<T>` class provides localStorage-backed storage
- **Service Layer**: Each entity has an internal service (e.g., `internalRestaurantService`)
- **Mock Data**: Default data is generated with realistic values

### Example Flow

When a user creates an order in internal mode:

1. Component calls `orderApi.createOrder(data)`
2. Wrapper checks `config.useInternalMode` (true)
3. Routes to `internalOrderService.createOrder(data)`
4. Service generates mock order with UUID
5. Saves to localStorage via `InternalStorage`
6. Returns mock order to component
7. Component updates UI normally

## Default Mock Data

The system comes with pre-configured mock data:

### Restaurants (3)
- Italian Bistro (Italian cuisine)
- Sushi Paradise (Japanese cuisine)
- Burger House (American cuisine)

### Menu Items (6)
- 2 items per restaurant
- Prices range from $3.99 to $15.99
- All items available by default

### No Orders/Deliveries/Vehicles by Default
- These are created as users interact with the system
- Full CRUD operations are supported

## Differences from Real Mode

### What Works the Same
- ✅ All UI components and flows
- ✅ Authentication (login/logout)
- ✅ Navigation and routing
- ✅ State management
- ✅ Form validation

### What's Different
- ❌ No real API calls to Azure/APIM
- ❌ No database persistence (uses localStorage)
- ❌ Simulated delays (300ms) for realistic UX
- ❌ Mock JWT tokens (not cryptographically secure)
- ❌ No Auth0 integration

## Development Tips

### Resetting Data

To reset all mock data to defaults:
1. Go to Internal Admin panel
2. Click "Clear All Data"
3. Or clear localStorage manually: `localStorage.clear()`

### Adding New Mock Data

Edit `/src/shared/internal-mode/mockData.ts` to add more default entities.

### Debugging

Internal services log to console in development mode:
```javascript
// Check if internal mode is active
console.log('Internal Mode:', config.useInternalMode);

// View all stored data
localStorage.getItem('internal_mode_restaurants');
```

## Production Use

**⚠️ Important**: Internal mode should **never** be enabled in production environments.

- Always verify `VITE_USE_INTERNAL_MODE=false` (or unset) in production builds
- The feature is designed for development and demos only
- No security measures are applied to mock data

## Troubleshooting

### Issue: Changes not persisting

**Solution**: Data is stored in localStorage. Make sure localStorage is not disabled in your browser.

### Issue: Admin panel not visible

**Solution**: 
1. Verify `VITE_USE_INTERNAL_MODE=true` in `.env`
2. Log in as admin user
3. Check that you're in the Admin section

### Issue: Build errors

**Solution**: Run `npm install` to ensure all dependencies are installed.

## Technical Details

### File Structure

```
src/shared/internal-mode/
├── index.ts                      # Exports all internal services
├── storage.ts                    # InternalStorage class
├── mockData.ts                   # Default mock data and generators
├── internalAuthService.ts        # Mock authentication
├── internalRestaurantService.ts  # Mock restaurant operations
├── internalOrderService.ts       # Mock order operations
├── internalDeliveryService.ts    # Mock delivery operations
├── internalVehicleService.ts     # Mock vehicle operations
├── internalRentalService.ts      # Mock rental operations
└── internalUserService.ts        # Mock user operations
```

### Storage Keys

All internal mode data is stored with the prefix `internal_mode_`:

- `internal_mode_users`
- `internal_mode_restaurants`
- `internal_mode_menu_items`
- `internal_mode_orders`
- `internal_mode_deliveries`
- `internal_mode_vehicles`
- `internal_mode_rentals`

## Contributing

When adding new features that require API calls:

1. Create internal service in `/src/shared/internal-mode/`
2. Add wrapper logic to existing API module
3. Export service from `/src/shared/internal-mode/index.ts`
4. Update this documentation

## License

Same as the main project.
