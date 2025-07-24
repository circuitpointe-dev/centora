export interface ReportingItem {
  id: string;
  grantName: string;
  organization: string;
  reportType: string;
  dueDate: string;
  status: 'Not submitted' | 'Submitted' | 'Reviewed';
  reviewer: string;
}

export const reportingData: ReportingItem[] = [
  {
    id: '1',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    reportType: 'Narrative',
    dueDate: 'Jul 10, 2025',
    status: 'Not submitted',
    reviewer: '-',
  },
  {
    id: '2',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    reportType: 'Financial',
    dueDate: 'Jul 10, 2025',
    status: 'Submitted',
    reviewer: 'Unassigned',
  },
  {
    id: '3',
    grantName: 'Rural health initiative',
    organization: 'GAC',
    reportType: 'M&E',
    dueDate: 'Jul 10, 2025',
    status: 'Reviewed',
    reviewer: 'A. okafor',
  },
  {
    id: '4',
    grantName: 'Rural health initiative',
    organization: 'UNICEF',
    reportType: 'Narrative',
    dueDate: 'Jul 10, 2025',
    status: 'Reviewed',
    reviewer: 'J. garcia',
  },
  {
    id: '5',
    grantName: 'Education Access Program',
    organization: 'UNESCO',
    reportType: 'Financial',
    dueDate: 'Aug 15, 2025',
    status: 'Not submitted',
    reviewer: '-',
  },
  {
    id: '6',
    grantName: 'Clean Water Initiative',
    organization: 'WHO',
    reportType: 'Narrative',
    dueDate: 'Sep 20, 2025',
    status: 'Submitted',
    reviewer: 'Unassigned',
  },
  {
    id: '7',
    grantName: 'Food Security Project',
    organization: 'FAO',
    reportType: 'M&E',
    dueDate: 'Oct 05, 2025',
    status: 'Reviewed',
    reviewer: 'M. johnson',
  },
  {
    id: '8',
    grantName: 'Youth Development',
    organization: 'UNDP',
    reportType: 'Financial',
    dueDate: 'Nov 12, 2025',
    status: 'Not submitted',
    reviewer: '-',
  },
];