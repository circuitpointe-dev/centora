import React from 'react';
import FiltersPanel from './FiltersPanel';
import CourseGrid from './CourseGrid';

const CataloguePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Panel - Filters */}
      <div className="lg:col-span-1">
        <FiltersPanel />
      </div>

      {/* Right Panel - Course Catalog */}
      <div className="lg:col-span-3">
        <CourseGrid />
      </div>
    </div>
  );
};

export default CataloguePage;