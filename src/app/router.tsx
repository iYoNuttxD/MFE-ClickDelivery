import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { RoleGuard } from './guards/RoleGuard';
import { MainLayout } from '@/widgets/layout/MainLayout';
import { AdminLayout } from '@/widgets/layout/AdminLayout';
import { LoadingSpinner } from '@/shared/ui/components/LoadingSpinner';

// Public Pages
const LandingPage = lazy(() => import('@/pages/public/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/pages/public/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/public/RegisterPage').then(m => ({ default: m.RegisterPage })));

// Customer Pages
const CustomerDashboardPage = lazy(() => import('@/pages/customer/CustomerDashboardPage').then(m => ({ default: m.CustomerDashboardPage })));
const OrdersPage = lazy(() => import('@/pages/customer/OrdersPage').then(m => ({ default: m.OrdersPage })));
const OrderDetailPage = lazy(() => import('@/pages/customer/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const ProfilePage = lazy(() => import('@/pages/customer/ProfilePage').then(m => ({ default: m.ProfilePage })));
const RestaurantsPage = lazy(() => import('@/pages/customer/RestaurantsPage').then(m => ({ default: m.RestaurantsPage })));
const RestaurantDetailPage = lazy(() => import('@/pages/customer/RestaurantDetailPage').then(m => ({ default: m.RestaurantDetailPage })));
const CartPage = lazy(() => import('@/pages/customer/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('@/pages/customer/CheckoutPage').then(m => ({ default: m.CheckoutPage })));

// Restaurant Pages
const RestaurantDashboardPage = lazy(() => import('@/pages/restaurant/RestaurantDashboardPage').then(m => ({ default: m.RestaurantDashboardPage })));
const RestaurantOrdersPage = lazy(() => import('@/pages/restaurant/RestaurantOrdersPage').then(m => ({ default: m.RestaurantOrdersPage })));
const RestaurantMenuPage = lazy(() => import('@/pages/restaurant/RestaurantMenuPage').then(m => ({ default: m.RestaurantMenuPage })));
const RestaurantSettingsPage = lazy(() => import('@/pages/restaurant/RestaurantSettingsPage').then(m => ({ default: m.RestaurantSettingsPage })));

// Courier Pages
const CourierDashboardPage = lazy(() => import('@/pages/courier/CourierDashboardPage').then(m => ({ default: m.CourierDashboardPage })));
const CourierDeliveriesPage = lazy(() => import('@/pages/courier/CourierDeliveriesPage').then(m => ({ default: m.CourierDeliveriesPage })));
const CourierVehiclesPage = lazy(() => import('@/pages/courier/CourierVehiclesPage').then(m => ({ default: m.CourierVehiclesPage })));
const CourierProfilePage = lazy(() => import('@/pages/courier/CourierProfilePage').then(m => ({ default: m.CourierProfilePage })));

// Owner Pages
const OwnerDashboardPage = lazy(() => import('@/pages/owner/OwnerDashboardPage').then(m => ({ default: m.OwnerDashboardPage })));
const OwnerVehiclesPage = lazy(() => import('@/pages/owner/OwnerVehiclesPage').then(m => ({ default: m.OwnerVehiclesPage })));
const OwnerRentalsPage = lazy(() => import('@/pages/owner/OwnerRentalsPage').then(m => ({ default: m.OwnerRentalsPage })));

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminRestaurantsPage = lazy(() => import('@/pages/admin/AdminRestaurantsPage').then(m => ({ default: m.AdminRestaurantsPage })));
const AdminCouriersPage = lazy(() => import('@/pages/admin/AdminCouriersPage').then(m => ({ default: m.AdminCouriersPage })));
const AdminOwnersPage = lazy(() => import('@/pages/admin/AdminOwnersPage').then(m => ({ default: m.AdminOwnersPage })));
const AdminReportsPage = lazy(() => import('@/pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminAuditPage = lazy(() => import('@/pages/admin/AdminAuditPage').then(m => ({ default: m.AdminAuditPage })));
const InternalAdminPage = lazy(() => import('@/pages/admin/InternalAdminPage').then(m => ({ default: m.InternalAdminPage })));

const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><LandingPage /></SuspenseWrapper> },
      { path: 'login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: 'register', element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },

      // Customer Routes
      {
        path: 'customer',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><CustomerDashboardPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><OrdersPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'orders/:id',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><OrderDetailPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><ProfilePage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'restaurants',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><RestaurantsPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'restaurants/:id',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><RestaurantDetailPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'cart',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><CartPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'checkout',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['customer']}>
                  <SuspenseWrapper><CheckoutPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Restaurant Routes
      {
        path: 'restaurant',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['restaurant']}>
                  <SuspenseWrapper><RestaurantDashboardPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'orders',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['restaurant']}>
                  <SuspenseWrapper><RestaurantOrdersPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'menu',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['restaurant']}>
                  <SuspenseWrapper><RestaurantMenuPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'settings',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['restaurant']}>
                  <SuspenseWrapper><RestaurantSettingsPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Courier Routes
      {
        path: 'courier',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['courier']}>
                  <SuspenseWrapper><CourierDashboardPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'deliveries',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['courier']}>
                  <SuspenseWrapper><CourierDeliveriesPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'vehicles',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['courier']}>
                  <SuspenseWrapper><CourierVehiclesPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'profile',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['courier']}>
                  <SuspenseWrapper><CourierProfilePage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Owner Routes
      {
        path: 'owner',
        children: [
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['owner']}>
                  <SuspenseWrapper><OwnerDashboardPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'vehicles',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['owner']}>
                  <SuspenseWrapper><OwnerVehiclesPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
          {
            path: 'rentals',
            element: (
              <ProtectedRoute>
                <RoleGuard roles={['owner']}>
                  <SuspenseWrapper><OwnerRentalsPage /></SuspenseWrapper>
                </RoleGuard>
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },

  // Admin Routes (with AdminLayout)
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <RoleGuard roles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper> },
      { path: 'internal', element: <SuspenseWrapper><InternalAdminPage /></SuspenseWrapper> },
      { path: 'users', element: <SuspenseWrapper><AdminUsersPage /></SuspenseWrapper> },
      { path: 'restaurants', element: <SuspenseWrapper><AdminRestaurantsPage /></SuspenseWrapper> },
      { path: 'couriers', element: <SuspenseWrapper><AdminCouriersPage /></SuspenseWrapper> },
      { path: 'owners', element: <SuspenseWrapper><AdminOwnersPage /></SuspenseWrapper> },
      { path: 'reports', element: <SuspenseWrapper><AdminReportsPage /></SuspenseWrapper> },
      { path: 'audit', element: <SuspenseWrapper><AdminAuditPage /></SuspenseWrapper> },
    ],
  },

  // Catch all - redirect to home
  { path: '*', element: <Navigate to="/" replace /> },
]);
