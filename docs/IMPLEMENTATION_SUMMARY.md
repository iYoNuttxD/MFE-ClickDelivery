# Internal Simulation Mode - Implementation Summary

## Overview
Successfully implemented a complete Internal Simulation Mode (Mock/Sandbox) feature for the MFE-ClickDelivery application. This allows the entire application to run offline without any backend dependencies.

## Feature Flag
- **Environment Variable**: `VITE_USE_INTERNAL_MODE`
- **Default**: `false` (disabled)
- **When enabled**: All API calls use local mock services
- **When disabled**: All API calls use real Azure/APIM backend

## Architecture

### Wrapper Pattern
```
Component → API Call → Wrapper Function → Check Flag → Internal Service OR Real API
```

All API modules check the flag and conditionally route to either:
- Internal mock services (when `true`)
- Real backend services (when `false`)

### Storage Layer
- **Class**: `InternalStorage<T>`
- **Backend**: localStorage
- **Persistence**: Data survives page reloads
- **Prefix**: All keys use `internal_mode_` prefix

## Implementation Details

### 1. Configuration (2 files updated)
- `.env.example` - Added `VITE_USE_INTERNAL_MODE` documentation
- `src/shared/config/env.ts` - Added `useInternalMode` to config object

### 2. Internal Services (10 new files in `src/shared/internal-mode/`)
| File | Purpose | Features |
|------|---------|----------|
| `storage.ts` | Storage utility | localStorage-backed Map with CRUD |
| `mockData.ts` | Default data | 3 restaurants, 6 menu items, generators |
| `internalAuthService.ts` | Authentication | 5 default users, mock JWT |
| `internalRestaurantService.ts` | Restaurant CRUD | Restaurants + menu items |
| `internalOrderService.ts` | Order CRUD | Create, cancel, status updates |
| `internalDeliveryService.ts` | Delivery CRUD | Assign couriers, track status |
| `internalVehicleService.ts` | Vehicle CRUD | CRUD + status management |
| `internalRentalService.ts` | Rental CRUD | Create, cancel, status updates |
| `internalUserService.ts` | User operations | Profile, password change |
| `index.ts` | Exports | All services exported |

### 3. API Wrappers (7 files updated)
Each wrapper follows this pattern:
```typescript
export const api = {
  method: (params) => {
    return config.useInternalMode
      ? internalService.method(params)
      : realService.method(params);
  }
};
```

**Updated files:**
- `src/shared/api/authService.ts`
- `src/entities/restaurant/api/restaurantApi.ts`
- `src/entities/order/api/orderApi.ts`
- `src/entities/delivery/api/deliveryApi.ts`
- `src/entities/vehicle/api/vehicleApi.ts`
- `src/entities/rental/api/rentalApi.ts`
- `src/entities/user/api/userApi.ts`

### 4. Internal Admin Panel (3 files updated/created)
- **New Page**: `src/pages/admin/InternalAdminPage.tsx`
  - 7 tabs: Users, Restaurants, Menu Items, Orders, Deliveries, Vehicles, Rentals
  - Clear all data functionality
  - Read-only data display
  
- **Updated Layout**: `src/widgets/layout/AdminLayout.tsx`
  - Added conditional "🔧 Internal Admin" link (only shows when flag is true)
  
- **Updated Router**: `src/app/router.tsx`
  - Added `/admin/internal` route

### 5. Documentation (3 files)
- `docs/INTERNAL_MODE.md` - Complete guide (7KB)
- `README.md` - Updated with internal mode section
- `.env.internal` - Template for quick setup

## Default Test Users

| Role | Email | Password | Capabilities |
|------|-------|----------|--------------|
| Admin | admin@clickdelivery.com | admin123 | Full system access + Internal Admin panel |
| Customer | customer@example.com | customer123 | Browse, order food |
| Restaurant | restaurant@example.com | restaurant123 | Manage menu, orders |
| Courier | courier@example.com | courier123 | Manage deliveries |
| Owner | owner@example.com | owner123 | Manage vehicles, rentals |

## Default Mock Data

### Restaurants (3)
1. **Italian Bistro** - Italian cuisine, 4.5⭐
2. **Sushi Paradise** - Japanese cuisine, 4.8⭐
3. **Burger House** - American cuisine, 4.2⭐

### Menu Items (6)
- 2 items per restaurant
- Price range: $3.99 - $15.99
- All items available

### Dynamic Data
- Orders, deliveries, vehicles, rentals are created as users interact
- Full CRUD operations supported
- Data persists in localStorage

## Testing Results

### Build ✅
```bash
npm run build
✓ built in 2.66s
```
- No errors
- All TypeScript compiled successfully
- Bundle size reasonable (~132KB for main chunk)

### Linter ✅
```bash
npm run lint
```
- No new warnings
- Pre-existing warnings in seed files (not touched)
- Code follows ESLint rules

### Security ✅
```bash
CodeQL Analysis
```
- 0 alerts found
- No security vulnerabilities introduced

## Usage Examples

