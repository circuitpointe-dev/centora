import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { module = 'fundraising' } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-theme(spacing.16))]">
        <Sidebar currentModule={module} isCollapsed={sidebarCollapsed} />
        <div className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          sidebarCollapsed ? "ml-16" : "ml-64"
        )}>
          {/* Sidebar Toggle */}
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="mr-2"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="text-sm text-gray-600">
              Navigate through modules and features using the sidebar
            </div>
          </div>
          
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
