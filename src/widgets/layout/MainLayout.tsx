import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/shared/ui/components/Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <Outlet />
      </main>
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} ClickDelivery. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
