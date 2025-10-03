import React from 'react';
import WorkspaceFiltersPanel from './WorkspaceFiltersPanel';
import EnrolledCoursesGrid from './EnrolledCoursesGrid';

const CourseWorkspacePage: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Panel - Filters */}
      <div className="lg:col-span-1">
        <WorkspaceFiltersPanel />
      </div>

      {/* Right Panel - Enrolled Courses */}
      <div className="lg:col-span-3">
        <EnrolledCoursesGrid />
      </div>
    </div>
  );
};

export default CourseWorkspacePage;
