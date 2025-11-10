# Internal Mode Testing Guide

## Overview
This document outlines the testing procedures for the Internal Simulation Mode (Mock/Sandbox) of MFE-ClickDelivery.

## Prerequisites
1. Ensure `.env.internal` file exists with `VITE_USE_INTERNAL_MODE=true`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start dev server: `npm run dev`

## Test Scenarios

### 1. Authentication Flow (Internal Mode)

#### Login with Mock Users
- **Customer**: email: `customer@example.com`, password: `customer123`
- **Restaurant**: email: `restaurant@example.com`, password: `restaurant123`
- **Courier**: email: `courier@example.com`, password: `courier123`
- **Owner**: email: `owner@example.com`, password: `owner123`
- **Admin**: email: `admin@clickdelivery.com`, password: `admin123`

**Expected Results:**
- ✓ Login succeeds without external API calls
- ✓ JWT token is generated with sub, email, roles, exp
- ✓ User is redirected to appropriate dashboard based on role
- ✓ Token is stored in localStorage as `auth_token`

### 2. Customer Flow

#### Browse Restaurants
1. Login as customer
2. Navigate to restaurants page
3. Verify 3 mock restaurants are displayed (Italian Bistro, Sushi Paradise, Burger House)

**Expected Results:**
- ✓ Restaurants load from localStorage
- ✓ No network requests are made
- ✓ Restaurant cards display correctly

#### Add to Cart
1. Click on a restaurant
2. Add multiple items to cart
3. Close browser and reopen
4. Verify cart persists

**Expected Results:**
- ✓ Cart items are stored in localStorage with key `internal_mode_cart`
- ✓ Cart count updates correctly
- ✓ Cart persists across sessions

#### Checkout and Order
1. Review cart
2. Complete checkout with delivery address
3. Submit order
4. View order in order history

**Expected Results:**
- ✓ Order is created with correct restaurant name
- ✓ Order is stored in localStorage with key `internal_mode_orders`
- ✓ Order appears in customer's order history
- ✓ Order includes all items, prices, and delivery info

### 3. Restaurant Owner Flow

#### View Orders
1. Login as restaurant owner
2. Navigate to orders page
3. Verify orders for the restaurant are displayed

**Expected Results:**
- ✓ Orders filtered by restaurant ID
- ✓ All order details visible
- ✓ Can update order status (confirmed, preparing, ready)

#### Manage Menu
1. Navigate to menu management
2. Add a new menu item
3. Edit existing menu item
4. Toggle item availability
5. Delete a menu item

**Expected Results:**
- ✓ Menu items stored in localStorage with key `internal_mode_menu_items`
- ✓ CRUD operations work correctly
- ✓ Changes persist after page reload

### 4. Courier Flow

#### View Available Deliveries
1. Login as courier
2. Navigate to deliveries page
3. View available orders for pickup

**Expected Results:**
- ✓ Orders with status 'ready' or 'confirmed' are shown
- ✓ Orders without courier assignment are displayed
- ✓ Can view order details

#### Accept Delivery
1. Select an available delivery
2. Choose a vehicle (if applicable)
3. Accept the delivery

**Expected Results:**
- ✓ Delivery is assigned to courier
- ✓ Vehicle ID is saved if selected
- ✓ Delivery status updates to 'assigned'
- ✓ Delivery appears in courier's active deliveries

#### Update Delivery Status
1. View active delivery
2. Update status: picked_up → in_transit → delivered
3. Verify timestamps are recorded

**Expected Results:**
- ✓ Status updates correctly
- ✓ pickupTime and deliveryTime are recorded
- ✓ Changes stored in localStorage with key `internal_mode_deliveries`

### 5. Vehicle Owner Flow

#### Manage Vehicles
1. Login as owner
2. Navigate to vehicles page
3. Add a new vehicle
4. Edit vehicle details
5. View vehicle status

**Expected Results:**
- ✓ Vehicles stored in localStorage with key `internal_mode_vehicles`
- ✓ CRUD operations work correctly
- ✓ Vehicle status reflects rental state

#### Manage Rentals
1. View pending rental requests
2. Approve a rental
3. Verify vehicle status changes to 'rented'
4. Complete a rental
5. Verify vehicle status changes back to 'available'

**Expected Results:**
- ✓ Rentals stored in localStorage with key `internal_mode_rentals`
- ✓ Rental status updates correctly (pending → active → completed)
- ✓ Vehicle status syncs with rental status
- ✓ Can reject pending rentals

### 6. Admin Panel

#### View All Data
1. Login as admin
2. Navigate to Internal Admin page (`/admin/internal`)
3. Verify all tabs display data correctly

