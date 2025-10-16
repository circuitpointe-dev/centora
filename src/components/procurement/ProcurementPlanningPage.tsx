import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
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
import { useApprovalMatrix } from "@/hooks/procurement/useProcurementApprovalMatrix";

const ProcurementPlanningPage: React.FC = () => {
  const navigate = useNavigate();
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
  const { data: planStats } = usePlanStats();
  const { data: planItems } = usePlanItems({ page: currentPage, limit: 8, search: searchTerm });
  const createPlanItem = useCreatePlanItem();
  const updatePlanItem = useUpdatePlanItem();
  const deletePlanItem = useDeletePlanItem();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<any>({});
  const { data: matrix } = useApprovalMatrix({ page: currentPage, limit: 8, search: searchTerm });

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
      createPlanItem.mutate({ item: 'New item', description: 'Describe item', est_cost: 0, status: 'Pending' }, { onSuccess: () => toast.success('Item added') });
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async () => {
    try {
      await createRequisitionMutation.mutateAsync(newReq as Requisition);
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

      {/* KPI Cards - Only show when NOT on plan-builder tab */}
      {activeTab !== 'plan-builder' && (
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
            <div className="text-2xl font-bold text-[#383839]">$3.50M</div>
            <div className="text-sm text-[#6b7280]">Total planned spend</div>
          </Card>
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(52,199,89,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img className="w-6 h-6" src="/group1.svg" alt="Total items" />
            </div>
            <div className="text-2xl font-bold text-[#383839]">52</div>
            <div className="text-sm text-[#6b7280]">Total items</div>
          </Card>
          <Card className="bg-white rounded-[10px] p-4 flex flex-col gap-4 items-center justify-start h-[152px] relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            <div className="bg-[rgba(255,193,7,0.15)] rounded-[42px] p-2.5 flex items-center justify-center w-12 h-12">
              <img className="w-6 h-6" src="/group2.svg" alt="Pending items" />
            </div>
            <div className="text-2xl font-bold text-[#383839]">8</div>
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
                <Button variant="outline" size="sm" className="h-[30px] px-3 text-xs">
                  <img className="w-4 h-4 mr-2" src="/list0.svg" alt="List view" />
                  List
                </Button>
                <Button variant="outline" size="sm" className="h-[30px] px-3 text-xs">
                  <img className="w-4 h-4 mr-2" src="/uil-export0.svg" alt="Export" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="h-[30px] px-3 text-xs">
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
              <div className="flex flex-col gap-[38px]">
                {/* Sample data matching Figma - replace with actual data from backend */}
                {[
                  { id: '1', item: 'Desktops', description: 'IT equipment for s....', est_cost: 15000, budget_source: 'General fund', status: 'Approved', planned_date: 'Q1 2025' },
                  { id: '2', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Pending', planned_date: 'Q1 2025' },
                  { id: '3', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Completed', planned_date: 'Q1 2025' },
                  { id: '4', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Approved', planned_date: 'Q1 2025' },
                  { id: '5', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Rejected', planned_date: 'Q1 2025' },
                  { id: '6', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Approved', planned_date: 'Q1 2025' },
                  { id: '7', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Pending', planned_date: 'Q1 2025' },
                  { id: '8', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Completed', planned_date: 'Q1 2025' }
                ].map((it: any, index: number) => (
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
                        <div className={`rounded-2xl px-3 py-1.5 text-[10px] font-normal text-center ${
                          it.status === 'Approved' ? 'bg-[#dcfce7] text-[#10bc4b]' :
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
              {[
                { id: '1', item: 'Desktops', description: 'IT equipment for s....', est_cost: 15000, budget_source: 'General fund', status: 'Approved', planned_date: 'Q1 2025' },
                { id: '2', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Pending', planned_date: 'Q1 2025' },
                { id: '3', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Completed', planned_date: 'Q1 2025' },
                { id: '4', item: 'Desktops', description: 'IT equipment for staff', est_cost: 15000, budget_source: 'General fund', status: 'Approved', planned_date: 'Q1 2025' }
              ].map((it: any) => (
                <div key={it.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#f5f7fa] rounded border border-[#e1e1e1]"></div>
                      <span className="font-medium text-sm">{it.item}</span>
                    </div>
                    <div className={`rounded-2xl px-3 py-1.5 text-[10px] font-normal ${
                      it.status === 'Approved' ? 'bg-[#dcfce7] text-[#10bc4b]' :
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
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs">Edit</Button>
                      <Button variant="outline" size="sm" className="h-8 px-3 text-xs text-red-600">Delete</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f5f7fa]">
              <div className="text-sm text-[rgba(56,56,56,0.65)]">
                Showing 1 to 8 of 120 procurement plan lists
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Approval matrix & workflows tab */}
      {activeTab === 'approval-matrix' && (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative">
                <img className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" src="/search0.svg" alt="search" />
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-full sm:w-64" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><img className="w-4 h-4 mr-2" src="/ion-filter0.svg" alt="filter" />Filter</Button>
                <Button size="sm" className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white">+ Add rule</Button>
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
                  {matrix?.rules?.map((r: any) => (
                    <tr key={r.id} className="border-b text-sm">
                      <td className="px-4 py-3 text-gray-700">{r.rule_code}</td>
                      <td className="px-4 py-3 text-gray-700">{r.entity_type}</td>
                      <td className="px-4 py-3 text-gray-700">{r.condition}</td>
                      <td className="px-4 py-3 text-gray-700">{(r.approver_sequence || []).join(' → ')}</td>
                      <td className="px-4 py-3 text-gray-700">{r.escalation_sla}</td>
                      <td className="px-4 py-3">{getStatusBadge((r.status || 'Active').toLowerCase() as any)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards could be added similarly */}
          </CardContent>
        </Card>
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
                    <Input value={newReq.req_id || ''} onChange={e => setNewReq(v => ({ ...v, req_id: e.target.value }))} />
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

      {/* Calendar placeholder */}
      {activeTab === 'calendar' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">
                Procurement Calendar
              </h3>
              <p>This feature is coming soon!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcurementPlanningPage;
