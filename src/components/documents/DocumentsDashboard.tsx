
import { StatisticsCardSection } from "@/components/documents/dashboard/sections/StatisticsCardSection";
import { DocumentByTypeSection } from "@/components/documents/dashboard/sections/DocumentByTypeSection";
import { NotificationsSection } from "@/components/documents/dashboard/sections/NotificationsSection";
import { QuickLinksSection } from "@/components/documents/dashboard/sections/QuickLinksSection";
import { RecentActivitySection } from "@/components/documents/dashboard/sections/RecentActivitySection";
import { DocumentByDepartmentSection } from "./dashboard/sections/DocumentByDepartmentSection";

const DocumentsDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Document Management Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of documents, signatures, and compliance status
        </p>
      </div>

      {/* Section 1: Statistics Cards */}
      <StatisticsCardSection />

      {/* Section 2: Documents by Type and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DocumentByTypeSection />
        </div>
        <div className="lg:col-span-1">
          <QuickLinksSection />
        </div>
      </div>

      {/* Section 3: Documents by Department and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentByDepartmentSection />
        <NotificationsSection />
      </div>

      {/* Section 4: Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-start-2 lg:col-span-2">
          <RecentActivitySection />
        </div>
      </div>
    </div>
  );
};

export default DocumentsDashboard;