**Expected Results:**
- ✓ Users tab shows all mock users
- ✓ Restaurants tab shows all restaurants
- ✓ Menu Items tab shows all menu items
- ✓ Orders tab shows all orders
- ✓ Deliveries tab shows all deliveries
- ✓ Vehicles tab shows all vehicles
- ✓ Rentals tab shows all rentals

#### Edit Entities
1. Edit a user's name
2. Edit a restaurant's details
3. Toggle restaurant open/closed status
4. Toggle menu item availability

**Expected Results:**
- ✓ Changes are saved to localStorage
- ✓ Changes persist after page reload
- ✓ UI updates immediately after save

#### Delete Entities
1. Delete a user
2. Delete a restaurant (with menu items)
3. Delete an order
4. Delete a vehicle

**Expected Results:**
- ✓ Entities are removed from localStorage
- ✓ Cascading deletes work (restaurant → menu items)
- ✓ Confirmation dialog appears
- ✓ List updates after deletion

#### Clear All Data
1. Click "Clear All Data" button
2. Confirm action
3. Verify all internal mode data is cleared

**Expected Results:**
- ✓ All `internal_mode_*` keys are removed from localStorage
- ✓ Page reloads with fresh default data
- ✓ Default users are re-initialized

### 7. Offline Functionality

#### Complete Workflow Offline
1. Load application in internal mode
2. Disconnect from internet
3. Perform all operations above
4. Reconnect to internet

**Expected Results:**
- ✓ All operations work without internet connection
- ✓ No network errors in console
- ✓ All data persists correctly
- ✓ Application remains fully functional

### 8. Production Mode Verification

#### Disable Internal Mode
1. Set `VITE_USE_INTERNAL_MODE=false` in `.env`
2. Rebuild application
3. Test that internal mode is not accessible

**Expected Results:**
- ✓ Internal Admin page shows "Access Denied"
- ✓ API calls use real httpClient (would fail without backend)
- ✓ No `internal_mode_*` localStorage keys are created
- ✓ Cart does not use localStorage persistence

## Network Request Verification

### Check No External Requests in Internal Mode
1. Open browser DevTools → Network tab
2. Login and perform all operations
3. Verify no XHR/Fetch requests to external APIs

**Expected Results:**
- ✓ Only static asset requests (JS, CSS, images)
- ✓ No requests to `cd-apim-gateway.azure-api.net`
- ✓ All data operations use localStorage

## localStorage Structure

Expected localStorage keys when in internal mode:
- `internal_mode_users` - User accounts with passwords
- `internal_mode_restaurants` - Restaurant data
- `internal_mode_menu_items` - Menu items for all restaurants
- `internal_mode_orders` - All customer orders
- `internal_mode_deliveries` - Delivery records
- `internal_mode_vehicles` - Vehicle inventory
- `internal_mode_rentals` - Rental agreements
- `internal_mode_cart` - Shopping cart state (customer only)
- `auth_token` - JWT token
- `internal_mode_user_id` - Current logged-in user ID

## JWT Token Validation

### Verify Token Structure
1. Login in internal mode
2. Get token from localStorage: `localStorage.getItem('auth_token')`
3. Decode token using jwt.io or browser console
4. Verify payload structure

**Expected Token Payload:**
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "roles": ["customer"],
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Expected Results:**
- ✓ Token is valid JWT format (header.payload.signature)
- ✓ Contains `sub`, `email`, `roles`, `exp` fields
- ✓ Compatible with AuthProvider decoding
- ✓ Expiration is 24 hours from issuance

## Regression Testing

After implementing changes, verify:
- ✓ Build completes without errors
- ✓ TypeScript compilation succeeds
- ✓ No console errors in browser
- ✓ All user roles can login
- ✓ All CRUD operations work
- ✓ Data persists across sessions
- ✓ No external API calls when `VITE_USE_INTERNAL_MODE=true`

## Known Limitations

1. Internal mode is for development/testing only
2. Data is stored in browser localStorage (limited to ~5-10MB)
3. Data is not shared across browsers or devices
4. Clearing browser data will reset all mock data
5. Password validation is simplified (no hashing in mock mode)
6. No real-time updates between tabs/windows

## Troubleshooting

### Issue: Data not persisting
**Solution:** Check localStorage quota, clear old data, check browser privacy settings

### Issue: Login fails
**Solution:** Verify email/password match mock users, check console for errors

### Issue: External requests still happening
**Solution:** Verify `VITE_USE_INTERNAL_MODE=true` in environment, rebuild application

### Issue: Cart not persisting
**Solution:** Ensure internal mode is enabled, check localStorage for `internal_mode_cart` key

### Issue: Admin panel not accessible
**Solution:** Verify `VITE_USE_INTERNAL_MODE=true`, login as admin user, navigate to `/admin/internal`
