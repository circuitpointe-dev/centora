
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
          Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of documents, signatures, and compliance status
        </p>
      </div>

      {/* Section 1: Statistics Cards */}
      <StatisticsCardSection />

      {/* Section 2: Documents by Department and Documents by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DocumentByDepartmentSection />
        <DocumentByTypeSection />
      </div>

      {/* Section 3: Recent Activity, Notifications, and Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <RecentActivitySection />
        </div>
        <div className="lg:col-span-4">
          <NotificationsSection />
        </div>
        <div className="lg:col-span-4">
          <QuickLinksSection />
        </div>
      </div>
    </div>
  );
};

export default DocumentsDashboard;
