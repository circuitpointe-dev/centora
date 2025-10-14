import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowLeft, Search, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { 
  useDeliveryStats, 
  useDeliveries, 
  useConfirmDelivery, 
  useUpdateDeliveryStatus,
  useDeliveryVendors,
  Delivery,
  DeliveryFilters
} from "@/hooks/procurement/useProcurementDeliveries";
import { toast } from "sonner";

const ProcurementDeliveriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<DeliveryFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: stats, isLoading: statsLoading, error: statsError } = useDeliveryStats();
  const { data: deliveriesData, isLoading: deliveriesLoading, error: deliveriesError } = useDeliveries({
    page: currentPage,
    limit: 8,
    search: searchTerm,
    filters,
    sortBy: 'delivery_date',
    sortOrder: 'asc'
  });
  const { data: vendors } = useDeliveryVendors();
  const confirmDeliveryMutation = useConfirmDelivery();
  const updateStatusMutation = useUpdateDeliveryStatus();

  const deliveries = deliveriesData?.deliveries || [];
  const totalDeliveries = deliveriesData?.total || 0;
  const totalPages = Math.ceil(totalDeliveries / 8);

  const handleConfirmReceipt = async (deliveryId: string) => {
    try {
      await confirmDeliveryMutation.mutateAsync({ deliveryId });
      toast.success("Delivery confirmed successfully");
    } catch (error) {
      toast.error("Failed to confirm delivery");
    }
  };

  const handleSelectDelivery = (deliveryId: string, checked: boolean) => {
    if (checked) {
      setSelectedDeliveries(prev => [...prev, deliveryId]);
    } else {
      setSelectedDeliveries(prev => prev.filter(id => id !== deliveryId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeliveries(deliveries.map(d => d.id));
    } else {
      setSelectedDeliveries([]);
    }
  };

  const getStatusBadge = (status: Delivery['status']) => {
    switch (status) {
      case 'overdue':
        return <Badge className="bg-[#fce9e9] text-[#dd2222] hover:bg-[#fce9e9]">Overdue</Badge>;
      case 'due_soon':
        return <Badge className="bg-[#fefacd] text-[#baaa03] hover:bg-[#fefacd]">Due soon</Badge>;
      case 'delivered':
        return <Badge className="bg-[#d1fae5] text-[#10b981] hover:bg-[#d1fae5]">Delivered</Badge>;
      case 'pending':
        return <Badge className="bg-[#e0e7ff] text-[#6366f1] hover:bg-[#e0e7ff]">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (statsLoading || deliveriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading deliveries...</p>
        </div>
      </div>
    );
  }

  if (statsError || deliveriesError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">
              {statsError?.message || deliveriesError?.message || "Failed to load deliveries"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/procurement/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total deliveries */}
        <Card className="hover:shadow-[0_4px_16px_0px_rgba(234,226,253,1)] transition-shadow border border-[#EEF2F6] rounded-[10px]">
          <CardContent className="p-4 flex flex-col gap-4 items-center justify-center text-center h-[152px]">
            <div className="bg-[#f1e9fe] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img
                className="w-6 h-6"
                src="/carbon-delivery0.svg"
                alt="Total deliveries"
              />
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <div className="text-[#383839] text-xl font-semibold">
                {stats?.totalDeliveries || 0}
              </div>
              <div className="text-[#6b7280] text-xs">
                Total deliveries
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card className="hover:shadow-[0_4px_16px_0px_rgba(234,226,253,1)] transition-shadow border border-[#EEF2F6] rounded-[10px]">
          <CardContent className="p-4 flex flex-col gap-4 items-center justify-center text-center h-[152px]">
            <div className="bg-[rgba(255,59,48,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img
                className="w-6 h-6"
                src="/carbon-delivery1.svg"
                alt="Overdue"
              />
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <div className="text-[#383839] text-xl font-semibold">
                {stats?.overdueDeliveries || 0}
              </div>
              <div className="text-[#6b7280] text-xs">
                Overdue
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due soon */}
        <Card className="hover:shadow-[0_4px_16px_0px_rgba(234,226,253,1)] transition-shadow border border-[#EEF2F6] rounded-[10px]">
          <CardContent className="p-4 flex flex-col gap-4 items-center justify-center text-center h-[152px]">
            <div className="bg-[rgba(255,204,0,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img
                className="w-6 h-6"
                src="/carbon-delivery2.svg"
                alt="Due soon"
              />
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
              <div className="text-[#383839] text-xl font-semibold">
                {stats?.dueSoonDeliveries || 0}
              </div>
              <div className="text-[#6b7280] text-xs">
                Due soon
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <h2 className="text-[#383839] text-base font-medium">Upcoming deliveries</h2>
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9b9b9b]" />
              <Input
                placeholder="Search...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-[30px] rounded-[20px] border-[#e1e1e1]"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-0.5 ${viewMode === 'grid' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-0.5 ${viewMode === 'list' ? 'text-primary' : 'text-muted-foreground'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            {/* Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-[43px] px-5 border-[#e1e1e1] rounded-[5px]"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="due_soon">Due Soon</option>
                  <option value="overdue">Overdue</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vendor</label>
                <select
                  value={filters.vendor || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, vendor: e.target.value || undefined }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Vendors</option>
                  {vendors?.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Priority</label>
                <select
                  value={filters.priority || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value || undefined }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {/* Deliveries Table */}
        <Card className="rounded-[5px] shadow-[0px_4px_16px_0px_rgba(234,226,253,1)]">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedDeliveries.length === deliveries.length && deliveries.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-[#383838] text-base font-medium">Reference</span>
                  </div>
                  <div className="text-[#383838] text-base font-medium w-[118px]">Date</div>
                  <div className="text-[#383838] text-base font-medium w-[135px]">Vendor</div>
                  <div className="text-[#383838] text-base font-medium w-[109px]">Status</div>
                  <div className="text-[#383838] text-base font-medium w-[155px]">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="space-y-8">
                  {deliveries.map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 w-[103px]">
                        <Checkbox
                          checked={selectedDeliveries.includes(delivery.id)}
                          onCheckedChange={(checked) => handleSelectDelivery(delivery.id, checked as boolean)}
                        />
                        <span className="text-blue-600 text-sm underline cursor-pointer">
                          {delivery.reference}
                        </span>
                      </div>
                      <div className="text-[rgba(56,56,56,0.65)] text-sm w-[118px]">
                        {formatDate(delivery.delivery_date)}
                      </div>
                      <div className="text-[rgba(56,56,56,0.65)] text-[13px] w-[135px]">
                        {delivery.vendor_name}
                      </div>
                      <div className="w-[109px]">
                        {getStatusBadge(delivery.status)}
                      </div>
                      <div className="w-[155px]">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmReceipt(delivery.id)}
                          disabled={delivery.status === 'delivered' || confirmDeliveryMutation.isPending}
                          className="h-[29px] px-[13px] border-[#e1e1e1] rounded-[5px] text-[rgba(56,56,56,0.60)] text-sm"
                        >
                          <img
                            className="w-4 h-4 mr-2"
                            src={`/group${deliveries.indexOf(delivery) % 8}.svg`}
                            alt="Confirm receipt"
                          />
                          Confirm receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {deliveries.map((delivery) => (
                  <Card key={delivery.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedDeliveries.includes(delivery.id)}
                            onCheckedChange={(checked) => handleSelectDelivery(delivery.id, checked as boolean)}
                          />
                          <span className="text-blue-600 text-sm underline cursor-pointer font-medium">
                            {delivery.reference}
                          </span>
                        </div>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <div className="text-[rgba(56,56,56,0.65)]">{formatDate(delivery.delivery_date)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vendor:</span>
                          <div className="text-[rgba(56,56,56,0.65)]">{delivery.vendor_name}</div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConfirmReceipt(delivery.id)}
                          disabled={delivery.status === 'delivered' || confirmDeliveryMutation.isPending}
                          className="w-full h-[29px] border-[#e1e1e1] rounded-[5px] text-[rgba(56,56,56,0.60)] text-sm"
                        >
                          <img
                            className="w-4 h-4 mr-2"
                            src={`/group${deliveries.indexOf(delivery) % 8}.svg`}
                            alt="Confirm receipt"
                          />
                          Confirm receipt
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
              <div className="text-[#383838] text-sm sm:text-base font-medium">
                Showing 1 to {Math.min(8, totalDeliveries)} of {totalDeliveries} upcoming receipt
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-[38px] px-[13px] border-[#e1e1e1] rounded-[5px] text-[rgba(56,56,56,0.60)] text-[13px]"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-[38px] px-[13px] border-[#e1e1e1] rounded-[5px] text-[#383838] text-[13px]"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcurementDeliveriesPage;
