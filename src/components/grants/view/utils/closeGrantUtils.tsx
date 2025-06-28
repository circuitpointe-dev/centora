
import React from 'react';
import { TableCell } from '@/components/ui/table';

export const getStatusIcon = (status: string) => {
  if (status === 'Completed' || status === 'Submitted') {
    return <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
      <div className="h-2 w-2 bg-white rounded-full"></div>
    </div>;
  }
  return <div className="h-4 w-4 bg-yellow-600 rounded-full"></div>;
};

export const getStatusColor = (status: string) => {
  if (status === 'Completed' || status === 'Submitted' || status === 'Released') {
    return 'text-green-800 bg-green-100';
  }
  if (status === 'In Progress' || status === 'Pending') {
    return 'text-yellow-800 bg-yellow-100';
  }
  if (status === 'Overdue') {
    return 'text-red-800 bg-red-100';
  }
  return 'text-gray-800 bg-gray-100';
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const renderReportRow = (report: any) => (
  <>
    <TableCell className="font-medium text-black">{report.reportType}</TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        {getStatusIcon(report.status)}
        <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(report.status)}`}>
          {report.status}
        </span>
      </div>
    </TableCell>
    <TableCell className="text-gray-600">
      {new Date(report.dueDate).toLocaleDateString()}
    </TableCell>
    <TableCell className="text-gray-600">
      {report.submittedDate ? new Date(report.submittedDate).toLocaleDateString() : '—'}
    </TableCell>
  </>
);

export const renderDisbursementRow = (disbursement: any) => (
  <>
    <TableCell className="font-medium text-black">{disbursement.milestone}</TableCell>
    <TableCell className="text-gray-600">{formatCurrency(disbursement.amount)}</TableCell>
    <TableCell className="text-gray-600">
      {new Date(disbursement.disbursedOn).toLocaleDateString()}
    </TableCell>
    <TableCell>
      <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(disbursement.status)}`}>
        {disbursement.status}
      </span>
    </TableCell>
  </>
);

export const renderComplianceRow = (requirement: any) => (
  <>
    <TableCell className="font-medium text-black">{requirement.requirement}</TableCell>
    <TableCell className="text-gray-600">
      <span className={requirement.status === 'Completed' ? 'line-through' : ''}>
        {new Date(requirement.dueDate).toLocaleDateString()}
      </span>
    </TableCell>
    <TableCell>
      <div className="flex items-center gap-2">
        {getStatusIcon(requirement.status)}
        <span className={`text-xs px-2 py-1 rounded-sm ${getStatusColor(requirement.status)}`}>
          {requirement.status}
        </span>
      </div>
    </TableCell>
    <TableCell className="text-gray-600">
      {requirement.status === 'Completed' && requirement.evidenceDocument ? (
        <span className="text-blue-600">{requirement.evidenceDocument}</span>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </TableCell>
  </>
);
