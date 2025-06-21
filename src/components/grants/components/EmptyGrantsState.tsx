
import React from 'react';
import { Database } from 'lucide-react';

export const EmptyGrantsState = () => {
  return (
    <div className="text-center py-12">
      <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Grants Found</h3>
      <p className="text-gray-500 mb-6">
        There are no grants matching your current filters. Try adjusting your search criteria.
      </p>
    </div>
  );
};
