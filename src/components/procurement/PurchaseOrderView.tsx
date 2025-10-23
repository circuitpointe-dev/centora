import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import arrowBack from '@/assets/view/arrow-back0.svg';
import searchIcon from '@/assets/view/search0.svg';
import menuIcon from '@/assets/view/menu0.svg';
import arrowLeft from '@/assets/view/arrow-left0.svg';
import arrowFilled from '@/assets/view/weui-arrow-filled0.svg';
import groupIcon from '@/assets/view/group2.svg';
import downloadIcon from '@/assets/view/material-symbols-download0.svg';

const PurchaseOrderView: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - replace with real data from API
  const poData = {
    poNumber: 'PO-2025-001',
    linkedRequisition: 'REG-007',
    vendor: 'Techware Inc.',
    poDate: 'Sep 18, 2025',
    deliveryDate: 'Sep 18, 2025',
    paymentTerms: 'Net 30 / Net 60',
    currency: 'USD',
    status: 'Approved',
    attachment: 'tax_certificate.pdf'
  };

  const approvalSteps = [
    { title: 'Created', date: 'Jul 2, 2025, 09:32 AM', completed: true },
    { title: 'Manager approval', date: 'Jul 2, 2025, 09:32 AM', completed: true },
    { title: 'Finance approval', date: 'Jul 2, 2025, 09:32 AM', completed: true },
    { title: 'Procurement head', date: 'Jul 2, 2025, 09:32 AM', completed: true }
  ];

  const items = [
    {
      item: 'Laptop',
      description: 'HP Elitebook',
      quantity: 1200,
      unitPrice: '$1,200',
      total: '$12,000',
      budgetSource: 'Grant A'
    },
    {
      item: 'Software lincense',
      description: 'Program management tool',
      quantity: 20,
      unitPrice: '$500',
      total: '$10,000',
      budgetSource: 'Grant B'
    }
  ];

  const costSummary = {
    subtotal: '$22,000.00',
    tax: '$0.00',
    discounts: '-$500.00',
    grandTotal: '$21,500.00'
  };

  return (
    <div className="bg-[#f5f7fa] min-h-screen relative">
      {/* Top Header */}
      <div className="bg-white border-b border-[#e6eff5] px-8 flex items-center justify-between h-[75px] fixed top-0 left-80 right-0 z-10">
        <div className="text-[#383839] text-2xl font-medium">
          Procurement execution
        </div>
        <div className="rounded-[20px] border border-[#e1e1e1] px-4 py-2 flex items-center gap-4 h-[30px]">
          <div className="text-[#9b9b9b] text-xs leading-6">
            Search documents, templates, or policies...
          </div>
          <img src={searchIcon} alt="search" className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-5">
          <div className="w-[50px] h-[50px] bg-[#f5f7fa] rounded-full flex items-center justify-center shadow-sm">
            <div className="w-[25px] h-[25px]" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
            <img src={arrowFilled} alt="dropdown" className="w-2.5 h-5" />
          </div>
        </div>
      </div>

      {/* Secondary Header with Back Button */}
      <div className="bg-white border-b border-[#e6eff5] px-8 flex items-center h-[75px] fixed top-[75px] left-80 right-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-[9px] border-b-2 border-transparent pt-2.5 px-[5px] pb-2.5"
        >
          <img src={arrowBack} alt="back" className="w-5 h-5" />
          <div className="text-[rgba(56,56,56,0.65)] text-sm font-medium">
            Back to purchase order
          </div>
        </button>
      </div>

      {/* Sidebar */}
      <div className="bg-white w-80 h-full fixed left-0 top-0 pt-10 flex flex-col justify-between shadow-md">
        <div className="flex flex-col gap-8">
          <div className="px-2.5 flex items-center gap-2 w-[290px]">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
              O
            </div>
            <div className="text-[#2d2b2b] text-lg font-medium">
              Orbit ERP
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="pl-[38px] h-[39px] flex items-center">
              <div className="text-[#7c3aed] text-lg font-medium">
                Procurement Management
              </div>
            </div>
            <div className="px-1.5 flex flex-col gap-4">
              <div className="rounded-[5px] pl-6 h-[52px] flex items-center gap-4">
                <div className="text-[rgba(56,56,57,0.60)] text-base font-medium">
                  Dashboard
                </div>
              </div>
              <div className="rounded-[5px] pl-6 h-[52px] flex items-center gap-4">
                <div className="text-[rgba(56,56,57,0.60)] text-base font-medium">
                  Procurement Planning
                </div>
              </div>
              <div className="rounded-[5px] pl-6 h-[52px] flex items-center gap-4">
                <div className="text-[rgba(56,56,57,0.60)] text-base font-medium">
                  Vendor Management
                </div>
              </div>
              <div className="bg-[#7c3aed] rounded-[5px] pl-6 h-[52px] flex items-center gap-4">
                <div className="text-white text-base font-medium">
                  Procurement Execution
                </div>
              </div>
              <div className="rounded-[5px] pl-6 h-[52px] flex items-center gap-4">
                <div className="text-[rgba(56,56,57,0.60)] text-base font-medium">
                  Procurement Reports
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white pl-[39px] flex items-center gap-[54px] h-[60px] shadow-top">
          <img src={menuIcon} alt="menu" className="w-5 h-5" />
          <div className="text-[rgba(56,56,57,0.82)] text-base font-medium">
            Switch Module
          </div>
          <img src={arrowLeft} alt="arrow" className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-80 pt-[175px] px-8 pb-10">
        <div className="bg-white rounded-[5px] p-6 shadow-lg">
          <div className="flex flex-col gap-[61px]">
            <div className="flex flex-col gap-[31px]">
              {/* Title and Edit Button */}
              <div className="flex items-center justify-between">
                <div className="text-[#383839] text-lg font-medium">
                  Purchase Order (PO) View
                </div>
                <div className="rounded-[5px] border border-[#e1e1e1] px-[13px] py-2 flex items-center gap-2">
                  <img src={groupIcon} alt="edit" className="w-4 h-4" />
                  <div className="text-[rgba(56,56,56,0.60)] text-sm font-medium">
                    Edit
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="flex flex-col gap-[42px]">
                {/* PO Detail */}
                <div className="bg-white rounded-[5px] border border-[#e1e1e1] p-[15px] flex flex-col gap-8">
                  <div className="text-[#383838] text-[17px] font-medium">
                    PO Detail
                  </div>
                  <div className="flex flex-col gap-[15px]">
                    {[
                      { label: 'PO Number', value: poData.poNumber },
                      { label: 'Linked Requisition', value: poData.linkedRequisition },
                      { label: 'Vendor', value: poData.vendor },
                      { label: 'PO Date', value: poData.poDate },
                      { label: 'Delivery Date', value: poData.deliveryDate },
                      { label: 'Payment Terms', value: poData.paymentTerms },
                      { label: 'Currency', value: poData.currency }
                    ].map((item, index) => (
                      <div key={index} className="flex items-end justify-between">
                        <div className="text-[#383838] text-sm font-normal">
                          {item.label}
                        </div>
                        <div className="text-[#383838] text-[15px] font-medium">
                          {item.value}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-end justify-between">
                      <div className="text-[#383838] text-sm font-normal">
                        Status
                      </div>
                      <div className="bg-[#d4fce4] rounded-full px-3 py-1 text-[#0ea353] text-xs font-medium">
                        {poData.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#383838] text-sm font-normal">
                        Attachments
                      </div>
                      <div className="flex items-center gap-2 text-[#383838] text-sm font-medium">
                        {poData.attachment}
                        <img src={downloadIcon} alt="download" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approval Workflow */}
                <div className="bg-white rounded-[5px] border border-[#e1e1e1] p-[15px] flex flex-col gap-8">
                  <div className="text-[#383838] text-[17px] font-medium">
                    Approval Workflow
                  </div>
                  <div className="flex items-center justify-between px-8">
                    {approvalSteps.map((step, index) => (
                      <div key={index} className="flex flex-col items-center gap-2 relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.completed ? 'bg-[#7c3aed]' : 'bg-gray-200'
                          }`}>
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                            {step.completed && (
                              <svg className="w-4 h-4 text-[#7c3aed]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[#383838] text-xs font-medium">
                            {step.title}
                          </div>
                          <div className="text-[#9b9b9b] text-[10px]">
                            {step.date}
                          </div>
                        </div>
                        {index < approvalSteps.length - 1 && (
                          <div className={`absolute top-6 left-full w-24 h-0.5 ${step.completed ? 'bg-[#7c3aed]' : 'bg-gray-300'
                            }`} style={{ transform: 'translateX(6px)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items Table */}
                <div className="bg-white rounded-[5px] border border-[#e1e1e1] p-[15px] flex flex-col gap-8">
                  <div className="text-[#383838] text-[17px] font-medium">
                    Item
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#e1e1e1]">
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Item</th>
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Description</th>
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Quantity</th>
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Unit price</th>
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Total</th>
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Budget source</th>
                          <th className="text-left text-[#383838] text-sm font-medium pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index} className="border-b border-[#e1e1e1]">
                            <td className="text-[#383838] text-sm py-4">{item.item}</td>
                            <td className="text-[#383838] text-sm py-4">{item.description}</td>
                            <td className="text-[#383838] text-sm py-4">{item.quantity}</td>
                            <td className="text-[#383838] text-sm py-4">{item.unitPrice}</td>
                            <td className="text-[#383838] text-sm py-4">{item.total}</td>
                            <td className="text-[#383838] text-sm py-4">{item.budgetSource}</td>
                            <td className="text-[#383838] text-sm py-4">
                              <button className="text-red-500 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Cost Summary */}
                  <div className="flex flex-col gap-4 border-t border-[#e1e1e1] pt-6">
                    <div className="text-[#383838] text-base font-medium">
                      Cost summary
                    </div>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Subtotal', value: costSummary.subtotal },
                        { label: 'Tax', value: costSummary.tax },
                        { label: 'Discounts', value: costSummary.discounts }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="text-[#383838] text-sm">{item.label}</div>
                          <div className="text-[#383838] text-sm">{item.value}</div>
                        </div>
                      ))}
                      <div className="flex items-center justify-between border-t border-[#e1e1e1] pt-3">
                        <div className="text-[#383838] text-base font-medium">Grand total</div>
                        <div className="text-[#383838] text-base font-medium">{costSummary.grandTotal}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancel Button */}
            <div className="flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="border border-[#e1e1e1] rounded-[5px] px-6 py-2 text-[#383838] text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderView;