### Enable Internal Mode
```bash
# Option 1: Use template
cp .env.internal .env

# Option 2: Manual
echo "VITE_USE_INTERNAL_MODE=true" >> .env

# Start dev server
npm run dev
```

### Disable Internal Mode
```bash
# Remove or set to false
echo "VITE_USE_INTERNAL_MODE=false" >> .env

# Or delete .env to use defaults
rm .env
```

### Access Internal Admin Panel
1. Set `VITE_USE_INTERNAL_MODE=true`
2. Login as admin (admin@clickdelivery.com / admin123)
3. Navigate to Admin section
4. Click "🔧 Internal Admin" in sidebar
5. View/manage all mock data

## Backward Compatibility

### When Flag is False/Unset ✅
- ✅ All API calls go to real backend
- ✅ Authentication via real BFF
- ✅ No localStorage used for app data
- ✅ Internal Admin link hidden
- ✅ Zero impact on existing functionality

### When Flag is True ✅
- ✅ All API calls use internal services
- ✅ Mock authentication
- ✅ Data stored in localStorage
- ✅ Internal Admin panel visible
- ✅ Complete offline operation

## Code Quality

### Principles Followed
- ✅ **DRY**: Shared storage utility, common patterns
- ✅ **SOLID**: Single responsibility services
- ✅ **Type Safety**: Full TypeScript typing
- ✅ **Separation of Concerns**: Clear layer separation
- ✅ **Documentation**: Comprehensive inline and external docs

### Patterns Used
- **Wrapper Pattern**: For API routing
- **Repository Pattern**: InternalStorage class
- **Factory Pattern**: Mock data generators
- **Strategy Pattern**: Conditional service selection

## Limitations & Notes

### What Works
- ✅ All CRUD operations
- ✅ Authentication & authorization
- ✅ Role-based access control
- ✅ Data persistence (localStorage)
- ✅ All user flows

### What Doesn't Work
- ❌ Real-time updates (no WebSocket simulation)
- ❌ File uploads (no file storage)
- ❌ Payment processing (not applicable)
- ❌ Email notifications (not applicable)

### Design Decisions
1. **localStorage over sessionStorage**: For persistence across sessions
2. **Mock JWT**: Simple base64, not cryptographically secure
3. **300ms delays**: Simulate network latency for realistic UX
4. **Read-only admin panel**: View data, not edit (can add if needed)
5. **Auto-initialization**: Default data created on first use

## Security Considerations

### Safe Practices ✅
- No sensitive data in mock users
- Feature flag prevents accidental production use
- Clear documentation warning against production use
- No external dependencies added

### Production Safety
⚠️ **CRITICAL**: Internal mode MUST be disabled in production
- Set `VITE_USE_INTERNAL_MODE=false` or leave unset
- Verify in production builds
- Add CI/CD checks if needed

## Performance Impact

### Bundle Size
- Internal mode adds ~15KB to bundle (InternalAdminPage chunk)
- Lazy loaded, not affecting initial load
- Main bundle: 132KB (minimal increase)

### Runtime
- No performance impact when flag is false
- When true: localStorage operations are fast
- 300ms simulated delays for realism

## Future Enhancements (Optional)

### Possible Additions
1. **Edit Mode**: Allow editing data in Internal Admin panel
2. **Import/Export**: JSON import/export for test scenarios
3. **Seeding**: Load custom mock data sets
4. **WebSocket Simulation**: Mock real-time updates
5. **Network Throttling**: Simulate slow networks
6. **Error Simulation**: Test error handling

### Not Recommended
- ❌ Making internal mode production-ready (security risk)
- ❌ Adding complex business logic (maintenance burden)
- ❌ External storage (defeats offline purpose)

## Maintenance Guide

### Adding New Entity
1. Create `internalXxxService.ts` in `src/shared/internal-mode/`
2. Add mock data to `mockData.ts`
3. Create/update API wrapper in entity's `api/` folder
4. Export service from `index.ts`
5. Add tab to Internal Admin page (optional)

### Updating Existing Entity
1. Update types in `entities/xxx/model/types.ts`
2. Update internal service to match new types
3. Update mock data generators if needed
4. Test both internal and real modes

### Debugging
```javascript
// Check if internal mode is active
console.log('Internal Mode:', import.meta.env.VITE_USE_INTERNAL_MODE);

// View stored data
Object.keys(localStorage)
  .filter(key => key.startsWith('internal_mode_'))
  .forEach(key => console.log(key, localStorage.getItem(key)));

// Clear internal data
localStorage.clear();
```

## Conclusion

The Internal Simulation Mode feature has been successfully implemented with:
- ✅ Complete offline functionality
- ✅ Zero impact on existing code when disabled
- ✅ Full CRUD operations for all entities
- ✅ User-friendly admin panel
- ✅ Comprehensive documentation
- ✅ Clean, maintainable code
- ✅ Type-safe implementation
- ✅ No security vulnerabilities

The feature is production-ready for development and demo purposes. All acceptance criteria have been met.

---
**Implementation Date**: November 10, 2025  
**Status**: ✅ Complete  
**Code Quality**: ✅ High  
**Documentation**: ✅ Comprehensive  
**Security**: ✅ No issues found
