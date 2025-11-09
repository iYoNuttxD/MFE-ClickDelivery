import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/ui/components/Navbar';
import { Sidebar } from '@/shared/ui/components/Sidebar';

const adminLinks = [
  { to: '/admin/dashboard', label: 'nav.dashboard' },
  { to: '/admin/users', label: 'nav.users' },
  { to: '/admin/restaurants', label: 'nav.restaurants' },
  { to: '/admin/couriers', label: 'Entregadores' },
  { to: '/admin/owners', label: 'Proprietários' },
  { to: '/admin/reports', label: 'nav.reports' },
  { to: '/admin/audit', label: 'nav.audit' },
];

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar links={adminLinks} />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
