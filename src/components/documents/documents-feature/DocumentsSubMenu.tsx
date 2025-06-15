
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const subMenuItems = [
  { id: 'all', name: 'All Documents' },
  { id: 'policies', name: 'Policies' },
  { id: 'finance', name: 'Finance' },
  { id: 'contracts', name: 'Contracts' },
  { id: 'm-e', name: 'M & E' },
  { id: 'uncategorized', name: 'Uncategorized' },
];

interface DocumentsSubMenuProps {
  feature: {
    id: string;
    name: string;
    icon: React.ElementType;
  };
  isCollapsed: boolean;
  onFeatureClick: (featureId: string) => void;
}

const DocumentsSubMenu = ({ feature, isCollapsed, onFeatureClick }: DocumentsSubMenuProps) => {
  const location = useLocation();
  const isActive = location.pathname.includes(`/documents/${feature.id}`);
  
  // Start with submenu open if we're on a sub-page
  const [isOpen, setIsOpen] = useState(new URLSearchParams(location.search).has('type'));

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
    }
  }, [isCollapsed]);

  const searchParams = new URLSearchParams(location.search);
  const activeSubType = searchParams.get('type');

  const handlemainClick = () => {
    if (isCollapsed) {
      onFeatureClick(feature.id);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleSubMenuClick = (subTypeId: string) => {
    if (subTypeId === 'all') {
      onFeatureClick(feature.id);
    } else {
      onFeatureClick(`${feature.id}?type=${subTypeId}`);
    }
  };

  return (
    <div>
      <Button
        variant={isActive && !activeSubType ? "secondary" : "ghost"}
        className={cn(
          "w-full flex justify-between items-center text-left font-light group",
          isCollapsed ? "px-2" : "px-3",
          isActive && !activeSubType && "bg-blue-50 text-blue-700 border border-blue-200"
        )}
        onClick={handlemainClick}
      >
        <div className="flex items-center">
          <feature.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && <span className="text-sm font-light">{feature.name}</span>}
        </div>
        {!isCollapsed && (
          <ChevronRight
            className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isOpen && "rotate-90"
            )}
          />
        )}
      </Button>
      <AnimatePresence>
        {!isCollapsed && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="pl-8 pr-3 overflow-hidden"
          >
            <div className="py-2 space-y-1 border-l border-gray-200 ml-1.5">
              {subMenuItems.map((item) => {
                const isSubActive = item.id === 'all' ? isActive && !activeSubType : activeSubType === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isSubActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left font-light text-sm pl-4",
                      isSubActive && "bg-blue-50 text-blue-700"
                    )}
                    onClick={() => handleSubMenuClick(item.id)}
                  >
                    {item.name}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsSubMenu;
