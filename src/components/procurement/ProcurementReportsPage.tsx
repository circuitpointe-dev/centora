import React, { useState } from 'react';
import { useDocumentArchive, useDocumentArchiveStats } from '@/hooks/procurement/useProcurementDocumentArchive';
import { Eye, Download } from 'lucide-react';

const ProcurementReportsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('contract');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('document-archive');

    const pageSize = 8;

    // Data fetching
    const { data: stats, isLoading: statsLoading, error: statsError } = useDocumentArchiveStats();
    const {
        data: documentsData,
        isLoading: documentsLoading,
        error: documentsError
    } = useDocumentArchive(
        currentPage,
        pageSize,
        searchTerm || undefined,
        selectedDocumentType || undefined
    );

    const isLoading = statsLoading || documentsLoading;
    const error = statsError || documentsError;

    // Handle document type filter
    const handleTypeFilter = (type: string) => {
        setSelectedDocumentType(type);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
    };

    // Handle document actions
    const handleViewDocument = (documentId: string) => {
        console.log('View document:', documentId);
    };

    const handleDownloadDocument = (documentId: string) => {
        console.log('Download document:', documentId);
    };

    // Handle pagination
    const totalPages = documentsData ? Math.ceil(documentsData.total / pageSize) : 0;
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, documentsData?.total || 0);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading document archive data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <p className="text-red-600 mb-2">Error loading document archive data</p>
                    <p className="text-gray-600 text-sm">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[5px] pt-6 pr-6 pb-10 pl-6 flex flex-col gap-[61px] items-start justify-start shrink-0 w-full h-auto relative" style={{ boxShadow: '0px 4px 16px 0px rgba(234, 226, 253, 1)' }}>
            {/* Header Tabs - Exact match to Figma */}
            <div className="flex flex-col gap-[21px] items-start justify-start shrink-0 w-full relative">
                <div className="bg-[#f5f7fa] rounded-[5px] border-solid border-[transparent] border pt-px pb-px flex flex-row gap-0 items-start justify-start self-stretch shrink-0 h-[46px] relative overflow-hidden">
                    <button
                        onClick={() => setActiveTab('document-archive')}
                        className={`rounded-[5px] pt-[15px] pr-[21px] pb-[15px] pl-[21px] flex flex-row gap-2.5 items-center justify-center shrink-0 w-[287px] h-[45px] relative overflow-hidden ${activeTab === 'document-archive'
                                ? 'bg-[#7c3aed]'
                                : 'bg-transparent hover:bg-gray-100'
                            }`}
                    >
                        <div className={`text-center font-['Inter-Medium',_sans-serif] text-base leading-tight font-medium relative flex items-center justify-center ${activeTab === 'document-archive' ? 'text-[#ffffff]' : 'text-[rgba(56,56,56,0.60)]'
                            }`}>
                            Procurement document archive
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('compliance-audit')}
                        className={`pt-[15px] pr-[21px] pb-[15px] pl-[21px] flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative overflow-hidden hover:bg-gray-100 ${activeTab === 'compliance-audit' ? 'bg-[#7c3aed] text-white' : ''
                            }`}
                    >
                        <div className={`text-center font-['Inter-Medium',_sans-serif] text-base leading-tight font-medium relative flex items-center justify-center ${activeTab === 'compliance-audit' ? 'text-[#ffffff]' : 'text-[rgba(56,56,56,0.60)]'
                            }`}>
                            Compliance & audit trial report
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('donor-compliance')}
                        className={`pt-[15px] pr-[21px] pb-[15px] pl-[21px] flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 relative overflow-hidden hover:bg-gray-100 ${activeTab === 'donor-compliance' ? 'bg-[#7c3aed] text-white' : ''
                            }`}
                    >
                        <div className={`text-center font-['Inter-Medium',_sans-serif] text-base leading-tight font-medium relative flex items-center justify-center ${activeTab === 'donor-compliance' ? 'text-[#ffffff]' : 'text-[rgba(56,56,56,0.60)]'
                            }`}>
                            Donor compliance reports
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('spend-analysis')}
                        className={`pt-[15px] pr-[21px] pb-[15px] pl-[21px] flex flex-row gap-2.5 items-center justify-center self-stretch shrink-0 w-[205px] relative overflow-hidden hover:bg-gray-100 ${activeTab === 'spend-analysis' ? 'bg-[#7c3aed] text-white' : ''
                            }`}
                    >
                        <div className={`text-center font-['Inter-Medium',_sans-serif] text-base leading-tight font-medium relative flex items-center justify-center ${activeTab === 'spend-analysis' ? 'text-[#ffffff]' : 'text-[rgba(56,56,56,0.60)]'
                            }`}>
                            Spend analysis reports
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-6 items-end justify-start self-stretch shrink-0 relative">
                {/* Header with Search and Filter */}
                <div className="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                    <div className="flex flex-row gap-[31px] items-center justify-start shrink-0 relative">
                        <div className="text-[#383839] text-center font-['Inter-Medium',_sans-serif] text-base leading-tight font-medium relative flex items-center justify-center">
                            Procurement document archive
                        </div>
                        <form onSubmit={handleSearch} className="flex items-center">
                            <div className="rounded-[20px] border-solid border-[#e1e1e1] border pt-2 pr-4 pb-2 pl-4 flex flex-row items-center justify-between shrink-0 w-[264px] h-[30px] relative">
                                <input
                                    type="text"
                                    placeholder="Search...."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="text-[#9b9b9b] text-left font-['Inter-Regular',_sans-serif] text-xs leading-6 font-normal relative flex items-center justify-start bg-transparent border-none outline-none flex-1"
                                />
                                <img
                                    src="/search1.svg"
                                    alt="Search"
                                    className="shrink-0 w-4 h-4 relative overflow-visible"
                                />
                            </div>
                        </form>
                    </div>
                    <div className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-5 pb-2 pl-5 flex flex-row gap-3.5 items-center justify-start shrink-0 h-[43px] relative">
                        <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                            <img
                                src="/ion-filter0.svg"
                                alt="Filter"
                                className="shrink-0 w-4 h-4 relative overflow-visible"
                            />
                            <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-[13px] leading-6 font-medium relative flex items-center justify-start">
                                Filter
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Type Cards - Exact match to Figma */}
                <div className="flex flex-row gap-[17px] items-center justify-start self-stretch shrink-0 relative">
                    {/* Contract Card */}
                    <div
                        className={`rounded-[10px] border-solid border pt-4 pr-[11px] pb-4 pl-[11px] flex flex-col gap-4 items-start justify-start flex-1 relative cursor-pointer ${selectedDocumentType === 'contract'
                                ? 'bg-[#ffffff] border-[#7c3aed]'
                                : 'bg-[#ffffff] border-[#f5f7fa]'
                            }`}
                        onClick={() => handleTypeFilter('contract')}
                    >
                        <div className="flex flex-col gap-4 items-start justify-start shrink-0 relative">
                            <div className="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                <div className="flex flex-row gap-[11px] items-center justify-start shrink-0 relative">
                                    <img
                                        src="/flat-color-icons-folder0.svg"
                                        alt="Contract"
                                        className="shrink-0 w-[29px] h-[29px] relative overflow-visible"
                                    />
                                    <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-lg leading-tight font-medium relative flex items-center justify-start">
                                        Contract
                                    </div>
                                </div>
                                <div className="bg-[#f5f7fa] rounded-[1000px] pt-[7px] pr-1 pb-[7px] pl-1 flex flex-col gap-2.5 items-center justify-center shrink-0 w-[26px] h-[26px] relative overflow-hidden">
                                    <div className="text-[rgba(56,56,56,0.65)] text-left font-['Inter-Medium',_sans-serif] text-[8px] font-medium relative self-stretch">
                                        +30
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[13px] items-center justify-start self-stretch shrink-0 relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDocument('contract');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/mdi-eye-outline0.svg"
                                    alt="View"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        View
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument('contract');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/material-symbols-download0.svg"
                                    alt="Download"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        Download
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Invoices Card */}
                    <div
                        className={`rounded-[10px] border-solid border pt-4 pr-[11px] pb-4 pl-[11px] flex flex-col gap-4 items-start justify-start flex-1 relative cursor-pointer ${selectedDocumentType === 'invoice'
                                ? 'bg-[#ffffff] border-[#7c3aed]'
                                : 'bg-[#ffffff] border-[#f5f7fa]'
                            }`}
                        onClick={() => handleTypeFilter('invoice')}
                    >
                        <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                            <div className="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                <div className="flex flex-row gap-[11px] items-center justify-start shrink-0 relative">
                                    <img
                                        src="/flat-color-icons-folder1.svg"
                                        alt="Invoices"
                                        className="shrink-0 w-[29px] h-[29px] relative overflow-visible"
                                    />
                                    <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-lg leading-tight font-medium relative flex items-center justify-start">
                                        Invoices
                                    </div>
                                </div>
                                <div className="bg-[#f5f7fa] rounded-[1000px] pt-[7px] pr-1 pb-[7px] pl-1 flex flex-col gap-2.5 items-center justify-center shrink-0 w-[26px] h-[26px] relative overflow-hidden">
                                    <div className="text-[rgba(56,56,56,0.65)] text-left font-['Inter-Medium',_sans-serif] text-[8px] font-medium relative self-stretch">
                                        +12
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[13px] items-center justify-start self-stretch shrink-0 relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDocument('invoice');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/mdi-eye-outline1.svg"
                                    alt="View"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        View
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument('invoice');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/material-symbols-download1.svg"
                                    alt="Download"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        Download
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* GRNs Card */}
                    <div
                        className={`rounded-[10px] border-solid border pt-4 pr-[11px] pb-4 pl-[11px] flex flex-col gap-4 items-start justify-start flex-1 relative cursor-pointer ${selectedDocumentType === 'grn'
                                ? 'bg-[#ffffff] border-[#7c3aed]'
                                : 'bg-[#ffffff] border-[#f5f7fa]'
                            }`}
                        onClick={() => handleTypeFilter('grn')}
                    >
                        <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                            <div className="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                <div className="flex flex-row gap-[11px] items-center justify-start shrink-0 relative">
                                    <img
                                        src="/flat-color-icons-folder2.svg"
                                        alt="GRNs"
                                        className="shrink-0 w-[29px] h-[29px] relative overflow-visible"
                                    />
                                    <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-lg leading-tight font-medium relative flex items-center justify-start">
                                        GRNs
                                    </div>
                                </div>
                                <div className="bg-[#f5f7fa] rounded-[1000px] pt-[7px] pr-1 pb-[7px] pl-1 flex flex-col gap-2.5 items-center justify-center shrink-0 w-[26px] h-[26px] relative overflow-hidden">
                                    <div className="text-[rgba(56,56,56,0.65)] text-left font-['Inter-Medium',_sans-serif] text-[8px] font-medium relative self-stretch">
                                        +12
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[13px] items-center justify-start self-stretch shrink-0 relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDocument('grn');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/mdi-eye-outline2.svg"
                                    alt="View"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        View
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument('grn');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/material-symbols-download2.svg"
                                    alt="Download"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        Download
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* POs Card */}
                    <div
                        className={`rounded-[10px] border-solid border pt-4 pr-[11px] pb-4 pl-[11px] flex flex-col gap-4 items-start justify-start flex-1 relative cursor-pointer ${selectedDocumentType === 'po'
                                ? 'bg-[#ffffff] border-[#7c3aed]'
                                : 'bg-[#ffffff] border-[#f5f7fa]'
                            }`}
                        onClick={() => handleTypeFilter('po')}
                    >
                        <div className="flex flex-col gap-4 items-start justify-start self-stretch shrink-0 relative">
                            <div className="flex flex-row items-center justify-between self-stretch shrink-0 relative">
                                <div className="flex flex-row gap-[11px] items-center justify-start shrink-0 relative">
                                    <img
                                        src="/flat-color-icons-folder3.svg"
                                        alt="POs"
                                        className="shrink-0 w-[29px] h-[29px] relative overflow-visible"
                                    />
                                    <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-lg leading-tight font-medium relative flex items-center justify-start">
                                        POs
                                    </div>
                                </div>
                                <div className="bg-[#f5f7fa] rounded-[1000px] pt-[7px] pr-1 pb-[7px] pl-1 flex flex-col gap-2.5 items-center justify-center shrink-0 w-[26px] h-[26px] relative overflow-hidden">
                                    <div className="text-[rgba(56,56,56,0.65)] text-left font-['Inter-Medium',_sans-serif] text-[8px] font-medium relative self-stretch">
                                        +12
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[13px] items-center justify-start self-stretch shrink-0 relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDocument('po');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/mdi-eye-outline3.svg"
                                    alt="View"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        View
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownloadDocument('po');
                                }}
                                className="rounded-[5px] border-solid border-[#e1e1e1] border pt-2 pr-2.5 pb-2 pl-2.5 flex flex-row gap-2 items-center justify-center shrink-0 h-[29px] relative hover:bg-gray-50"
                            >
                                <img
                                    src="/material-symbols-download3.svg"
                                    alt="Download"
                                    className="shrink-0 w-[18px] h-[18px] relative overflow-visible"
                                />
                                <div className="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-6 font-medium relative flex items-center justify-start">
                                        Download
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Documents Table */}
                <div className="bg-white rounded-[5px] border-solid border-[#f5f7fa] border w-full">
                    {/* Table Header */}
                    <div className="bg-[#f5f7fa] flex items-center px-[21px] py-[15px] border-b border-[#e1e1e1]">
                        <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium flex-[2]">
                            Document
                        </div>
                        <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium flex-1">
                            Type
                        </div>
                        <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium flex-1">
                            Vendor
                        </div>
                        <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium flex-1">
                            Project
                        </div>
                        <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium flex-1">
                            Date
                        </div>
                        <div className="text-[#383839] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium flex-1">
                            Actions
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-[#f5f7fa]">
                        {documentsData?.data && documentsData.data.length > 0 ? (
                            documentsData.data.map((document) => (
                                <div key={document.id} className="flex items-center px-[21px] py-[18px] hover:bg-[#f5f7fa]/50 transition-colors">
                                    <div className="text-[#383839] text-left font-['Inter-Regular',_sans-serif] text-sm leading-tight font-normal flex-[2]">
                                        {document.document_number}
                                    </div>
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Regular',_sans-serif] text-sm leading-tight font-normal flex-1 capitalize">
                                        {document.document_type}
                                    </div>
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Regular',_sans-serif] text-sm leading-tight font-normal flex-1 truncate">
                                        {document.vendor_name || '-'}
                                    </div>
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Regular',_sans-serif] text-sm leading-tight font-normal flex-1 truncate">
                                        {document.project_name || '-'}
                                    </div>
                                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Regular',_sans-serif] text-sm leading-tight font-normal flex-1">
                                        {new Date(document.document_date).toLocaleDateString('en-US', { 
                                            month: 'short', 
                                            day: 'numeric', 
                                            year: 'numeric' 
                                        })}
                                    </div>
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            onClick={() => handleViewDocument(document.id)}
                                            className="rounded-[5px] border-solid border-[#e1e1e1] border px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <Eye className="w-4 h-4 text-[rgba(56,56,56,0.60)]" />
                                            <span className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium">
                                                View
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleDownloadDocument(document.id)}
                                            className="rounded-[5px] border-solid border-[#e1e1e1] border px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 transition-colors"
                                        >
                                            <Download className="w-4 h-4 text-[rgba(56,56,56,0.60)]" />
                                            <span className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium">
                                                Download
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <p className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Regular',_sans-serif] text-sm">
                                    No documents found
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between w-full">
                    <div className="text-[rgba(56,56,56,0.60)] text-left font-['Inter-Regular',_sans-serif] text-sm leading-tight font-normal">
                        Showing {startItem} to {endItem} of {documentsData?.total || 0} {selectedDocumentType} folder lists
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="rounded-[5px] border-solid border-[#e1e1e1] border px-5 py-2 text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="rounded-[5px] border-solid border-[#e1e1e1] border px-5 py-2 text-[rgba(56,56,56,0.60)] text-left font-['Inter-Medium',_sans-serif] text-sm leading-tight font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcurementReportsPage;