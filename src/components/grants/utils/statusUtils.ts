
export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getReportingStatusColor = (status: string) => {
  if (status === 'All Submitted') return 'bg-green-100 text-green-800';
  if (status === 'No Reports') return 'bg-blue-100 text-blue-800';
  return 'bg-orange-100 text-orange-800';
};
