'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({ children, showSidebar = true, showHeader = true, showFooter = true }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {showHeader && <Header />}

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="min-h-screen">
            {children}
          </div>
          
          {/* Footer */}
          {showFooter && <Footer />}
        </main>
      </div>
    </div>
  );
}
