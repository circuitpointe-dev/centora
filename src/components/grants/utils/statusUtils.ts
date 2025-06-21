
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Overdue': return 'bg-red-100 text-red-800';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getReportingStatusColor = (status: string) => {
  if (status === 'All Submitted') return 'bg-green-100 text-green-800';
  if (status === 'No Reports') return 'bg-blue-100 text-blue-800';
  return 'bg-orange-100 text-orange-800';
};
