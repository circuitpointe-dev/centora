import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  useRequisitionStats,
  useRequisitions,
  useCreateRequisition,
  useUpdateRequisitionStatus,
  useRequisitionBudgetSources,
  useRequisitionCategories,
  Requisition,
  RequisitionFilters
} from "@/hooks/procurement/useProcurementRequisitions";
import { toast } from "sonner";
import { usePlanItems, usePlanStats, useCreatePlanItem, useUpdatePlanItem, useDeletePlanItem } from "@/hooks/procurement/useProcurementPlanBuilder";
import { useApprovalMatrix, useCreateApprovalRule, useUpdateApprovalRule, useDeleteApprovalRule } from "@/hooks/procurement/useProcurementApprovalMatrix";

const ProcurementPlanningPage: React.FC = () => {
  const navigate = useNavigate();
  const generateFriendlyCode = (len: number = 4) => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I, O, 0, 1
    const bytes = new Uint8Array(len);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < len; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    let out = '';
    for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
    return out;
  };
  const generateReadableId = (prefix: string) => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const code = generateFriendlyCode(4);
    return `${prefix}-${y}${m}${day}-${code}`;
  };
  const generateRuleCode = () => `R-${generateFriendlyCode(4)}`;
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<RequisitionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('requisition-management');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newReq, setNewReq] = useState<Partial<Requisition>>({
    req_id: '',
    item_name: '',
    quantity: 1,
    estimated_cost: 0,
    currency: 'USD',
    date_submitted: new Date().toISOString(),
    status: 'pending',
  });
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const itemsPerPage = 8;
  const { data: planStats } = usePlanStats();
  const { data: planItems } = usePlanItems({ page: currentPage, limit: itemsPerPage, search: searchTerm });
  const { data: calendarItems } = usePlanItems({ page: 1, limit: 1000, search: searchTerm });
  const pendingItemsCount = (planStats?.pendingItems ?? ((planItems?.items || []).filter((it: any) => it.status === 'Pending').length));
  const createPlanItem = useCreatePlanItem();
  const updatePlanItem = useUpdatePlanItem();
  const deletePlanItem = useDeletePlanItem();
  const [planViewMode, setPlanViewMode] = useState<'list' | 'compact'>('list');
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [newPlanItem, setNewPlanItem] = useState<any>({ item: '', description: '', est_cost: 0, budget_source: '', status: 'Pending', planned_date: null });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<any>({});
  const [matrixFilters, setMatrixFilters] = useState<{ entityType?: string; status?: string }>({});
  const { data: matrix } = useApprovalMatrix({ page: currentPage, limit: 8, search: searchTerm, filters: matrixFilters });
  const createRule = useCreateApprovalRule();
  const updateRule = useUpdateApprovalRule();
  const deleteRule = useDeleteApprovalRule();
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState<any>({ rule_code: '', entity_type: 'Requisition', condition: '', approver_sequence: [], escalation_sla: '', status: 'Active' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarFilterOpen, setIsCalendarFilterOpen] = useState(false);
  const [isDrillOpen, setIsDrillOpen] = useState(false);
  const [drillDate, setDrillDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [calendarFilter, setCalendarFilter] = useState<{ status?: 'Planned' | 'Completed' | undefined }>({});

  const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
  const startOffset = startOfMonth.getDay();
  const totalCells = 42; // 6 weeks grid
  const monthLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const itemsInMonth = (calendarItems?.items || []).filter((it: any) => {
    const d = it.planned_date ? new Date(it.planned_date) : undefined;
    if (!d || isNaN(d.getTime())) return false;
    const within = d >= startOfMonth && d <= endOfMonth;
    if (!within) return false;
    if (calendarFilter.status) return (it.status || '').toLowerCase() === calendarFilter.status.toLowerCase();
    return true;
  });

  const itemsByDay: Record<string, any[]> = {};
  itemsInMonth.forEach((it: any) => {
    const key = new Date(it.planned_date).toISOString().slice(0, 10);
    itemsByDay[key] = itemsByDay[key] || [];
    itemsByDay[key].push(it);
  });

  const handleCalendarExport = () => {
    const rows = [
      ['Item', 'Description', 'Planned date', 'Status', 'Budget source', 'Est. cost'],
      ...itemsInMonth.map((it: any) => [it.item, it.description, it.planned_date, it.status, it.budget_source || '', String(it.est_cost || 0)])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `procurement-calendar-${monthLabel.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { data: stats, isLoading: statsLoading, error: statsError } = useRequisitionStats();
  const { data: requisitionsData, isLoading: requisitionsLoading, error: requisitionsError } = useRequisitions({
    page: currentPage,
    limit: 8,
    search: searchTerm,
    filters,
    sortBy: 'date_submitted',
    sortOrder: 'desc'
  });
  const { data: budgetSources } = useRequisitionBudgetSources();
  const { data: categories } = useRequisitionCategories();
  const createRequisitionMutation = useCreateRequisition();
  const updateStatusMutation = useUpdateRequisitionStatus();

  const requisitions = requisitionsData?.requisitions || [];
  const totalRequisitions = requisitionsData?.total || 0;
  const totalPages = Math.ceil(totalRequisitions / 8);

  const handleViewRequisition = (requisitionId: string) => {
    navigate(`/dashboard/procurement/requisition-detail-${requisitionId}`);
  };

  const handleNewRequisition = () => {
    if (activeTab === 'plan-builder') {
      setIsCreatePlanOpen(true);
      return;
    }
    setNewReq(v => ({
      ...v,
      req_id: generateReadableId('REQ')
    }));
    setIsCreateOpen(true);
  };

  const handleExportPlanItems = () => {
    if (planItems?.items) {
      const csvContent = [
        ['Item', 'Description', 'Est. Cost', 'Budget Source', 'Status', 'Planned Date'],
        ...planItems.items.map((item: any) => [
          item.item,
          item.description,
          item.est_cost,
          item.budget_source,
          item.status,
          item.planned_date
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'procurement-plan-items.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Plan items exported successfully!');
    } else {
      toast.error('No items to export');
    }
  };

  const handleBulkUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: any) => {
          const csv: string = e.target.result || '';
          const lines = csv.split(/\r?\n/).filter(Boolean);
          if (lines.length < 2) { toast.error('CSV has no rows'); return; }
          const items = lines.slice(1).map((line: string) => {
            const values = line.split(',');
            return {
              item: (values[0] || '').trim(),
              description: (values[1] || '').trim(),
              est_cost: Number(values[2] || 0),
              budget_source: (values[3] || '').trim(),
              status: (values[4] || 'Pending').trim(),
              planned_date: (values[5] || '').trim()
            };
          }).filter(rec => rec.item);
          if (items.length === 0) { toast.error('No valid rows found'); return; }
          let created = 0;
          for (const item of items) {
            try { await createPlanItem.mutateAsync(item); created++; } catch { }
          }
          toast.success(`Bulk upload completed (${created}/${items.length})`);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleCreatePlanSubmit = async () => {
    if (!newPlanItem.item || newPlanItem.item.trim() === '') {
      toast.error('Item name is required');
      return;
    }
    try {
      const payload = {
        item: newPlanItem.item.trim(),
        description: newPlanItem.description || '',
        est_cost: Number(newPlanItem.est_cost) || 0,
        budget_source: newPlanItem.budget_source || '',
        status: newPlanItem.status || 'Pending',
        planned_date: newPlanItem.planned_date ? format(newPlanItem.planned_date, 'yyyy-MM-dd') : ''
      };
      console.log('Creating plan item with payload:', payload);
      await createPlanItem.mutateAsync(payload);
      setIsCreatePlanOpen(false);
      setNewPlanItem({ item: '', description: '', est_cost: 0, budget_source: '', status: 'Pending', planned_date: null });
      toast.success('Plan item added successfully');
    } catch (e: any) {
      console.error('Error creating plan item:', e);
      toast.error(e?.message || 'Failed to add plan item. Please check the browser console for details.');
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const payload = { ...newReq } as Requisition;
      if (!payload.req_id || payload.req_id.trim() === '') {
        payload.req_id = generateReadableId('REQ');
      }
      await createRequisitionMutation.mutateAsync(payload);
      setIsCreateOpen(false);
      toast.success('Requisition created');
      setNewReq({ req_id: '', item_name: '', quantity: 1, estimated_cost: 0, currency: 'USD', date_submitted: new Date().toISOString(), status: 'pending' });
    } catch (e: any) {
      toast.error(e.message || 'Failed to create requisition');
    }
  };

  const handleExport = () => {
    const rows = [
      ['REQ ID', 'ITEM', 'QUANTITY', 'EST. COST', 'CURRENCY', 'DATE SUBMITTED', 'BUDGET SOURCE', 'STATUS'],
      ...requisitions.map(r => [r.req_id, r.item_name, String(r.quantity), String(r.estimated_cost), r.currency, new Date(r.date_submitted).toISOString(), r.budget_source || '', r.status])
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `requisitions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBulkClick = () => fileInputRef.current?.click();

  const handleBulkFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
    const idx = (k: string) => headers.indexOf(k);
    for (const line of lines) {
      const cols = line.split(',');
      const payload: Partial<Requisition> = {
        req_id: cols[idx('req_id')] || cols[idx('REQ ID')],
        item_name: cols[idx('item_name')] || cols[idx('ITEM')],
        quantity: Number(cols[idx('quantity')] || 1),
        estimated_cost: Number(cols[idx('estimated_cost')] || 0),
        currency: cols[idx('currency')] || 'USD',
        date_submitted: cols[idx('date_submitted')] || new Date().toISOString(),
        budget_source: cols[idx('budget_source')] || undefined,
        status: (cols[idx('status')] as any) || 'pending',
      } as any;
      try { await createRequisitionMutation.mutateAsync(payload as Requisition); } catch { }
    }
    toast.success('Bulk upload completed');
    (e.target as any).value = '';
  };

  const getStatusBadge = (status: Requisition['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-[#fef3c7] text-[#d97706] hover:bg-[#fef3c7]">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-[#d1fae5] text-[#059669] hover:bg-[#d1fae5]">Approved</Badge>;
      case 'completed':
        return <Badge className="bg-[#d1fae5] text-[#059669] hover:bg-[#d1fae5]">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-[#fee2e2] text-[#dc2626] hover:bg-[#fee2e2]">Rejected</Badge>;
      case 'cancelled':
        return <Badge className="bg-[#f3f4f6] text-[#6b7280] hover:bg-[#f3f4f6]">Cancelled</Badge>;
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

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (statsLoading || requisitionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading procurement planning...</p>
        </div>
      </div>
    );
  }

  if (statsError || requisitionsError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">
              {statsError?.message || requisitionsError?.message || "Failed to load procurement planning"}
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
        <h1 className="text-2xl font-semibold text-[#383839]">Procurement planning</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-full lg:w-fit">
        {[
          { id: 'requisition-management', label: 'Requisition management' },
          { id: 'plan-builder', label: 'Procurement plan builder' },
          { id: 'approval-matrix', label: 'Approval matrix & workflows' },
          { id: 'calendar', label: 'Procurement calendar' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab.id
              ? 'bg-white text-[#7c3aed] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Cards - Only show on requisition-management tab */}
      {activeTab === 'requisition-management' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Requisitions */}
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(255,193,7,0.15)] rounded-[42px] p-2.5 flex flex-row gap-2.5 items-center justify-center shrink-0 w-12 h-12 relative">
              <div className="shrink-0 w-6 h-6 relative overflow-hidden">
                <img
                  className="w-[95.45%] h-[96.97%] absolute right-[2.27%] left-[2.27%] bottom-[1.52%] top-[1.52%] overflow-visible"
                  src="/group0.svg"
                  alt="Pending requisitions"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-start shrink-0 relative">
              <div className="text-[#383839] text-center font-['Inter-Bold',_sans-serif] text-2xl font-bold relative">
                {stats?.pendingRequisitions || 0}
              </div>
              <div className="text-[#6b7280] text-center font-['Inter-Regular',_sans-serif] text-xs leading-tight font-normal relative w-[196px] flex items-center justify-center">
                Pending requisitions
              </div>
            </div>
          </Card>

          {/* Approved Requisitions */}
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(52,199,89,0.15)] rounded-[42px] p-2.5 flex flex-row gap-2.5 items-center justify-center shrink-0 w-12 h-12 relative">
              <div className="shrink-0 w-6 h-6 relative overflow-hidden">
                <img
                  className="w-[95.45%] h-[96.97%] absolute right-[2.27%] left-[2.27%] bottom-[1.52%] top-[1.52%] overflow-visible"
                  src="/group1.svg"
                  alt="Approved requisitions"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-start shrink-0 relative">
              <div className="text-[#383839] text-center font-['Inter-Bold',_sans-serif] text-2xl font-bold relative">
                {stats?.approvedRequisitions || 0}
              </div>
              <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-xs leading-tight font-normal relative flex items-center justify-start">
                Approved requisitions
              </div>
            </div>
          </Card>

          {/* Average Approval Time */}
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(124,58,237,0.15)] rounded-[42px] p-2.5 flex flex-row gap-2.5 items-center justify-center shrink-0 w-12 h-12 relative">
              <div className="shrink-0 w-6 h-6 relative overflow-hidden">
                <img
                  className="w-[88.28%] h-[79.17%] absolute right-[6.86%] left-[4.86%] bottom-[8.33%] top-[12.5%] overflow-visible"
                  src="/group2.svg"
                  alt="Average approval time"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 items-center justify-start shrink-0 relative">
              <div className="text-[#383839] text-center font-['Inter-Bold',_sans-serif] text-2xl font-bold relative">
                {stats?.averageApprovalTime || 0} days
              </div>
              <div className="text-[#6b7280] text-left font-['Inter-Regular',_sans-serif] text-xs leading-tight font-normal relative flex items-center justify-start">
                Average approval time
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Plan Builder Tab KPI (when active) */}
      {activeTab === 'plan-builder' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(124,58,237,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img className="w-6 h-6" src="/group0.svg" alt="Total spend" />
            </div>
            <div className="text-2xl font-bold text-[#383839]">{formatCurrency(planStats?.totalPlannedSpend ?? (planItems?.items || []).reduce((s: number, it: any) => s + Number(it.est_cost || 0), 0))}</div>
            <div className="text-sm text-[#6b7280]">Total planned spend</div>
          </Card>
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(52,199,89,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img className="w-6 h-6" src="/group1.svg" alt="Total items" />
            </div>
            <div className="text-2xl font-bold text-[#383839]">{planStats?.totalItems ?? (planItems?.total || 0)}</div>
            <div className="text-sm text-[#6b7280]">Total items</div>
          </Card>
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(255,193,7,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img className="w-6 h-6" src="/group2.svg" alt="Pending items" />
            </div>
            <div className="text-2xl font-bold text-[#383839]">{pendingItemsCount}</div>
            <div className="text-sm text-[#6b7280]">Pending items</div>
          </Card>
        </div>
      )}

      {activeTab === 'plan-builder' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-[#383839]">Procurement plan list</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  src="/search1.svg"
                  alt="Search"
                />
                <Input
                  placeholder="Search...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48 h-[30px] rounded-[20px] border-[#e1e1e1] text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-[30px] px-3 text-xs" onClick={() => setPlanViewMode(v => v === 'list' ? 'compact' : 'list')}>
                  <img className="w-4 h-4 mr-2" src="/list0.svg" alt="List view" />
                  {planViewMode === 'list' ? 'List' : 'Compact'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[30px] px-3 text-xs"
                  onClick={handleExportPlanItems}
                >
                  <img className="w-4 h-4 mr-2" src="/uil-export0.svg" alt="Export" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[30px] px-3 text-xs"
                  onClick={handleBulkUpload}
                >
                  <img className="w-4 h-4 mr-2" src="/typcn-upload0.svg" alt="Bulk upload" />
                  Bulk upload
                </Button>
                <Button
                  onClick={handleNewRequisition}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white h-[30px] px-3 text-sm font-medium"
                >
                  <img className="w-5 h-5 mr-1.5" src="/material-symbols-add-rounded0.svg" alt="Add" />
                  Add item
                </Button>
              </div>
            </div>
          </div>

          {/* Plan Items Table */}
          <div className="bg-white rounded-[5px] border border-[#f5f7fa] p-6" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="hidden lg:block overflow-x-auto">
              {/* Table Headers */}
              <div className="flex items-center gap-6 py-3 border-b border-[#f5f7fa] mb-6">
                <div className="w-[101px] text-xs font-medium text-[#6b7280] uppercase tracking-wider">Item</div>
                <div className="flex-1 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Description</div>
                <div className="w-24 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Est. cost</div>
                <div className="w-28 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Budget source</div>
                <div className="w-[109px] text-xs font-medium text-[#6b7280] uppercase tracking-wider">Status</div>
                <div className="w-[101px] text-xs font-medium text-[#6b7280] uppercase tracking-wider">Planned date</div>
                <div className="w-32 text-xs font-medium text-[#6b7280] uppercase tracking-wider">Action</div>
              </div>

              <div className={`flex flex-col ${planViewMode === 'list' ? 'gap-[38px]' : 'gap-4'}`}>
                {/* Real data from backend */}
                {(planItems?.items || []).map((it: any, index: number) => (
                  <div key={it.id} className="flex items-center gap-6 py-4">
                    {/* Checkbox + Item */}
                    <div className="flex items-center gap-3 w-[101px]">
                      <div className="w-4 h-4 bg-[#f5f7fa] rounded border border-[#e1e1e1] flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#7c3aed] rounded-sm hidden"></div>
                      </div>
                      <span className="text-sm text-[rgba(56,56,56,0.65)] font-normal">
                        {editingId === it.id ? (
                          <Input
                            value={editDraft.item}
                            onChange={e => setEditDraft((v: any) => ({ ...v, item: e.target.value }))}
                            className="text-sm border-0 p-0 h-auto bg-transparent"
                          />
                        ) : it.item}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      {editingId === it.id ? (
                        <Input
                          value={editDraft.description}
                          onChange={e => setEditDraft((v: any) => ({ ...v, description: e.target.value }))}
                          className="text-sm border-0 p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <span className="text-sm text-[rgba(56,56,56,0.65)] font-normal">{it.description}</span>
                      )}
                    </div>

                    {/* Est. Cost */}
                    <div className="w-24">
                      {editingId === it.id ? (
                        <Input
                          type="number"
                          value={editDraft.est_cost}
                          onChange={e => setEditDraft((v: any) => ({ ...v, est_cost: Number(e.target.value) }))}
                          className="text-sm border-0 p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <span className="text-sm text-[rgba(56,56,56,0.65)] font-normal">${Number(it.est_cost || 0).toLocaleString()}</span>
                      )}
                    </div>

                    {/* Budget Source */}
                    <div className="w-28">
                      {editingId === it.id ? (
                        <Input
                          value={editDraft.budget_source}
                          onChange={e => setEditDraft((v: any) => ({ ...v, budget_source: e.target.value }))}
                          className="text-sm border-0 p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <span className="text-sm text-[rgba(56,56,56,0.65)] font-normal">{it.budget_source}</span>
                      )}
                    </div>

                    {/* Status */}
                    <div className="w-[109px]">
                      {editingId === it.id ? (
                        <Input
                          value={editDraft.status}
                          onChange={e => setEditDraft((v: any) => ({ ...v, status: e.target.value }))}
                          className="text-sm border-0 p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <div className={`rounded-2xl px-3 py-1.5 text-[10px] font-normal text-center ${it.status === 'Approved' ? 'bg-[#dcfce7] text-[#10bc4b]' :
                          it.status === 'Pending' ? 'bg-[#fefacd] text-[#baaa03]' :
                            it.status === 'Completed' ? 'bg-[#dcfce7] text-[#10bc4b]' :
                              it.status === 'Rejected' ? 'bg-[#fee2e2] text-[#dc2626]' :
                                'bg-[#f3f4f6] text-[#6b7280]'
                          }`}>
                          {it.status}
                        </div>
                      )}
                    </div>

                    {/* Planned Date */}
                    <div className="w-[101px]">
                      {editingId === it.id ? (
                        <Input
                          value={editDraft.planned_date}
                          onChange={e => setEditDraft((v: any) => ({ ...v, planned_date: e.target.value }))}
                          className="text-sm border-0 p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <span className="text-sm text-[rgba(56,56,56,0.65)] font-normal">{it.planned_date}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {editingId === it.id ? (
                        <>
                          <Button
                            size="sm"
                            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white h-8 px-3 text-xs"
                            onClick={async () => {
                              await updatePlanItem.mutateAsync({ id: it.id, updates: editDraft });
                              setEditingId(null);
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs flex items-center gap-1"
                            onClick={() => {
                              setEditingId(it.id);
                              setEditDraft({
                                item: it.item,
                                description: it.description,
                                est_cost: it.est_cost,
                                budget_source: it.budget_source,
                                status: it.status,
                                planned_date: it.planned_date
                              });
                            }}
                          >
                            <img className="w-4 h-4" src="/material-symbols-delete-outline0.svg" alt="Edit" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs flex items-center gap-1 text-red-600 hover:text-red-700"
                            onClick={async () => {
                              if (confirm('Delete this item?')) {
                                await deletePlanItem.mutateAsync(it.id);
                              }
                            }}
                          >
                            <img className="w-4 h-4" src="/material-symbols-delete-outline0.svg" alt="Delete" />
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-4">
              {(planItems?.items || []).map((it: any) => (
                <div key={it.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#f5f7fa] rounded border border-[#e1e1e1]"></div>
                      <span className="font-medium text-sm">{it.item}</span>
                    </div>
                    <div className={`rounded-2xl px-3 py-1.5 text-[10px] font-normal ${it.status === 'Approved' ? 'bg-[#dcfce7] text-[#10bc4b]' :
                      it.status === 'Pending' ? 'bg-[#fefacd] text-[#baaa03]' :
                        it.status === 'Completed' ? 'bg-[#dcfce7] text-[#10bc4b]' :
                          it.status === 'Rejected' ? 'bg-[#fee2e2] text-[#dc2626]' :
                            'bg-[#f3f4f6] text-[#6b7280]'
                      }`}>
                      {it.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{it.description}</div>
                  <div className="flex justify-between text-sm">
                    <span>Est. Cost: ${Number(it.est_cost || 0).toLocaleString()}</span>
                    <span>Budget: {it.budget_source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Planned: {it.planned_date}</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => {
                          setEditingId(it.id);
                          setEditDraft({
                            item: it.item,
                            description: it.description,
                            est_cost: it.est_cost,
                            budget_source: it.budget_source,
                            status: it.status,
                            planned_date: it.planned_date
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs text-red-600"
                        onClick={async () => {
                          if (confirm('Delete this item?')) {
                            await deletePlanItem.mutateAsync(it.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f5f7fa]">
              <div className="text-sm text[rgba(56,56,56,0.65)]">
                Showing {(planItems && planItems.items && planItems.items.length) ? (itemsPerPage * (currentPage - 1) + 1) : 0}
                {" "}to {Math.min(itemsPerPage * currentPage, planItems?.total || 0)} of {planItems?.total || 0} procurement plan lists
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  disabled={!planItems?.total || itemsPerPage * currentPage >= (planItems?.total || 0)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Approval matrix & workflows tab */}
      {activeTab === 'approval-matrix' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[120px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(124,58,237,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/carbon-rule0.svg" alt="Rules active" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">{(matrix?.rules || []).filter((r: any) => (r.status || '').toLowerCase() === 'active').length}</div>
              <div className="text-xs text-[#6b7280]">Rules active</div>
            </Card>
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[120px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(52,199,89,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/group1.svg" alt="Avg. approval time" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">{0} mins</div>
              <div className="text-xs text-[#6b7280]">Avg. approval time</div>
            </Card>
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[120px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(255,193,7,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/fontisto-date0.svg" alt="Last updated" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">{(matrix?.rules?.[0]?.updated_at ? new Date(matrix.rules[0].updated_at).toLocaleDateString() : '-')}</div>
              <div className="text-xs text-[#6b7280]">Last updated</div>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative">
                  <img className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" src="/search0.svg" alt="search" />
                  <Input placeholder="Search...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-64" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)}><img className="w-4 h-4 mr-2" src="/ion-filter0.svg" alt="filter" />Filter</Button>
                  <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" onClick={() => { setNewRule((v: any) => ({ ...v, rule_code: generateRuleCode() })); setIsAddRuleOpen(true); }}>+ Add rule</Button>
                </div>
              </div>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr className="text-left text-xs text-gray-500">
                      <th className="px-4 py-3">Rule ID</th>
                      <th className="px-4 py-3">Entity type</th>
                      <th className="px-4 py-3">Condition</th>
                      <th className="px-4 py-3">Approver sequence</th>
                      <th className="px-4 py-3">Escalation SLA</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(matrix?.rules || []).map((r: any) => (
                      <tr key={r.id} className="border-b text-sm">
                        <td className="px-4 py-3 text-gray-700">{r.rule_code}</td>
                        <td className="px-4 py-3 text-gray-700">{r.entity_type}</td>
                        <td className="px-4 py-3 text-gray-700">{r.condition}</td>
                        <td className="px-4 py-3 text-gray-700">{(r.approver_sequence || []).join(' → ')}</td>
                        <td className="px-4 py-3 text-gray-700">{r.escalation_sla}</td>
                        <td className="px-4 py-3">{getStatusBadge((r.status || 'Active').toLowerCase() as any)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => updateRule.mutate({ id: r.id, updates: { status: (r.status === 'Active' ? 'Inactive' : 'Active') } })}>Toggle</Button>
                            <Button variant="outline" size="sm" className="text-red-600" onClick={() => { if (confirm('Delete rule?')) deleteRule.mutate(r.id); }}>Delete</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 lg:px-6 py-4 border-t bg-gray-50">
                <div className="flex items-center justify-between text-sm text-[#6b7280]">
                  <div>Showing 1 to {Math.min(8, matrix?.total || 0)} of {matrix?.total || 0} approval matrix & workflows lists</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={!matrix?.total || currentPage * 8 >= (matrix?.total || 0)}>Next</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Modal */}
          {isFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filter rules</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Entity type</label>
                    <Input placeholder="Requisition / Purchase order / Payment" value={matrixFilters.entityType || ''} onChange={e => setMatrixFilters(v => ({ ...v, entityType: e.target.value || undefined }))} />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <Input placeholder="Active / Inactive" value={matrixFilters.status || ''} onChange={e => setMatrixFilters(v => ({ ...v, status: e.target.value || undefined }))} />
                  </div>
                </div>
                <div className="p-4 border-t flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => { setMatrixFilters({}); setIsFilterOpen(false); }}>Clear</Button>
                  <Button onClick={() => setIsFilterOpen(false)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Apply</Button>
                </div>
              </div>
            </div>
          )}

          {/* Add Rule Modal */}
          {isAddRuleOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Add rule</h3>
                  <button onClick={() => setIsAddRuleOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-5 space-y-4">
                  {/* Rule ID */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Rule ID</label>
                    <Input value={newRule.rule_code} readOnly />
                  </div>

                  {/* Entity type */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Entity type</label>
                    <div className="relative">
                      <select
                        value={newRule.entity_type}
                        onChange={e => setNewRule((v: any) => ({ ...v, entity_type: e.target.value }))}
                        className="w-full h- nine rounded-md border border-[#e5e7eb] bg-white px-3 text-sm focus:outline-none"
                      >
                        <option>Requisition</option>
                        <option>Purchase order</option>
                        <option>Payment</option>
                      </select>
                    </div>
                  </div>

                  {/* Condition: Amount < currency amount */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Condition</label>
                    <div className="grid grid-cols-4 gap-2">
                      <select
                        value={newRule._metric || 'Amount'}
                        onChange={e => setNewRule((v: any) => ({ ...v, _metric: e.target.value, condition: `${e.target.value} ${v._op || '<'} ${v._currency || 'USD'} ${v._amount || ''}` }))}
                        className="col-span-1 h- nine rounded-md border border-[#e5e7eb] bg-white px-2 text-sm"
                      >
                        <option>Amount</option>
                        <option>Item count</option>
                      </select>
                      <select
                        value={newRule._op || '<'}
                        onChange={e => setNewRule((v: any) => ({ ...v, _op: e.target.value, condition: `${v._metric || 'Amount'} ${e.target.value} ${v._currency || 'USD'} ${v._amount || ''}` }))}
                        className="col-span-1 h- nine rounded-md border border-[#e5e7eb] bg-white px-2 text-sm"
                      >
                        <option>{'<'}</option>
                        <option>{'<='}</option>
                        <option>{'>'}</option>
                        <option>{'>='}</option>
                      </select>
                      <select
                        value={newRule._currency || 'USD'}
                        onChange={e => setNewRule((v: any) => ({ ...v, _currency: e.target.value, condition: `${v._metric || 'Amount'} ${v._op || '<'} ${e.target.value} ${v._amount || ''}` }))}
                        className="col-span-1 h- nine rounded-md border border-[#e5e7eb] bg-white px-2 text-sm"
                      >
                        <option>USD</option>
                        <option>NGN</option>
                        <option>EUR</option>
                      </select>
                      <Input
                        type="number"
                        value={newRule._amount || ''}
                        onChange={e => setNewRule((v: any) => ({ ...v, _amount: e.target.value, condition: `${v._metric || 'Amount'} ${v._op || '<'} ${v._currency || 'USD'} ${e.target.value}` }))}
                        className="col-span-1 h- nine"
                      />
                    </div>
                  </div>

                  {/* Approver role */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Approver role</label>
                    <div className="relative">
                      <select
                        value={newRule._approver || ''}
                        onChange={e => setNewRule((v: any) => ({ ...v, _approver: e.target.value, approver_sequence: e.target.value ? [e.target.value] : [] }))}
                        className="w-full h- nine rounded-md border border-[#e5e7eb] bg-white px-3 text-sm"
                      >
                        <option value="">Select role</option>
                        <option>Dept. manager</option>
                        <option>Finance team</option>
                        <option>Legal department</option>
                        <option>Procurement</option>
                        <option>Executive team</option>
                        <option>Project lead</option>
                      </select>
                    </div>
                  </div>

                  {/* Escalation SLA */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Escalation SLA (Service level agreement)</label>
                    <select
                      value={newRule.escalation_sla || ''}
                      onChange={e => setNewRule((v: any) => ({ ...v, escalation_sla: e.target.value }))}
                      className="w-full h- nine rounded-md border border-[#e5e7eb] bg-white px-3 text-sm"
                    >
                      <option value="">Select</option>
                      <option>After 24 hr</option>
                      <option>After 48 hr</option>
                      <option>After 72 hr</option>
                      <option>After 90 hr</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Status</label>
                    <select
                      value={newRule.status}
                      onChange={e => setNewRule((v: any) => ({ ...v, status: e.target.value }))}
                      className="w-full h- nine rounded-md border border-[#e5e7eb] bg-white px-3 text-sm"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 border-t flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>Cancel</Button>
                  <Button
                    onClick={async () => {
                      await createRule.mutateAsync({
                        rule_code: newRule.rule_code && newRule.rule_code.trim() !== '' ? newRule.rule_code : generateRuleCode(),
                        entity_type: newRule.entity_type,
                        condition: newRule.condition,
                        approver_sequence: newRule.approver_sequence,
                        escalation_sla: newRule.escalation_sla,
                        status: newRule.status,
                      });
                      setIsAddRuleOpen(false);
                      setNewRule({ rule_code: '', entity_type: 'Requisition', condition: '', approver_sequence: [], escalation_sla: '', status: 'Active' });
                    }}
                    className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Requisition Management Section */}
      {activeTab === 'requisition-management' && (
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#383839]">Requisition management lists</h2>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="relative">
                <img
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                  src="/search0.svg"
                  alt="Search"
                />
                <Input
                  placeholder="Search...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <img className="w-4 h-4 mr-2" src="/list0.svg" alt="List view" />
                List
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <img className="w-4 h-4 mr-2" src="/uil-export0.svg" alt="Export" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkClick}>
                <img className="w-4 h-4 mr-2" src="/typcn-upload0.svg" alt="Bulk upload" />
                <span className="hidden sm:inline">Bulk upload</span>
              </Button>
              <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleBulkFile} />
              <Button
                onClick={handleNewRequisition}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white"
              >
                <img className="w-4 h-4 mr-2" src="/material-symbols-add-rounded0.svg" alt="Add" />
                <span className="hidden sm:inline">New requisition</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>

          {/* Requisitions Table */}
          <Card>
            <CardContent className="p-0">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Req ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Est. cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Budget source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requisitions.map((requisition) => (
                      <tr key={requisition.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#383839]">
                          {requisition.req_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                          {requisition.item_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                          {requisition.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                          {formatCurrency(requisition.estimated_cost, requisition.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                          {formatDate(requisition.date_submitted)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                          {requisition.budget_source || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(requisition.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRequisition(requisition.id)}
                            className="text-[#7c3aed] border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
                          >
                            <img className="h-4 w-4 mr-1" src="/eye0.svg" alt="View" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {requisitions.map((requisition) => (
                  <Card key={requisition.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-[#383839]">{requisition.req_id}</div>
                        {getStatusBadge(requisition.status)}
                      </div>
                      <div className="text-sm text-[#6b7280] font-medium">{requisition.item_name}</div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <div className="text-[#6b7280]">{requisition.quantity}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Est. Cost:</span>
                          <div className="text-[#6b7280]">{formatCurrency(requisition.estimated_cost, requisition.currency)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <div className="text-[#6b7280]">{formatDate(requisition.date_submitted)}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Budget:</span>
                          <div className="text-[#6b7280]">{requisition.budget_source || '-'}</div>
                        </div>
                      </div>
                      <div className="pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewRequisition(requisition.id)}
                          className="w-full text-[#7c3aed] border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white"
                        >
                          <img className="h-4 w-4 mr-1" src="/eye0.svg" alt="View" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-4 lg:px-6 py-4 border-t bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-[#6b7280]">
                    Showing 1 to {Math.min(8, totalRequisitions)} of {totalRequisitions} requisition management lists
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create Requisition Modal */}
          {isCreateOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-semibold">New requisition</h3>
                  <button onClick={() => setIsCreateOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">REQ ID</label>
                    <Input value={newReq.req_id || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Item</label>
                    <Input value={newReq.item_name || ''} onChange={e => setNewReq(v => ({ ...v, item_name: e.target.value }))} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                      <Input type="number" value={newReq.quantity || 1} onChange={e => setNewReq(v => ({ ...v, quantity: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Est. cost</label>
                      <Input type="number" value={newReq.estimated_cost || 0} onChange={e => setNewReq(v => ({ ...v, estimated_cost: Number(e.target.value) }))} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Currency</label>
                      <Input value={newReq.currency || 'USD'} onChange={e => setNewReq(v => ({ ...v, currency: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Budget source</label>
                    <Input value={newReq.budget_source || ''} onChange={e => setNewReq(v => ({ ...v, budget_source: e.target.value }))} />
                  </div>
                </div>
                <div className="p-4 border-t flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateSubmit} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Create</Button>
                </div>
              </div>
            </div>
          )}
          {/* End Modal */}
        </div>
      )}

      {/* Create Plan Item Modal */}
      {isCreatePlanOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold">Add plan item</h3>
              <button onClick={() => setIsCreatePlanOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Item</label>
                <Input value={newPlanItem.item} onChange={e => setNewPlanItem((v: any) => ({ ...v, item: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <Input value={newPlanItem.description} onChange={e => setNewPlanItem((v: any) => ({ ...v, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Est. cost</label>
                  <Input type="number" value={newPlanItem.est_cost} onChange={e => setNewPlanItem((v: any) => ({ ...v, est_cost: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Budget source</label>
                  <Input value={newPlanItem.budget_source} onChange={e => setNewPlanItem((v: any) => ({ ...v, budget_source: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Planned date</label>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal truncate",
                          !newPlanItem.planned_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {newPlanItem.planned_date ? (
                            format(newPlanItem.planned_date, "MMM dd, yyyy")
                          ) : (
                            "Pick a date"
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={newPlanItem.planned_date}
                        onSelect={(date) => setNewPlanItem((v: any) => ({ ...v, planned_date: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex items-center justify-end gap-2 sticky bottom-0 bg-white">
              <Button variant="outline" onClick={() => setIsCreatePlanOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePlanSubmit} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Add</Button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar placeholder */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[116px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(124,58,237,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/group0.svg" alt="On-time" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">82%</div>
              <div className="text-xs text-[#6b7280]">On-time</div>
            </Card>
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[116px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(59,130,246,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/fontisto-date1.svg" alt="Avg delay" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">4.5 days</div>
              <div className="text-xs text-[#6b7280]">Avg delay</div>
            </Card>
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[116px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/group1.svg" alt="Due this month" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">12</div>
              <div className="text-xs text-[#6b7280]">Due this month</div>
            </Card>
            <Card className="bg-white rounded-[10px] p-4 flex flex-col items-center justify-center h-[116px]" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
              <div className="mb-2 h-10 w-10 rounded-full bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
                <img className="w-5 h-5" src="/layer-13.svg" alt="Overdue" />
              </div>
              <div className="text-xl font-semibold text-[#383839]">10</div>
              <div className="text-xs text-[#6b7280]">Overdue</div>
            </Card>
          </div>

          {/* Toolbar */}
          <Card>
            <CardContent className="p-0">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="relative">
                  <img className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" src="/search1.svg" alt="search" />
                  <Input placeholder="Search...." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-64" />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCalendarExport}><img className="w-4 h-4 mr-2" src="/uil-export0.svg" alt="export" />Export</Button>
                  <Button variant="outline" size="sm" onClick={() => setIsCalendarFilterOpen(true)}><img className="w-4 h-4 mr-2" src="/ion-filter0.svg" alt="filter" />Filter</Button>
                  <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white" onClick={() => { setDrillDate(new Date()); setIsDrillOpen(true); }}><img className="w-4 h-4 mr-2" src="/fluent-mdl-2-drill-down0.svg" alt="drill" />Drill down</Button>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded border border-[#e5e7eb] hover:bg-gray-50" onClick={() => setCalendarMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))} aria-label="Previous month">
                      <img className="w-4 h-4" src="/weui-arrow-filled0.svg" alt="Prev" />
                    </button>
                    <div className="text-sm text-[#383839] min-w-[120px] text-center">{monthLabel}</div>
                    <button className="p-1 rounded border border-[#e5e7eb] hover:bg-gray-50" onClick={() => setCalendarMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))} aria-label="Next month">
                      <img className="w-4 h-4 rotate-180" src="/weui-arrow-filled0.svg" alt="Next" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date())}>Today</Button>
                    <Button variant="outline" size="sm">Week</Button>
                    <Button variant="outline" size="sm">Month</Button>
                    <div className="hidden sm:flex items-center gap-1 ml-2">
                      <button className={`px-2 py-1 rounded text-xs border ${!calendarFilter.status ? 'bg-white border-[#7c3aed] text-[#7c3aed]' : 'border-[#e5e7eb] text-gray-600'}`} onClick={() => setCalendarFilter({ status: undefined })}>All</button>
                      <button className={`px-2 py-1 rounded text-xs border ${calendarFilter.status === 'Planned' ? 'bg-white border-[#7c3aed] text-[#7c3aed]' : 'border-[#e5e7eb] text-gray-600'}`} onClick={() => setCalendarFilter({ status: 'Planned' })}>Planned</button>
                      <button className={`px-2 py-1 rounded text-xs border ${calendarFilter.status === 'Completed' ? 'bg-white border-[#7c3aed] text-[#7c3aed]' : 'border-[#e5e7eb] text-gray-600'}`} onClick={() => setCalendarFilter({ status: 'Completed' })}>Actual</button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-xs text-gray-500 px-2 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 mt-1">
                  {Array.from({ length: totalCells }).map((_, i) => {
                    const dayNum = i - startOffset + 1;
                    const inMonth = dayNum >= 1 && dayNum <= endOfMonth.getDate();
                    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), Math.max(1, Math.min(dayNum, endOfMonth.getDate())));
                    const key = date.toISOString().slice(0, 10);
                    const dayItems = inMonth ? (itemsByDay[key] || []) : [];
                    return (
                      <div key={i} className={`min-h-[100px] border rounded-md p-2 ${inMonth ? 'bg-white border-[#eef2f6]' : 'bg-gray-50 border-[#f3f4f6]'}`}>
                        <div className="text-[10px] text-gray-400">{inMonth ? String(dayNum).padStart(2, '0') : ''}</div>
                        <div className="space-y-1 mt-1">
                          {dayItems.map((it: any) => (
                            <button key={it.id} className={`text-[10px] rounded px-2 py-1 inline-block ${it.status === 'Completed' ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#ede3ff] text-[#7c3aed]'}`} onClick={() => { setDrillDate(date); setIsDrillOpen(true); }}>
                              {it.item}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6b7280] mt-4">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#7c3aed]/20 inline-block"></span> Planned</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#ef4444]/20 inline-block"></span> Actual</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Filter Modal */}
          {isCalendarFilterOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filter calendar</h3>
                  <button onClick={() => setIsCalendarFilterOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <select value={calendarFilter.status || ''} onChange={e => setCalendarFilter({ status: (e.target.value || undefined) as any })} className="w-full rounded-md border border-[#e5e7eb] bg-white px-3 h- nine text-sm">
                      <option value="">All</option>
                      <option value="Planned">Planned</option>
                      <option value="Completed">Actual</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 border-t flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => { setCalendarFilter({}); setIsCalendarFilterOpen(false); }}>Clear</Button>
                  <Button onClick={() => setIsCalendarFilterOpen(false)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Apply</Button>
                </div>
              </div>
            </div>
          )}

          {/* Drill-down Modal */}
          {isDrillOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Items for {drillDate ? drillDate.toLocaleDateString() : ''}</h3>
                  <button onClick={() => setIsDrillOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="p-4 space-y-2">
                  {(() => {
                    const key = drillDate ? new Date(drillDate).toISOString().slice(0, 10) : '';
                    const list = (itemsByDay[key] || []) as any[];
                    if (list.length === 0) return <div className="text-sm text-gray-500">No items.</div>;
                    return list.map(it => (
                      <div key={it.id} className="flex items-center justify-between border rounded-md p-3">
                        <div>
                          <div className="text-sm font-medium text-[#383839]">{it.item}</div>
                          <div className="text-xs text-[#6b7280]">{it.description}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${it.status === 'Completed' ? 'bg-[#fee2e2] text-[#dc2626]' : 'bg-[#ede3ff] text-[#7c3aed]'}`}>{it.status || 'Planned'}</div>
                      </div>
                    ));
                  })()}
                </div>
                <div className="p-4 border-t flex items-center justify-end">
                  <Button onClick={() => setIsDrillOpen(false)} className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">Close</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcurementPlanningPage;
