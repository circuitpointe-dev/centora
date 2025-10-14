import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ApprovalFilters as FilterType } from '@/hooks/procurement/useProcurementApprovals';

interface ApprovalFiltersProps {
    filters: FilterType;
    onFiltersChange: (filters: FilterType) => void;
    onClearFilters: () => void;
}

const ApprovalFilters: React.FC<ApprovalFiltersProps> = ({
    filters,
    onFiltersChange,
    onClearFilters
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempFilters, setTempFilters] = useState<FilterType>(filters);

    const handleApply = () => {
        onFiltersChange(tempFilters);
        setIsOpen(false);
    };

    const handleClear = () => {
        setTempFilters({});
        onClearFilters();
        setIsOpen(false);
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(value =>
            value !== undefined && value !== null && value !== ''
        ).length;
    };

    const activeFiltersCount = getActiveFiltersCount();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 relative">
                    <Filter className="h-4 w-4" />
                    Filter
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filter Approvals
                    </DialogTitle>
                    <DialogDescription>
                        Use the filters below to narrow down your approval list. All filters are optional.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Type Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Request Type</Label>
                        <Select
                            value={tempFilters.type || ''}
                            onValueChange={(value) =>
                                setTempFilters(prev => ({ ...prev, type: value || undefined }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All types</SelectItem>
                                <SelectItem value="requisition">Requisition</SelectItem>
                                <SelectItem value="purchase_order">Purchase Order</SelectItem>
                                <SelectItem value="payment">Payment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Risk Level Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="risk_level">Risk Level</Label>
                        <Select
                            value={tempFilters.risk_level || ''}
                            onValueChange={(value) =>
                                setTempFilters(prev => ({ ...prev, risk_level: value || undefined }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All risk levels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All risk levels</SelectItem>
                                <SelectItem value="low">Low Risk</SelectItem>
                                <SelectItem value="medium">Medium Risk</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Department Filter */}
                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                            id="department"
                            placeholder="e.g., IT, Marketing, Operations"
                            value={tempFilters.department || ''}
                            onChange={(e) =>
                                setTempFilters(prev => ({ ...prev, department: e.target.value || undefined }))
                            }
                        />
                    </div>

                    {/* Date Range */}
                    <div className="space-y-4">
                        <Label>Date Submitted</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date_from" className="text-sm">From</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !tempFilters.date_from && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tempFilters.date_from ? (
                                                format(new Date(tempFilters.date_from), "MMM dd, yyyy")
                                            ) : (
                                                "Select date"
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tempFilters.date_from ? new Date(tempFilters.date_from) : undefined}
                                            onSelect={(date) =>
                                                setTempFilters(prev => ({
                                                    ...prev,
                                                    date_from: date ? date.toISOString().split('T')[0] : undefined
                                                }))
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_to" className="text-sm">To</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !tempFilters.date_to && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {tempFilters.date_to ? (
                                                format(new Date(tempFilters.date_to), "MMM dd, yyyy")
                                            ) : (
                                                "Select date"
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tempFilters.date_to ? new Date(tempFilters.date_to) : undefined}
                                            onSelect={(date) =>
                                                setTempFilters(prev => ({
                                                    ...prev,
                                                    date_to: date ? date.toISOString().split('T')[0] : undefined
                                                }))
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>

                    {/* Amount Range */}
                    <div className="space-y-4">
                        <Label>Amount Range</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount_min" className="text-sm">Minimum Amount</Label>
                                <Input
                                    id="amount_min"
                                    type="number"
                                    placeholder="0"
                                    value={tempFilters.amount_min || ''}
                                    onChange={(e) =>
                                        setTempFilters(prev => ({
                                            ...prev,
                                            amount_min: e.target.value ? Number(e.target.value) : undefined
                                        }))
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount_max" className="text-sm">Maximum Amount</Label>
                                <Input
                                    id="amount_max"
                                    type="number"
                                    placeholder="No limit"
                                    value={tempFilters.amount_max || ''}
                                    onChange={(e) =>
                                        setTempFilters(prev => ({
                                            ...prev,
                                            amount_max: e.target.value ? Number(e.target.value) : undefined
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {activeFiltersCount > 0 && (
                        <div className="space-y-2">
                            <Label>Active Filters</Label>
                            <div className="flex flex-wrap gap-2">
                                {filters.type && (
                                    <Badge variant="secondary" className="gap-1">
                                        Type: {filters.type.replace('_', ' ')}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, type: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters.risk_level && (
                                    <Badge variant="secondary" className="gap-1">
                                        Risk: {filters.risk_level}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, risk_level: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters.department && (
                                    <Badge variant="secondary" className="gap-1">
                                        Dept: {filters.department}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, department: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters.date_from && (
                                    <Badge variant="secondary" className="gap-1">
                                        From: {format(new Date(filters.date_from), "MMM dd")}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, date_from: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters.date_to && (
                                    <Badge variant="secondary" className="gap-1">
                                        To: {format(new Date(filters.date_to), "MMM dd")}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, date_to: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters.amount_min && (
                                    <Badge variant="secondary" className="gap-1">
                                        Min: ${filters.amount_min.toLocaleString()}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, amount_min: undefined })}
                                        />
                                    </Badge>
                                )}
                                {filters.amount_max && (
                                    <Badge variant="secondary" className="gap-1">
                                        Max: ${filters.amount_max.toLocaleString()}
                                        <X
                                            className="h-3 w-3 cursor-pointer"
                                            onClick={() => onFiltersChange({ ...filters, amount_max: undefined })}
                                        />
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClear}>
                        Clear All
                    </Button>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleApply}>
                        Apply Filters
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApprovalFilters;
