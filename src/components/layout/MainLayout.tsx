
import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { module = 'fundraising' } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar 
          currentModule={module} 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          // Responsive margins: full width on mobile, respect sidebar on desktop
          "ml-0",
          "md:ml-16",
          !sidebarCollapsed && "lg:ml-64"
        )}>
          {/* Main Content Area - reduced padding */}
          <main className="flex-1 overflow-auto px-6 py-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
