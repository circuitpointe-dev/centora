
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
      <Header sidebarCollapsed={sidebarCollapsed} />
      <div className="flex flex-1 overflow-hidden pt-16">
        <Sidebar 
          currentModule={module} 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
